import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Hoe Denckh met gegevens omgaat.",
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <main id="inhoud">
      <div className="section-shell legal-page">
        <Header compact />
        <Link className="back-link" href="/">← Terug naar denckh</Link>
        <article>
          <p className="eyebrow">privacy</p>
          <h1>Zo min mogelijk<br /><em>bijhouden.</em></h1>
          <p className="legal-page__intro">Deze website gebruikt geen analytics, geen advertentietrackers en geen cookies.</p>
          <h2>Je schets</h2>
          <p>Wat je bovenaan de homepage tekent, wordt alleen in je eigen browser verwerkt. Om je lijn verderop op de pagina terug te laten komen, bewaart de site een vereenvoudigde versie van je schets (en de zin die je eventueel invult) in de sessieopslag van je browser. Die verdwijnt als je het tabblad sluit. Er wordt niets naar een server gestuurd.</p>
          <h2>Contact</h2>
          <p>De knop &ldquo;Vertel het me&rdquo; opent je eigen mailprogramma met je tekst erin. Pas als je die mail zelf verstuurt, komt hij binnen op info@denckh.nl. Ik gebruik je bericht alleen om te reageren.</p>
          <h2>Externe diensten</h2>
          <p>Lettertypen worden vanaf deze site zelf geladen. Er zijn geen video&apos;s, embeds of analysetools van derden. De site wordt gehost via GitHub Pages; zoals bij elke webserver kan de host technische verbindingsgegevens verwerken.</p>
          <h2>Vragen</h2>
          <p>Mail naar info@denckh.nl. Bedrijfsgegevens volgen hier zodra ze definitief zijn.</p>
        </article>
        <Footer />
      </div>
    </main>
  );
}
