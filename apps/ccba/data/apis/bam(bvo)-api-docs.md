# BAM (BVO) Agentic API Documentation


## **POST /bam/agentic**

Initiates the BAM agentic process for a specific brand.

---

## **Body Parameters**

| Field | Type | Required | Description |
|-------|--------|----------|-------------|
| `client_id` | string | yes | Client identifier. |
| `brand_id` | string | yes | Brand identifier. |
| `social_id` | string | yes | Social media report batch ID. |
| `website_id` | string | yes | Website report batch ID. |
| `custom_instructions` | string/null | no | Additional agent instructions. |
| `stakeholder_interview_insights` | array<string>/null | no | Parsed insights from interviews. |
| `stakeholder_questionaire_insights` | array<string>/null | no | Parsed insights from questionnaires. |
| `agent_ids` | array<string>/null | no | Agents to run. Empty → all. |
| `mode` | string | no | `sequential` (default), `independent`, `interactive`. |
| `model` | string/null | no | LLM model. Default: `claude-4.5-sonnet`. |
| `rag_name` | string/null | no | RAG config name. Default: `default_rag`. |
| `fuse_depth` | integer/null | no | RAG fusion depth. Default: `3`. |
| `files` | array<string>/null | no | Optional uploaded file IDs/URLs. |

---

## **Execution Modes**

### **sequential**
Runs full pipeline in order.

### **independent**
Runs selected agents concurrently.

### **interactive**
Starts guided, step-by-step execution.



## **Sample Response**

{
  "task_id": "task_84hs882jh2",
  "status": "Pending"
}

---

## **GET /bam/agentic**

Retrieve the history of all BAM sessions for a specific brand.

### **Query Parameters**

| Name | Type | Required | Description |
|------|--------|----------|-------------|
| `client_id` | string | yes | Client identifier. |
| `brand_id` | string | yes | Brand identifier. |

---

## **GET /bam/agentic/{task_id}/status**

Retrieve the status of BAM agents for a specific task.

### **Path Parameters**

| Name | Type | Required | Description |
|------|--------|----------|-------------|
| `task_id` | string | yes | Unique task identifier. |

### **Query Parameters**

| Name | Type | Required | Description |
|------|--------|----------|-------------|
| `client_id` | string | yes | Client identifier. |
| `brand_id` | string | yes | Brand identifier. |

---

## **GET /bam/agentic/{task_id}/results**

Retrieve the results of BAM agents for a specific task.

### **Path Parameters**

| Name | Type | Required | Description |
|------|--------|----------|-------------|
| `task_id` | string | yes | Unique task identifier. |

### **Query Parameters**

| Name | Type | Required | Description |
|------|--------|----------|-------------|
| `client_id` | string | yes | Client identifier. |
| `brand_id` | string | yes | Brand identifier. |

---

## **POST /bam/interactive/{session_id}/run**

Run a specific agent inside an interactive session.

### **Path Parameters**

| Name | Type | Required | Description |
|------|--------|----------|-------------|
| `session_id` | string | yes | Interactive session ID. |

### **Request Body (application/json)**

```json
{
  "agent_id": "",
  "custom_instructions": ""
}

Field	Type	Required	Description
agent_id	string	yes	Agent ID to run.
custom_instructions	string	no	Extra instructions for this execution.


⸻

### **GET /bam/interactive/{session_id}/status**

Get the current status of an interactive session.

Path Parameters

Name	Type	Required	Description
session_id	string	yes	Interactive session ID.


⸻

### **POST /bam/interactive/{session_id}/end**

End an interactive session and return final results.

Path Parameters

Name	Type	Required	Description
session_id	string	yes	Interactive session ID.

