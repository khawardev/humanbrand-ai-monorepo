'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { runSocialAuditorAgent, getSocialAuditorOutput } from '@/server/actions/auditorActions';

type UseSocialAuditorProps = {
    clientId: string;
    brandId: string;
    batchId: string | null;
    channel: string;
    scope: string;
};

export function useSocialAuditor({ clientId, brandId, batchId, channel, scope }: UseSocialAuditorProps) {
    const [taskId, setTaskId] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);
    const [isRunning, setIsRunning] = useState(false);

    const pollResult = useCallback(async (taskIdToPoll: string) => {
        let attempts = 0;
        const maxAttempts = 60;

        const interval = setInterval(async () => {
            attempts++;
            try {
                const res = await getSocialAuditorOutput({
                    client_id: clientId,
                    brand_id: brandId,
                    task_id: taskIdToPoll
                });

                if (res.success && res.data) {
                    setResult(res.data);
                    toast.success('Social analysis complete!');
                    setIsRunning(false);
                    clearInterval(interval);
                } else if (attempts >= maxAttempts) {
                    toast.error('Social analysis timed out.');
                    setIsRunning(false);
                    clearInterval(interval);
                }
            } catch (e) {
                console.error('Polling social auditor error', e);
            }
        }, 3000);
    }, [clientId, brandId]);

    const handleRun = useCallback(async () => {
        if (!batchId) {
            toast.error('No social data found. Please run data collection first.');
            return;
        }
        setIsRunning(true);
        setResult(null);
        toast.info(`Starting Social Auditor Analysis for ${channel} (${scope})...`);

        try {
            const res = await runSocialAuditorAgent({
                client_id: clientId,
                brand_id: brandId,
                batch_id: batchId,
                channel_name: channel as any,
                analysis_scope: scope as any
            });

            if (res.success && res.data?.task_id) {
                setTaskId(res.data.task_id);
                toast.success(`Social Auditor started for ${channel}!`);
                pollResult(res.data.task_id);
            } else {
                toast.error(`Social Auditor failed: ${res.error || 'Unknown error'}`);
                setIsRunning(false);
            }
        } catch (e) {
            console.error(e);
            toast.error('Error starting Social Auditor');
            setIsRunning(false);
        }
    }, [clientId, brandId, batchId, channel, scope, pollResult]);

    return {
        taskId,
        result,
        isRunning,
        handleRun
    };
}
