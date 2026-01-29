import React from "react"
import { Hero } from "@/components/aiag-components/reusable-components/hero"
import { DashboardInnerLayout } from "@/components/shared/DashboardComponents"
import { CampaignPageComponent } from "@/components/aiag-components/campaign/CampaignPageComponent"

export default function CampaignPage() {
  return (
    <DashboardInnerLayout>
      <Hero />
      <CampaignPageComponent />
    </DashboardInnerLayout>
  )
}