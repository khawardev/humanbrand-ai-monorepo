
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="relative flex gap-44 items-center justify-center   w-full mx-auto max-w-lg px-4 sm:px-6 ">
        <div className="pointer-events-none absolute bottom-0 left-0 -translate-x-1/3" aria-hidden="true">
          <div className="h-80 w-80 rounded-full bg-gradient-to-tr  from-[#FBDA88] to-[#844DE4] opacity-40 blur-[160px]" />
        </div>
        <div className="w-full my-20">
          {children}
        </div>
      </main>
    </>
  );
}
