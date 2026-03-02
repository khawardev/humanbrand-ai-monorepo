'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { runAuditorAgent, getAuditorOutput } from '@/server/actions/auditorActions';

type UseAuditorProps = {
    clientId: string;
    brandId: string;
    batchId: string | null;
    scope: string;
    modelName?: string;
};

export function useAuditor({ clientId, brandId, batchId, scope, modelName }: UseAuditorProps) {
    const [taskId, setTaskId] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);
    const [isRunning, setIsRunning] = useState(false);

    const pollResult = useCallback(async (taskIdToPoll: string) => {
        let attempts = 0;
        const maxAttempts = 60;

        const interval = setInterval(async () => {
            attempts++;
            try {
                const res = await getAuditorOutput({
                    client_id: clientId,
                    brand_id: brandId,
                    task_id: taskIdToPoll
                });

                if (res.success && res.data) {
                    setResult(res.data);
                    toast.success('Auditor analysis complete!');
                    setIsRunning(false);
                    clearInterval(interval);
                } else if (attempts >= maxAttempts) {
                    toast.error('Auditor analysis timed out. Please try fetching later.');
                    setIsRunning(false);
                    clearInterval(interval);
                }
            } catch (e) {
                console.error('Polling auditor error', e);
            }
        }, 3000);
    }, [clientId, brandId]);

    const handleRun = useCallback(async () => {
        if (!batchId) {
            toast.error('No website data found. Please run data collection first.');
            return;
        }
        setIsRunning(true);
        toast.info(`Starting Website Auditor analysis (${scope})...`);
        try {
            const res = await runAuditorAgent({
                client_id: clientId,
                brand_id: brandId,
                batch_id: batchId,
                analysis_scope: scope as any,
                model_name: modelName
            });

            if (res.success && res.data?.task_id) {
                setTaskId(res.data.task_id);
                toast.success('Auditor Agent started! Analyzing content...');
                pollResult(res.data.task_id);
            } else {
                toast.error(`Auditor failed to start: ${res.error || 'Unknown error'}`);
                setIsRunning(false);
            }
        } catch (e) {
            console.error(e);
            toast.error('Error starting Auditor Agent');
            setIsRunning(false);
        }
    }, [clientId, brandId, batchId, scope, pollResult]);

    return {
        taskId,
        result,
        isRunning,
        handleRun
    };
}
