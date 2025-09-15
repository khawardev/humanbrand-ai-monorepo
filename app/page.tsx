import React from "react"
import { Hero } from "@/components/aiag-components/reusable-components/hero"
import AdminMailAlert from "@/components/aiag-components/admin-mail-alert"
import HomePageComponent from "@/components/aiag-components/home/home-page-component"
export default function HomePage() {
  const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY!;
  return (
    <main className="pt-14 relative">
      <Hero />
      <section className="div-center-md">
      {CLAUDE_API_KEY}
        <AdminMailAlert />
        <HomePageComponent />
      </section>
    </main>
  )
}