import Link from "next/link";
import { Wordmark } from "./Wordmark";

type HeaderProps = {
  compact?: boolean;
};

export function Header({ compact = false }: HeaderProps) {
  return (
    <header className={`site-header${compact ? " site-header--compact" : ""}`}>
      <Link className="brand-link" href="/" aria-label="denckh, naar de homepage">
        <Wordmark />
        <span className="brand-link__tagline" aria-hidden="true">van idee naar vorm</span>
      </Link>
      <nav aria-label="Hoofdnavigatie">
        <Link className="link-draw" href="/#projecten">Projecten</Link>
        <Link className="link-draw" href="/#werkwijze">Werkwijze</Link>
        <Link className="link-draw link-draw--dot" href="/#contact">Vertel het me</Link>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__brand">
        <Wordmark living={false} />
        <p>Een kleine conceptstudio. Van idee naar vorm.</p>
      </div>
      <div className="footer-links">
        <Link className="link-draw" href="/#projecten">Projecten</Link>
        <Link className="link-draw" href="/prijzen/">Prijzen</Link>
        <a className="link-draw" href="mailto:info@denckh.nl">info@denckh.nl</a>
        <Link className="link-draw" href="/privacy/">Privacy</Link>
      </div>
      <p className="footer-note">Denckh · Vlierweg 54, Houten · KvK 83176896 · btw NL003791952B15</p>
      <p className="footer-note">Geen tracking, geen cookies. Je schets blijft in je eigen browser.</p>
    </footer>
  );
}
