"use client";

import { useState, useEffect, useTransition } from "react";
import {
    getInteractiveSessionStatus,
    endInteractiveSession,
} from "@/server/actions/bvo/agenticActions";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/shared/SpinnerLoader";
import { toast } from "sonner";
import { redirect } from "next/navigation";

export function InteractiveExecutionClient({ session_id, onSessionEnd }: { session_id: string, onSessionEnd: () => void }) {
    const [status, setStatus] = useState<any>(null);
    const [isPolling, setIsPolling] = useState(true);
    const [isEnding, startEndingTransition] = useTransition();

    useEffect(() => {
        if (!session_id || !isPolling) return;

        const intervalId = setInterval(() => {
            getInteractiveSessionStatus(session_id)
                .then((res) => {
                    if (res) { // res is directly the data or null
                        setStatus(res);
                        if (res.status === "Completed" || res.status === "Failed") {
                            setIsPolling(false);
                            toast.success(`Session ${res.status.toLowerCase()}.`);
                        }
                    } else {
                        toast.error("Failed to get session status.");
                        setIsPolling(false);
                    }
                })
                .catch((err) => {
                    toast.error(err.message || "An error occurred while fetching status.");
                    setIsPolling(false);
                });
        }, 15000); // Poll every 15 seconds

        return () => clearInterval(intervalId);
    }, [session_id, isPolling]);

    const handleEndSession = () => {
        startEndingTransition(() => {
            (async () => {
                setIsPolling(false);
                const { success, message, data } = await endInteractiveSession(session_id);
                if (!success) {
                    return toast.error(message || "Failed to end the session.");
                }
                toast.success(message);
                setStatus(data);
                onSessionEnd();
                redirect('/dashboard/bvo');
            })();
        });
    };

    return (
        <div className="p-6 border rounded-lg my-8">
            <h3 className="text-lg font-medium mb-4">Interactive Session Status</h3>
            <div className="flex items-center justify-between">
                <div>
                    <p>Session ID: <span className="font-mono text-sm">{session_id}</span></p>
                    <p>Status: <span className="font-semibold">{status?.status || "Initializing..."}</span></p>
                </div>
                {isPolling && <Spinner />}
            </div>
            <div className="mt-4">
                <pre className="bg-border/50 p-4 rounded-md text-sm whitespace-pre-wrap">
                    {status?.output || JSON.stringify(status, null, 2)}
                </pre>
            </div>
            <div className="flex justify-end mt-6">
                <Button onClick={handleEndSession} disabled={isEnding || !isPolling}>
                    {isEnding ? "Ending..." : "End Session"}
                </Button>
            </div>
        </div>
    );
}
