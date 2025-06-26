import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DesktopHeader from "@/components/header/desktop-header";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import KnowledgeBaseChatComponent from "@/components/knowledge-base-chat/knowledge-base-chat-component";

const inter = Inter({ subsets: ["latin"] });


export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
  maximumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://aiag-content-action-model-3-3.vercel.app/"),
  title: "AIAG content action model 25.1",
  description: "Plateform for genrating AIAG Content",
};

export default function RootLayout({
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
          <div className="fixed bottom-6 right-6 z-50">
            <KnowledgeBaseChatComponent />
          </div>
          <DesktopHeader />
          {children}
          <Toaster />
          <div className="pointer-events-none fixed bottom-0 left-20 z-0 -translate-x-1/3" aria-hidden="true">
            <div className="h-80 w-80 rounded-full bg-gradient-to-tr from-background to-primary  opacity-40 blur-[160px]" />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
