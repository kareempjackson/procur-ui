import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import StoreProvider from "@/store/StoreProvider";
import { I18nProvider } from "@/lib/i18n/I18nProvider";

const GA_MEASUREMENT_ID = "G-0W1025KKQ3";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Procur - Agricultural Marketplace",
    template: "%s | Procur",
  },
  description:
    "Procur connects farmers, buyers, and government entities in a modern agricultural marketplace. Buy and sell fresh produce, manage orders, and streamline agricultural commerce.",
  keywords: [
    "agriculture",
    "marketplace",
    "farmers",
    "produce",
    "buyers",
    "sellers",
    "agricultural commerce",
  ],
  authors: [{ name: "Procur" }],
  creator: "Procur",
  publisher: "Procur",
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/favicon.png", type: "image/png" }],
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    title: "Procur - Agricultural Marketplace",
    description:
      "Procur connects farmers, buyers, and government entities in a modern agricultural marketplace.",
    siteName: "Procur",
    images: [
      {
        url: "/images/hero/land-o-lakes-inc-BlXa_riHlp4-unsplash.jpg",
        width: 1200,
        height: 630,
        alt: "Procur - Agricultural Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Procur - Agricultural Marketplace",
    description:
      "Procur connects farmers, buyers, and government entities in a modern agricultural marketplace.",
    images: ["/images/hero/land-o-lakes-inc-BlXa_riHlp4-unsplash.jpg"],
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <I18nProvider>{children}</I18nProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
