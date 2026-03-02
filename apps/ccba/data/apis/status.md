# /stage/running-tasks

Get the status of all running tasks for a specific stage. Currently supports 'ccba' (batch processing, bedrock reports) and 'bvo' (BAM analysis) stages.

## Query parameters:

stage: The stage name (e.g., 'ccba' or 'bvo')
client_id: Client identifier
brand_id: Brand identifier
Parameters


Name	Description

stage *
string
(query)
ccba
client_id *
string
(query)
763d503f-9d24-42c4-b6d5-0fa2beba5da9
brand_id *
string
(query)
1ea9c057-d7dd-45fd-9d12-7ce4b0211474


## Request : 

curl -X 'GET' \
  'http://54.221.221.0:8000/stage/running-tasks?stage=ccba&client_id=2ea1a375-9bbe-4125-b063-3fa15068f48f&brand_id=cfbcfb0a-6b64-4d4d-9345-732ee037c0b2' \
  -H 'accept: application/json'

## Response 


{
  "stage": "ccba",
  "client_id": "763d503f-9d24-42c4-b6d5-0fa2beba5da9",
  "brand_id": "1ea9c057-d7dd-45fd-9d12-7ce4b0211474",
  "running_tasks": {
    "batch_processing": [
      {
        "task_type": "BATCH_WEBSITE",
        "task_id": "0d7f5ab6-10e4-47cf-b343-9284145f6649",
        "status": "Processing",
        "created_at": "2025-11-20T10:24:20.648804",
        "name": "1ea9c057-d7dd-45fd-9d12-7ce4b0211474 - website Capture"
      },
      {
        "task_type": "BATCH_SOCIAL",
        "task_id": "d96b72ee-11f7-410a-8897-e5ac3f4abda8",
        "status": "Processing",
        "created_at": "2025-11-20T10:24:43.106831",
        "name": "social_scrape_1ea9c057-d7dd-45fd-9d12-7ce4b0211474"
      }
    ],
    "bedrock_reports": [
      {
        "task_type": "BATCH_WEBSITE_REPORT",
        "task_id": "be390acb-731f-45f9-9ec6-2b4d713b5172",
        "status": "Processing",
        "created_at": "2025-11-20T10:24:27.946393",
        "batch_name": "1ea9c057-d7dd-45fd-9d12-7ce4b0211474_report"
      },
      {
        "task_type": "BATCH_SOCIAL_REPORT",
        "task_id": "36839411-815d-40cd-9080-df23bf339d1f",
        "status": "Processing",
        "created_at": "2025-11-20T10:14:46.857391",
        "batch_name": "1ea9c057-d7dd-45fd-9d12-7ce4b0211474 - website Report"
      }
    ]
  },
  "total_running": 4
}