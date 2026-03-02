'use client';

import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Loader2, CheckCircle2, AlertCircle, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

type StatusVariant = 'processing' | 'completed' | 'completedWithErrors' | 'failed' | 'pending' | 'initializing';

type ScrapeStatusBadgeProps = {
    label: string;
    status: string | null;
    error?: string | null;
    showLabel?: boolean;
    size?: 'sm' | 'md';
    className?: string;
};

function getStatusVariant(status: string | null): StatusVariant {
    if (!status) return 'pending';
    const normalized = status.toLowerCase();
    if (normalized === 'completed') return 'completed';
    if (normalized === 'completedwitherrors') return 'completedWithErrors';
    if (normalized === 'failed') return 'failed';
    if (normalized === 'initializing') return 'initializing';
    return 'processing';
}

export function ScrapeStatusBadge({
    label,
    status,
    error,
    showLabel = true,
    size = 'sm',
    className
}: ScrapeStatusBadgeProps) {
    const variant = getStatusVariant(status);
    const sizeClasses = size === 'sm' ? 'h-6 text-[10px] px-2' : 'h-7 text-xs px-3';
    const hasError = error && (variant === 'completedWithErrors' || variant === 'failed');

    const renderBadge = () => {
        switch (variant) {
            case 'completed':
                return (
                    <Badge variant='secondary' className={cn(' dark:text-green-400 flex items-center gap-1', sizeClasses, className)}>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                        {showLabel ? label : 'Completed'}
                    </Badge>
                );
            case 'completedWithErrors':
                return (
                    <Badge variant="secondary" className={cn('text-yellow-700 dark:text-yellow-400 flex items-center gap-1', sizeClasses, className)}>
                        <CheckCircle2 className="w-3 h-3 shrink-0" />
                        {showLabel ? label : 'Completed with Errors'}
                    </Badge>
                );
            case 'failed':
                return (
                    <Badge variant="destructive" className={cn('flex items-center gap-1', sizeClasses, className)}>
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        {showLabel ? label : 'Failed'}
                    </Badge>
                );
            case 'initializing':
            case 'processing':
                return (
                    <Badge variant="secondary" className={cn('text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 flex items-center gap-1', sizeClasses, className)}>
                        <Loader2 className="w-3 h-3 animate-spin shrink-0" />
                        {showLabel ? label : 'Processing'}
                    </Badge>
                );
            case 'pending':
            default:
                return (
                    <Badge variant="outline" className={cn('text-muted-foreground flex items-center gap-1', sizeClasses, className)}>
                        <Loader2 className="w-3 h-3 animate-spin shrink-0" />
                        {showLabel && 'Pending'}
                    </Badge>
                );
        }
    };

    if (hasError) {
        return (
            <div className="flex items-center gap-1.5">
                <TooltipProvider>
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                            {renderBadge()}
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                            <p className="text-sm">{error}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        );
    }

    return renderBadge();
}

export function ScrapeStatusBadgeSkeleton() {
    return <div className="h-6 w-16 rounded-full bg-muted animate-pulse" />;
}
