import { CheckCircle2 } from "lucide-react"

import { FormSection } from "@/components/shared/reusable/FormSection"

interface CampaignTypeDetailsProps {
    selectedCampaignType?: number | null;
}

export function CampaignTypeDetails({ selectedCampaignType }: CampaignTypeDetailsProps) {
    if (!selectedCampaignType) return null;

    return (
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
    );
}
