import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const GA_ID = "G-F1NSGZ0BQ6";

export const metadata: Metadata = {
  metadataBase: new URL("https://media.tokyoplants.com"),
  applicationName: "tokyoplants media",
  title: {
    default: "観葉植物の育て方・土・図鑑 | tokyoplants media",
    template: "%s | tokyoplants media",
  },
  description:
    "観葉植物の育て方、土・用土の選び方、植物図鑑、用品レビューを掲載。初心者から中級者まで役立つ実践ガイドを毎週更新。",
  keywords: [
    "観葉植物",
    "観葉植物 育て方",
    "観葉植物 土",
    "観葉植物 植え替え",
    "植物図鑑",
    "tokyoplants",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "tokyoplants media",
    locale: "ja_JP",
    title: "観葉植物の育て方・土・図鑑 | tokyoplants media",
    description:
      "観葉植物の育て方、土・用土の選び方、植物図鑑、用品レビューを掲載。初心者から中級者まで役立つ実践ガイドを毎週更新。",
    images: [
      {
        url: "https://images.unsplash.com/photo-1628246499185-54f441171885?w=1600&q=80",
        width: 1600,
        height: 1067,
        alt: "tokyoplants media",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "観葉植物の育て方・土・図鑑 | tokyoplants media",
    description:
      "観葉植物の育て方、土・用土の選び方、植物図鑑、用品レビューを掲載。初心者から中級者まで役立つ実践ガイドを毎週更新。",
    images: ["https://images.unsplash.com/photo-1628246499185-54f441171885?w=1600&q=80"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: "large",
      maxVideoPreview: -1,
    },
  },
  verification: {
    google: "_zyLhlGGI-nDjNHRDAqfF0GDHJ1qwYJxu4zRkl88M28",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "tokyoplants media",
    alternateName: "tokyoplants",
    url: "https://media.tokyoplants.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://media.tokyoplants.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { send_page_view: true });
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
