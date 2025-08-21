import { FormSection } from "@/components/aiag-components/reusable-components/form-section"
import { FileDropzone } from "../reusable-components/uploads/file-dropzone";


interface ReferenceMaterialSectionProps {
    onFilesChange: (data: any) => void;
    initialFileInfos?: any;
    title: string;
}

export function ReferenceMaterialSection({ onFilesChange, initialFileInfos, title }: ReferenceMaterialSectionProps) {
    return (
        <FormSection title={title}>
            <FileDropzone
                onFilesChange={onFilesChange}
                initialFileInfos={initialFileInfos}
            />
        </FormSection>
    )
}