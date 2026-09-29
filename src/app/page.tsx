import styles from "./coming-soon.module.css";

export default function Home() {
  return (
    <main id="inhoud" className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand} aria-label="Denckh, van idee naar vorm">
          <span className={styles.wordmark}>denckh<span className={styles.dot}>.</span></span>
          <span className={styles.tagline}>van idee naar vorm</span>
        </div>
        <span className={styles.status}>in de maak</span>
      </header>

      <section className={styles.hero} aria-labelledby="coming-soon-title">
        <div className={styles.copy}>
          <p className={styles.kicker}>Een nieuw idee krijgt vorm.</p>
          <h1 id="coming-soon-title">
            Er zit iets<br />
            in mijn hoofd<span className={styles.dot}>.</span>
          </h1>
          <p className={styles.lead}>
            Denckh denkt, probeert en maakt. Van een eerste gedachte naar iets
            dat je kunt zien, testen of gebruiken.
          </p>
          <p className={styles.soon}>Binnenkort meer.</p>
        </div>

        <div className={styles.canvas} aria-hidden="true">
          <span className={styles.canvasLabel}>idee</span>
          <svg className={styles.sketch} viewBox="0 0 620 520" role="presentation">
            <path
              className={styles.pathGhost}
              d="M91 100 C166 103 169 210 238 218 C318 227 312 124 390 137 C471 151 442 274 511 289 C561 300 565 361 515 390 C465 419 389 386 353 423"
            />
            <path
              className={styles.path}
              pathLength="1"
              d="M91 100 C166 103 169 210 238 218 C318 227 312 124 390 137 C471 151 442 274 511 289 C561 300 565 361 515 390 C465 419 389 386 353 423"
            />
          </svg>
          <span className={styles.ideaDot} />
          <span className={styles.form}>
            <i />
          </span>
          <span className={styles.formLabel}>vorm</span>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>denckh.nl</span>
        <span>© 2026 Denckh</span>
      </footer>
    </main>
  );
}
