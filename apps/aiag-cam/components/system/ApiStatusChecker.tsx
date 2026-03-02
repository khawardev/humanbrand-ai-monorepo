'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { checkApiKeys } from '@/server/actions/system/check-api-keys';

interface ApiKeyStatus {
    modelAlias: string;
    status: 'valid' | 'invalid';
    message?: string;
    responseData?: string | null;
}

export function ApiStatusChecker() {
    const [loading, setLoading] = useState(false);
    const [statuses, setStatuses] = useState<ApiKeyStatus[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleCheck = async () => {
        setLoading(true);
        setError(null);
        setStatuses([]);
        
        try {
            const results = await checkApiKeys();
            setStatuses(results);
            
            const failures = results.filter(r => r.status === 'invalid');
            if (failures.length > 0) {
                toast.error(`Found ${failures.length} invalid API keys.`);
            } else {
                toast.success("All AI Model API keys are verified and valid.");
            }
        } catch (err) {
            console.error("Failed to check API keys:", err);
            setError("An unexpected error occurred while checking API keys.");
            toast.error("Failed to check API keys.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>AI Model Integration Status</CardTitle>
                <CardDescription>
                    Verify the connection status and API key validity for configured AI models.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Button 
                    onClick={handleCheck} 
                    disabled={loading} 
                    className="w-full sm:w-auto"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying Connections...
                        </>
                    ) : (
                        "Check API Status"
                    )}
                </Button>

                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                        {error}
                    </div>
                )}

                {statuses.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {statuses.map((status) => (
                            <div 
                                key={status.modelAlias} 
                                className={`flex flex-col p-4 rounded-lg border ${
                                    status.status === 'valid' 
                                        ? 'bg-green-50/50 border-green-200' 
                                        : 'bg-red-50/50 border-red-200'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        {status.status === 'valid' ? (
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-red-600" />
                                        )}
                                        <span className="font-semibold capitalize text-base">
                                            {status.modelAlias === 'recommended' ? 'Default (GPT)' : status.modelAlias}
                                        </span>
                                    </div>
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                        status.status === 'valid' 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-red-100 text-red-700'
                                    }`}>
                                        {status.status === 'valid' ? 'Active' : 'Failed'}
                                    </span>
                                </div>
                                
                                {status.status === 'invalid' && status.message && (
                                    <p className="text-xs text-red-600 mt-1 wrap-break-word">
                                        {status.message}
                                    </p>
                                )}
                                {status.status === 'valid' && (
                                    <p className="text-xs text-green-700 mt-1">
                                        Connection successful. Ready for generation.
                                    </p>
                                )}

                                {status.responseData && (
                                    <div className="mt-3 p-2 bg-background/50 rounded border text-xs font-mono text-muted-foreground">
                                        <p className="font-semibold mb-1">Response:</p>
                                        <p>{status.responseData}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
