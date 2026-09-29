import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://denckh.nl"),
  title: {
    default: "Denckh · van idee naar vorm",
    template: "%s · Denckh",
  },
  description: "Kleine conceptstudio. Je hoeft nog niet te weten wat het moet worden: Denckh zoekt de vorm die bij je idee past en maakt die.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: "Denckh",
    title: "Denckh · van idee naar vorm",
    description: "Een kleine conceptstudio voor ideeën die concreet mogen worden.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "denckh. van idee naar vorm" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
    title: "Denckh · van idee naar vorm",
    description: "Van idee naar vorm.",
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#F7F4EE",
  colorScheme: "light",
};

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Denckh",
  url: "https://denckh.nl",
  description: "Kleine creatieve conceptstudio. Van idee naar vorm.",
  email: "info@denckh.nl",
  address: { "@type": "PostalAddress", streetAddress: "Vlierweg 54", addressLocality: "Houten", addressCountry: "NL" },
  vatID: "NL003791952B15",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl" data-scroll-behavior="smooth">
      <head>
        <link rel="preload" href="/fonts/fraunces-denckh.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/manrope-denckh.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
        <a className="skip-link" href="#inhoud">Ga naar de inhoud</a>
        {children}
      </body>
    </html>
  );
}
