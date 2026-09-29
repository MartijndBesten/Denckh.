import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
const p = await ctx.newPage();
await p.goto("http://localhost:8711/", { waitUntil: "networkidle" });
await p.getByRole("button", { name: "of bekijk een voorbeeld" }).tap();
for (let i = 0; i < 4; i++) {
  await p.waitForTimeout(3600);
  console.log(i, await p.locator(".look-text").textContent(), "|", await p.locator(".punt__say").textContent());
  await p.locator(".punt").screenshot({ path: `/tmp/claude-0/-home-user-Denckh-/159404e6-fe2a-5c35-b8c4-0790811bf13e/scratchpad/shots/mob-ex-${i}.png` });
  await p.getByRole("button", { name: "nog een voorbeeld" }).tap();
}
await b.close();
