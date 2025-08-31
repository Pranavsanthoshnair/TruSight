import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Playfair_Display, Open_Sans } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@vercel/analytics/react"
import { ClerkProvider } from "@clerk/nextjs"

import "./globals.css"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
})

export const metadata: Metadata = {
  title: {
    default: "TruSight - AI-Powered News Analysis & Bias Detection Platform",
    template: "%s | TruSight"
  },
  description: "Discover unbiased news analysis with TruSight's AI-powered bias detection tool. Stay informed with fact-checked news from around the world. Analyze media bias, verify sources, and make informed decisions.",
  keywords: [
    "news analysis",
    "bias detection",
    "AI news",
    "media literacy",
    "fact checking",
    "unbiased news",
    "news verification",
    "media bias analysis",
    "journalism tools",
    "news platform",
    "AI journalism",
    "news credibility",
    "source verification",
    "media analysis",
    "news literacy"
  ],
  authors: [{ name: "TruSight Team", url: "https://trusight.com" }],
  creator: "TruSight",
  publisher: "TruSight",
  category: "Technology",
  classification: "News & Media",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://trusight.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TruSight - AI-Powered News Analysis & Bias Detection Platform",
    description: "Discover unbiased news analysis with TruSight's AI-powered bias detection tool. Stay informed with fact-checked news from around the world.",
    url: "https://trusight.com",
    siteName: "TruSight",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TruSight - AI-Powered News Analysis Platform",
        type: "image/jpeg",
      },
      {
        url: "/og-image-dark.jpg",
        width: 1200,
        height: 630,
        alt: "TruSight - AI-Powered News Analysis Platform (Dark Mode)",
        type: "image/jpeg",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TruSight - AI-Powered News Analysis & Bias Detection Platform",
    description: "Discover unbiased news analysis with TruSight's AI-powered bias detection tool. Stay informed with fact-checked news from around the world.",
    images: ["/og-image.jpg"],
    creator: "@trusight",
    site: "@trusight",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  other: {
    "theme-color": "#000000",
    "color-scheme": "dark light",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "TruSight",
    "application-name": "TruSight",
    "msapplication-TileColor": "#000000",
    "msapplication-config": "/browserconfig.xml",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
          <meta name="msapplication-TileColor" content="#000000" />
          <meta name="theme-color" content="#000000" />
        </head>
        <body
          className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${playfairDisplay.variable} ${openSans.variable} newspaper-texture`}
          suppressHydrationWarning
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
