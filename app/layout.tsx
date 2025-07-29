import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Link from "next/link";
import Footer from "./components/Footer";
import Logo from "./components/Logo";
import { GoogleAnalytics } from "@next/third-parties/google";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#2563EB",
};

export const metadata: Metadata = {
  title: "GuideMyRecipe - AI-Powered Cooking Assistant",
  description:
    "Transform any recipe into an interactive cooking guide. Extract, organize, and follow recipes from any website with our AI-powered cooking assistant.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "GuideMyRecipe - AI-Powered Cooking Assistant",
    description:
      "Transform any recipe into an interactive cooking guide. Extract, organize, and follow recipes from any website with our AI-powered cooking assistant.",
    type: "website",
    url: "https://guidemyrecipe.com",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GuideMyRecipe - AI-Powered Cooking Assistant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GuideMyRecipe - AI-Powered Cooking Assistant",
    description:
      "Transform any recipe into an interactive cooking guide. Extract, organize, and follow recipes from any website with our AI-powered cooking assistant.",
    images: ["/og-image.jpg"],
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
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Structured data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="worker"
        >
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "GuideMyRecipe",
              "url": "https://guidemyrecipe.com",
              "description": "Transform any recipe into an interactive cooking guide. Extract, organize, and follow recipes from any website with our AI-powered cooking assistant.",
              "applicationCategory": "CookingApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "Recipe Extraction",
                "Interactive Cooking Guide",
                "Ingredient Scaling",
                "Step-by-Step Instructions",
                "Real-time Cooking Guidance"
              ],
              "author": {
                "@type": "Organization",
                "name": "GuideMyRecipe",
                "url": "https://guidemyrecipe.com"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://guidemyrecipe.com?url={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              },
              "sameAs": [
                "https://twitter.com/guidemyrecipe",
                "https://facebook.com/guidemyrecipe",
                "https://instagram.com/guidemyrecipe"
              ]
            }
          `}
        </Script>

        {/* Performance monitoring */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <Footer />
        </div>
      </body>
      {process.env.NODE_ENV === "production" && (
        <GoogleAnalytics gaId="G-X18BDWVHGK" />
      )}
    </html>
  );
}
