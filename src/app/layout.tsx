import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Footer } from "@/components/layout/footer";
import { LocaleProvider } from "@/components/i18n/locale-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { getLocale, getServerDictionary } from "@/lib/i18n/server";
import { ogLocales, locales } from "@/lib/i18n/config";
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

// Localized per request: the resolved locale's dictionary drives the meta
// description, OG/Twitter copy, and `og:locale` (with the other locales listed
// as `og:locale:alternate`). The brand title stays untranslated. Because the
// locale comes from a cookie / Accept-Language rather than the URL, the same
// canonical URL serves every language via content negotiation.
export async function generateMetadata(): Promise<Metadata> {
  const [locale, dict] = await Promise.all([
    getLocale(),
    getServerDictionary(),
  ]);
  const description = dict.seo.description;
  const alternateLocale = locales
    .filter((l) => l !== locale)
    .map((l) => ogLocales[l]);

  return {
    // Base for resolving the relative OG/Twitter image URLs to absolute ones.
    metadataBase: new URL(SITE_URL),
    title: "The Daily Derby",
    description,
    alternates: { canonical: SITE_URL },
    openGraph: {
      type: "website",
      siteName: "The Daily Derby",
      title: "The Daily Derby",
      description,
      url: SITE_URL,
      locale: ogLocales[locale],
      alternateLocale,
    },
    twitter: {
      card: "summary_large_image",
      title: "The Daily Derby",
      description,
    },
  };
}

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
      {/* suppressHydrationWarning: browser extensions (e.g. Grammarly) inject
          attributes onto <body> before React hydrates, which would otherwise
          trip a hydration mismatch warning. */}
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
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
