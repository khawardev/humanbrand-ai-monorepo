'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { capitalize } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type AuditStatus = 'completed' | 'failed' | 'pending';

interface Audit {
    id: string;
    url: string;
    createdAt: string | Date;
    status: AuditStatus;
}

interface AuditCardProps {
    audit: Audit;
}

export default function AuditCard({ audit }: AuditCardProps) {

    const getBadgeVariant = (status: AuditStatus) => {
        switch (status) {
            case 'completed':
                return 'default';
            case 'failed':
                return 'destructive';
            case 'pending':
            default:
                return 'secondary';
        }
    };

    return (
        <Link href={`/audit/${audit.id}`} className="block">
            <Card className="h-full hover:bg-muted/70 transition-colors">
                <CardHeader>
                    <CardTitle className="truncate text-lg">{audit.url}</CardTitle>
                    <CardDescription>
                        Generated on {new Date(audit.createdAt).toLocaleDateString()}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Badge variant={getBadgeVariant(audit.status)}>
                        {capitalize(audit.status)}
                    </Badge>
                </CardContent>
            </Card>
        </Link>
    );
}