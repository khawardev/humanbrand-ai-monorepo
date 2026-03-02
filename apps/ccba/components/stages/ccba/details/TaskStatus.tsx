'use client';

import { CcbaStatusResponse } from '@/types/status';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SCRAPE } from '@/lib/constants';

interface TaskStatusProps {
  initialStatusData: CcbaStatusResponse | null;
}

const taskTypeMapping: Record<string, string> = {
  BATCH_WEBSITE: `Website ${SCRAPE}`,
  BATCH_SOCIAL: `Social ${SCRAPE}`,
  BATCH_WEBSITE_REPORT: 'Website Report',
  BATCH_SOCIAL_REPORT: 'Social Report'
};

export function TaskStatus({ initialStatusData }: TaskStatusProps) {
  const [statusData, setStatusData] = useState(initialStatusData);
  const router = useRouter();

  useEffect(() => {
    setStatusData(initialStatusData);
  }, [initialStatusData]);

  useEffect(() => {
    const hasRunningTasks = statusData && statusData.total_running > 0;

    if (!hasRunningTasks) {
      return;
    }

    const interval = setInterval(() => {
      router.refresh();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [statusData, router]);

  if (!statusData || statusData.total_running === 0) {
    return <Badge variant="outline">No pending tasks</Badge>;
  }

  const allTasks = [
    ...(statusData.running_tasks.batch_processing || []),
    ...(statusData.running_tasks.bedrock_reports || [])
  ];

  return (
    <div className="flex items-center gap-2">
      {allTasks.map((task) => (
        <TooltipProvider key={task.task_id}>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="default">
                {taskTypeMapping[task.task_type] || task.task_type}: {task.status}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Task: {taskTypeMapping[task.task_type]}</p>
              <p>Status: {task.status}</p>
              <p>Started: {new Date(task.created_at).toLocaleString()}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
