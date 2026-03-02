import { getCurrentUser } from "@/db/actions/userActions";
import HeroSection from "@/components/home/HeroSection";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="container mx-auto max-w-4xl px-4 flex flex-col justify-center text-center h-[95vh]">
      <h1 className="font-heading z-50 text-4xl font-bold tracking-tight sm:text-6xl text-lime-green">
        Get Clarity. Start your free Website <span className="text-primary"> Brand Health Audit</span>.
      </h1>
      <div className="mt-10">
        <HeroSection user={user} />
      </div>
    </div>
  );
}
