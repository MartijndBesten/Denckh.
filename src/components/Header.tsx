import Link from "next/link";

type HeaderProps = {
  compact?: boolean;
};

export function Wordmark() {
  return (
    <span className="wordmark" aria-label="denckh, van idee naar vorm">
      denckh<span className="wordmark__dot">.</span>
      <span className="wordmark__tagline">van idee naar vorm</span>
    </span>
  );
}

export function Header({ compact = false }: HeaderProps) {
  return (
    <header className={`site-header${compact ? " site-header--compact" : ""}`}>
      <Link className="brand-link" href="/" aria-label="Naar de homepage van denckh">
        <Wordmark />
      </Link>
      <nav aria-label="Hoofdnavigatie">
        <a href="/#projecten">Projecten</a>
        <a href="/#werkwijze">Werkwijze</a>
        <a href="/#contact">Vertel het me</a>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <Wordmark />
        <p>Een kleine conceptstudio voor ideeën die vorm mogen krijgen.</p>
      </div>
      <div className="footer-links">
        <a href="/#projecten">Projecten</a>
        <a href="/#contact">Contact</a>
        <Link href="/privacy/">Privacy</Link>
      </div>
      <p className="footer-note">Zonder tracking. Zonder cookie-banner.</p>
    </footer>
  );
}
