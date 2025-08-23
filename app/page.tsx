import React from "react"
import { Hero } from "@/components/aiag-components/reusable-components/hero"
import AdminMailAlert from "@/components/aiag-components/admin-mail-alert"
import HomePageComponent from "@/components/aiag-components/home/home-page-component"
export default function HomePage() {
  return (
    <main className="pt-14 relative">
       <Hero />
      <section className="div-center-md">
        <AdminMailAlert />
        <HomePageComponent />
      </section>
    </main>
  )
}