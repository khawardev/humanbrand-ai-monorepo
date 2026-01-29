import React from "react"
import { Hero } from "@/components/aiag-components/reusable-components/hero"
import AdminMailAlert from "@/components/aiag-components/admin-mail-alert"
import HomePageComponent from "@/components/aiag-components/home/home-page-component"
import { DashboardInnerLayout } from "@/components/shared/DashboardComponents"

export default function NewPage() {
  return (
    <DashboardInnerLayout>
      <Hero />
      <AdminMailAlert />
      <HomePageComponent />
    </DashboardInnerLayout>
  )
}
