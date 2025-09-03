import { getUser } from "@/actions/users-actions";
import { ContainerSm } from "@/components/Container";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (user) {
    redirect('/')
  }

  return (
    <ContainerSm className="relative flex gap-44 items-center justify-between w-full mx-auto  max-w-lg px-4 ">
      <div className="w-full ">
        {children}
      </div>
    </ContainerSm>
  );
}