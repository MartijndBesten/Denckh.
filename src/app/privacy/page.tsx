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
          <p>De knop &ldquo;Vertel het me&rdquo; opent je eigen mailprogramma met je tekst erin. Heb je bovenaan getekend of een idee ingevuld, dan staat ook kort in de mail wat Denckh erin las. Je ziet alles voordat je verstuurt. Pas als je die mail zelf verstuurt, komt hij binnen op info@denckh.nl.</p>
          <p>Ik gebruik je naam, mailadres en bericht alleen om te reageren en, als je dat wilt, om een opdracht voor te bereiden. Ik deel ze niet met anderen en gebruik ze niet voor nieuwsbrieven of reclame. Alleen mijn mailprovider verwerkt de mail, omdat die hem bezorgt en bewaart.</p>
          <h2>Bewaren</h2>
          <p>Ik bewaar je mail zolang dat nodig is om je vraag af te handelen. Wordt het een opdracht, dan bewaar ik wat bij de administratie hoort zo lang als de wet dat vraagt: zeven jaar.</p>
          <h2>Externe diensten</h2>
          <p>Lettertypen worden vanaf deze site zelf geladen. Er zijn geen video&apos;s, embeds of analysetools van derden. De prijslijst is een gewoon bestand op deze site. De site staat op GitHub Pages, een dienst van het Amerikaanse bedrijf GitHub. Zoals bij elke webserver kan de host technische verbindingsgegevens verwerken, zoals je IP-adres.</p>
          <h2>Je rechten</h2>
          <p>Je mag altijd vragen welke gegevens ik van je heb, en ze laten aanpassen of verwijderen. Mail daarvoor naar info@denckh.nl. Kom je er met mij niet uit, dan kun je een klacht indienen bij de Autoriteit Persoonsgegevens.</p>
          <h2>Vragen</h2>
          <p>Mail naar info@denckh.nl. Denckh · Vlierweg 54, Houten · KvK 83176896 · btw NL003791952B15.</p>
          <p className="legal-page__date">Laatst bijgewerkt: 29 september 2026.</p>
        </article>
        <Footer />
      </div>
    </main>
  );
}
