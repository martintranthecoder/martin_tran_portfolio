import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import ClickSpark from "@/components/ui/ClickSpark";
import FloatingJellyfish from "@/components/ui/FloatingJellyfish";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Calistoga, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});
const calistoga = Calistoga({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://martintran.work"),
  title: "Martin Tran - Software Engineer",
  description:
    "Martin Tran is a Software Development Engineer at Amazon Web Services (AWS) and a San Jose State University alumni with expertise in distributed systems, infrastructure, backend development, and data engineering.",
  keywords: [
    "Martin Tran",
    "Software Engineer",
    "AWS",
    "Amazon Web Services",
    "SJSU",
    "San Jose State University",
    "portfolio",
    "backend developer",
    "distributed systems",
    "infrastructure",
    "data engineering",
  ],
  authors: [{ name: "Martin Tran", url: "https://martintran.work" }],
  openGraph: {
    type: "website",
    url: "https://martintran.work",
    siteName: "Martin Tran",
    title: "Martin Tran - Software Engineer",
    description:
      "Software Development Engineer at AWS. SJSU alumni specializing in distributed systems, infrastructure, and backend development.",
    images: [
      {
        url: "/img/martin-portfolio.png",
        width: 1200,
        height: 630,
        alt: "Martin Tran Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Martin Tran - Software Engineer",
    description:
      "Software Development Engineer at AWS. SJSU alumni specializing in distributed systems, infrastructure, and backend development.",
    images: ["/img/martin-portfolio.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          calistoga.variable,
        )}
      >
        <GoogleAnalytics />
        <Providers>
          <FloatingJellyfish />
          <ClickSpark
            sparkColor="#fff"
            sparkSize={10}
            sparkRadius={15}
            sparkCount={8}
            duration={400}
          >
            <Header />
            <div className="mx-auto flex max-w-3xl flex-col px-8">
              <main className="grow">{children}</main>
            </div>
            <Footer />
          </ClickSpark>
        </Providers>
      </body>
    </html>
  );
}
