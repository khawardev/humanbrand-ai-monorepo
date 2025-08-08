import React from "react"
import { Hero } from "@/components/aiag-components/reusable-components/hero"
import AdminMailAlert from "@/components/aiag-components/admin-mail-alert"
import HomePageComponent from "@/components/aiag-components/home/home-page-component"
export default function HomePage() {
  console.log(process.env.BETTER_AUTH_URL, `BETTER_AUTH_URL`);
  console.log(process.env.GOOGLE_CLIENT_SECRET, `GOOGLE_CLIENT_SECRET`);
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