import { Button } from "@/components/ui/button"

type FormActionsProps = {
    onSaveDraft: () => void;
    onGenerate: () => void;
}

export const Generate = ({ onSaveDraft, onGenerate }: FormActionsProps) => {
    return (
        <div className="flex justify-end space-x-3">
            <Button variant="ghost" size="sm" onClick={onSaveDraft}>
                Save Draft
            </Button>
            <Button size="sm" onClick={onGenerate}>
                Generate
            </Button>
        </div>
    )
}