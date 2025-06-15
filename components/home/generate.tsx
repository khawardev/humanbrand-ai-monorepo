import { Button } from "@/components/ui/button"
import { ButtonSpinner } from "@/shared/spinner";

type FormActionsProps = {
    onSaveDraft: () => void;
    onGenerate: () => void;
    generatingContent: boolean;
    isDisabled ?: boolean;
}

export const Generate = ({ onSaveDraft, onGenerate, generatingContent, isDisabled }: FormActionsProps) => {
    return (
        <div className="flex justify-end space-x-3">
            <Button variant="ghost" size="sm" disabled={generatingContent || isDisabled} onClick={onSaveDraft}>
                Save Draft
            </Button>
            <Button size="sm" disabled={generatingContent || isDisabled} onClick={onGenerate}>
                {generatingContent ? <ButtonSpinner>Generating</ButtonSpinner> : 'Generate'}
            </Button>
        </div>
    )
}