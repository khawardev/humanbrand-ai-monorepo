import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface BatchInfoProps {
    batchId: string;
    status: string;
    scrapedAt?: string;
    pagesCount?: number;
    startDate?: string;
    endDate?: string;
}

function formatDate(dateString: string): string {
    try {
        const date = parseISO(dateString);
        return format(date, 'd MMM yyyy');
    } catch {
        return dateString;
    }
}

export function BatchInfo({ 
    batchId, 
    status, 
    scrapedAt, 
    pagesCount,
    startDate,
    endDate 
}: BatchInfoProps) {
    if (!batchId) return null;

    return (
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
            <span>Batch: <code className="bg-background px-1 rounded">{batchId}</code></span>
            {/* <span>Status: <Badge variant="outline" className="text-[10px]">{status}</Badge></span> */}
            
            {pagesCount !== undefined && (
                <span>Pages: {pagesCount}</span>
            )}
            
            {startDate && endDate && (
                <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(startDate)} - {formatDate(endDate)}
                </span>
            )}
            
            {scrapedAt && (
                <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(scrapedAt).toLocaleString()}
                </span>
            )}
        </div>
    );
}
