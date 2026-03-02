'use client';

import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn, isStatusProcessing, isWithinOneDay } from '@/lib/utils';
import { Globe, Share2, CheckCircle2, AlertCircle, Loader2, Clock, ChevronDown, Check } from 'lucide-react';
import { PollingStatusBadge } from '../PollingStatusBadge';

type BatchItem = {
    batch_id: string;
    created_at: string;
    status: string;
};

type BatchSelectorProps = {
    brandId: string;
    type: 'website' | 'social';
    batches: BatchItem[];
    selectedBatchId: string | null;
    onBatchChange: (batchId: string) => void;
    disabled?: boolean;
};

function formatBatchTime(createdAt: string): string {
    try {
        const date = parseISO(createdAt);
        return format(date, 'MMM d, yyyy h:mm a');
    } catch {
        return createdAt;
    }
}

function getStatusIcon(status: string) {
    const normalized = status?.toLowerCase() || '';
    if (normalized === 'completed') {
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    }
    if (normalized === 'completedwitherrors') {
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
    if (normalized === 'failed') {
        return <AlertCircle className="w-4 h-4 text-destructive" />;
    }
    if (normalized === 'processing' || normalized === 'initializing') {
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
    }
    return <Clock className="w-4 h-4 text-muted-foreground" />;
}

function getStatusText(status: string): string {
    const normalized = status?.toLowerCase() || '';
    if (normalized === 'completed') return 'Completed';
    if (normalized === 'completedwitherrors') return 'Completed w/ Errors';
    if (normalized === 'failed') return 'Failed';
    if (normalized === 'processing') return 'Processing';
    if (normalized === 'initializing') return 'Initializing';
    return 'Pending';
}

export function BatchSelector({
    brandId,
    type,
    batches,
    selectedBatchId,
    onBatchChange,
    disabled = false
}: BatchSelectorProps) {
    const Icon = type === 'website' ? Globe : Share2;
    const label = type === 'website' ? 'Website Batch' : 'Social Batch';

    const sortedBatches = useMemo(() => {
        return [...batches].sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }, [batches]);

    const selectedBatch = useMemo(() => 
        batches.find(b => b.batch_id === selectedBatchId),
        [batches, selectedBatchId]
    );

    const normalizedType = type === 'website' ? 'Website' : 'Social';

    if (sortedBatches.length === 0) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    disabled={disabled}
                    className={cn(
                        "rounded-xl h-auto py-2",
                        !selectedBatch && "text-muted-foreground"
                    )}
                >
                    <div className="flex items-center gap-2 overflow-hidden">
                        <Badge variant={'secondary'} className="shrink-0 font-normal">
                            {normalizedType}
                        </Badge>
                        {selectedBatch ? (
                            <div className="flex items-center gap-2 truncate text-foreground">
                                {isStatusProcessing(selectedBatch.status) && isWithinOneDay(selectedBatch.created_at) ? (
                                    <PollingStatusBadge
                                        type={type === 'website' ? 'Website' : 'Social'}
                                        initialStatus={selectedBatch.status}
                                        brandId={brandId}
                                        batchId={selectedBatch.batch_id}
                                        createdAt={selectedBatch.created_at}
                                    />
                                ) : (
                                    <>
                                        {getStatusIcon(selectedBatch.status)}
                                        <div className="flex flex-col gap-0.5 truncate text-left">
                                            <span className="truncate font-medium text-sm leading-none">
                                                {formatBatchTime(selectedBatch.created_at)}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground leading-none">
                                                {getStatusText(selectedBatch.status)}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <span>Select {label}</span>
                        )}
                    </div>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[300px]" align="start">
                <DropdownMenuLabel label={`${normalizedType} Batches`} />
                <DropdownMenuSeparator />
                {sortedBatches.map((batch, index) => {
                    const isSelected = selectedBatchId === batch.batch_id;
                    const isProcessing = isStatusProcessing(batch.status) && isWithinOneDay(batch.created_at);
                    
                    return (
                        <DropdownMenuItem 
                            key={batch.batch_id} 
                            onSelect={() => onBatchChange(batch.batch_id)}
                            className="cursor-pointer py-2.5 items-start px-3"
                        >
                            <div className={cn(
                                "mr-2 flex h-4 w-4 shrink-0 items-center justify-center mt-0.5 transition-opacity",
                                isSelected ? "opacity-100" : "opacity-0"
                            )}>
                                <Check className="h-4 w-4" />
                            </div>
                            <div className="flex flex-1 flex-col gap-1 w-full min-w-0">
                                <div className="flex items-center justify-between w-full">
                                    <span className="font-medium text-sm truncate">
                                        {formatBatchTime(batch.created_at)}
                                    </span>
                                    {index === 0 && (
                                        <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary ml-2 shrink-0">
                                            Latest
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    {isProcessing ? (
                                        <PollingStatusBadge
                                            type={type === 'website' ? 'Website' : 'Social'}
                                            initialStatus={batch.status}
                                            brandId={brandId}
                                            batchId={batch.batch_id}
                                            createdAt={batch.created_at}
                                        />
                                    ) : (
                                        <>
                                            {getStatusIcon(batch.status)}
                                            <span className="text-xs truncate">
                                                {getStatusText(batch.status)}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
