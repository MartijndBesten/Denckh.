// End-to-end controle van de interactieve kern en de rest van de homepage.
// Gebruik: npm run build && npx http-server out -p 8711 -s  (tweede terminal)  →  node tests/interaction.mjs
// Vereist Playwright (globaal of via npx). Geen testdata verlaat de browser.
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:8711/";
const results = [];
const check = (name, ok, detail = "") => { results.push({ name, ok, detail }); console.log(`${ok ? "OK  " : "FAIL"} ${name}${detail ? ` · ${detail}` : ""}`); };

async function page(browser, { width = 1440, height = 900, mobile = false, reduced = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile, reducedMotion: reduced ? "reduce" : "no-preference" });
  const p = await ctx.newPage();
  const errors = [];
  p.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(BASE, { waitUntil: "networkidle" });
  await p.waitForTimeout(500);
  return { p, ctx, errors };
}

async function drawCircle(p, touch = false, ctx = null) {
  const dot = await p.locator(".punt__dot").boundingBox();
  const zone = await p.locator(".punt__zone").boundingBox();
  const cx = zone.x + zone.width / 2, cy = zone.y + zone.height / 2, r = Math.min(zone.width, zone.height) * 0.3;
  const pts = Array.from({ length: 61 }, (_, i) => [cx + Math.cos((i / 60) * Math.PI * 2) * r, cy + Math.sin((i / 60) * Math.PI * 2) * r]);
  const sx = dot.x + dot.width / 2, sy = dot.y + dot.height / 2;
  if (touch) {
    const cdp = await ctx.newCDPSession(p);
    const t = (type, x, y) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: type === "touchEnd" ? [] : [{ x, y }] });
    await t("touchStart", sx, sy);
    for (const [x, y] of pts) { await t("touchMove", x, y); await p.waitForTimeout(10); }
    await t("touchEnd", 0, 0);
  } else {
    await p.mouse.move(sx, sy); await p.mouse.down();
    for (const [x, y] of pts) { await p.mouse.move(x, y, { steps: 2 }); await p.waitForTimeout(6); }
    await p.mouse.up();
  }
}

const browser = await chromium.launch();

// 1 · desktop: tekenen → kijken → lezen → vorm
{
  const { p, ctx, errors } = await page(browser);
  check("hero: punt staat in de kop", (await p.locator(".punt--idle").count()) === 1);
  const ghost = await p.locator(".punt__ghost").getAttribute("d");
  check("hero: hulplijn is de Denckh-krul (vier bochten na de aanloop)", (ghost?.match(/C /g) ?? []).length === 5, `${(ghost?.match(/C /g) ?? []).length} bochten`);
  check("hero: favicon en OG-beeld ongewijzigd", (await p.locator('link[rel="icon"]').getAttribute("href")) === "/favicon.svg" && (await p.locator('meta[property="og:image"]').getAttribute("content")) === "https://denckh.nl/og.png");
  await drawCircle(p);
  check("hero: hulplijn verdwijnt zodra je tekent", (await p.locator(".punt__ghost").count()) === 0);
  await p.waitForTimeout(400);
  check("kijken: meetlijnen verschijnen", (await p.locator(".punt__look .look-line").count()) >= 4);
  await p.waitForTimeout(1800);
  const say = await p.locator(".punt__say").textContent();
  check("lezen: cirkel wordt als bediening gelezen", /rond/i.test(say ?? ""), say ?? "");
  await p.getByRole("button", { name: "Zal ik er vorm aan geven?" }).click();
  await p.waitForTimeout(1500);
  const slider = p.getByRole("slider", { name: "Draaiknop" });
  check("vorm: draaiknop is bedienbaar element", (await slider.count()) === 1);
  await slider.focus(); await p.keyboard.press("ArrowRight"); await p.keyboard.press("ArrowRight");
  check("vorm: draaiknop reageert op toetsen", (await slider.getAttribute("aria-valuenow")) === "44");
  await p.fill("#punt-idee", "een uitleg bij een machine");
  await p.getByRole("button", { name: "Vertel", exact: true }).click();
  check("vraag: voorbeeldreactie noemt het idee", /een uitleg bij een machine/.test((await p.locator(".punt__reply").textContent()) ?? ""));
  await p.waitForTimeout(900);
  check("idee: vorm krijgt een kader met onderwerp", ((await p.locator(".idea-title").textContent()) ?? "") === "Machine");
  check("idee: knop regelt iets uit het idee", /detailniveau/.test((await slider.getAttribute("aria-valuetext")) ?? ""), (await slider.getAttribute("aria-valuetext")) ?? "");
  check("idee: drie aantekeningen bij drie delen", (await p.locator(".punt__notes li").count()) === 3);
  await p.fill("#punt-idee", "een webshop voor mijn bakkerij");
  await p.getByRole("button", { name: "Vertel", exact: true }).click();
  await p.waitForTimeout(300);
  check("idee: ander idee, andere vorm", ((await p.locator(".idea-title").textContent()) ?? "") === "Bakkerij" && /aantal/.test((await slider.getAttribute("aria-valuetext")) ?? ""));
  const mail = decodeURIComponent((await p.locator(".contact-return__form").getAttribute("data-mailto")) ?? "");
  check("mail: concreet voorstel gaat mee", /Wat het zou kunnen worden:/.test(mail) && /webshop voor mijn bakkerij/.test(mail), mail.slice(0, 80));
  const href = await p.locator(".contact-return__form").evaluate((f) => f.closest("section") !== null);
  check("contact: sectie aanwezig", href);
  const sketchNote = await p.locator(".contact-return__sketch").count();
  check("contact: jouw schets reist mee", sketchNote === 1);
  const wm = await p.locator(".site-header .wordmark__dot").getAttribute("data-kind");
  check("woordmerk: punt neemt de vorm aan", wm === "knop", wm ?? "");
  check("desktop: geen console-errors", errors.length === 0, errors.join(" | "));
  await ctx.close();
}

// 1b · ideeënkaart: één korte vraag bij een aangeraakt punt
{
  const { p, ctx } = await page(browser);
  const dot = await p.locator(".punt__dot").boundingBox(); const zone = await p.locator(".punt__zone").boundingBox();
  const cx = zone.x + zone.width / 2, cy = zone.y + zone.height / 2, r = Math.min(zone.width, zone.height) * 0.25;
  await p.mouse.move(dot.x + dot.width / 2, dot.y + dot.height / 2); await p.mouse.down();
  for (let i = 0; i <= 160; i++) { const t = (i / 160) * Math.PI * 6; await p.mouse.move(cx + Math.cos(t) * r * (0.5 + 0.5 * Math.sin(i / 13)) + (i - 80) * 1.2, cy + Math.sin(t * 1.3) * r * 0.8, { steps: 1 }); await p.waitForTimeout(3); }
  await p.mouse.up(); await p.waitForTimeout(2300);
  await p.getByRole("button", { name: "Zal ik er vorm aan geven?" }).click(); await p.waitForTimeout(1600);
  const kern = p.getByRole("button", { name: "de kern" });
  check("kaart: krabbel wordt een kaart met 'de kern'", (await kern.count()) === 1);
  if (await kern.count()) { await kern.click(); await p.waitForTimeout(200); }
  check("kaart: aanraken toont één korte vraag", ((await p.locator(".punt__say").textContent()) ?? "") === "Is dit waar het eigenlijk om draait?");
  await ctx.close();
}

// 2 · toetsenbord: Enter pakt de punt, pijltjes tekenen, Enter laat los
{
  const { p, ctx, errors } = await page(browser);
  await p.locator(".punt__dot").focus();
  await p.keyboard.press("Enter");
  for (let i = 0; i < 12; i++) await p.keyboard.press("ArrowRight");
  for (let i = 0; i < 4; i++) await p.keyboard.press("ArrowDown");
  await p.keyboard.press("Enter");
  await p.waitForTimeout(2300);
  check("toetsenbord: tekenen en loslaten werkt", (await p.locator(".punt__say").count()) === 1, (await p.locator(".punt__say").textContent()) ?? "");
  check("toetsenbord: geen console-errors", errors.length === 0, errors.join(" | "));
  await ctx.close();
}

// 3 · voorbeeld afspelen
{
  const { p, ctx } = await page(browser);
  await p.getByRole("button", { name: "of bekijk een voorbeeld" }).click();
  await p.waitForTimeout(3500);
  const exSay = (await p.locator(".punt__say").textContent()) ?? "";
  check("voorbeeld: één rustige cirkel, gelezen als rond en gesloten", /rond/i.test(exSay), exSay);
  await ctx.close();
}

// 4 · mobiel met touch
{
  const { p, ctx, errors } = await page(browser, { width: 390, height: 844, mobile: true });
  const before = await p.evaluate(() => scrollY);
  await drawCircle(p, true, ctx);
  await p.waitForTimeout(400);
  check("touch: tekenen scrolt de pagina niet", (await p.evaluate(() => scrollY)) === before);
  await p.waitForTimeout(1800);
  check("touch: lezing verschijnt", (await p.locator(".punt__say").count()) === 1);
  check("mobiel: geen console-errors", errors.length === 0, errors.join(" | "));
  await ctx.close();
}

// 5 · reduced motion: geen ademende punt, titels recht
{
  const { p, ctx } = await page(browser, { reduced: true });
  const anim = await p.locator(".punt__dot").evaluate((el) => getComputedStyle(el, "::after").animationName);
  check("reduced motion: punt ademt niet", anim === "none", anim);
  await p.locator("#idee-titel").scrollIntoViewIfNeeded();
  const rot = await p.locator(".settle__ch").first().evaluate((el) => getComputedStyle(el).getPropertyValue("--rot"));
  check("reduced motion: letters staan recht", /^0(deg)?$/.test(rot.trim()), rot);
  await ctx.close();
}

// 6 · projecten: vormen starten pas als het beeld in zicht is, stappen zijn klikbaar
{
  const { p, ctx, errors } = await page(browser, { width: 390, height: 844, mobile: true });
  const fig = p.locator(".construct").first();
  const box = await fig.evaluate((el) => { const r = el.getBoundingClientRect(); return { top: r.top + scrollY, h: r.height }; });
  await p.evaluate(({ top, h }) => scrollTo(0, top + h / 2 - innerHeight * 0.8), box);
  await p.waitForTimeout(400);
  check("construct: nog een lijn zolang het beeld binnenkomt", (await fig.locator(".construct__line.is-sketch").count()) === 1);
  await p.evaluate(({ top, h }) => scrollTo(0, top + h / 2 - innerHeight * 0.55), box);
  await p.waitForTimeout(900);
  const merk = fig.getByRole("button", { name: "een merk" });
  await merk.click();
  await p.waitForTimeout(1200);
  check("construct: stap is klikbaar", (await merk.getAttribute("aria-current")) === "step");
  check("construct: Deegh-logo in de stap merk", (await fig.locator(".construct__details.is-on image").count()) === 1);
  for (let i = 0; i < 3; i++) { await p.locator(".more__item").nth(i).scrollIntoViewIfNeeded(); await p.waitForTimeout(300); }
  await p.waitForTimeout(1200);
  check("ook gemaakt: drie vormen krijgen vorm", (await p.locator(".more__details").count()) === 3);
  check("projecten: geen console-errors", errors.length === 0, errors.join(" | "));
  await ctx.close();
}

// 6b · desktop: stappen reageren al als je eroverheen gaat
{
  const { p, ctx } = await page(browser);
  const fig = p.locator(".construct").first();
  await fig.evaluate((el) => { const r = el.getBoundingClientRect(); scrollTo({ top: r.top + scrollY + r.height / 2 - innerHeight * 0.6, behavior: "instant" }); });
  await p.waitForTimeout(500);
  const shop = fig.getByRole("button", { name: "een plek om te bestellen" });
  await shop.hover();
  await p.waitForTimeout(1300);
  check("construct: stap verandert al bij aanwijzen", (await shop.getAttribute("aria-current")) === "step");
  await ctx.close();
}

// 6c · logo-lab: interne proef, niet vindbaar
{
  const ctx = await browser.newContext();
  const p = await ctx.newPage();
  await p.goto(new URL("logo-lab/", BASE).href, { waitUntil: "networkidle" });
  check("logo-lab: noindex", /noindex/.test((await p.locator('meta[name="robots"]').getAttribute("content")) ?? ""));
  check("logo-lab: vijf merkproeven en de favicon-vergelijking", (await p.locator(".lab__row:not(.lab__row--old)").count()) === 5 && (await p.locator('img[src="/favicon-krul.svg"]').count()) === 4);
  const sitemap = await (await p.request.get(new URL("sitemap.xml", BASE).href)).text();
  check("logo-lab: niet in de sitemap", !sitemap.includes("logo-lab"));
  await ctx.close();
}

// 7 · geen horizontale overflow
for (const width of [320, 390, 768, 1024, 1440]) {
  const { p, ctx } = await page(browser, { width, height: 800, mobile: width < 500 });
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  check(`geen horizontale overflow op ${width}px`, ov <= 0, `${ov}px`);
  await ctx.close();
}

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} controles geslaagd`);
process.exit(failed.length ? 1 : 0);
