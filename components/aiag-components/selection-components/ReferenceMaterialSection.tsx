
import { FormSection } from "@/components/aiag-components/reusable-components/form-section"
import { PdfFileDropzone } from "@/components/aiag-components/reusable-components/uploads/PdfFileDropzone"

interface ReferenceMaterialSectionProps {
    files: File[];
    setFiles: (files: File[]) => void;
    setReferenceMaterial: any
    title:string
}

export function ReferenceMaterialSection({ files, setFiles, setReferenceMaterial, title }: ReferenceMaterialSectionProps) {
    return (
        <FormSection title={title}>
            <PdfFileDropzone files={files} setFiles={setFiles} setReferenceMaterial={setReferenceMaterial} maxFiles={1} />
        </FormSection>
    )
}