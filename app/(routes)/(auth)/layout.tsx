import { ContainerSm } from "@/components/shared/Container";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ContainerSm className="relative h-[90vh] flex gap-44 items-center justify-between w-full mx-auto  max-w-lg px-4 ">
      <div className="w-full ">
        {children}
      </div>
    </ContainerSm>
  );
}
