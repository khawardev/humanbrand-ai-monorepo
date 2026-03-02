"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { batchWebsiteReports } from "@/server/actions/ccba/website/websiteReportActions"
import { ButtonSpinner } from "@/components/shared/SpinnerLoader"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { WebsiteModelSelector } from "./WebsiteModelSelector"

export function WebsiteReportButton({
  brand_id,
  batch_id,
  children,
}: {
  brand_id: string
  batch_id: string | null
  children?: React.ReactNode
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [isPending, startTransition] = useTransition()
  const [selectedModels, setSelectedModels] = useState<string[]>([])

  async function handleGenerate() {
    if (!batch_id) {
      toast.error("No batch selected for report generation.")
      return
    }

    setOpen(false)
    startTransition(() => {
      (async () => {
      const { success, message } = await batchWebsiteReports({
        brand_id,
        batch_id,
        model_id: selectedModels[0],
        sythesizerPrompt: prompt || null,
      });
      setSelectedModels([]);
      setPrompt("");
      router.refresh();
      if (!success) {
        return toast.error(message);
      }
      toast.success(message);
      })();
    });
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button disabled={isPending || !batch_id}>
            {isPending ? (
              <ButtonSpinner>Generating</ButtonSpinner>
            ) : (
              "Generate Website Reports"
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Website Reports</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Select LLM Models</p>
            <WebsiteModelSelector
              selectedModel={selectedModels[0]}
              setSelectedModel={(modelId: string) =>
                setSelectedModels([modelId])
              }
            />
          </div>

          <div>
            <p className="text-sm font-medium mb-2">
              Website Synthesizer Prompt (optional)
            </p>
            <Textarea
              placeholder="Enter your custom prompt..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={selectedModels.length === 0 || isPending}
            onClick={handleGenerate}
          >
            {isPending ? "Generating..." : "Generate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


