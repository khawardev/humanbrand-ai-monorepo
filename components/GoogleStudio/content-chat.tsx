'use client'

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { PdfFileDropzone } from "@/components/home/PdfFileDropzone";
import { RiChatSmileAiFill } from "react-icons/ri";

export function ContentChat() {
    const [uploadedPdfs, setUploadedPdfs] = useState<File[]>([]);
    const [referenceMaterial, setReferenceMaterial] = useState<string>();

    return (
        <section className="space-y-4 flex flex-col">
            <h4 >
                Chat with Generated Content
            </h4>
            <Label className="text-sm text-muted-foreground mb-2">Upload docs for chat (Optional)</Label>
            <PdfFileDropzone
                files={uploadedPdfs}
                setFiles={setUploadedPdfs}
                setReferenceMaterial={setReferenceMaterial}
                maxFiles={1}
            />
        </section>
    );
}