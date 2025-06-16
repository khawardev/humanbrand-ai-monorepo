'use client'

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { PdfFileDropzone } from "@/components/home/PdfFileDropzone";

export function ContentChat() {
    const [uploadedPdfs, setUploadedPdfs] = useState<File[]>([]);
    const [referenceMaterial, setReferenceMaterial] = useState<string>();

    return (
        <section className="space-y-4 flex flex-col">
            <div>
                <h4> Chat with Generated Content</h4>
                <Label className="text-sm text-muted-foreground">Upload docs for chat (Optional)</Label>
            </div>
            <PdfFileDropzone
                files={uploadedPdfs}
                setFiles={setUploadedPdfs}
                setReferenceMaterial={setReferenceMaterial}
                maxFiles={1}
            />
        </section>
    );
}