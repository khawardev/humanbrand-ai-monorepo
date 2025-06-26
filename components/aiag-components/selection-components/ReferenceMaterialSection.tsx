// import { FormSection } from "@/components/aiag-components/reusable-components/form-section"
// import { PdfFileDropzone } from "../reusable-components/uploads/PdfFileDropzone";

// interface ReferenceMaterialSectionProps {
//     onFileChange: (data: any) => void;
//     initialFileInfo?: any;
//     title: string;
// }

// export function ReferenceMaterialSection({ onFileChange, initialFileInfo, title }: ReferenceMaterialSectionProps) {
//     return (
//         <FormSection title={title}>
//             <PdfFileDropzone
//                 onFileChange={onFileChange}
//                 initialFileInfo={initialFileInfo}
//             />
//         </FormSection>
//     )
// }


import { FormSection } from "@/components/aiag-components/reusable-components/form-section"
import { FileDropzone } from "../reusable-components/uploads/file-dropzone";

////////////////// changes explain comment start ////////////
// 1. Replaced `PdfFileDropzone` with the new, more capable `FileDropzone` component.
// 2. Renamed the `initialFileInfo` prop to `initialFileInfos` to accurately reflect that it now accepts an array of file information objects.
// 3. Updated `onFileChange` to `onFilesChange` for consistency.
////////////////// changes explain comment end ////////////
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