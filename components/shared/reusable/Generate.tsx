import { Button } from "@/components/ui/button"
import { ButtonSpinner } from "@/components/shared/Spinner";

type GenerateProps = {
    onGenerate: () => void;
    isPending: boolean;
    isDisabled?: boolean;
}

export const Generate = ({ onGenerate, isPending, isDisabled }: GenerateProps) => {
    return (
        <div className="flex justify-end space-x-3 mb-12">
            <Button size="sm" disabled={isPending || isDisabled} onClick={onGenerate}>
                {isPending ? <ButtonSpinner>Please wait</ButtonSpinner> : 'Generate'}
            </Button>
        </div>
    )
}