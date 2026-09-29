import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";

function subscribe(l: () => void) {
  const m = window.matchMedia(query);
  m.addEventListener("change", l);
  return () => m.removeEventListener("change", l);
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}
