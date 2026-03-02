"use client";

import { useState, useTransition, useId } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { toast } from "sonner";
import { FastForward, Link as LinkIcon, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CommandDialog, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ButtonSpinner, Spinner } from "@/components/shared/SpinnerLoader";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { ReportCard } from "./Report-Card";

import { getBrandbyIdWithCompetitors } from "@/server/actions/brandActions";
import { getBatchWebsiteReports } from "@/server/actions/ccba/website/websiteReportActions";
import { getBatchSocialReports } from "@/server/actions/ccba/social/socialReportActions";
import { MODELS, agents, executionModes } from "@/lib/constants";
import { arrangeAgentIds } from "@/lib/utils";
import { InteractiveExecutionClient } from "./InteractiveExecutionClient";
import { initiateBvoAgenticProcess } from "@/server/actions/bvo/agenticActions";
import { EmptyStateCard } from "@/components/shared/CardsUI";

const defaultValues: any = {
  name: "",
  aiModel: "claude-4.5-sonnet",
  brand: {},
  competitors: [],
  brand_documents: [],
  stakeholder_interview_files: [],
  questionnaire_answers_files: [],
  custom_instructions: "",
  executionMode: "interactive",
  selectedAgents: [],
  selectedWebsiteReport: null,
  selectedSocialReport: null,
};

export default function NewBvoForm({ brands, client_id }: any) {
  const [isPending, startTransition] = useTransition();
  const [selectedBrand, setSelectedBrand] = useState<any | null>(null);
  const [websiteReports, setWebsiteReports] = useState<any[]>([]);
  const [socialReports, setSocialReports] = useState<any[]>([]);
  const [isFetchingReports, setIsFetchingReports] = useState(false);
  const [isModelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const executionModeId = useId();
  const agentSelectionId = useId();

  const form = useForm({
    defaultValues,
    mode: "onChange",
  });

  const { formState: { isSubmitting }, control, setValue, watch } = form;

  const handleBrandChange = (brandId: string) => {
    if (!brandId) {
      setSelectedBrand(null);
      setWebsiteReports([]);
      setSocialReports([]);
      setValue("brand", {});
      setValue("competitors", []);
      setValue("selectedWebsiteReport", null);
      setValue("selectedSocialReport", null);
      return;
    }

    const brand = brands.find((b: any) => b.brand_id === brandId);
    if (brand) {
      startTransition(() => {
        (async () => {
          try {
            setIsFetchingReports(true);
            const brandWithCompetitors = await getBrandbyIdWithCompetitors(brandId);

            setSelectedBrand(brandWithCompetitors);
            setValue("brand", { id: brand.brand_id, name: brand.name });

            if (brandWithCompetitors?.competitors) {
              const competitorData = brandWithCompetitors.competitors.map((c: any) => ({ id: c.competitor_id, name: c.name }));
              setValue("competitors", competitorData);
            }

            const [{ data: websiteReportData }, { data: socialReportData }]: any = await Promise.all([
              getBatchWebsiteReports(brandId),
              getBatchSocialReports(brandId)
            ]);

            setWebsiteReports(websiteReportData || []);
            setSocialReports(socialReportData || []);

          } catch (error) {
            console.error("Failed to fetch brand details and reports:", error);
            toast.error("Failed to load brand details. Please try again.");
            setSelectedBrand(null);
          } finally {
            setIsFetchingReports(false);
          }
        })();
      });
    };
  }

  async function onSubmit(data: any) {
    if (!data.brand?.id) {
      toast.error("Please select a brand.");
      return;
    }
    if (!data.selectedWebsiteReport?.report_batch_id) {
      toast.error("Please select a website report.");
      return;
    }
    if (!data.selectedSocialReport?.report_batch_id) {
      toast.error("Please select a social media report.");
      return;
    }

    startTransition(() => {
      (async () => {
        const formData = new FormData();

        (data.brand_documents || []).forEach((file: File) => {
          formData.append('files', file);
        });
        (data.stakeholder_interview_files || []).forEach((file: File) => {
          formData.append('stakeholder_interview_insights', file);
        });
        (data.questionnaire_answers_files || []).forEach((file: File) => {
          formData.append('stakeholder_questionaire_insights', file);
        });

        formData.append('client_id', client_id);
        formData.append('brand_id', selectedBrand.brand_id);
        formData.append('social_id', data.selectedSocialReport.report_batch_id);
        formData.append('website_id', data.selectedWebsiteReport.report_batch_id);
        formData.append('custom_instructions', data.custom_instructions || "");
        formData.append('model', data.aiModel);
        formData.append('mode', data.executionMode);
        // formData.append('rag_name', data.name);
        formData.append('fuse_depth', '3');

        if (data.executionMode === 'independent' && data.selectedAgents?.length > 0) {
          const agentIds = arrangeAgentIds(data.selectedAgents);
          agentIds.forEach((id: string) => {
            formData.append('agent_ids', id);
          });
        }

        try {

          const { success, message, data } = await initiateBvoAgenticProcess(selectedBrand.brand_id, formData);

          if (!success) {
            return toast.error(message || "Failed to initiate BVO process.");
          }

          if (data.executionMode === 'interactive' && data.session_id) {
            toast.success(message || "Interactive session started.");
            setSessionId(data.session_id);
          } else {
            toast.success(message || "BVO process has been initiated successfully.");
          }
        } catch (error: any) {
          toast.error(`An unexpected error occurred: ${error.message}`);
        }
      })();
    });
  }

  const aiModelValue = watch("aiModel");
  const currentModel = MODELS.find(model => model.id === aiModelValue);

  if (sessionId) {
    return <InteractiveExecutionClient session_id={sessionId} onSessionEnd={() => setSessionId(null)} />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
        <div className="space-y-6">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BVO Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Q4 Competitive Analysis" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="aiModel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>AI Model</FormLabel>
                <FormControl>
                  <div>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault();
                        setModelSelectorOpen(true);
                      }}
                    >
                      {currentModel ? currentModel.name : "Select a model"}
                    </Button>
                    <CommandDialog open={isModelSelectorOpen} onOpenChange={setModelSelectorOpen}>
                      <CommandInput placeholder="Search models..." />
                      <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        {MODELS.map((model) => (
                          <CommandItem
                            key={model.id}
                            onSelect={() => {
                              field.onChange(model.id);
                              setModelSelectorOpen(false);
                            }}
                            className={`cursor-pointer ${field.value === model.id ? "bg-accent text-accent-foreground" : ""}`}
                          >
                            {model.name}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </CommandDialog>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-8 w-full">
          <div>
            <h3 className="text-lg font-medium">Brand & Competitors</h3>
            <p className="text-sm text-muted-foreground">
              Select a brand to view its details, reports, and competitors for analysis.
            </p>
          </div>
          <FormField
            control={control}
            name="brand.id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Brand</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleBrandChange(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-64 capitalize">
                      <SelectValue placeholder="Select brand to audit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="capitalize">
                    {brands.map((brand: any) => (
                      <SelectItem key={brand.brand_id} value={brand.brand_id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {isPending && (
            <div className="flex items-center space-x-2 mt-4">
              <Spinner />
              <p className="text-sm text-muted-foreground">Loading brand details...</p>
            </div>
          )}

          {!isPending && selectedBrand && (
            <>
              <div className="space-y-2">
                <h3 className="text-xl capitalize">{selectedBrand.name}</h3>
                <Link href={selectedBrand.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                  {selectedBrand.url}
                  <LinkIcon className="size-3" />
                </Link>
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedBrand.facebook_url && <Badge asChild variant="secondary"><Link href={selectedBrand.facebook_url} target="_blank">Facebook</Link></Badge>}
                  {selectedBrand.instagram_url && <Badge asChild variant="secondary"><Link href={selectedBrand.instagram_url} target="_blank">Instagram</Link></Badge>}
                  {selectedBrand.linkedin_url && <Badge asChild variant="secondary"><Link href={selectedBrand.linkedin_url} target="_blank">LinkedIn</Link></Badge>}
                  {selectedBrand.x_url && <Badge asChild variant="secondary"><Link href={selectedBrand.x_url} target="_blank">X</Link></Badge>}
                  {selectedBrand.youtube_url && <Badge asChild variant="secondary"><Link href={selectedBrand.youtube_url} target="_blank">YouTube</Link></Badge>}
                </div>
              </div>

              {isFetchingReports ? (
                <div className="flex items-center space-x-2">
                  <Spinner />
                  <p className="text-sm text-muted-foreground">Loading reports...</p>
                </div>
              ) : (
                <div className="space-y-8">
                  <FormField
                    control={control}
                    name="selectedWebsiteReport"
                    render={({ field }) => (
                      <FormItem>
                        <h4 className="text-lg font-medium mb-4">Website Report (Select one)</h4>
                        {websiteReports.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {websiteReports.map((report) => (
                              <ReportCard
                                key={report.report_batch_id}
                                report={report}
                                reportType="website"
                                isSelected={field.value?.report_batch_id === report.report_batch_id}
                                onSelect={() => {
                                  field.onChange(field.value?.report_batch_id === report.report_batch_id ? null : report);
                                }}
                              />
                            ))}
                          </div>
                        ) : <EmptyStateCard message="No website reports found." />}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="selectedSocialReport"
                    render={({ field }) => (
                      <FormItem>
                        <h4 className="text-lg font-medium mb-4">Social Media Report (Select one)</h4>
                        {socialReports.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {socialReports.map((report) => (
                              <ReportCard
                                key={report.report_batch_id}
                                report={report}
                                reportType="social"
                                isSelected={field.value?.report_batch_id === report.report_batch_id}
                                onSelect={() => {
                                  field.onChange(field.value?.report_batch_id === report.report_batch_id ? null : report);
                                }}
                              />
                            ))}
                          </div>
                        ) : <EmptyStateCard message="No social media reports found." />}
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <div>
                <h4 className="text-lg font-medium mb-4">Competitors</h4>
                {selectedBrand.competitors?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Website</TableHead>
                        <TableHead>Socials</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedBrand.competitors.map((competitor: any) => (
                        <TableRow key={competitor.competitor_id}>
                          <TableCell className="font-medium">{competitor.name}</TableCell>
                          <TableCell>
                            <Link href={competitor.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline text-primary">
                              {competitor.url}
                              <LinkIcon className="size-3" />
                            </Link>
                          </TableCell>
                          <TableCell className="flex flex-wrap gap-1">
                            {competitor.facebook_url && <Badge asChild variant="secondary"><Link href={competitor.facebook_url} target="_blank">Facebook</Link></Badge>}
                            {competitor.instagram_url && <Badge asChild variant="secondary"><Link href={competitor.instagram_url} target="_blank">Instagram</Link></Badge>}
                            {competitor.linkedin_url && <Badge asChild variant="secondary"><Link href={competitor.linkedin_url} target="_blank">LinkedIn</Link></Badge>}
                            {competitor.x_url && <Badge asChild variant="secondary"><Link href={competitor.x_url} target="_blank">X</Link></Badge>}
                            {competitor.youtube_url && <Badge asChild variant="secondary"><Link href={competitor.youtube_url} target="_blank">YouTube</Link></Badge>}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : <EmptyStateCard message="No competitors found for this brand." />}
              </div>
            </>
          )}
        </div>

        <Separator />

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Supporting Documents</h3>
            <p className="text-sm text-muted-foreground">
              Upload documents to provide more context for the analysis.
            </p>
          </div>
          <div className="flex gap-8">
            <div className="w-full space-y-6 ">
              <div>
                <h4 className="text-lg font-medium">Questionnaire Answers</h4>
                <p className="text-xs text-muted-foreground">
                  Upload Documents containing answers to Brand questionnaires.
                </p>
              </div>
              <FormField
                control={control}
                name="questionnaire_answers_files"
                render={({ field }) => (
                  <FileDropzone
                    onFilesChange={field.onChange}
                    initialFiles={field.value}
                  />
                )}
              />
            </div>

            <div className="w-full space-y-6">
              <div>
                <h4 className="text-lg font-medium">Stakeholder Interviews</h4>
                <p className="text-xs text-muted-foreground">
                  Upload Documents containing Stakeholder interviews Insights.
                </p>
              </div>
              <FormField
                control={control}
                name="stakeholder_interview_files"
                render={({ field }) => (
                  <FileDropzone
                    onFilesChange={field.onChange}
                    initialFiles={field.value}
                  />
                )}
              />
            </div>
          </div>
          <div className="space-y-6">
            <div >
              <h3 className="text-lg font-medium">Brand Documents</h3>
              <p className="text-xs text-muted-foreground">
                Upload Brand guidelines, market research, or competitor analysis files.
              </p>
            </div>

            <FormField
              control={control}
              name="brand_documents"
              render={({ field }) => (
                <FileDropzone
                  onFilesChange={field.onChange}
                  initialFiles={field.value}
                />
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Custom Instructions</h3>
            <p className="text-sm text-muted-foreground">
              Provide any specific instructions, context, or key questions for the AI to consider during analysis.
            </p>
          </div>
          <FormField
            control={control}
            name="custom_instructions"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Focus on our new product line's reception in the market compared to Competitor X. Ignore legacy products."
                    className="min-h-[200px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Execution Configuration</h3>
            <p className="text-sm text-muted-foreground">Choose how you want to run the agents.</p>
          </div>
          <FormField
            control={control}
            name="executionMode"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Execution Mode</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    {executionModes.map((mode) => (
                      <div key={mode.id} className="relative flex w-full items-start gap-2 rounded-md border border-input p-4 shadow-xs outline-none has-data-[state=checked]:border-primary has-data-[state=checked]:ring-primary has-data-[state=checked]:bg-primary/20 bg-border/40">
                        <RadioGroupItem
                          value={mode.id}
                          id={`${executionModeId}-${mode.id}`}
                          aria-describedby={`${executionModeId}-${mode.id}-description`}
                          className="order-1 after:absolute after:inset-0"
                        />
                        <div className="grid grow gap-2">
                          <Label htmlFor={`${executionModeId}-${mode.id}`}>
                            {mode.label}
                          </Label>
                          <p id={`${executionModeId}-${mode.id}-description`} className="text-xs text-muted-foreground">
                            {mode.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {watch("executionMode") === "independent" && (
            <div className="pt-4">
              <h4 className="font-medium mb-2">Select Agents</h4>
              <FormField
                control={control}
                name="selectedAgents"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ">
                    {agents.map((agent) => (
                      <div key={agent.id} className="relative  flex w-full items-start gap-2 rounded-md border  border-input p-4 shadow-xs outline-none has-data-[state=checked]:border-primary  has-data-[state=checked]:ring-primary  has-data-[state=checked]:bg-primary/20 bg-border/40">
                        <Checkbox
                          id={`${agentSelectionId}-${agent.id}`}
                          className="order-1  after:absolute after:inset-0"
                          aria-describedby={`${agentSelectionId}-${agent.id}-description`}
                          checked={field.value?.includes(agent.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...(field.value || []), agent.id])
                              : field.onChange(
                                field.value?.filter(
                                  (value: any) => value !== agent.id
                                )
                              );
                          }}
                        />
                        <div className="grid grow gap-2">
                          <Label htmlFor={`${agentSelectionId}-${agent.id}`}>
                            {agent.name}
                          </Label>
                          <p id={`${agentSelectionId}-${agent.id}-description`} className="text-xs text-muted-foreground">
                            {agent.description}
                          </p>
                        </div>
                      </div>
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <div className=" w-full  justify-end flex">
          <Button type="submit" disabled={isSubmitting || isPending} >
            {isSubmitting || isPending ? (
              <ButtonSpinner>Executing</ButtonSpinner>
            ) : (
              <>
                <FastForward />
                Execute Audit
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}