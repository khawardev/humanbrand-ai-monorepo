import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, Inter, PT_Serif } from "next/font/google";
import "@/app/(css)/globals.css";
import { ThemeProvider } from "next-themes";
import LightRaysWrapper from "@/components/ui/react-bits/LightRays/LightRaysWrapper";
import HeaderServer from "@/components/static/header/HeaderServer";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config/brandos-sidebar-config";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const ptSerif = PT_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-serif',
})
export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`relative font-sf-pro ${inter?.className}  tracking-tight antialiased `} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <LightRaysWrapper>
            <HeaderServer />
            {children}
            <Toaster position='bottom-center' />
          </LightRaysWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}