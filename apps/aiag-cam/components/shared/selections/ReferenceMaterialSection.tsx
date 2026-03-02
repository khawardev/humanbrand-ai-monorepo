import { FormSection } from "@/components/shared/reusable/FormSection"
import { FileDropzone } from "../reusable/uploads/FileDropzone";


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