import React from "react"
import { Hero } from "@/components/shared/reusable/Hero"
import AdminMailAlert from "@/components/shared/AdminMailAlert"
import HomePageComponent from "@/components/AIAGComponents/home/HomePageComponent"
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
