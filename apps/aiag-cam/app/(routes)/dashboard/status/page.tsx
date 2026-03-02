
import { ApiStatusChecker } from "@/components/system/ApiStatusChecker"
import { ModelPlayground } from "@/components/system/playground/ModelPlayground"

export default function ApiStatusPage() {
  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Status</h1>
          <p className="text-muted-foreground mt-2">
            Check the status of external services and integrations.
          </p>
        </div>
        
        <ApiStatusChecker />
        
        <div className="pt-8 border-t">
          <h2 className="text-2xl font-bold tracking-tight mb-4">Model Playground</h2>
          <ModelPlayground />
        </div>
      </div>
    </div>
  )
}
