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
          <p className="legal-page__intro">Deze eerste versie van de website gebruikt geen analytics, advertentietrackers of niet-noodzakelijke cookies.</p>
          <h2>Contactformulier</h2>
          <p>Het contactformulier in deze versie controleert alleen invoer in je browser. Het verstuurt nog geen gegevens en bewaart niets. Voor livegang wordt de verzendroute, bewaartermijn en het contactadres hier concreet toegevoegd.</p>
          <h2>Externe diensten</h2>
          <p>Deze site laadt geen externe lettertypen, video&apos;s, embeds of analysetools. Daardoor worden er bij gewoon bezoek geen gegevens met zulke diensten gedeeld.</p>
          <h2>Vragen</h2>
          <p>De bedrijfs- en contactgegevens worden toegevoegd voordat een werkend formulier live staat.</p>
        </article>
        <Footer />
      </div>
    </main>
  );
}
