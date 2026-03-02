## /cam/knowledge-base/

### Create a CAM Knowledge Base Session

This endpoint creates a new CAM session by fetching BAM agent results and storing them for use in content generation, chat, and content revision.

### How to use:

First run BAM agents to get a bam_session_id
Call this endpoint with your client_id, brand_id, and bam_session_id
Use the returned cam_session_id in subsequent content/chat/revise requests
Parameters:

client_id: Your client identifier
brand_id: Your brand identifier
bam_session_id: The session ID from completed BAM agent run
Returns:

cam_session_id: Unique session ID for this knowledge base
message: Success confirmation
### Example:

{
  "client_id": "your-client-id",
  "brand_id": "your-brand-id",
  "bam_session_id": "bam-session-uuid"
}
### Response:

{
  "cam_session_id": "cam-session-uuid",
  "message": "Knowledge base created successfully"
}

### Request body

application/json
Example Value
Schema
{
  "client_id": "string",
  "brand_id": "string",
  "bam_session_id": "string"
}

---

## /cam/content/

### Generate Branded Content

This endpoint generates branded content using insights from BAM agents, with content prioritized by importance (Agent 17 has highest priority).

### How to use:

First create a knowledge base session with /cam/knowledge-base/
Call this endpoint with your cam_session_id and content requirements
Optionally add additional_instructions and uploaded_docs for more context
### Parameters:

client_id: Your client identifier
brand_id: Your brand identifier
cam_session_id: Session ID from knowledge base creation
additional_instructions: Content generation instructions and requirements
uploaded_docs: Optional list of document URLs for additional context (default: [])
model_id: AI model to use (default: "claude-3-5-sonnet")
### Available Models:

claude-3-haiku - Fast, cost-effective
claude-3-5-sonnet - Balanced performance (default)
claude-3-7-sonnet - Highest quality
claude-4-sonnet, claude-4-opus - Latest models
deepseek-r1 - Alternative model
meta-llama4-scout - Large context model
### Context Priority:

Agent 17 insights (highest priority)
Additional instructions (content requirements)
Other BAM agent outputs
Uploaded documents
### Example:

{
  "client_id": "your-client-id",
  "brand_id": "your-brand-id",
  "cam_session_id": "cam-session-uuid",
  "additional_instructions": "Write a compelling product description for our new eco-friendly water bottle, focusing on sustainability benefits and key features",
  "uploaded_docs": ["https://example.com/product-specs.pdf"],
  "model_id": "claude-3-5-sonnet"
}

### Response:

{
  "generated_content": "Introducing our revolutionary EcoFlow Water Bottle..."
}

### Request body

application/json
Example Value
Schema
{
  "client_id": "string",
  "brand_id": "string",
  "cam_session_id": "string",
  "additional_instructions": "string",
  "uploaded_docs": [],
  "model_id": "claude-3-5-sonnet"
}


---

## /cam/chat/


### Conversational AI Chat with Brand Context

This endpoint provides conversational Q&A using BAM agent insights as context, with persistent chat history for natural conversations.

### How to use:

Create a knowledge base session with /cam/knowledge-base/
Ask questions using the cam_session_id
Chat history is automatically maintained for follow-up questions
Each session remembers previous conversation turns
### Parameters:

client_id: Your client identifier
brand_id: Your brand identifier
cam_session_id: Session ID from knowledge base creation
question: Your question about the brand/company
additional_instructions: Optional context instructions (default: "")
uploaded_docs: Optional documents for additional context (default: [])
model_id: AI model to use (default: "claude-3-5-sonnet")
temperature: Response creativity (0.0-1.0, default: 0.7)
top_p: Response diversity (0.0-1.0, default: 1.0)
history_limit: Number of recent Q&A pairs to include (1-10, default: 3)
### Chat History:

Automatically saves conversation history per session
Includes last N exchanges in context for coherent responses
History persists across multiple API calls
## Context Priority:

### Recent chat history
Agent 17 insights
Additional instructions
Other BAM agent outputs
Uploaded documents

### Example:

{
  "client_id": "your-client-id",
  "brand_id": "your-brand-id",
  "cam_session_id": "cam-session-uuid",
  "question": "What are our brand's core values?",
  "additional_instructions": "Focus on sustainability aspects",
  "history_limit": 3,
  "model_id": "claude-3-5-sonnet"
}
### Response:

{
  "answer": "Based on our brand analysis, our core values include..."
}
### Follow-up Example:

{
  "client_id": "your-client-id",
  "brand_id": "your-brand-id",
  "cam_session_id": "cam-session-uuid",
  "question": "How do we communicate these values in marketing?",
  "history_limit": 3
}

(The system will remember the previous question about core values)


### Request body

application/json
Example Value
Schema
{
  "client_id": "string",
  "brand_id": "string",
  "cam_session_id": "string",
  "question": "string",
  "additional_instructions": "",
  "model_id": "claude-3-5-sonnet",
  "temperature": 0.7,
  "top_p": 1,
  "history_limit": 3,
  "uploaded_docs": []
}



---


# /cam/revise/


### Revise Generated Content with User Feedback

This endpoint takes previously generated content and revises it based on user feedback while maintaining brand consistency using BAM agent insights.

### How to use:

Generate initial content with /cam/content/
If you want changes, call this endpoint with the original content and your feedback
The system will revise while staying true to brand insights
Parameters:

client_id: Your client identifier
brand_id: Your brand identifier
cam_session_id: Session ID from knowledge base creation
original_content: The content you want to revise
user_feedback: Specific feedback on what to change/improve
model_id: AI model to use (default: "claude-3-5-sonnet")
### Revision Process:

Uses the same BAM agent context for brand consistency
Focuses on Agent 17 insights (highest priority) to maintain brand voice
Addresses user feedback while preserving core brand messaging
### Use Cases:

Tone adjustments
Length modifications
Adding/removing specific information
Style improvements
Fact corrections
### Example:

{
  "client_id": "your-client-id",
  "brand_id": "your-brand-id",
  "cam_session_id": "cam-session-uuid",
  "original_content": "Our product is great and you should buy it.",
  "user_feedback": "Make it more engaging and add benefits about sustainability",
  "model_id": "claude-3-5-sonnet"
}
### Response:

{
  "revised_content": "Discover our eco-friendly product that not only delivers exceptional performance but also contributes to a sustainable future..."
}
### Best Practices:

Be specific in your feedback for better results
Mention particular sections to change if needed
Include examples of desired tone or style
The system will maintain brand consistency from BAM analysis



### Request body

application/json
Example Value
Schema
{
  "client_id": "string",
  "brand_id": "string",
  "cam_session_id": "string",
  "original_content": "string",
  "user_feedback": "string",
  "model_id": "claude-3-5-sonnet"
}


---

# /cam/sessions


### Get All CAM Sessions for a Brand

This endpoint retrieves all CAM sessions for a specific brand, including session metadata.

### Parameters:

client_id: Client identifier (query parameter)
brand_id: Brand identifier (query parameter)
Returns:

sessions: Array of CAM session objects with metadata
### Example:

GET /cam/sessions?client_id=your-client&brand_id=your-brand
### Response:

{
  "sessions": [
    {
      "cam_session_id": "session-uuid-1",
      "bam_session_id": "bam-session-uuid-1",
      "created_at": "2025-11-13T14:00:00.000Z",
      "chat_messages": 5
    },
    {
      "cam_session_id": "session-uuid-2",
      "bam_session_id": "bam-session-uuid-2",
      "created_at": "2025-11-13T13:30:00.000Z",
      "chat_messages": 12
    }
  ]
}