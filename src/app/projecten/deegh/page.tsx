import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "@/components/Header";
import { Construct } from "@/components/grammar/Construct";

export const metadata: Metadata = {
  title: "Deegh",
  description: "Een eigen product kreeg een webshop met producten, bereiding, recepten, verkooppunten en een zakelijke route.",
  alternates: { canonical: "/projecten/deegh/" },
};

export default function DeeghCase() {
  return (
    <main id="inhoud">
      <div className="section-shell case-page">
        <Header compact />
        <Link className="back-link" href="/#projecten">← Alle projecten</Link>
        <header className="case-page__header">
          <p className="eyebrow">eigen product · webshop</p>
          <h1>Van deegbol naar<br /><em>een plek die klopt.</em></h1>
          <p>Deegh is een eigen merk rond ambachtelijk pizzadeeg. De digitale vorm moest net zo duidelijk zijn als het product zelf.</p>
        </header>
        <Construct project="deegh" label="deegh.nl, schematisch" />
        <div className="case-page__facts">
          <section><h2>Idee</h2><p>Een product niet alleen aanbieden, maar ook laten zien hoe je ermee werkt, wat je kunt maken en waar je het vindt.</p></section>
          <section><h2>Denckh</h2><p>De nieuwe webshop is gebouwd als een eigen WordPress- en WooCommerce-omgeving met een lichtgewicht thema en een eigen functieplugin.</p></section>
          <section><h2>Vorm</h2><p>Een webshop met pizzabol- en deegpakketten, bereiding, recepten, verkooppunten, een zakelijke route en een helder merkverhaal.</p></section>
        </div>
        <aside className="case-page__source"><strong>Wat hier staat</strong><p>Deze case is gebaseerd op de live webshop en de broncode. Beelden van Deegh worden hier nog niet hergebruikt; de herkomst en publicatietoestemming worden per beeld bevestigd.</p></aside>
        <div className="case-page__next"><p>Heb je zelf iets dat vorm mag krijgen?</p><Link className="button button--dark" href="/#contact">Vertel het me</Link></div>
        <Footer />
      </div>
    </main>
  );
}
