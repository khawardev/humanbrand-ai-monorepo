# Backend Concurrency Issues - Analysis & Solutions

> **Document Version:** 1.0  
> **Created:** January 29, 2026  
> **Platform:** FastAPI on AWS  
> **Issue:** Missing competitor data on concurrent requests

---

## Table of Contents

1. [Problem Summary](#problem-summary)
2. [Test Results](#test-results)
3. [Root Cause Analysis](#root-cause-analysis)
4. [Possible Backend Issues](#possible-backend-issues)
5. [Recommended Fixes](#recommended-fixes)
6. [Frontend Workaround](#frontend-workaround)
7. [Monitoring & Debugging](#monitoring--debugging)

---

## Problem Summary

When the frontend makes **parallel API requests** to fetch brand enrichment data (website scrapes, social scrapes, competitors), some requests fail with timeouts or return empty data. This results in **missing competitor information** for certain brands on the deployed Vercel frontend.

### Symptoms

- ✅ **Sequential requests**: 100% success rate
- ❌ **Parallel requests**: ~33% failure rate
- ✅ **Batched parallel (2 at a time)**: 100% success rate
- Request failures occur at approximately **10.5 seconds** (timeout threshold)

---

## Test Results

The following test was performed using a custom concurrency test script:

### Sequential Requests (One at a time)
```
Total Duration: 55,708ms
Success: 15/15 (100%)
Failure: 0/15 (0%)
```

### Parallel Requests (All at once - 5 brands × 3 endpoints = 15 requests)
```
Total Duration: 17,329ms
Success: 10/15 (67%)
Failure: 5/15 (33%)

Failed endpoints (all at ~10.5 seconds):
- competitors (multiple brands)
- social-scrapes (some brands)
```

### Batched Parallel Requests (2 brands at a time)
```
Total Duration: 13,387ms
Success: 15/15 (100%)
Failure: 0/15 (0%)
```

### Key Insight

The backend can handle **limited concurrency** (2-3 parallel requests per batch), but fails when too many requests arrive simultaneously. This indicates a **resource bottleneck** on the backend.

---

## Root Cause Analysis

The ~10.5 second timeout on failed requests suggests one or more of the following:

1. **Connection pool exhaustion** - Not enough database connections available
2. **Worker thread/process limits** - Server can't handle the request volume
3. **DynamoDB throttling** - Read capacity exceeded
4. **Memory/CPU saturation** - Server resources maxed out under load
5. **API Gateway timeout** - Request queuing at the gateway level

---

## Possible Backend Issues

### 1. Database Connection Pool Exhaustion ⭐ (Most Likely)

**Problem:**  
DynamoDB boto3 client has a default maximum pool connections limit. When concurrent requests exceed this limit, subsequent requests must wait for a connection, leading to timeouts.

**Symptoms:**
- Random failures under load
- Failures occur at consistent timeout thresholds
- Works fine with low traffic

**Current Default:**
```python
# boto3 default: max_pool_connections = 10
```

**Fix:**
```python
import boto3
from botocore.config import Config

# Increase connection pool size
config = Config(
    max_pool_connections=50,  # Increase from default 10
    connect_timeout=5,
    read_timeout=30,
    retries={
        'max_attempts': 3,
        'mode': 'adaptive'
    }
)

dynamodb = boto3.resource('dynamodb', config=config)
# OR
dynamodb_client = boto3.client('dynamodb', config=config)
```

---

### 2. Uvicorn/Gunicorn Worker Limits

**Problem:**  
FastAPI runs on Uvicorn/Gunicorn with a limited number of worker processes. Default is often **1 worker**, meaning all requests are processed by a single process.

**Symptoms:**
- Server becomes unresponsive under load
- Requests queue up and timeout
- CPU usage stays low (not utilizing multiple cores)

**Current Default:**
```bash
uvicorn main:app  # Default: 1 worker
```

**Fix:**
```bash
# Production deployment - use multiple workers
uvicorn main:app --host 0.0.0.0 --port 8000 \
    --workers 4 \                    # Number of worker processes (2-4 × CPU cores)
    --limit-concurrency 100 \        # Max concurrent connections per worker
    --timeout-keep-alive 30          # Keep-alive timeout

# Alternative with Gunicorn (recommended for production)
gunicorn main:app \
    -w 4 \                           # Workers
    -k uvicorn.workers.UvicornWorker \
    --timeout 60 \
    --keep-alive 30 \
    --max-requests 1000 \
    --max-requests-jitter 50
```

**AWS ECS Task Definition:**
```json
{
  "containerDefinitions": [
    {
      "command": [
        "gunicorn", "main:app",
        "-w", "4",
        "-k", "uvicorn.workers.UvicornWorker",
        "--bind", "0.0.0.0:8000"
      ],
      "cpu": 1024,
      "memory": 2048
    }
  ]
}
```

---

### 3. Synchronous Database Calls Blocking Event Loop

**Problem:**  
If FastAPI endpoints use synchronous database operations, they block the async event loop, preventing other requests from being processed.

**Symptoms:**
- Server handles one request at a time despite being async
- Thread pool exhaustion
- High latency under concurrent load

**Bad Example (Blocking):**
```python
@app.get("/brands/competitors/")
def get_competitors(brand_id: str, client_id: str):
    # ❌ This blocks the event loop
    table = dynamodb.Table('competitors')
    response = table.query(
        KeyConditionExpression=Key('brand_id').eq(brand_id)
    )
    return response['Items']
```

**Good Example (Non-blocking):**
```python
import asyncio
from concurrent.futures import ThreadPoolExecutor

executor = ThreadPoolExecutor(max_workers=20)

@app.get("/brands/competitors/")
async def get_competitors(brand_id: str, client_id: str):
    # ✅ Run blocking code in thread pool
    loop = asyncio.get_event_loop()
    response = await loop.run_in_executor(
        executor,
        lambda: dynamodb.Table('competitors').query(
            KeyConditionExpression=Key('brand_id').eq(brand_id)
        )
    )
    return response['Items']
```

**Even Better - Use aioboto3:**
```python
import aioboto3

session = aioboto3.Session()

@app.get("/brands/competitors/")
async def get_competitors(brand_id: str, client_id: str):
    async with session.resource('dynamodb') as dynamodb:
        table = await dynamodb.Table('competitors')
        response = await table.query(
            KeyConditionExpression=Key('brand_id').eq(brand_id)
        )
        return response['Items']
```

---

### 4. DynamoDB Throttling

**Problem:**  
DynamoDB with **Provisioned Capacity** has Read Capacity Units (RCU) and Write Capacity Units (WCU) limits. Exceeding these limits causes throttling.

**Symptoms:**
- `ProvisionedThroughputExceededException`
- Intermittent failures (some requests succeed, others fail)
- Failures correlate with traffic spikes

**Diagnosis:**
```bash
# Check CloudWatch metrics for:
# - ConsumedReadCapacityUnits
# - ThrottledRequests
# - ReadThrottleEvents
```

**Fix Option 1 - Switch to On-Demand:**
```python
# In DynamoDB console or CloudFormation:
# BillingMode: PAY_PER_REQUEST

# Or via boto3:
dynamodb.create_table(
    TableName='competitors',
    BillingMode='PAY_PER_REQUEST',  # On-demand capacity
    ...
)
```

**Fix Option 2 - Increase Provisioned Capacity:**
```python
dynamodb.update_table(
    TableName='competitors',
    ProvisionedThroughput={
        'ReadCapacityUnits': 100,   # Increase as needed
        'WriteCapacityUnits': 50
    }
)
```

**Fix Option 3 - Enable Auto Scaling:**
```yaml
# CloudFormation example
Resources:
  CompetitorsTableReadScaling:
    Type: AWS::ApplicationAutoScaling::ScalableTarget
    Properties:
      MaxCapacity: 1000
      MinCapacity: 5
      ResourceId: table/competitors
      ScalableDimension: dynamodb:table:ReadCapacityUnits
      ServiceNamespace: dynamodb
```

---

### 5. AWS API Gateway Timeout

**Problem:**  
AWS API Gateway has a **maximum timeout of 29 seconds**. If your backend takes longer to respond, the gateway terminates the request.

**Symptoms:**
- Requests fail at exactly 29 seconds
- "Endpoint request timed out" errors
- Works locally but fails in production

**Fix:**
```yaml
# serverless.yml or SAM template
provider:
  apiGateway:
    timeout: 29  # Maximum allowed

# For longer operations, consider:
# 1. Async processing with SQS
# 2. Response streaming
# 3. Client-side polling with job IDs
```

---

### 6. Lambda Cold Starts (If using Lambda)

**Problem:**  
Lambda functions that haven't been invoked recently take time to initialize (cold start). Under concurrent load, multiple cold starts can occur simultaneously.

**Symptoms:**
- First request(s) after idle period are slow
- ~10+ second response times sporadically
- Performance improves after "warming up"

**Fix:**
```yaml
# Enable Provisioned Concurrency
Resources:
  MyFunction:
    Type: AWS::Lambda::Function
    Properties:
      ProvisionedConcurrencyConfig:
        ProvisionedConcurrentExecutions: 5
```

---

### 7. Missing Rate Limiting / Request Queuing

**Problem:**  
Without rate limiting, all requests compete for resources simultaneously, leading to resource exhaustion.

**Fix - Add Rate Limiting with SlowAPI:**
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.get("/brands/competitors/")
@limiter.limit("20/second")  # 20 requests per second per client
async def get_competitors(request: Request, brand_id: str, client_id: str):
    ...
```

---

## Recommended Fixes

### Priority Order

| Priority | Issue | Fix | Effort |
|----------|-------|-----|--------|
| 🔴 **P1** | DB Connection Pool | Increase `max_pool_connections` to 50+ | Low |
| 🔴 **P1** | Uvicorn Workers | Use 4+ workers in production | Low |
| 🟠 **P2** | Sync DB Calls | Use `run_in_executor` or `aioboto3` | Medium |
| 🟠 **P2** | DynamoDB Capacity | Switch to On-Demand or increase RCU | Low |
| 🟡 **P3** | Rate Limiting | Add SlowAPI rate limiter | Medium |
| 🟡 **P3** | Lambda Cold Starts | Enable Provisioned Concurrency | Low |

### Quick Implementation Checklist

```markdown
- [ ] Increase boto3 max_pool_connections to 50
- [ ] Deploy with 4+ Uvicorn/Gunicorn workers
- [ ] Switch DynamoDB to On-Demand billing
- [ ] Wrap sync DB calls with run_in_executor
- [ ] Add retry logic with exponential backoff
- [ ] Monitor CloudWatch for ThrottlingExceptions
- [ ] Add health check endpoint
```

---

## Frontend Workaround

Until backend fixes are deployed, the frontend uses **batched sequential processing**:

### Current Implementation

**File:** `/server/actions/brandActions.ts`

```typescript
const BATCH_SIZE = 2;        // Process 2 brands at a time
const BATCH_DELAY_MS = 100;  // 100ms delay between batches

async function processBrandsInBatches(
  brands: any[], 
  clientId: string, 
  accessToken: string
): Promise<any[]> {
  const allResults: any[] = [];
  
  for (let i = 0; i < brands.length; i += BATCH_SIZE) {
    const batch = brands.slice(i, i + BATCH_SIZE);
    
    const batchPromises = batch.map((brand: any) => 
      enrichBrandWithData(brand, clientId, accessToken)
    );
    
    const batchResults = await Promise.allSettled(batchPromises);
    
    // Process results...
    
    // Delay before next batch
    if (i + BATCH_SIZE < brands.length) {
      await new Promise(resolve => setTimeout(resolve, BATCH_DELAY_MS));
    }
  }
  
  return allResults;
}
```

### Trade-offs

| Mode | Duration (7 brands) | Success Rate |
|------|---------------------|--------------|
| Parallel | ~17 seconds | 67% (fails) |
| **Batched (size 2)** | **~13 seconds** | **100%** |
| Sequential | ~55 seconds | 100% |

---

## Monitoring & Debugging

### CloudWatch Metrics to Monitor

```
# DynamoDB
- ConsumedReadCapacityUnits
- ThrottledRequests
- ReadThrottleEvents

# Lambda (if applicable)
- Duration
- ConcurrentExecutions
- Throttles
- Errors

# API Gateway
- 5XXError
- IntegrationLatency
- Latency

# ECS/EC2
- CPUUtilization
- MemoryUtilization
- NetworkIn/Out
```

### Logging Recommendations

Add structured logging to track request performance:

```python
import logging
import time
from functools import wraps

logger = logging.getLogger(__name__)

def log_performance(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start = time.time()
        try:
            result = await func(*args, **kwargs)
            duration = time.time() - start
            logger.info(f"{func.__name__} completed", extra={
                "duration_ms": duration * 1000,
                "status": "success",
                "args": str(kwargs)
            })
            return result
        except Exception as e:
            duration = time.time() - start
            logger.error(f"{func.__name__} failed", extra={
                "duration_ms": duration * 1000,
                "status": "error",
                "error": str(e),
                "args": str(kwargs)
            })
            raise
    return wrapper

@app.get("/brands/competitors/")
@log_performance
async def get_competitors(brand_id: str, client_id: str):
    ...
```

### Health Check Endpoint

```python
@app.get("/health")
async def health_check():
    # Test DynamoDB connection
    try:
        dynamodb.meta.client.describe_limits()
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
    
    return {
        "status": "ok" if db_status == "healthy" else "degraded",
        "database": db_status,
        "timestamp": datetime.utcnow().isoformat()
    }
```

---

## Summary

The missing competitor data issue is caused by **backend concurrency limitations**. The most likely culprits are:

1. **Low DynamoDB/boto3 connection pool** (default 10 connections)
2. **Single Uvicorn worker** (default 1 worker)
3. **Synchronous blocking database calls**

### Immediate Actions

1. Increase `max_pool_connections` to 50+
2. Deploy with 4+ worker processes
3. Consider switching DynamoDB to On-Demand capacity

### Frontend Mitigation

Batched processing (2 brands at a time) with 100ms delays between batches provides 100% success rate as a workaround until backend is optimized.

---

*Document maintained by the BrandOS Engineering Team*
