import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Footer } from "@/components/layout/footer";
import { LocaleProvider } from "@/components/i18n/locale-provider";
import { getLocale } from "@/lib/i18n/server";
import { SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DESCRIPTION =
  "A daily football prediction game — pick winners, manage your F$, earn trophies, and climb the global leaderboard.";

export const metadata: Metadata = {
  // Base for resolving the relative OG/Twitter image URLs to absolute ones.
  metadataBase: new URL(SITE_URL),
  title: "The Daily Derby",
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "The Daily Derby",
    title: "The Daily Derby",
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Daily Derby",
    description: DESCRIPTION,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <LocaleProvider locale={locale}>
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
        </LocaleProvider>
        <Analytics />
      </body>
    </html>
  );
}
