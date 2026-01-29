'use client'

import { FormSection } from "@/components/aiag-components/reusable-components/form-section"
import { ModelsTabs } from "@/components/aiag-components/reusable-components/models-tabs"
import {
    campaignTypes,
    modelTabs,
} from "@/config/formData"
import { Hero } from "@/components/aiag-components/reusable-components/hero"
import React, { useState, useRef, startTransition, useTransition } from "react"
import { RadioCard } from "@/components/aiag-components/reusable-components/radio-card"
import { CheckCircle2, Copy, Download } from "lucide-react"
import { ReferenceMaterialSection } from "@/components/aiag-components/selection-components/ReferenceMaterialSection"
import { AdditionalInstructionsSection } from "@/components/aiag-components/selection-components/AdditionalInstructionsSection"
import { Generate } from "@/components/aiag-components/reusable-components/generate"
import { LineSpinner } from "@/components/shared/Spinner"
import { Separator } from "@/components/ui/separator"
import { getCampaignContentPrompts } from "@/lib/aiag/prompts"
import { generateNewContent } from "@/server/actions/generateNewContentActions"
import { cleanAndFlattenBulletsGoogle } from "@/lib/cleanMarkdown"
import { AIAG_VERSION } from "@/lib/aiag/constants"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { IoIosArrowDown } from "react-icons/io"
import { toast } from "sonner"
import { getUser } from "@/server/actions/usersActions"
import { stripMarkdownBold } from "@/lib/utils"


export default function Home() {
    const [selectedModel, setSelectedModel] = useState<number>(modelTabs[0].id)
    const [selectedCampaignType, setSelectedCampaignType] = useState<number | null>(null)
    const [referenceFileInfos, setReferenceFileInfos] = useState<any[]>([])
    const [additionalInstructions, setAdditionalInstructions] = useState<string>("")
    const [referenceFilesData, setReferenceFilesData] = useState<string | null>(null)
    const [genratedContent, setGenratedContent] = useState<any>()
    const [isPending, startTransition] = useTransition()

    const handleReferenceFileChange = ({ fileInfos, parsedText }: any) => {
        setReferenceFileInfos(fileInfos || []);
        setReferenceFilesData(parsedText || null);
    };

    const isDisabled = selectedCampaignType === null

    const handleGenerate = () => {
        if (isDisabled) return

        const selectedModelObj = modelTabs.find((tab) => tab.id === selectedModel)
        const selectedCampaign = campaignTypes.find((tab) => tab.id === selectedCampaignType)

        const data = {
            selectedCampaign: selectedCampaign?.label || "",
            additionalInstructions,
            referenceFilesData,
        }

        const { systemPrompt, userPrompt } = getCampaignContentPrompts(data)


        startTransition(async () => {
            const user: any = await getUser()
            if (!user) {
                toast.warning('Please Login to continue')
                return;
            }
            if (user?.adminVerified === false) {
                toast.warning('Please wait for the Admin to Approve')
                return;
            }

            const generateData = {
                modelAlias: selectedModelObj?.label,
                temperature: 5,
                systemPrompt,
                userPrompt
            }

            const generatedResult = await generateNewContent(generateData)
            const cleanedMarkdown = cleanAndFlattenBulletsGoogle(generatedResult.generatedText)
            setGenratedContent(cleanedMarkdown)
        })
    }

    const formRef = useRef<HTMLDivElement>(null)
    const handleCopy = () => {
        navigator.clipboard.writeText(stripMarkdownBold(genratedContent));
        toast.success("Content copied to clipboard!");
    };

    const handleDownloadTxt = () => {
        const blob = new Blob([genratedContent], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "AIAG_generatedContent.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <main className="overflow-hidden">
            <Hero />
            <section className="div-center-md">
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
                            <div className="border  rounded-lg p-3 bg-muted/30">
                                <p className="flex items-center gap-2 text-lg font-semibold text-primary">
                                    <CheckCircle2 className="size-4 text-primary" />
                                    Newsletter Articles <span className="text-sm">(3x)</span>
                                </p>
                            </div>

                            <div className="border  rounded-lg p-3 bg-muted/30">
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
                    isDisabled={isDisabled}
                />

                {isPending && (
                    <>
                        <Separator className="my-6" />
                        <LineSpinner>Generating Content...</LineSpinner>
                    </>
                )}

                {genratedContent &&
                    <section>
                        <div>
                            <div className={"md:flex md:space-y-0 space-y-3 md:items-center items-end justify-between mb-4"}>
                                <h4>AIAG - Campaign Content Generation Details ({AIAG_VERSION})</h4>
                                <div className=" flex justify-end ">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant={'ghost'} size={'sm'}>
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
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{genratedContent}</ReactMarkdown>
                        </div>
                    </section>
                }
            </section>
        </main>
    )
}