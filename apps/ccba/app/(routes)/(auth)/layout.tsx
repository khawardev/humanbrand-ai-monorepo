export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="z-10 flex items-center justify-center h-screen">
      {children}
    </div>
  );
}
