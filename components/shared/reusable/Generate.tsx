import { Button } from "@/components/ui/button"
import { ButtonSpinner } from "@/components/shared/Spinner";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

type GenerateProps = {
    onGenerate: () => void;
    isPending: boolean;
    isDisabled?: boolean;
}

export const Generate = ({ onGenerate, isPending, isDisabled }: GenerateProps) => {
    return (
        <div className="flex justify-end space-x-3 mb-12">
            <TooltipProvider>
                <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                        <span tabIndex={0} className="inline-flex">
                            <Button disabled={isPending || isDisabled} onClick={onGenerate}>
                                {isPending ? <ButtonSpinner>Please wait</ButtonSpinner> : 'Generate'}
                            </Button>
                        </span>
                    </TooltipTrigger>
                    {isDisabled && (
                        <TooltipContent>
                            <p>Please make all Selections</p>
                        </TooltipContent>
                    )}
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}