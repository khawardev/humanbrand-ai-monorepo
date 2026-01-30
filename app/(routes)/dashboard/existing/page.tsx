import React from "react"
import { DashboardInnerLayout } from "@/components/shared/DashboardComponents"
import { ExistingPageComponent } from "@/components/routes/existing/ExistingPageComponent"

export default function ExistingContentPage() {
  return (
    <DashboardInnerLayout>
      <ExistingPageComponent />
    </DashboardInnerLayout>
  )
}