'use client'

import { CheckboxCard } from "@/components/home/checkbox-card"
import { FormSection } from "@/components/home/form-section"
import { Generate } from "@/components/home/generate"
import { ModelsTabs } from "@/components/home/models-tabs"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { adjustToneAndCreativityData, audiences, contentTypes, ctas, modelTabs, socialPlatforms, subjects } from "@/config/form-data"
import { Hero } from "@/components/home/hero"
import React, { useState, useEffect, useRef } from "react"
import { RadioCard } from "@/components/home/radio-card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { PdfFileDropzone } from "@/components/home/PdfFileDropzone"
import { getImageGenerationPrompt, getNewGenerationPrompts } from "@/lib/ai/prompts"
import { knowledgeBaseContent } from "@/lib/ai/knowledge_base"
import { generateNewContent } from "@/actions/generate-new-content"
import { Separator } from "@/components/ui/separator"
import { LineSpinner } from "@/shared/spinner"
import { AIAG_VERSION } from "@/lib/ai/constants"
import { Card, CardContent } from '@/components/ui/card';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Copy, Download, PersonStanding, Stars } from "lucide-react"
import { TfiLoop } from "react-icons/tfi";
import { IoIosArrowDown } from "react-icons/io";
import { ImageFileDropzone } from "@/components/home/ImageFileDropzone"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DialogClose, DialogDescription } from "@radix-ui/react-dialog"
import { cleanAndFixMarkdown, cleanAndFlattenBullets, cleanAndFlattenBulletsGoogle, cleanMarkdown } from "@/lib/cleanMarkdown"
import { SampleMarkdown } from "@/config/sample-markdown"
import { PiFilePdfFill } from "react-icons/pi"
import { TbPdf } from "react-icons/tb"
import { BiSolidFilePdf } from "react-icons/bi";
import { FaImage } from "react-icons/fa6"
import { RiImageAiFill } from "react-icons/ri";
import { RiChatSmileAiFill } from "react-icons/ri";

export default function Home() {
  const [selectedModel, setSelectedModel] = useState<number>(modelTabs[0].id)
  const [selectedAudiences, setSelectedAudiences] = useState<number[]>([])
  const [selectedSubjects, setSelectedSubjects] = useState<number | null>(null)
  const [selectedContentTypes, setSelectedContentTypes] = useState<number[]>([])
  const [selectedCtas, setSelectedCtas] = useState<number[]>([])
  const [selectedSocialPlatform, setSelectedSocialPlatform] = useState<number | null>(null)
  const [uploadedPdfs, setUploadedPdfs] = useState<File[]>([]);
  const [referenceMaterial, setReferenceMaterial] = useState<string>()
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [contextualAwareness, setContextualAwareness] = useState("");
  const [toneValue, setToneValue] = useState<number>(adjustToneAndCreativityData.tone.defaultValue);
  const [creativityValue, setCreativityValue] = useState<number>(adjustToneAndCreativityData.creativity.defaultValue);
  const [generatingContent, setgeneratingContent] = useState(false);
  const [contentGenerated, setcontentGenerated] = useState<string>("");
  const [imagePrompt, setImagePrompt] = useState('')
  const socialPostContentTypeId = contentTypes.find(
    (type) => type.label === "Social Media Post"
  )?.id

  const isSocialPostSelected =
    socialPostContentTypeId !== undefined &&
    selectedContentTypes.includes(socialPostContentTypeId)

  useEffect(() => {
    if (!isSocialPostSelected) {
      setSelectedSocialPlatform(null)
    }
  }, [isSocialPostSelected])

  const handleGenerate = async () => {
    setgeneratingContent(true)
    const selectedModelObj = modelTabs.find((tab) => tab.id === selectedModel)

    const selectedAudienceLabels = audiences
      .filter((audience: any) => selectedAudiences.includes(audience.id))
      .map((audience: any) => audience.label)

    const selectedSubjectObj = subjects.find((subject) => subject.id === selectedSubjects)

    const selectedContentTypeLabels = contentTypes
      .filter((contentType) => selectedContentTypes.includes(contentType.id))
      .map((contentType) => contentType.label)

    const selectedCtaLabels = ctas
      .filter((cta) => selectedCtas.includes(cta.id))
      .map((cta) => cta.label)

    const selectedSocialPlatformObj = socialPlatforms.find(
      (platform) => platform.id === selectedSocialPlatform
    )

    const promptdata = {
      selectedAudiences: selectedAudienceLabels,
      selectedSubject: selectedSubjectObj?.label || "",
      selectedContentTypes: selectedContentTypeLabels,
      selectedCtas: selectedCtaLabels,
      selectedSocialPlatform: selectedSocialPlatformObj?.label || "",
      userUploadedContent: referenceMaterial || '',
      additionalInstructions: additionalInstructions || '',
      contextualAwareness: contextualAwareness || '',
      knowledgeBaseContent: knowledgeBaseContent,
      selectedtone: toneValue,
    }




    const { systemPrompt, userPrompt } = getNewGenerationPrompts(promptdata);


    const generatedata = {
      modelAlias: selectedModelObj?.label,
      temperature: creativityValue,
      systemPrompt,
      userPrompt
    }



    const contentGenerated = await generateNewContent(generatedata)

  
    const imagePromptdata = {
      selectedAudiences: selectedAudienceLabels,
      selectedSubject: selectedSubjectObj?.label || "",
      contentGenerated: contentGenerated,
    }
  
    const { finalImagePrompt } = getImageGenerationPrompt(imagePromptdata);

    const generateimagepromptdata = {
      modelAlias: selectedModelObj?.label,
      temperature: creativityValue,
      userPrompt: finalImagePrompt
    }

    const imagepromptGenerated = await generateNewContent(generateimagepromptdata)
    const cleanedMarkdown = cleanAndFlattenBulletsGoogle(contentGenerated.generatedText);

    setImagePrompt(imagepromptGenerated.generatedText);
    setcontentGenerated(cleanedMarkdown);
    setgeneratingContent(false)

  }

  const handleSaveDraft = () => {
    console.log("Draft saved!")
  }


  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  // Example function to handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Submitting files:", uploadedFiles);
    const formData = new FormData();
    uploadedFiles.forEach(file => {
      formData.append('images', file);
    });
    alert(`You have ${uploadedFiles.length} files ready to be submitted! Check the console.`);
  };
  return (
    <main className="overflow-hidden py-14">
      <Hero />
      <section className="div-center-md">
        <FormSection title="HBAI Models">
          <ModelsTabs
            options={modelTabs}
            selectedValue={selectedModel}
            onValueChange={setSelectedModel}
          />
        </FormSection>

        <FormSection title="Audience(s)">
          <CheckboxCard
            options={audiences}
            selectedValues={selectedAudiences}
            onSelectionChange={setSelectedAudiences}
          />
        </FormSection>

        <FormSection title="Subject focus">
          <RadioCard
            options={subjects}
            selectedValue={selectedSubjects}
            onSelectionChange={setSelectedSubjects}
          />
        </FormSection>

        <FormSection title="Content Type(s)">
          <CheckboxCard
            options={contentTypes}
            selectedValues={selectedContentTypes}
            onSelectionChange={setSelectedContentTypes}
          />
        </FormSection>

        {isSocialPostSelected && (
          <FormSection title="Social Platform">
            <RadioCard
              options={socialPlatforms}
              selectedValue={selectedSocialPlatform}
              onSelectionChange={setSelectedSocialPlatform}
            />
          </FormSection>
        )}

        <FormSection title="Call to Action(s)">
          <CheckboxCard
            options={ctas}
            selectedValues={selectedCtas}
            onSelectionChange={setSelectedCtas}
          />
        </FormSection>


        <FormSection title="Reference Materials (optional)">
          <PdfFileDropzone
            files={uploadedPdfs}
            setFiles={setUploadedPdfs}
            setReferenceMaterial={setReferenceMaterial}
            maxFiles={1}
          />
        </FormSection>

        <FormSection title="Additional Instructions (optional)">
          <Textarea
            placeholder="Enter any specific requirements or instructions..."
            rows={14}
            value={additionalInstructions}
            onChange={(e) => setAdditionalInstructions(e.target.value)}
          />
        </FormSection>

        <FormSection title="Contextual Awareness (optional)">
          <Textarea
            placeholder="Provide relevant background information or context..."
            rows={49}
            value={contextualAwareness}
            onChange={(e) => setContextualAwareness(e.target.value)}
          />
        </FormSection>

        <FormSection title="Adjust Tone and Creativity">
          <div className="space-y-8 mt-3">
            {Object.entries(adjustToneAndCreativityData).map(([key, setting]) => (
              <div key={key}>
                <Label className="text-base font-medium">{setting.label}</Label>
                <Slider
                  value={key === "tone" ? [toneValue] : [creativityValue]}
                  onValueChange={(value) => {
                    if (key === "tone") {
                      setToneValue(value[0]);
                    } else {
                      setCreativityValue(value[0]);
                    }
                  }}
                  min={setting.minValue}
                  max={setting.maxValue}
                  step={0.1}
                  className="my-4"
                />

                <div className="flex justify-between text-xs text-muted-foreground px-1">
                  {setting.options.map((option, index) => (
                    <span key={index}>{option}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </FormSection>

        <Generate generatingContent={generatingContent} onSaveDraft={handleSaveDraft} onGenerate={handleGenerate} />
        
        {generatingContent ? <>
          <Separator />
          <LineSpinner>Generating Content..</LineSpinner>
        </>
          : contentGenerated && <>
            <Separator />
            <main className=" space-y-10">
              <section>
                <h4 >Generated Content</h4>
                <div className=" md:flex items-center justify-between">
                  <h3 className=" mb-4">AIAG - Content Generation Details ({AIAG_VERSION})</h3>
                  <div className=" flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size={'sm'}  >
                          Actions <IoIosArrowDown />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="max-w-64" align="end">
                        <DropdownMenuItem>
                          <Copy size={16} className="opacity-60" aria-hidden="true" />
                          <span>Copy</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download size={16} className="opacity-60" aria-hidden="true" />
                          <span>Download .txt</span>
                        </DropdownMenuItem>
                       
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <TfiLoop size={16} className="opacity-60" aria-hidden="true" />
                              <span>Revise</span>
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-3xl">
                            <section className="space-y-4 flex flex-col">
                              <div>
                                <span className=" font-semibold text-accent-foreground tracking-tight">Provide Feedback for Revision</span>
                                <Label className=" text-sm text-muted-foreground  mb-2">Changes requested:</Label>
                                <Textarea
                                  value={''}
                                  onChange={(e) => setImagePrompt(e.target.value)}
                                  placeholder="e.g Make tone more formal ..."
                                  rows={6}
                                />
                              </div>
                            </section>
                            <DialogFooter>
                              <Button size={'sm'}>Submit</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <DropdownMenuItem>
                          <BiSolidFilePdf size={16} className="opacity-60" aria-hidden="true" />
                          <span>Download .pdf</span>
                        </DropdownMenuItem>
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Stars size={16} className="opacity-60" aria-hidden="true" />
                              <span>Adapt for persona</span>
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-3xl">
                            <section className="space-y-4 flex flex-col">
                              <div>
                                <span className=" font-semibold text-accent-foreground tracking-tight">Adapt Content for Hyper Relevance</span>
                                <Label className=" text-sm text-muted-foreground  mb-2">Describe Target Persona(s):</Label>
                                <Textarea
                                  value={''}
                                  onChange={(e) => setImagePrompt(e.target.value)}
                                  placeholder="e.g Quality Manager at Tier 1 Supplier ..."
                                  rows={6}
                                />
                              </div>
                              <Label className=" text-sm text-muted-foreground mt-4 mb-2">Upload Persona Details (Optional):</Label>
                              <PdfFileDropzone
                                files={uploadedPdfs}
                                setFiles={setUploadedPdfs}
                                setReferenceMaterial={setReferenceMaterial}
                                maxFiles={1}
                              />
                            </section>

                            <DialogFooter>
                              <Button size={'sm'}>Submit</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <Separator className="mb-4" />
                <div className="prose prose-neutral  max-w-none markdown-body space-y-3  dark:prose-invert">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {contentGenerated}  
                  </ReactMarkdown>
                </div>
                <Separator className="mt-4" />
              </section>
              <section className="space-y-4 flex flex-col">
                <div >
                  <h4 className=" flex  items-center gap-2"> <span className="bg-primary/15 border border-primary/50 p-2.5 rounded-full text-primary"><RiImageAiFill size={30} /></span>Generate <br /> Accompanying Image</h4>
                  <Label className=" text-sm text-muted-foreground mt-4  mb-2">Image Prompt:</Label>
                  <Textarea
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="Enter prompt to generate an Image"
                    rows={6}
                  />
                </div>
                <Label className=" text-sm text-muted-foreground mt-4  mb-2">Upload Reference Image(s) (Optional):</Label>
                <ImageFileDropzone
                  files={uploadedFiles}
                  setFiles={setUploadedFiles}
                  maxFiles={1}
                />
                <Button className="w-full" size={'sm'}>Generate Image</Button>
              </section>
              <Separator />

              <section className="space-y-4 flex flex-col">
                <h4 className=" flex  items-center gap-2"> <span className="bg-primary/15 border border-primary/50 p-2.5 rounded-full text-primary"><RiChatSmileAiFill size={30} /></span> Chat with <br /> Generated Content</h4>
                <Label className=" text-sm text-muted-foreground  mb-2">Upload docs for chat (Optional)</Label>
                <PdfFileDropzone
                  files={uploadedPdfs}
                  setFiles={setUploadedPdfs}
                  setReferenceMaterial={setReferenceMaterial}
                  maxFiles={1}
                />
              </section>
            </main>
          </>
        }


      </section>
    </main>
  )
}