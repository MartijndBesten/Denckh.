import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Footer, Header } from "@/components/Header";
import { IdeaCanvas } from "@/components/IdeaCanvas";
import { ProjectVisual } from "@/components/ProjectVisual";

const outcomes = ["website", "prototype", "interactieve demo", "webshop", "spel", "presentatie", "tool", "visualisatie"];

export default function Home() {
  return (
    <main id="inhoud">
      <section className="hero section-shell">
        <Header />
        <div className="hero__grid">
          <div className="hero__copy">
            <p className="eyebrow">kleine conceptstudio</p>
            <h1>Heb je een idee?<br /><em>Mooi.</em></h1>
            <p className="hero__intro">Het hoeft nog geen plan te zijn. Denckh denkt mee en maakt het concreet: iets dat je kunt zien, testen, laten zien of gebruiken.</p>
            <a className="text-link" href="#projecten">Bekijk wat al vorm kreeg <span aria-hidden="true">↓</span></a>
          </div>
          <IdeaCanvas />
        </div>
      </section>

      <section className="idea-section section-shell" aria-labelledby="idee-title">
        <div className="section-marker" aria-hidden="true"><span />01</div>
        <div className="idea-section__copy">
          <p className="eyebrow">van idee naar vorm</p>
          <h2 id="idee-title">Soms begint het met<br />een los punt.</h2>
          <p>Soms weet je precies wat je wilt. Soms heb je alleen een gedachte waarvan je denkt: hier zit iets in.</p>
          <p>Denckh maakt zo&apos;n gedachte scherper en geeft hem een eerste vorm. Van website tot prototype. Van interactieve uitleg tot iets waarvoor nog geen goede naam bestaat.</p>
        </div>
        <div className="idea-line" aria-hidden="true">
          <span className="idea-line__point" />
          <svg viewBox="0 0 580 370" preserveAspectRatio="none"><path d="M24 19 C92 98 120 168 220 133 S365 82 393 208 S494 337 557 329" /></svg>
          <span className="idea-line__shape" />
        </div>
      </section>

      <section className="projects section-shell" id="projecten" aria-labelledby="projecten-title">
        <div className="projects__heading">
          <div className="section-marker" aria-hidden="true"><span />02</div>
          <div>
            <p className="eyebrow">niet alleen websites</p>
            <h2 id="projecten-title">Dingen die al<br />vorm kregen.</h2>
          </div>
          <p>Geen verzonnen resultaten. Wel concrete vormen, elk begonnen met een ander soort idee.</p>
        </div>

        <article className="project project--deegh">
          <ProjectVisual kind="deegh" />
          <div className="project__copy">
            <p className="project__index">01 · eigen product</p>
            <h3>Deegh</h3>
            <p className="project__lead">Een product kreeg een merk, uitleg en een plek om te bestellen.</p>
            <dl>
              <div><dt>Idee</dt><dd>Ambachtelijk pizzadeeg dat ook online een helder verhaal nodig heeft.</dd></div>
              <div><dt>Vorm</dt><dd>Een webshop met producten, bereiding, recepten, verkooppunten en een route voor zakelijk bestellen.</dd></div>
            </dl>
            <Link className="text-link" href="/projecten/deegh/">Bekijk de case <span aria-hidden="true">↗</span></Link>
          </div>
        </article>

        <article className="project project--koffer">
          <ProjectVisual kind="koffer" />
          <div className="project__copy">
            <p className="project__index">02 · interactieve uitleg</p>
            <h3>Een demokoffer die meer vertelt.</h3>
            <p className="project__lead">Complexe techniek wordt geen brochure, maar iets dat je kunt verkennen.</p>
            <dl>
              <div><dt>Idee</dt><dd>Een fysieke demokoffer ondersteunen met een digitale route, bediening en demonstratiemodus.</dd></div>
              <div><dt>Vorm</dt><dd>Een meertalige, offline te gebruiken interactieve gids met koffer, stappen en presentatieflow.</dd></div>
            </dl>
            <p className="project__note">Naam, beelden en volledige case worden pas gepubliceerd met toestemming.</p>
          </div>
        </article>

        <article className="project project--loflijn">
          <ProjectVisual kind="loflijn" />
          <div className="project__copy">
            <p className="project__index">03 · spel en verkoop</p>
            <h3>Een spel vindt<br />zijn plek online.</h3>
            <p className="project__lead">Een fysiek muziekspel krijgt uitleg, ritme en een kooproute.</p>
            <dl>
              <div><dt>Idee</dt><dd>Een spel rond christelijke muziek begrijpelijk maken voor wie het voor het eerst ziet.</dd></div>
              <div><dt>Vorm</dt><dd>Een online winkelervaring met speluitleg, oefenmoment en productinformatie.</dd></div>
            </dl>
            <p className="project__note">Beeldmateriaal en de uitgebreide case volgen wanneer de rechten zijn bevestigd.</p>
          </div>
        </article>
      </section>

      <section className="outcomes section-shell" aria-labelledby="uitkomst-title">
        <div className="section-marker" aria-hidden="true"><span />03</div>
        <div className="outcomes__copy">
          <p className="eyebrow">wat er kan ontstaan</p>
          <h2 id="uitkomst-title">Het middel volgt<br />het idee.</h2>
          <p>Niet andersom.</p>
        </div>
        <div className="outcomes__words" aria-label={`Mogelijke vormen: ${outcomes.join(", ")}. Of iets waar nog geen naam voor is.`}>
          {outcomes.map((outcome, index) => <span key={outcome} style={{ "--word-index": index } as React.CSSProperties}>{outcome}</span>)}
          <strong>Of iets waar nog geen naam voor is.</strong>
        </div>
      </section>

      <section className="process section-shell" id="werkwijze" aria-labelledby="werkwijze-title">
        <div className="process__heading">
          <div className="section-marker section-marker--light" aria-hidden="true"><span />04</div>
          <p className="eyebrow eyebrow--light">zo werkt het</p>
          <h2 id="werkwijze-title">Niet groot doen.<br />Wel goed beginnen.</h2>
        </div>
        <ol className="process__steps">
          <li><span>01</span><h3>Vertel</h3><p>Je hoeft nog geen briefing van twintig pagina&apos;s te hebben. Een gedachte is genoeg.</p></li>
          <li><span>02</span><h3>Denckh</h3><p>We onderzoeken, denken en proberen tot het idee scherp genoeg is om te maken.</p></li>
          <li><span>03</span><h3>Vorm</h3><p>Er ontstaat iets dat je kunt bekijken, testen, laten zien of gebruiken.</p></li>
        </ol>
      </section>

      <section className="small section-shell" aria-labelledby="klein-title">
        <div className="small__graphic" aria-hidden="true"><span /><i /><b /></div>
        <div>
          <p className="eyebrow">klein, bewust</p>
          <h2 id="klein-title">Je werkt rechtstreeks met degene die meedenkt én maakt.</h2>
          <p>Geen doorgeefluik. Geen groot verhaal. Gewoon aandacht voor wat er in je hoofd zit — en voor wat het kan worden.</p>
        </div>
      </section>

      <section className="contact section-shell" id="contact" aria-labelledby="contact-title">
        <div className="contact__heading">
          <div className="section-marker" aria-hidden="true"><span />05</div>
          <p className="eyebrow">jouw idee is het volgende punt</p>
          <h2 id="contact-title">Heb je iets<br />in je hoofd?</h2>
          <p>Het hoeft nog niet af te zijn.</p>
        </div>
        <ContactForm />
      </section>
      <div className="section-shell"><Footer /></div>
    </main>
  );
}
