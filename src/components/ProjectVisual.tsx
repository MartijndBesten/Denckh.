type ProjectVisualProps = {
  kind: "deegh" | "koffer" | "loflijn";
};

export function ProjectVisual({ kind }: ProjectVisualProps) {
  if (kind === "deegh") {
    return (
      <div className="project-visual project-visual--deegh" aria-hidden="true">
        <span className="visual-label">een product</span>
        <span className="visual-node visual-node--one" />
        <span className="visual-node visual-node--two" />
        <span className="visual-node visual-node--three" />
        <span className="visual-line visual-line--one" />
        <span className="visual-line visual-line--two" />
        <span className="visual-note">→ een plek om te kiezen, te leren en te bestellen</span>
      </div>
    );
  }

  if (kind === "koffer") {
    return (
      <div className="project-visual project-visual--koffer" aria-hidden="true">
        <span className="koffer-box"><i /><i /><i /><i /></span>
        <span className="koffer-route koffer-route--one" />
        <span className="koffer-route koffer-route--two" />
        <span className="visual-note">fysiek → digitaal → begrijpelijk</span>
      </div>
    );
  }

  return (
    <div className="project-visual project-visual--loflijn" aria-hidden="true">
      <span className="loflijn-track" />
      <span className="loflijn-card loflijn-card--one">1</span>
      <span className="loflijn-card loflijn-card--two">2</span>
      <span className="loflijn-card loflijn-card--three">3</span>
      <span className="visual-note">een spel krijgt een plek online</span>
    </div>
  );
}
