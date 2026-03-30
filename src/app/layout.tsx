import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import StoreProvider from "@/store/StoreProvider";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import BuyerAssistantBot from "@/components/bot/BuyerAssistantBot";

const GA_MEASUREMENT_ID = "G-0W1025KKQ3";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://procur.io";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Procur — Fresh Produce Marketplace",
    template: "%s | Procur",
  },
  description:
    "Procur connects buyers directly with verified Caribbean farmers. Transparent pricing, reliable supply, and produce that's never more than a day from harvest.",
  keywords: [
    "fresh produce marketplace",
    "Caribbean agriculture",
    "Grenada farmers",
    "farm to table",
    "agricultural marketplace",
    "buy fresh produce",
    "verified farmers",
    "food supply chain",
  ],
  authors: [{ name: "Procur" }],
  creator: "Procur",
  publisher: "Procur",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/favicon.png", type: "image/png" }],
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Procur",
    title: "Procur — Fresh Produce Marketplace",
    description:
      "Procur connects buyers directly with verified Caribbean farmers. Transparent pricing, reliable supply, and produce that's never more than a day from harvest.",
    images: [
      {
        url: "/images/hero/land-o-lakes-inc-BlXa_riHlp4-unsplash.jpg",
        width: 1200,
        height: 630,
        alt: "Procur — Fresh Produce Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@procurapp",
    title: "Procur — Fresh Produce Marketplace",
    description:
      "Procur connects buyers directly with verified Caribbean farmers. Transparent pricing, reliable supply, and produce that's never more than a day from harvest.",
    images: ["/images/hero/land-o-lakes-inc-BlXa_riHlp4-unsplash.jpg"],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Procur",
  url: "https://procur.io",
  logo: "https://procur.io/images/logos/procur-logo.svg",
  sameAs: ["https://twitter.com/procurapp"],
  description:
    "Procur connects buyers directly with verified Caribbean farmers. Transparent pricing, reliable supply, and produce that's never more than a day from harvest.",
  areaServed: "Caribbean",
  knowsAbout: ["fresh produce", "agricultural marketplace", "Caribbean farming", "farm-to-table"],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Procur",
  url: "https://procur.io",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://procur.io/browse?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical Urbanist font weights to prevent FOUT */}
        <link rel="preload" href="/fonts/Urbanist-Regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Urbanist-Medium.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Urbanist-SemiBold.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Urbanist-Bold.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body className="antialiased">
        <StoreProvider>
          <I18nProvider>
            {children}
            <BuyerAssistantBot />
          </I18nProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
