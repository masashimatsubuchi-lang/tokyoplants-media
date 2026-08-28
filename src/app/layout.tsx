import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppPromoBanner from "@/components/AppPromoBanner";
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
const GTM_ID = "GTM-W4B3BGPL";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

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
    "トーキョープランツ",
    "東京プランツ",
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
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
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
    alternateName: ["tokyoplants", "トーキョープランツ", "東京プランツ"],
    url: "https://media.tokyoplants.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://media.tokyoplants.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "tokyoplants",
    alternateName: ["トーキョープランツ", "東京プランツ"],
    url: "https://www.tokyoplants.com",
    description:
      "観葉植物専門店。培養土「I'm original SOIL」やリーフタオル等の園芸用品の販売、観葉植物の専門メディア運営、お世話・成長記録アプリ「Green Collection」の開発を行う。",
    knowsAbout: [
      "観葉植物の育て方",
      "観葉植物の用土・培養土",
      "観葉植物の植え替え",
      "観葉植物の品種・図鑑",
    ],
    sameAs: [
      "https://media.tokyoplants.com",
      "https://www.instagram.com/tokyoplants.jp",
    ],
  };

  return (
    <html lang="ja">
      <head>
        <Script id="gtm-head" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <AppPromoBanner />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
