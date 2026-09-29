import Link from "next/link";
import { Header } from "@/components/Header";

export default function NotFound() {
  return (
    <main className="section-shell not-found" id="inhoud">
      <Header compact />
      <p className="eyebrow">404</p>
      <h1>Dit punt bestaat<br /><em>nog niet.</em></h1>
      <Link className="button button--dark" href="/">Terug naar het begin</Link>
    </main>
  );
}
