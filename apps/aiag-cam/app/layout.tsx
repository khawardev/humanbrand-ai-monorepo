import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/app/(styles)/globals.css";
import DesktopHeader from "@/components/header/DesktopHeader";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
  maximumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://aiag-content-action-model-3-3.vercel.app/"),
  title: "AIAG CAM 26.2 | Humanbrand AI",
  description: "Plateform for genrating AIAG Content",
};

export const revalidate = 0;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${inter?.className} relative  antialiased`} suppressHydrationWarning={true}>
        
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {/* <DesktopHeader /> */}
          {children}
          <Toaster position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}