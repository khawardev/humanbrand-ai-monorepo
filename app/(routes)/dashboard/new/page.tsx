import React from "react"
import { Hero } from "@/components/shared/reusable/Hero"
import AdminMailAlert from "@/components/shared/AdminMailAlert"
import { DashboardInnerLayout } from "@/components/shared/DashboardComponents"
import NewPageComponent from "@/components/routes/new/NewPageComponent"

export default function NewPage() {
  return (
    <DashboardInnerLayout>
      <Hero />
      <AdminMailAlert />
      <NewPageComponent />
    </DashboardInnerLayout>
  )
}
