import Image from "next/image";
import Link from "next/link";
import { Footer, Header } from "@/components/Header";
import { PuntStage } from "@/components/punt/PuntStage";
import { ContactReturn } from "@/components/grammar/ContactReturn";
import { Construct } from "@/components/grammar/Construct";
import { InkRule } from "@/components/grammar/InkRule";
import { MoreWork } from "@/components/grammar/MoreWork";
import { Outcomes } from "@/components/grammar/Outcomes";
import { PriceLine } from "@/components/grammar/PriceLine";
import { SettleTitle } from "@/components/grammar/SettleTitle";
import { Werkwijze } from "@/components/grammar/Werkwijze";
import { HOME_STOPS } from "@/lib/prices";

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
          <p>Je hoeft nog niet te weten wat het moet worden. Denckh denkt mee, zoekt de vorm die bij het idee past en maakt die concreet. Dat kan een interactieve uitleg zijn, een prototype, een presentatie of iets fysieks. Soms is het een website. Of iets waarvoor nog geen goede naam bestaat.</p>
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
              <div><dt>Aanleiding</dt><dd>Hoe snapt iemand die de koffer openmaakt meteen wat erin zit en hoe je het bedient?</dd></div>
              <div><dt>Denckh</dt><dd>Een verkenner van de koffer, de bediening stap voor stap nagebootst en een demomodus om mee te presenteren. In drie talen, ook offline.</dd></div>
              <div><dt>Vorm</dt><dd>Een interactieve uitleg die naast het echte product werkt.</dd></div>
            </dl>
            <p className="case__note">Zonder merknaam of productbeelden: het gaat hier om de manier van uitleggen.</p>
          </div>
        </article>

        <article className="case case--flip">
          <Construct project="spel" label="Loflijn, schematisch: een beurt van kaart tot tijdlijn" end="van psalm tot praise" ratio={0.62} />
          <div className="case__text">
            <p className="case__kind">spel op tafel → uitleg in drie tellen</p>
            <h3>Loflijn</h3>
            <p className="case__lead">Een muziekspel voor op tafel. Online moest je in een paar tellen snappen hoe een beurt werkt.</p>
            <dl className="case__facts">
              <div><dt>Aanleiding</dt><dd>Van Psalm tot Praise is een fysiek muziekspel: je scant een kaart, luistert naar het lied en legt de kaart op de tijdlijn. Wie het nog niet kent, moet dat meteen zien.</dd></div>
              <div><dt>Denckh</dt><dd>De website en webshop: een beurt uitgelegd in drie stappen, productinformatie en een route naar bestellen.</dd></div>
              <div><dt>Vorm</dt><dd>loflijn.nl, waar je het spel leert kennen en bestelt.</dd></div>
            </dl>
            <p className="case__links"><a className="link-draw" href="https://loflijn.nl" rel="noopener">loflijn.nl</a></p>
          </div>
        </article>
      </section>

      <section className="shell more-section" id="ook-gemaakt" aria-labelledby="ook-titel">
        <header className="projects__head">
          <h2 id="ook-titel">Ook gemaakt.</h2>
          <p>Kleinere vormen, dezelfde manier van denken.</p>
        </header>
        <MoreWork />
      </section>

      <section className="shell outcomes-section" aria-labelledby="uitkomst-titel">
        <header className="projects__head">
          <h2 id="uitkomst-titel">Wat kan een idee worden?</h2>
          <p>Dat weet je niet altijd vooraf. De vorm volgt uit wat het idee nodig heeft. Juist iets technisch of ingewikkelds? Mooi. Daar begint het vaak.</p>
        </header>
        <Outcomes />
      </section>

      <section className="shell ww-section" id="werkwijze" aria-labelledby="werkwijze-titel">
        <header className="ww-section__head">
          <h2 id="werkwijze-titel">Zo werkt het.</h2>
          <p>Wat er bovenaan met je lijn gebeurde, is precies hoe het werkt.</p>
        </header>
        <Werkwijze />
      </section>

      <section className="shell prices" id="prijzen" aria-labelledby="prijzen-titel">
        <header className="prices__head">
          <h2 id="prijzen-titel">Wat kost zoiets?</h2>
          <p>Dat hangt af van wat het idee nodig heeft. Maar je hoeft niet eerst een offerte aan te vragen om enig idee van de prijs te krijgen.</p>
        </header>
        <PriceLine stops={HOME_STOPS} label="Van even samen denken tot echt maken" />
        <div className="prices__more">
          <p>Benieuwd naar de richtprijzen per vorm?</p>
          <div className="prices__cta">
            <Link className="ink-button" href="/prijzen/">Bekijk de richtprijzen</Link>
            <a className="link-draw link-draw--dot" href="#contact">Vertel je idee</a>
          </div>
        </div>
      </section>

      <section className="shell small" aria-labelledby="klein-titel">
        <figure className="small__photo">
          <Image src="/images/portret.jpg" width={600} height={750} sizes="(max-width: 760px) 260px, 360px"
            alt="De maker van Denckh aan tafel in een restaurant, armen over elkaar, kijkend naar de menukaart." />
        </figure>
        <div className="small__text">
          <h2 id="klein-titel">Denckh is klein. Bewust.</h2>
          <p>Ik ben Martijn. Elektrotechnisch opgeleid en al jaren aan het werk waar techniek en commercie elkaar raken: verlichting, lichtsturing en slimme gebouwen.</p>
          <p>Daardoor kijk ik van twee kanten naar een vraag: hoe werkt het echt, en hoe maak je het zo eenvoudig dat een ander het begrijpt, gebruikt of kan verkopen? Soms wordt dat een interactieve uitleg, een prototype, een tool of een presentatie. Soms iets fysieks. En soms gewoon een goede website.</p>
          <p>Je werkt rechtstreeks met mij: degene die meedenkt én maakt.</p>
          <p>Naast Denckh maak ik Deegh, ambachtelijk pizzadeeg. Ook dat begon als een idee.</p>
        </div>
      </section>

      <div className="shell"><InkRule /></div>

      <section className="shell contact" id="contact" aria-labelledby="contact-titel">
        <h2 id="contact-titel">En wat zit er bij jou in je hoofd?</h2>
        <p className="contact__lead">Het hoeft nog geen plan te zijn. Een half idee, een vraag of een probleem is genoeg om mee te beginnen.</p>
        <ContactReturn />
      </section>

      <div className="shell"><Footer /></div>
    </main>
  );
}
