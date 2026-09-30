// End-to-end controle van de interactieve kern en de rest van de homepage.
// Gebruik: npm run build && npx http-server out -p 8711 -s  (tweede terminal)  →  node tests/interaction.mjs
// Vereist Playwright (globaal of via npx). Geen testdata verlaat de browser.
import { chromium } from "playwright";
import crypto from "node:crypto";
import fs from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:8711/";
const results = [];
const check = (name, ok, detail = "") => { results.push({ name, ok, detail }); console.log(`${ok ? "OK  " : "FAIL"} ${name}${detail ? ` · ${detail}` : ""}`); };

async function page(browser, { width = 1440, height = 900, mobile = false, reduced = false, path = "" } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile, reducedMotion: reduced ? "reduce" : "no-preference" });
  const p = await ctx.newPage();
  const errors = [];
  p.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(new URL(path, BASE).href, { waitUntil: "networkidle" });
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
  check("hero: goedgekeurde intro", /Weet je nog niet wat het moet worden\? Ook goed\./.test((await p.locator(".punt__intro").textContent()) ?? ""));
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

// 3b · voorbeeldreeks: elke klik tekent de volgende tekening, en dezelfde engine maakt er iets anders van
{
  const { p, ctx, errors } = await page(browser);
  const forms = [], inks = [];
  await p.getByRole("button", { name: "of bekijk een voorbeeld" }).click();
  for (let i = 0; i < 7; i++) {
    await p.waitForTimeout(3600);
    inks.push(await p.locator(".punt__ink").getAttribute("d"));
    await p.getByRole("button", { name: "Zal ik er vorm aan geven?" }).click();
    await p.waitForTimeout(1500);
    const kind = await p.locator(".punt__svg .fw").first().getAttribute("class");
    forms.push((kind ?? "").replace("fw fw--", ""));
    if (i === 1) { // regelaar: echt schuifbaar
      const s = p.getByRole("slider", { name: "Regelaar" }); await s.focus(); await p.keyboard.press("ArrowRight");
      check("voorbeelden: regelaar is echt schuifbaar", (await s.getAttribute("aria-valuenow")) === "52");
    }
    if (i === 4) { // kaart: punten echt aanklikbaar, met één korte vraag
      const kern = p.getByRole("button", { name: "de kern" });
      if (await kern.count()) await kern.click();
      check("voorbeelden: kaartpunten zijn aanklikbaar", /\?$/.test((await p.locator(".punt__say").textContent()) ?? ""));
    }
    if (i < 6) await p.getByRole("button", { name: "nog een voorbeeld" }).click();
  }
  check("voorbeelden: reeks laat zes verschillende kanten zien", forms.slice(0, 6).join(",") === "knob,slider,screen,chart,map,map", forms.join(","));
  check("voorbeelden: na de laatste weer de eerste", forms[6] === "knob", forms[6]);
  check("voorbeelden: elk voorbeeld heeft eigen geometrie", new Set(inks.slice(0, 6)).size === 6);
  check("voorbeelden: geen console-errors", errors.length === 0, errors.join(" | "));
  // eigen tekening daarna: voorbeeldstatus lekt niet
  await p.getByRole("button", { name: "Nog een idee" }).click();
  await p.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await p.waitForTimeout(300);
  const dot = await p.locator(".punt__dot").boundingBox(), zone = await p.locator(".punt__zone").boundingBox();
  await p.mouse.move(dot.x + dot.width / 2, dot.y + dot.height / 2); await p.mouse.down();
  for (let i = 0; i <= 40; i++) await p.mouse.move(zone.x + zone.width * (0.15 + 0.7 * (i / 40)), zone.y + zone.height * 0.5, { steps: 2 });
  await p.mouse.up(); await p.waitForTimeout(2300);
  check("eigen tekening na voorbeelden: eigen lezing, geen voorbeeldknop", /schaal|rechte/i.test((await p.locator(".punt__say").textContent()) ?? "") && (await p.getByRole("button", { name: "nog een voorbeeld" }).count()) === 0);
  await ctx.close();
}

// 3d · dezelfde reeks op mobiel (touch), ook op een smal scherm
for (const [w, h] of [[390, 844], [320, 640]]) {
  const { p, ctx, errors } = await page(browser, { width: w, height: h, mobile: true });
  const forms = [];
  await p.getByRole("button", { name: "of bekijk een voorbeeld" }).tap();
  for (let i = 0; i < 6; i++) {
    await p.waitForTimeout(3600);
    await p.getByRole("button", { name: "Zal ik er vorm aan geven?" }).tap();
    await p.waitForTimeout(1500);
    forms.push(((await p.locator(".punt__svg .fw").first().getAttribute("class")) ?? "").replace("fw fw--", ""));
    if (i < 5) await p.getByRole("button", { name: "nog een voorbeeld" }).tap();
  }
  check(`voorbeelden op ${w}px: dezelfde zes kanten`, forms.join(",") === "knob,slider,screen,chart,map,map", forms.join(","));
  check(`voorbeelden op ${w}px: geen overflow, geen errors`, (await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)) <= 0 && errors.length === 0, errors.join(" | "));
  await ctx.close();
}

// 3c · broncode: Deegh-voorbeeld volgt het echte logo, en de engine kent geen voorbeeld-uitzonderingen
{
  const ex = fs.readFileSync(new URL("../src/lib/ink/examples.ts", import.meta.url), "utf8");
  check("voorbeelden: Deegh-geometrie verwijst naar het echte logo", ex.includes("public/images/deegh-logo.png") && fs.existsSync(new URL("../public/images/deegh-logo.png", import.meta.url)) && /key: "deegh"/.test(ex));
  const engine = ["src/lib/ink/analyze.ts", "src/lib/ink/forms.ts", "src/lib/ink/interpret.ts", "src/lib/ink/concept.ts", "src/components/punt/PuntStage.tsx", "src/components/punt/FormWidget.tsx"]
    .map((f) => fs.readFileSync(new URL(`../${f}`, import.meta.url), "utf8")).join("\n");
  check("voorbeelden: geen Deegh- of voorbeeldspecifieke analyse in de engine", !/deegh/i.test(engine) && !/example\.key/.test(engine));
}

// 4 · mobiel met touch
{
  const { p, ctx, errors } = await page(browser, { width: 390, height: 844, mobile: true });
  await p.waitForTimeout(1500);
  const g = await p.locator(".punt__ghost").boundingBox(), hint = await p.locator(".punt__hint-main").boundingBox();
  check("mobiel: compacte hulplijn, 'begin met een punt' eerder in beeld", g.height < 420 && g.y + g.height < hint.y && hint.y < 700, `h ${Math.round(g.height)}, hint ${Math.round(hint.y)}`);
  const before = await p.evaluate(() => scrollY);
  await drawCircle(p, true, ctx);
  await p.waitForTimeout(400);
  check("touch: tekenen scrolt de pagina niet", (await p.evaluate(() => scrollY)) === before);
  await p.waitForTimeout(1800);
  check("touch: lezing verschijnt", (await p.locator(".punt__say").count()) === 1);
  check("mobiel: geen console-errors", errors.length === 0, errors.join(" | "));
  await ctx.close();
}

// 4b · mobiel: een tekening groter dan het vlak duwt de tekst omlaag; lijn, aantekeningen en tekst vallen niet over elkaar
{
  const { p, ctx, errors } = await page(browser, { width: 393, height: 852, mobile: true });
  const dot = await p.locator(".punt__dot").boundingBox(), zone = await p.locator(".punt__zone").boundingBox();
  const r = zone.width * 0.43, cx = zone.x + zone.width / 2, cy = zone.y + r + 20, sx = dot.x + dot.width / 2, sy = dot.y + dot.height / 2;
  const cdp = await ctx.newCDPSession(p);
  const t = (type, x, y) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: type === "touchEnd" ? [] : [{ x, y }] });
  await t("touchStart", sx, sy);
  for (let i = 1; i <= 20; i++) { await t("touchMove", sx, sy + (cy - r * 0.95 - sy) * (i / 20)); await p.waitForTimeout(8); }
  for (let i = 0; i <= 70; i++) { const a = -Math.PI * 0.6 + (i / 70) * Math.PI * 2; await t("touchMove", cx + Math.cos(a) * r, cy + Math.sin(a) * r); await p.waitForTimeout(8); }
  await t("touchEnd", 0, 0);
  await p.waitForTimeout(3500);
  const gap = await p.evaluate(() => { const look = document.querySelector(".punt__look").getBoundingClientRect(), say = document.querySelector(".punt__say").getBoundingClientRect(); return Math.round(say.top - look.bottom); });
  check("mobiel: grote tekening, tekst staat onder de aantekeningen", gap >= 8, `${gap}px ruimte`);
  const z = await p.evaluate(() => [".punt__copy", ".punt__svg"].map((q) => Number(getComputedStyle(document.querySelector(q)).zIndex)));
  check("hero: intro ligt boven de lijn (leesbaar)", z[0] > z[1], z.join(" > "));
  check("mobiel: grote tekening, geen console-errors", errors.length === 0, errors.join(" | "));
  await ctx.close();
}

// 4c · 320 px: na vorm en idee valt niets in het paneel buiten beeld (invulveld, knop, aantekeningen)
{
  const { p, ctx } = await page(browser, { width: 320, height: 700, mobile: true });
  await p.getByRole("button", { name: "of bekijk een voorbeeld" }).click();
  await p.waitForTimeout(6000);
  await p.getByRole("button", { name: "Zal ik er vorm aan geven?" }).click();
  await p.waitForTimeout(2500);
  await p.locator("#punt-idee").fill("een webshop voor mijn bakkerij");
  await p.getByRole("button", { name: "Vertel", exact: true }).click();
  await p.waitForTimeout(2000);
  const out = await p.evaluate(() => [...document.querySelectorAll(".punt__panel *")].filter((e) => e.getBoundingClientRect().right > innerWidth + 0.5).map((e) => e.className || e.tagName).slice(0, 4));
  check("320 px: paneel met idee past in beeld", out.length === 0, out.join(", "));
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
  check("construct: echt Deegh-logo (PNG), lijn maakt plaats", (await fig.locator('.construct__details.is-on image[href="/images/deegh-logo.png"]').count()) === 1 && (await fig.locator(".construct__line").evaluate((e) => getComputedStyle(e).opacity)) === "0");
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

// 6d · Deegh-eindbeeld: de menu-items schuiven nergens over elkaar, ook niet op een smal scherm
for (const [w, h, mobile] of [[320, 700, true], [393, 852, true], [1440, 900, false]]) {
  const { p, ctx } = await page(browser, { width: w, height: h, mobile });
  const fig = p.locator(".construct").first();
  await fig.evaluate((el) => { const r = el.getBoundingClientRect(); scrollTo({ top: r.top + scrollY + r.height / 2 - innerHeight * 0.5, behavior: "instant" }); });
  await p.waitForTimeout(600);
  await fig.getByRole("button", { name: /deegh\.nl/ }).click();
  await p.waitForTimeout(1500);
  const nav = await p.evaluate(() => {
    const t = [...document.querySelectorAll(".deegh-shot text")].slice(0, 5).map((e) => e.getBBox()), frame = document.querySelector(".deegh-shot path").getBBox();
    return { gaps: t.slice(1).map((b, i) => Math.round(b.x - (t[i].x + t[i].width))), over: Math.round(t[4].x + t[4].width - (frame.x + frame.width)) };
  });
  check(`deegh-eindbeeld op ${w}px: menu zonder overlap, binnen het kader`, nav.gaps.every((g) => g >= 4) && nav.over < 0, `ruimtes ${nav.gaps.join(",")} · rand ${nav.over}`);
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

// 7 · prijzen op de homepage: een lijn van €45 via €125 naar €295, geen prijskaarten
{
  const { p, ctx, errors } = await page(browser);
  const block = p.locator("#prijzen");
  check("prijsblok: kop en intro", ((await block.locator("h2").textContent()) ?? "") === "Wat kost zoiets?" && /hoeft niet eerst een offerte aan te vragen/.test((await block.locator(".prices__head p").textContent()) ?? ""));
  const stops = await block.locator(".pl__stop").evaluateAll((els) => els.map((e) => ({ label: e.querySelector(".pl__label")?.textContent, price: e.querySelector(".pl__price")?.textContent?.replace(/\s+/g, " ").trim() })));
  check("prijsblok: drie haltes in de goede volgorde", stops.map((s) => s.label).join(",") === "Eerst even Denckh,Eerste vorm,Echt maken", stops.map((s) => s.label).join(","));
  check("prijsblok: €45, vanaf €125, vanaf €295, alle excl. btw", stops.map((s) => s.price).join(" | ") === "€45 excl. btw | vanaf €125 excl. btw | vanaf €295 excl. btw", stops.map((s) => s.price).join(" | "));
  check("prijsblok: €45 wordt verrekend bij een opdracht vanaf €295", /Wordt het daarna een opdracht vanaf €295\? Dan verreken ik die €45\./.test((await block.locator(".pl__note").textContent()) ?? ""));
  check("prijsblok: links naar /prijzen/ en contact", (await block.getByRole("link", { name: "Bekijk de richtprijzen" }).getAttribute("href")) === "/prijzen/" && (await block.getByRole("link", { name: "Vertel je idee" }).getAttribute("href")) === "#contact");
  const line = block.locator(".pl__line path");
  await block.evaluate((el) => scrollTo({ top: el.getBoundingClientRect().top + scrollY - innerHeight * 1.2, behavior: "instant" }));
  await p.waitForTimeout(400);
  const before = Number(await line.evaluate((e) => getComputedStyle(e).strokeDashoffset.replace("px", "")));
  await p.locator(".pl").evaluate((el) => { const r = el.getBoundingClientRect(); scrollTo({ top: r.top + scrollY + r.height / 2 - innerHeight * 0.35, behavior: "instant" }); });
  await p.waitForTimeout(600);
  const after = Number(await line.evaluate((e) => getComputedStyle(e).strokeDashoffset.replace("px", "")));
  check("prijsblok: de lijn tekent zich bij het scrollen", before > 0.9 && after < 0.05, `${before.toFixed(2)} → ${after.toFixed(2)}`);
  check("prijsblok: alle drie haltes bereikt", (await block.locator(".pl__stop.is-reached").count()) === 3);
  await p.locator("#prijzen-titel").evaluate((el) => { el.tabIndex = -1; el.focus(); });
  await p.keyboard.press("Tab");
  check("prijsblok: toetsenbord gaat direct naar de richtprijzen", ((await p.evaluate(() => document.activeElement?.textContent)) ?? "") === "Bekijk de richtprijzen");
  check("footer: link naar prijzen", (await p.locator(".site-footer a[href='/prijzen/']").count()) === 1);
  check("prijsblok: geen console-errors", errors.length === 0, errors.join(" | "));
  await ctx.close();
}

// 7b · reduced motion: de prijslijn staat er meteen helemaal
{
  const { p, ctx } = await page(browser, { reduced: true });
  await p.locator("#prijzen").scrollIntoViewIfNeeded();
  await p.waitForTimeout(300);
  const off = Number(await p.locator("#prijzen .pl__line path").evaluate((e) => getComputedStyle(e).strokeDashoffset.replace("px", "")));
  check("reduced motion: prijslijn meteen getekend", off === 0 && (await p.locator("#prijzen .pl__stop.is-reached").count()) === 3, String(off));
  await ctx.close();
}

const dotOffset = (p) => p.evaluate(() => { const n = document.querySelector(".fp__row.is-on .fp__name").getBoundingClientRect(), d = document.querySelector(".fp__dot").getBoundingClientRect(); return Math.round(Math.abs(n.top + n.height / 2 - (d.top + d.height / 2))); });

// 8 · /prijzen/: richtprijzen per vorm
{
  const prices = { "Visual / eerste vorm": 125, "Presentatie": 195, "Prototype": 295, "Spel / spelconcept": 295, "Website": 295, "Interactieve uitleg / tool": 395, "Interactieve demo": 495, "Uitgebreidere website": 495, "Webshop": 595, "Uitgebreidere webshop": 795, "Iets zonder naam": 95 };
  const { p, ctx, errors } = await page(browser, { path: "prijzen/" });
  check("prijzen: titel en beschrijving", (await p.title()) === "Prijzen · Denckh" && /€45/.test((await p.locator('meta[name="description"]').getAttribute("content")) ?? ""), await p.title());
  check("prijzen: canonical", (await p.locator('link[rel="canonical"]').getAttribute("href")) === "https://denckh.nl/prijzen/");
  check("prijzen: kop", ((await p.locator("h1").textContent()) ?? "") === "Wat kan een idee kosten?");
  const rows = await p.locator(".fp__row").evaluateAll((els) => els.map((e) => ({ name: e.querySelector(".fp__name")?.textContent, price: e.querySelector(".fp__price")?.textContent?.replace(/\s+/g, " ").trim(), domain: !!e.querySelector(".fp__domain"), aside: e.querySelector(".fp__aside")?.textContent ?? "" })));
  const wrong = rows.filter((r) => r.price !== `vanaf €${prices[r.name]}`);
  check("prijzen: elf vormen met de juiste vanafprijs", rows.length === 11 && wrong.length === 0, wrong.map((r) => `${r.name}: ${r.price}`).join(", ") || `${rows.length} rijen`);
  check("prijzen: vermelding exclusief btw bij de vormen", /Alle bedragen zijn vanafprijzen, exclusief btw\./.test(await p.locator("#vormen-titel + p").textContent() ?? ""));
  check("prijzen: domeinnaam bij alle websites en webshops", rows.filter((r) => r.domain).map((r) => r.name).join(",") === "Website,Uitgebreidere website,Webshop,Uitgebreidere webshop");
  check("prijzen: domeinnaam tot maximaal €20 excl. btw", /eerste jaar inbegrepen, tot maximaal €20 excl\. btw\./.test((await p.locator(".fp__domain").first().textContent()) ?? ""));
  check("prijzen: €95 is anders dan Even Denckh", /Anders dan Even Denckh/.test(rows.find((r) => r.name === "Iets zonder naam")?.aside ?? ""));
  const start = await p.locator(".pl__stop").evaluateAll((els) => els.map((e) => `${e.querySelector(".pl__label")?.textContent}: ${e.querySelector(".pl__price")?.textContent?.replace(/\s+/g, " ").trim()}`));
  check("prijzen: kennismaken, Even Denckh, project", start.join(" | ") === "Kennismaken: vrijblijvend circa 20 minuten | Even Denckh: €45 excl. btw · 60 minuten | Project: vaste prijs vooraf afgesproken", start.join(" | "));
  const body = (await p.locator("main").textContent()) ?? "";
  check("prijzen: meerwerk na overleg, geen uurtarief op de site", /Iets extra nodig\?/.test(body) && /Je hoort vooraf wat het extra kost\./.test(body) && !/per uur/.test(body));
  check("prijzen: webadres op eigen naam, hosting niet standaard", /komt op jouw naam/.test(body) && /Hosting zit er niet standaard bij\./.test(body));
  check("prijzen: standaard en niet standaard", (await p.locator(".scope-list--in li").count()) === 6 && (await p.locator("#niet-titel + ul li").count()) === 12);
  const pdf = fs.existsSync(new URL("../public/downloads/denckh-prijslijst.pdf", import.meta.url));
  check("prijzen: pdf-link alleen als het bestand er is", (await p.getByRole("link", { name: "Download de prijslijst" }).count()) === (pdf ? 1 : 0), pdf ? "pdf aanwezig" : "nog geen pdf");
  if (pdf) {
    const res = await p.request.get(new URL("downloads/denckh-prijslijst.pdf", BASE).href);
    const body = await res.body();
    check("prijslijst: pdf wordt echt geleverd", res.ok() && body.subarray(0, 5).toString() === "%PDF-" && body.length < 1024 * 1024, `${res.status()} · ${Math.round(body.length / 1024)} KB`);
    const hash = crypto.createHash("sha256").update(fs.readFileSync(new URL("../src/lib/prices.ts", import.meta.url))).digest("hex");
    check("prijslijst: gemaakt uit de huidige prijzen (anders: npm run prijslijst)", fs.readFileSync(new URL("../scripts/prijslijst.bron.txt", import.meta.url), "utf8").startsWith(hash));
  }
  check("prijzen: vertel je idee naar contact", (await p.getByRole("link", { name: "Vertel je idee" }).getAttribute("href")) === "/#contact");
  check("prijzen: geen gedachtestreepjes en geen 'wij'", !/[—–]/.test(body) && !/\b(wij|ons|onze)\b/i.test(body));
  await p.locator(".fp__row", { hasText: "Webshop" }).first().hover();
  await p.waitForTimeout(900);
  await p.waitForTimeout(700); // laatste detail: 420 ms + 40 ms per detail + 500 ms tekenen
  const partial = await p.locator(".fp__details path").evaluateAll((els) => els.filter((e) => { const c = getComputedStyle(e), da = parseFloat(c.strokeDasharray) || Infinity; return da < e.getTotalLength() - 0.5 || parseFloat(c.strokeDashoffset) !== 0; }).length);
  check("prijzen: de vorm wordt helemaal getekend", partial === 0, `${partial} onvolledig`);
  check("prijzen: punt op de rail staat bij de aangewezen rij", (await dotOffset(p)) <= 2, `${await dotOffset(p)}px`);
  check("prijzen: aanwijzen geeft de lijn de vorm van die rij", /Webshop/.test((await p.locator(".fp__row.is-on .fp__name").textContent()) ?? "") && /vanaf €595/.test((await p.locator(".fp__now").textContent()) ?? "") && (await p.locator(".fp__details path").count()) > 0);
  const sitemap = await (await p.request.get(new URL("sitemap.xml", BASE).href)).text();
  check("prijzen: in de sitemap", sitemap.includes("https://denckh.nl/prijzen/"));
  check("prijzen: geen console-errors", errors.length === 0, errors.join(" | "));
  await ctx.close();
}

// 8b · /prijzen/ op mobiel: de vaste figuur volgt de rij waar je leest
{
  const { p, ctx, errors } = await page(browser, { width: 390, height: 844, mobile: true, path: "prijzen/" });
  const row = p.locator(".fp__row").nth(8);
  await row.evaluate((el) => scrollTo({ top: el.getBoundingClientRect().top + scrollY - innerHeight * 0.4, behavior: "instant" }));
  await p.waitForTimeout(900);
  const on = (await p.locator(".fp__row.is-on .fp__name").textContent()) ?? "";
  const now = (await p.locator(".fp__now span").first().textContent()) ?? "";
  const fig = await p.locator(".fp__figure").boundingBox();
  check("prijzen mobiel: punt op de rail staat bij die rij", (await dotOffset(p)) <= 2, `${await dotOffset(p)}px`);
  check("prijzen mobiel: figuur blijft staan en toont de rij waar je leest", on === now && fig.y >= 0 && fig.y < 120, `${on} / ${now} · y ${Math.round(fig.y)}`);
  await p.locator(".fp__row").nth(8).locator(".fp__text").tap();
  await p.locator(".fp__row").nth(2).evaluate((el) => scrollTo({ top: el.getBoundingClientRect().top + scrollY - innerHeight * 0.4, behavior: "instant" }));
  await p.waitForTimeout(900);
  check("prijzen mobiel: een tik zet geen rij vast, scrollen blijft leidend", ((await p.locator(".fp__row.is-on .fp__name").textContent()) ?? "") !== on, (await p.locator(".fp__row.is-on .fp__name").textContent()) ?? "");
  check("prijzen mobiel: geen console-errors", errors.length === 0, errors.join(" | "));
  await ctx.close();
}

// 8c · /prijzen/: alle prijzen rechts uitgelijnd, ook bij een lange naam op een smal scherm
for (const [w, h, mobile] of [[320, 700, true], [390, 844, true], [1440, 900, false]]) {
  const { p, ctx } = await page(browser, { width: w, height: h, mobile, path: "prijzen/" });
  const rights = await p.locator(".fp__price").evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().right)));
  const firstLine = await p.locator(".fp__row").evaluateAll((rows) => rows.every((r) => Math.abs(r.querySelector(".fp__price").getBoundingClientRect().top - r.querySelector(".fp__name").getBoundingClientRect().top) < 14));
  check(`prijzen op ${w}px: alle prijzen rechts, op de eerste regel`, new Set(rights).size === 1 && firstLine, `${[...new Set(rights)].join(",")}${firstLine ? "" : " · prijs onder de naam"}`);
  await ctx.close();
}

// 9 · geen horizontale overflow
for (const path of ["", "prijzen/"]) for (const width of [320, 390, 768, 1024, 1440]) {
  const { p, ctx } = await page(browser, { width, height: 800, mobile: width < 500, path });
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  check(`geen horizontale overflow op ${width}px${path ? ` (/${path})` : ""}`, ov <= 0, `${ov}px`);
  await ctx.close();
}

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} controles geslaagd`);
process.exit(failed.length ? 1 : 0);
