import { Button } from "@/components/ui/button"
import { ButtonSpinner } from "@/shared/spinner";

type FormActionsProps = {
    onSaveDraft: () => void;
    onGenerate: () => void;
    generatingContent: boolean;
    isDisabled ?: boolean;
}

export const Generate =  ({ onSaveDraft, onGenerate, generatingContent, isDisabled }: FormActionsProps) => {
    return (
        <div className="flex justify-end space-x-3 mb-12">
            <Button size="sm"  disabled={generatingContent || isDisabled} onClick={onGenerate}>
                {generatingContent ? <ButtonSpinner>Generating</ButtonSpinner> : 'Generate'}
            </Button>
        </div>
    )
}