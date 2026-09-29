import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://denckh.nl"),
  title: {
    default: "Denckh · van idee naar vorm",
    template: "%s · Denckh",
  },
  description: "Kleine conceptstudio. Van website tot prototype, van interactieve uitleg tot iets waar nog geen naam voor is.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: "Denckh",
    title: "Denckh · van idee naar vorm",
    description: "Een kleine conceptstudio voor ideeën die concreet mogen worden.",
  },
  twitter: {
    card: "summary",
    title: "Denckh · van idee naar vorm",
    description: "Van idee naar vorm.",
  },
  icons: { icon: "/favicon.svg" },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#FAF8F3",
  colorScheme: "light",
};

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Denckh",
  url: "https://denckh.nl",
  description: "Kleine creatieve conceptstudio. Van idee naar vorm.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl" data-scroll-behavior="smooth">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
        <a className="skip-link" href="#inhoud">Ga naar de inhoud</a>
        {children}
      </body>
    </html>
  );
}
