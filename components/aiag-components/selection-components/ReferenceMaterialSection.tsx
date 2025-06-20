import { FormSection } from "@/components/aiag-components/reusable-components/form-section"
import { PdfFileDropzone } from "../reusable-components/uploads/PdfFileDropzone";

interface ReferenceMaterialSectionProps {
    onFileChange: (data: any) => void;
    initialFileInfo?: any;
    title: string;
}

export function ReferenceMaterialSection({ onFileChange, initialFileInfo, title }: ReferenceMaterialSectionProps) {
    return (
        <FormSection title={title}>
            <PdfFileDropzone
                onFileChange={onFileChange}
                initialFileInfo={initialFileInfo}
            />
        </FormSection>
    )
}