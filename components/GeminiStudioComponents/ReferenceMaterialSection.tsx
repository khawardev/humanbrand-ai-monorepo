
import { FormSection } from "@/components/home/form-section"
import { PdfFileDropzone } from "@/components/home/PdfFileDropzone"

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