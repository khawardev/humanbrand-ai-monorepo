import { ContainerMd, ContainerSm } from "@/components/Container";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ContainerSm className="relative flex gap-44 items-center justify-between w-full mx-auto  max-w-lg px-4 ">
      <div className="w-full ">
        {children}
      </div>
    </ContainerSm>
  );
}