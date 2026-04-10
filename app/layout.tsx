import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "./provider";
import CustomCursor from "@/components/CustomCursor";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shresth's Portfolio",
  description: "Modern & Premium Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/jsm-logo.png" sizes="any" />
      </head>
      <body className={spaceGrotesk.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
