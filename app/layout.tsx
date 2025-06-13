import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DesktopHeader from "@/components/header/desktop-header";
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
  metadataBase: new URL("https://www.repurai.com/"),
  title: "AIAG content action model 25.1",
  description: "AI that Repurpose Content in Revenue Ready Assets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${inter?.className} relative  antialiased`} suppressHydrationWarning={true}>
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        > */}
          <DesktopHeader />
          {children}
          <Toaster />
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
