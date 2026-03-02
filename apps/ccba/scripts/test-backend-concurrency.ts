/**
 * Backend Concurrency Test Script
 * 
 * This script tests if the backend can handle multiple concurrent requests properly.
 * 
 * HOW TO RUN:
 * 1. First, get your access_token from browser:
 *    - Open your app in browser, login
 *    - Open DevTools (F12) -> Application -> Cookies
 *    - Copy the value of "access_token"
 * 
 * 2. Run the test with your token:
 *    TEST_ACCESS_TOKEN=your_token_here pnpm exec tsx scripts/test-backend-concurrency.ts
 * 
 * Or set both values:
 *    TEST_CLIENT_ID=xxx TEST_ACCESS_TOKEN=yyy pnpm exec tsx scripts/test-backend-concurrency.ts
 */

import * as fs from 'fs';
import * as path from 'path';

function loadEnv() {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        envContent.split('\n').forEach(line => {
            if (line && !line.startsWith('#')) {
                const [key, ...valueParts] = line.split('=');
                if (key && valueParts.length > 0) {
                    const value = valueParts.join('=').trim();
                    if (!process.env[key.trim()]) {
                        process.env[key.trim()] = value;
                    }
                }
            }
        });
    }
}

loadEnv();

const API_URL = process.env.API_URL || 'https://api-beta.brandos.humanbrand.ai';

interface TestResult {
    endpoint: string;
    success: boolean;
    duration: number;
    error?: string;
    dataLength?: number;
    data?: any;
}

async function makeRequest(
    endpoint: string,
    accessToken: string
): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        const duration = Date.now() - startTime;
        
        if (!res.ok) {
            return {
                endpoint,
                success: false,
                duration,
                error: `HTTP ${res.status}: ${res.statusText}`
            };
        }
        
        const data = await res.json();
        
        return {
            endpoint,
            success: true,
            duration,
            dataLength: Array.isArray(data) ? data.length : (typeof data === 'object' ? Object.keys(data).length : 1),
            data
        };
    } catch (error: any) {
        return {
            endpoint,
            success: false,
            duration: Date.now() - startTime,
            error: error.message || 'Unknown error'
        };
    }
}

async function testSequentialRequests(
    clientId: string,
    brandIds: string[],
    accessToken: string
) {
    console.log('\n========== SEQUENTIAL REQUEST TEST ==========');
    console.log(`Testing ${brandIds.length} brands sequentially...\n`);
    
    const results: TestResult[] = [];
    const startTime = Date.now();
    
    for (const brandId of brandIds) {
        const endpoints = [
            `/batch/website-scrapes?client_id=${clientId}&brand_id=${brandId}`,
            `/batch/social-scrapes?client_id=${clientId}&brand_id=${brandId}`,
            `/brands/competitors/?client_id=${clientId}&brand_id=${brandId}`
        ];
        
        for (const endpoint of endpoints) {
            const result = await makeRequest(endpoint, accessToken);
            results.push(result);
            const endpointName = endpoint.split('?')[0]?.split('/').filter(Boolean).pop() || 'endpoint';
            console.log(`[${result.success ? '✓' : '✗'}] ${result.duration.toString().padStart(4)}ms - ${endpointName?.padEnd(18)} - ${result.success ? `${result.dataLength} items` : result.error}`);
        }
    }
    
    const totalDuration = Date.now() - startTime;
    const successCount = results.filter(r => r.success).length;
    
    console.log(`\nSequential Results:`);
    console.log(`  Total Duration: ${totalDuration}ms`);
    console.log(`  Success: ${successCount}/${results.length}`);
    console.log(`  Failure: ${results.length - successCount}/${results.length}`);
    
    return { results, totalDuration, successCount };
}

async function testParallelRequests(
    clientId: string,
    brandIds: string[],
    accessToken: string
) {
    console.log('\n========== PARALLEL REQUEST TEST ==========');
    console.log(`Testing ${brandIds.length} brands in parallel (all at once)...\n`);
    
    const startTime = Date.now();
    
    const allPromises: Promise<TestResult>[] = [];
    
    for (const brandId of brandIds) {
        allPromises.push(makeRequest(`/batch/website-scrapes?client_id=${clientId}&brand_id=${brandId}`, accessToken));
        allPromises.push(makeRequest(`/batch/social-scrapes?client_id=${clientId}&brand_id=${brandId}`, accessToken));
        allPromises.push(makeRequest(`/brands/competitors/?client_id=${clientId}&brand_id=${brandId}`, accessToken));
    }
    
    const results = await Promise.all(allPromises);
    const totalDuration = Date.now() - startTime;
    
    results.forEach(result => {
        const endpointName = result.endpoint.split('?')[0]?.split('/').filter(Boolean).pop() || 'endpoint';
        console.log(`[${result.success ? '✓' : '✗'}] ${result.duration.toString().padStart(4)}ms - ${endpointName?.padEnd(18)} - ${result.success ? `${result.dataLength} items` : result.error}`);
    });
    
    const successCount = results.filter(r => r.success).length;
    
    console.log(`\nParallel Results:`);
    console.log(`  Total Duration: ${totalDuration}ms`);
    console.log(`  Success: ${successCount}/${results.length}`);
    console.log(`  Failure: ${results.length - successCount}/${results.length}`);
    
    return { results, totalDuration, successCount };
}

async function testBatchedParallelRequests(
    clientId: string,
    brandIds: string[],
    accessToken: string,
    batchSize: number = 2
) {
    console.log('\n========== BATCHED PARALLEL REQUEST TEST ==========');
    console.log(`Testing ${brandIds.length} brands with batch size ${batchSize}...\n`);
    
    const startTime = Date.now();
    const allResults: TestResult[] = [];
    
    for (let i = 0; i < brandIds.length; i += batchSize) {
        const batch = brandIds.slice(i, i + batchSize);
        console.log(`Processing batch ${Math.floor(i / batchSize) + 1} (${batch.length} brands)...`);
        
        const batchPromises: Promise<TestResult>[] = [];
        
        for (const brandId of batch) {
            batchPromises.push(makeRequest(`/batch/website-scrapes?client_id=${clientId}&brand_id=${brandId}`, accessToken));
            batchPromises.push(makeRequest(`/batch/social-scrapes?client_id=${clientId}&brand_id=${brandId}`, accessToken));
            batchPromises.push(makeRequest(`/brands/competitors/?client_id=${clientId}&brand_id=${brandId}`, accessToken));
        }
        
        const batchResults = await Promise.all(batchPromises);
        allResults.push(...batchResults);
        
        batchResults.forEach(result => {
            const endpointName = result.endpoint.split('?')[0]?.split('/').filter(Boolean).pop() || 'endpoint';
            console.log(`  [${result.success ? '✓' : '✗'}] ${result.duration.toString().padStart(4)}ms - ${endpointName?.padEnd(18)} - ${result.success ? `${result.dataLength} items` : result.error}`);
        });
    }
    
    const totalDuration = Date.now() - startTime;
    const successCount = allResults.filter(r => r.success).length;
    
    console.log(`\nBatched Parallel Results:`);
    console.log(`  Total Duration: ${totalDuration}ms`);
    console.log(`  Success: ${successCount}/${allResults.length}`);
    console.log(`  Failure: ${allResults.length - successCount}/${allResults.length}`);
    
    return { results: allResults, totalDuration, successCount };
}

async function main() {
    console.log('==============================================');
    console.log('     BACKEND CONCURRENCY TEST');
    console.log('==============================================\n');
    console.log(`API URL: ${API_URL}\n`);
    
    const ACCESS_TOKEN = process.env.TEST_ACCESS_TOKEN;
    
    if (!ACCESS_TOKEN) {
        console.log('❌ ERROR: No access token provided!\n');
        console.log('HOW TO GET YOUR ACCESS TOKEN:');
        console.log('1. Open your app in browser and login');
        console.log('2. Open DevTools (F12 or Cmd+Option+I)');
        console.log('3. Go to Application -> Cookies -> your domain');
        console.log('4. Copy the value of "access_token"\n');
        console.log('Then run:');
        console.log('  TEST_ACCESS_TOKEN="your_token_here" pnpm exec tsx scripts/test-backend-concurrency.ts');
        return;
    }
    
    console.log('Access token provided ✓\n');
    
    // First, fetch brands to get brand IDs and client_id
    console.log('Fetching user info to get client_id...');
    
    const userResult = await makeRequest('/users/me/', ACCESS_TOKEN);
    
    if (!userResult.success) {
        console.error('❌ Failed to fetch user info:', userResult.error);
        console.log('\nYour token might be expired. Please get a fresh token from your browser.');
        return;
    }
    
    const clientId = userResult.data?.client_id;
    if (!clientId) {
        console.error('❌ No client_id found in user data');
        return;
    }
    
    console.log(`Client ID: ${clientId}\n`);
    
    // Fetch brands
    console.log('Fetching brands...');
    const brandsResult = await makeRequest(`/brands/?client_id=${clientId}`, ACCESS_TOKEN);
    
    if (!brandsResult.success) {
        console.error('❌ Failed to fetch brands:', brandsResult.error);
        return;
    }
    
    const brands = brandsResult.data;
    if (!Array.isArray(brands) || brands.length === 0) {
        console.log('No brands found');
        return;
    }
    
    console.log(`Found ${brands.length} brands\n`);
    
    // Get brand IDs - test with up to 5 brands
    const brandIds = brands.map((b: any) => b.brand_id).slice(0, 5);
    const brandNames = brands.slice(0, 5).map((b: any) => b.name);
    
    console.log('Testing with brands:');
    brandNames.forEach((name: string, i: number) => {
        console.log(`  ${i + 1}. ${name} (${brandIds[i]})`);
    });
    console.log('');
    
    // Run tests
    const seqResults = await testSequentialRequests(clientId, brandIds, ACCESS_TOKEN);
    
    console.log('\nWaiting 2 seconds before parallel test...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const parallelResults = await testParallelRequests(clientId, brandIds, ACCESS_TOKEN);
    
    console.log('\nWaiting 2 seconds before batched parallel test...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const batchedResults = await testBatchedParallelRequests(clientId, brandIds, ACCESS_TOKEN, 2);
    
    console.log('\n==============================================');
    console.log('     ANALYSIS');
    console.log('==============================================\n');
    
    const seqSuccess = seqResults.successCount === seqResults.results.length;
    const parSuccess = parallelResults.successCount === parallelResults.results.length;
    const batSuccess = batchedResults.successCount === batchedResults.results.length;
    
    console.log(`Sequential:        ${seqSuccess ? '✓ ALL PASS' : `✗ ${seqResults.results.length - seqResults.successCount} FAILED`} (${seqResults.totalDuration}ms)`);
    console.log(`Parallel:          ${parSuccess ? '✓ ALL PASS' : `✗ ${parallelResults.results.length - parallelResults.successCount} FAILED`} (${parallelResults.totalDuration}ms)`);
    console.log(`Batched (size 2):  ${batSuccess ? '✓ ALL PASS' : `✗ ${batchedResults.results.length - batchedResults.successCount} FAILED`} (${batchedResults.totalDuration}ms)`);
    
    console.log('\nRECOMMENDATIONS:');
    
    if (seqSuccess && !parSuccess) {
        console.log('⚠️  Parallel requests fail but sequential work.');
        console.log('   → Backend has concurrency limits or rate limiting.');
        console.log('   → Consider implementing batched requests with delays.');
    }
    
    if (seqSuccess && parSuccess && batSuccess) {
        console.log('✓  All tests passed! Backend handles concurrency well.');
        console.log('   → If you still see missing data, the issue is likely in Next.js cookies() handling.');
    }
    
    if (!seqSuccess) {
        console.log('❌  Even sequential requests are failing.');
        console.log('   → Check backend logs for errors.');
        console.log('   → Verify API endpoints are correct.');
    }
    
    // Show competitor data specifically
    console.log('\n==============================================');
    console.log('     COMPETITOR DATA CHECK');
    console.log('==============================================\n');
    
    for (let i = 0; i < brandIds.length; i++) {
        const brandId = brandIds[i];
        const brandName = brandNames[i];
        const result = await makeRequest(`/brands/competitors/?client_id=${clientId}&brand_id=${brandId}`, ACCESS_TOKEN);
        
        if (result.success) {
            const competitors = Array.isArray(result.data) ? result.data : (result.data?.competitors || []);
            console.log(`${brandName}: ${competitors.length} competitors ${result.success ? '✓' : '✗'}`);
            if (competitors.length > 0) {
                competitors.forEach((c: any) => {
                    console.log(`  - ${c.name}`);
                });
            }
        } else {
            console.log(`${brandName}: FAILED - ${result.error}`);
        }
    }
}

main().catch(console.error);
