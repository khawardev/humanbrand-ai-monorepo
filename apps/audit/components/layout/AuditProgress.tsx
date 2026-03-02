"use client";

import * as React from "react";
import { Progress } from "@/components/ui/progress";

interface AuditProgressProps {
    progress: number;
    progressTitle: string;
}

export default function AuditProgress({ progress, progressTitle }: AuditProgressProps) {
    return (
        <div className="w-full max-w-lg  mx-auto flex flex-col items-center gap-2 z-50 px-2">
            <div className="w-full flex justify-between items-center">
                <p className="text-sm font-medium text-muted-foreground">
                    {progressTitle}
                </p>
                <span className="text-sm text-muted-foreground">
                    {Math.round(progress)}%
                </span>
            </div>
            <Progress value={progress} className="w-full h-2" />
        </div>
    );
}