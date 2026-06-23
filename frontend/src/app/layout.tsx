import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { cn } from "../lib/utils";
import { Geist, Geist_Mono, Noto_Sans } from "next/font/google";
import Header from "../components/Header";
import StoreProvider from "./StoreProvider";

const notoSansHeading = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

const notoSans = Noto_Sans({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AltFinder | Find Free Open Source Alternatives",
  description: "Save thousands of dollars. Find free and open-source alternatives to Photoshop, Salesforce, Zapier, and other expensive software.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <StoreProvider>
        <html
          lang="en"
          className={cn(
            "h-full",
            "antialiased",
            "dark", // Force dark mode theme
            geistSans.variable,
            geistMono.variable,
            "font-sans",
            notoSans.variable,
            notoSansHeading.variable
          )}
        >
          <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-indigo-500/30">

            {/* Render the Client Header component */}
            <Header />

            {/* Core Content */}
            <main className="flex-1">
              {children}
            </main>

          </body>
        </html>
      </StoreProvider>
    </ClerkProvider>
  );
}
