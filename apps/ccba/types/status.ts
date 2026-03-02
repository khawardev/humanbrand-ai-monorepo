export interface BatchProcessingTask {
  task_type: 'BATCH_WEBSITE' | 'BATCH_SOCIAL';
  task_id: string;
  status: string;
  created_at: string;
  name: string;
}

export interface BedrockReportTask {
  task_type: 'BATCH_WEBSITE_REPORT' | 'BATCH_SOCIAL_REPORT';
  task_id: string;
  status: string;
  created_at: string;
  batch_name: string;
}

export interface RunningTasks {
  batch_processing: BatchProcessingTask[];
  bedrock_reports: BedrockReportTask[];
}

export interface CcbaStatusResponse {
  stage: 'ccba';
  client_id: string;
  brand_id: string;
  running_tasks: RunningTasks;
  total_running: number;
}
