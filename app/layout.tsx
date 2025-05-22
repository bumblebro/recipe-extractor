import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Link from "next/link";
import Footer from "./components/Footer";
import Logo from "./components/Logo";

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
              "name": "GuideMyRecipe.com",
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
          <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <Logo />
                </div>
                <div className="flex items-center space-x-4">
                  <Link
                    href="/"
                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    aria-label="Home Page"
                  >
                    Home
                  </Link>
                  <Link
                    href="/about"
                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    aria-label="About Us Page"
                  >
                    About
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
