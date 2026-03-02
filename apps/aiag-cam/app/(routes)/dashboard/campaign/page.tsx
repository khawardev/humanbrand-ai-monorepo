import React from "react"
import { Hero } from "@/components/shared/reusable/Hero"
import { DashboardInnerLayout } from "@/components/shared/DashboardComponents"
import { CampaignPageComponent } from "@/components/routes/campaign/CampaignPageComponent"

export default function CampaignPage() {
  return (
    <DashboardInnerLayout>
      <Hero />
      <CampaignPageComponent />
    </DashboardInnerLayout>
  )
}