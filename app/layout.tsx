import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DesktopHeader from "@/components/header/desktop-header";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import KnowledgeBaseChatComponent from "@/components/aiag-components/knowledge-base-chat/knowledge-base-chat-component";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
  maximumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://aiag-content-action-model-3-3.vercel.app/"),
  title: "AIAG CAM 25.1 | Humanbrand AI",
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
          <div className="fixed bottom-6 right-6 z-50">
            <KnowledgeBaseChatComponent />
          </div>
          <DesktopHeader />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}