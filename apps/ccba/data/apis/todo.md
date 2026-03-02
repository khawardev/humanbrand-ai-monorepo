/stage/running-tasks

curl -X 'GET' \
  'http://54.221.221.0:8000/stage/running-tasks?stage=ccba&client_id=763d503f-9d24-42c4-b6d5-0fa2beba5da9&brand_id=1ea9c057-d7dd-45fd-9d12-7ce4b0211474' \
  -H 'accept: application/json'


Get the status of all running tasks for a specific stage. Currently supports 'ccba' stage which includes batch processing and bedrock reports.

Query parameters:

stage: The stage name (e.g., 'ccba')
client_id: Client identifier
brand_id: Brand identifier
Parameters
Cancel
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


Response

{
  "stage": "ccba",
  "client_id": "763d503f-9d24-42c4-b6d5-0fa2beba5da9",
  "brand_id": "1ea9c057-d7dd-45fd-9d12-7ce4b0211474",
  "running_tasks": {
    "batch_processing": [
      {
        "task_type": "BATCH_WEBSITE",
        "task_id": "fc43de9e-2410-4385-8fba-b9e79ccf3bd8",
        "status": "Processing",
        "created_at": "2025-11-17T06:08:40.699135",
        "name": "1ea9c057-d7dd-45fd-9d12-7ce4b0211474 - website Capture"
      },
      {
        "task_type": "BATCH_SOCIAL",
        "task_id": "366ae4d6-6b86-489a-8442-5d3318366a3f",
        "status": "Processing",
        "created_at": "2025-11-17T06:09:43.718990",
        "name": "social_scrape_1ea9c057-d7dd-45fd-9d12-7ce4b0211474"
      }
    ],
    "bedrock_reports": [
      {
        "task_type": "BATCH_WEBSITE_REPORT",
        "task_id": "dbea8497-59d6-42ed-9948-e9563099ca24",
        "status": "Processing",
        "created_at": "2025-11-17T06:30:23.365724",
        "batch_name": "1ea9c057-d7dd-45fd-9d12-7ce4b0211474 - website Report"
      },
      {
        "task_type": "BATCH_SOCIAL_REPORT",
        "task_id": "dbea8497-59d6-42ed-9948-e9563099ca24",
        "status": "Processing",
        "created_at": "2025-11-17T06:30:23.365724",
        "batch_name": "1ea9c057-d7dd-45fd-9d12-7ce4b0211474 - website Report"
      }
    ]
  },
  "total_running": 1
}