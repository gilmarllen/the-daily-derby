import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Footer } from "@/components/layout/footer";
import { LocaleProvider } from "@/components/i18n/locale-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { getLocale } from "@/lib/i18n/server";
import { getTheme } from "@/lib/theme/server";
import { THEME_COOKIE } from "@/lib/theme/config";
import { SITE_URL } from "@/lib/site";

// Runs before paint to set the `.dark` class from the cookie (or the OS
// preference when "system"/unset), avoiding a light-mode flash. Inlined as a
// string because the server can't read `prefers-color-scheme`.
const NO_FLASH_SCRIPT = `(function(){try{var m=document.cookie.match(/(?:^|; )${THEME_COOKIE}=([^;]*)/);var t=m?decodeURIComponent(m[1]):"system";var d=t==="dark"||((t==="light")?false:window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;

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
  const [locale, theme] = await Promise.all([getLocale(), getTheme()]);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col">
        <ThemeProvider theme={theme}>
          <LocaleProvider locale={locale}>
            <div className="flex flex-1 flex-col">{children}</div>
            <Footer />
          </LocaleProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
