import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/projecten/deegh/", "/privacy/"];
  return routes.map((route) => ({ url: `https://denckh.nl${route}`, lastModified: new Date("2026-09-29") }));
}
