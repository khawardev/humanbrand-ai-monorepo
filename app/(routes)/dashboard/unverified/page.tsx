import { ShieldAlert } from "lucide-react";

export default async function UnverifiedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center space-y-6 animate-in fade-in duration-700">
      
      <div className="relative">
        <div className="absolute inset-0 blur-xl rounded-full " />
        <div className="relative bg-accent p-4 rounded-full">
           <ShieldAlert className="w-12 h-12" strokeWidth={1.5} />
        </div>
      </div>

      <div className="space-y-3 max-w-2xl px-6 ">
        <p className="text-xl text-muted-foreground leading-relaxed">
           Your account is currently under review. <br className="hidden sm:inline" /> 
           Access to the dashboard is restricted until an administrator verifies your profile.
        </p>
      </div>
    </div>
  );
}
