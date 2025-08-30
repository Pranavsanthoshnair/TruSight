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
  title: "TruSight - News Platform with AI Bias Detection",
  description: "Stay informed with the latest news from around the world, then analyze potential bias with our AI-powered detection tool. Make informed decisions with TruSight.",
  keywords: ["news", "bias detection", "media literacy", "AI", "fact checking", "journalism"],
  authors: [{ name: "TruSight Team" }],
  creator: "TruSight",
  publisher: "TruSight",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://trusight.com"),
  openGraph: {
    title: "TruSight - News Platform with AI Bias Detection",
    description: "Stay informed with the latest news from around the world, then analyze potential bias with our AI-powered detection tool.",
    url: "https://trusight.com",
    siteName: "TruSight",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TruSight - News Platform with AI Bias Detection",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TruSight - News Platform with AI Bias Detection",
    description: "Stay informed with the latest news from around the world, then analyze potential bias with our AI-powered detection tool.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
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
