import React from "react"
import { DashboardInnerLayout } from "@/components/shared/DashboardComponents"
import { Hero } from "@/components/shared/reusable/Hero"
import { ExistingPageComponent } from "@/components/routes/existing/ExistingPageComponent"

export default function ExistingContentPage() {
  return (
    <DashboardInnerLayout>
      <Hero />
      <ExistingPageComponent />
    </DashboardInnerLayout>
  )
}