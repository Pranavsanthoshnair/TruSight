import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Bias Detection Tool",
  description: "Analyze news articles, text, or URLs for media bias using our advanced AI-powered detection tool. Get instant insights into potential bias and missing perspectives.",
  keywords: [
    "bias detection",
    "media bias analysis",
    "AI bias detection",
    "news analysis",
    "media literacy",
    "fact checking",
    "source verification",
    "unbiased news",
    "media analysis tool"
  ],
  openGraph: {
    title: "AI Bias Detection Tool - TruSight",
    description: "Analyze news articles, text, or URLs for media bias using our advanced AI-powered detection tool.",
    url: "https://trusight.com/bias",
    siteName: "TruSight",
    images: [
      {
        url: "/bias-detection-og.jpg",
        width: 1200,
        height: 630,
        alt: "TruSight AI Bias Detection Tool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Bias Detection Tool - TruSight",
    description: "Analyze news articles, text, or URLs for media bias using our advanced AI-powered detection tool.",
    images: ["/bias-detection-og.jpg"],
  },
  alternates: {
    canonical: "/bias",
  },
}

export default function BiasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
