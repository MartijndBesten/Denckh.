import Link from "next/link";
import { Footer, Header } from "@/components/Header";
import { PuntStage } from "@/components/punt/PuntStage";
import { ContactReturn } from "@/components/grammar/ContactReturn";
import { Construct } from "@/components/grammar/Construct";
import { InkRule } from "@/components/grammar/InkRule";
import { Outcomes } from "@/components/grammar/Outcomes";
import { SettleTitle } from "@/components/grammar/SettleTitle";
import { Werkwijze } from "@/components/grammar/Werkwijze";

export default function Home() {
  return (
    <main id="inhoud">
      <section className="hero" aria-label="Begin met een punt">
        <div className="shell"><Header /></div>
        <div className="shell hero__stage"><PuntStage /></div>
      </section>

      <div className="shell"><InkRule note="jouw lijn" /></div>

      <section className="shell story" aria-labelledby="idee-titel">
        <SettleTitle id="idee-titel" text="Van idee naar vorm." className="story__title" />
        <div className="story__text">
          <p className="story__lead">Soms weet je precies wat je wilt. Soms heb je alleen een gedachte waarvan je denkt: hier zit iets in.</p>
          <p>Denckh denkt mee, maakt het zichtbaar en bouwt een eerste vorm. Van website tot prototype. Van interactieve uitleg tot iets waarvoor nog geen goede naam bestaat.</p>
        </div>
      </section>

      <section className="shell projects" id="projecten" aria-labelledby="projecten-titel">
        <header className="projects__head">
          <h2 id="projecten-titel">Wat er al vorm kreeg.</h2>
          <p>Drie ideeën, drie soorten denken. Scroll, en kijk hoe een lijn elk project wordt.</p>
        </header>

        <article className="case">
          <Construct project="deegh" label="deegh.nl, schematisch" />
          <div className="case__text">
            <p className="case__kind">product → merk → webshop</p>
            <h3>Deegh</h3>
            <p className="case__lead">Van deegbol tot een plek waar je bestelt en leert hoe het werkt.</p>
            <dl className="case__facts">
              <div><dt>Aanleiding</dt><dd>Een eigen product, ambachtelijk pizzadeeg, had een plek nodig die net zo helder is als het product zelf.</dd></div>
              <div><dt>Denckh</dt><dd>Een eigen webshop op WordPress en WooCommerce, met een eigen thema: producten, uitleg in stappen, recepten, verkooppunten en een zakelijke route.</dd></div>
              <div><dt>Vorm</dt><dd>deegh.nl: bestellen, en leren hoe je van een bol deeg een pizza maakt.</dd></div>
            </dl>
            <p className="case__links">
              <Link className="link-draw" href="/projecten/deegh/">Bekijk het project</Link>
              <a className="link-draw" href="https://deegh.nl" rel="noopener">deegh.nl</a>
            </p>
          </div>
        </article>

        <article className="case case--flip case--night">
          <Construct project="koffer" label="interactieve gids bij een demokoffer" tone="night" />
          <div className="case__text">
            <p className="case__kind">complexe techniek → begrijpelijke uitleg</p>
            <h3>Een koffer die zichzelf uitlegt</h3>
            <p className="case__lead">Een demokoffer vol sensortechniek kreeg een digitale gids die je opent met een QR-code op de koffer.</p>
            <dl className="case__facts">
              <div><dt>Aanleiding</dt><dd>Wie de koffer openmaakt, moet snel snappen wat erin zit en hoe je het bedient.</dd></div>
              <div><dt>Denckh</dt><dd>Een verkenner van de koffer, de bediening stap voor stap nagebootst en een demomodus om mee te presenteren. In drie talen, ook offline.</dd></div>
              <div><dt>Vorm</dt><dd>Een interactieve uitleg die naast het echte product werkt.</dd></div>
            </dl>
            <p className="case__note">Zonder merknaam of productbeelden: het gaat hier om de manier van uitleggen.</p>
          </div>
        </article>

        <article className="case">
          <Construct project="spel" label="loflijn.nl, schematisch" ratio={0.62} />
          <div className="case__text">
            <p className="case__kind">fysiek spel → uitleg en verkoop</p>
            <h3>Loflijn</h3>
            <p className="case__lead">Een muziekspel voor op tafel kreeg een plek online: uitleg in drie stappen en een route naar bestellen.</p>
            <dl className="case__facts">
              <div><dt>Aanleiding</dt><dd>Van Psalm tot Praise is een fysiek muziekspel. Wie het nog niet kent, moet in een paar tellen snappen hoe het werkt.</dd></div>
              <div><dt>Denckh</dt><dd>De website en webshop: het spel uitgelegd in drie stappen (scan de QR-code, luister naar het lied, leg de kaart op de tijdlijn), productinformatie en een kooproute.</dd></div>
              <div><dt>Vorm</dt><dd>loflijn.nl, waar je het spel leert kennen en bestelt.</dd></div>
            </dl>
            <p className="case__links"><a className="link-draw" href="https://loflijn.nl" rel="noopener">loflijn.nl</a></p>
          </div>
        </article>
      </section>

      <section className="shell outcomes-section" aria-labelledby="uitkomst-titel">
        <h2 id="uitkomst-titel">Wat kan eruit komen?</h2>
        <Outcomes />
      </section>

      <section className="shell ww-section" id="werkwijze" aria-labelledby="werkwijze-titel">
        <header className="ww-section__head">
          <h2 id="werkwijze-titel">Zo werkt het.</h2>
          <p>Wat er bovenaan met je lijn gebeurde, is precies hoe het werkt.</p>
        </header>
        <Werkwijze />
      </section>

      <section className="shell small" aria-labelledby="klein-titel">
        <figure className="small__photo">
          <span className="small__photo-note">hier komt een echte foto. geen gegenereerde.</span>
        </figure>
        <div className="small__text">
          <h2 id="klein-titel">Denckh is klein. Bewust.</h2>
          <p>Achter Denckh zit één persoon. Je werkt rechtstreeks met degene die meedenkt en maakt. Geen accountmanager, geen doorgeefluik.</p>
          <p>Naast Denckh maak ik Deegh, ambachtelijk pizzadeeg. Ook dat begon als een idee.</p>
        </div>
      </section>

      <div className="shell"><InkRule /></div>

      <section className="shell contact" id="contact" aria-labelledby="contact-titel">
        <h2 id="contact-titel">En wat zit er bij jou in je hoofd?</h2>
        <ContactReturn />
      </section>

      <div className="shell"><Footer /></div>
    </main>
  );
}
