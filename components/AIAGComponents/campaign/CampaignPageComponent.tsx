'use client'

import { CheckCircle2, Copy, Download } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { IoIosArrowDown } from "react-icons/io"
import { FormSection } from "@/components/shared/reusable/FormSection"
import { ModelsTabs } from "@/components/shared/reusable/ModelsTabs"
import { RadioCard } from "@/components/shared/reusable/RadioCard"
import { Generate } from "@/components/shared/reusable/Generate"
import { ReferenceMaterialSection } from "@/components/shared/selections/ReferenceMaterialSection"
import { AdditionalInstructionsSection } from "@/components/shared/selections/AdditionalInstructionsSection"
import { LineSpinner } from "@/components/shared/Spinner"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { campaignTypes, modelTabs } from "@/config/formData"
import { AIAG_VERSION } from "@/lib/aiag/constants"
import { useCampaignContentGenerator } from "@/hooks/aiagHooks/useCampaignContentGenerator"

export function CampaignPageComponent() {
    const {
        isPending,
        selectedModel,
        setSelectedModel,
        selectedCampaignType,
        setSelectedCampaignType,
        referenceFileInfos,
        handleReferenceFileChange,
        additionalInstructions,
        setAdditionalInstructions,
        generatedContent,
        isGenerateDisabled,
        handleGenerate,
        handleCopy,
        handleDownloadTxt,
        formRef,
    } = useCampaignContentGenerator()

    return (
        <>
            <div id="form-start" ref={formRef}>
                <FormSection title="HBAI Models">
                    <ModelsTabs
                        options={modelTabs}
                        selectedValue={selectedModel}
                        onValueChange={setSelectedModel}
                    />
                </FormSection>
            </div>

            <FormSection title="Campaign Type(s)">
                <RadioCard
                    options={campaignTypes}
                    selectedValue={selectedCampaignType}
                    onSelectionChange={setSelectedCampaignType}
                />
            </FormSection>

            {selectedCampaignType && (
                <FormSection title="Campaign Content">
                    <div className="space-y-6">
                        <div className="border rounded-lg p-3 bg-muted/30">
                            <p className="flex items-center gap-2 text-lg font-semibold text-primary">
                                <CheckCircle2 className="size-4 text-primary" />
                                Newsletter Articles <span className="text-sm">(3x)</span>
                            </p>
                        </div>

                        <div className="border rounded-lg p-3 bg-muted/30">
                            <p className="flex items-center gap-2 text-lg font-semibold text-primary">
                                <CheckCircle2 className="size-4 text-primary" />
                                Social Media Posts
                            </p>
                            <ul className="mt-3 ml-6 list-disc text-sm space-y-1">
                                <li>LinkedIn Posts (3x)</li>
                                <li>Facebook Posts (3x)</li>
                                <li>X (Twitter) Posts (3x)</li>
                                <li>YouTube Scripts (3x)</li>
                                <li>Paid LI Ads (3x)</li>
                            </ul>
                        </div>

                        <div className="border rounded-lg p-3 bg-muted/30">
                            <p className="flex items-center gap-2 text-lg font-semibold text-primary">
                                <CheckCircle2 className="size-4 text-primary" />
                                Press Release + Media Kit (1x)
                            </p>
                        </div>
                    </div>
                </FormSection>
            )}

            <ReferenceMaterialSection
                title="Reference Material"
                initialFileInfos={referenceFileInfos}
                onFilesChange={handleReferenceFileChange}
            />

            <AdditionalInstructionsSection
                title="Additional Instructions (optional)"
                value={additionalInstructions}
                onChange={setAdditionalInstructions}
            />

            <Generate
                isPending={isPending}
                onGenerate={handleGenerate}
                isDisabled={isGenerateDisabled}
            />

            {isPending && (
                <>
                    <Separator className="my-6" />
                    <LineSpinner>Generating Content...</LineSpinner>
                </>
            )}

            {generatedContent && (
                <section>
                    <div>
                        <div className="md:flex md:space-y-0 space-y-3 md:items-center items-end justify-between mb-4">
                            <h4>AIAG - Campaign Content Generation Details ({AIAG_VERSION})</h4>
                            <div className="flex justify-end">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            Actions <IoIosArrowDown />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={handleCopy}>
                                            <Copy size={16} className="opacity-60 mr-1" aria-hidden="true" />
                                            <span>Copy</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleDownloadTxt}>
                                            <Download size={16} className="opacity-60 mr-1" aria-hidden="true" />
                                            <span>Download .txt</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        <Separator className="mb-4" />
                    </div>
                    <div className="prose prose-neutral max-w-none markdown-body space-y-3 dark:prose-invert">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{generatedContent}</ReactMarkdown>
                    </div>
                </section>
            )}
        </>
    )
}
