import React from "react"
import { Hero } from "@/components/aiag-components/reusable-components/hero"
import AdminMailAlert from "@/components/aiag-components/admin-mail-alert"
import HomePageComponent from "@/components/aiag-components/home/home-page-component"
export default function HomePage() {
  const envVars = {
    NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    DB_SCHEMA_NAME: process.env.DB_SCHEMA_NAME,
    DATABASE_URL: process.env.DATABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
  };

  return (
    <main className="pt-14 relative">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Public Environment Variables</h2>
        <ul className="space-y-2">
          {Object.entries(envVars).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {value}
            </li>
          ))}
        </ul>
      </div>

      {/* <Hero />
      <section className="div-center-md">
        <AdminMailAlert />
        <HomePageComponent />
      </section> */}
    </main>
  )
}