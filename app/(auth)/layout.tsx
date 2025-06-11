import Image from "next/image";
import Logo from "@/shared/logo";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="relative flex gap-44 items-center pb-16 w-full ml-auto max-w-7xl px-4 sm:px-6 ">
        <div className="pointer-events-none absolute bottom-0 left-0 -translate-x-1/3" aria-hidden="true">
          <div className="h-80 w-80 rounded-full bg-gradient-to-tr from-[#FBDA88] to-[#844DE4] opacity-40 blur-[160px]" />
        </div>

        <div className="flex w-full justify-center">
          <div className="w-full ">
            {children}
          </div>
        </div>

        <div className="relative  hidden w-[50%]  shrink-0 overflow-hidden rounded-2xl lg:block">
          <div
          >
            <Image
              src="https://i.postimg.cc/MpD1gvJt/b36ce814-958c-4939-8eac-b4c238d59a24.jpg"
              className=" h-[85vh]"
              width={1285}
              height={1684}
              alt="Auth background"
            />
          </div>
        </div>
      </main>
    </>
  );
}
