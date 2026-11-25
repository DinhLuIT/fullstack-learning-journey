#!/usr/bin/env node
// Kiểm tra hub trước khi commit: node site/check.mjs
// Dựng vào thư mục tạm rồi kiểm tra: lộ Markdown, link hỏng, lộ nội dung riêng tư, độ tương phản màu, số mục trên thanh trên cùng.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const SITE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SITE, "..");
const BASE = "/kiem-tra/";
const OUT = fs.mkdtempSync(path.join(os.tmpdir(), "hub-check-"));
const errors = [];
const fail = (kind, msg) => errors.push(`[${kind}] ${msg}`);

const run = spawnSync(process.execPath, [path.join(SITE, "build.mjs"), "--base", BASE, "--out", OUT], { encoding: "utf8" });
if (run.status !== 0) { console.error(run.stderr || run.stdout); process.exit(1); }
console.log(run.stdout.trim());

const walk = (d, out = []) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); e.isDirectory() ? walk(p, out) : out.push(p); } return out; };
const pages = walk(OUT).filter((f) => f.endsWith(".html") && !f.includes(`${path.sep}diagrams${path.sep}`));
const visibleText = (html) => {
  const main = html.includes("<main") ? html.slice(html.indexOf("<main"), html.indexOf("</main>")) : html;
  return main.replace(/<(script|style|pre|code|svg|textarea)[^>]*>[\s\S]*?<\/\1>/g, "").replace(/<[^>]+>/g, "\n")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"');
};

// 1. lộ cú pháp Markdown
for (const f of pages) {
  for (const line of visibleText(fs.readFileSync(f, "utf8")).split("\n")) {
    const l = line.trim();
    if (/(^#{1,6}\s)|\*\*|!?\[[^\]]*\]\([^)]*\)|^```|├──|└──/.test(l)) { fail("markdown", `${path.relative(OUT, f)}: ${l.slice(0, 90)}`); break; }
  }
}

// 2. link nội bộ hỏng
for (const f of pages) {
  for (const [, h] of fs.readFileSync(f, "utf8").matchAll(/(?:href|src|data-index)="([^"#?]+)/g)) {
    if (!h.startsWith(BASE)) continue;
    let p = path.join(OUT, h.slice(BASE.length));
    if (h.endsWith("/")) p = path.join(p, "index.html");
    if (!fs.existsSync(p)) fail("link", `${path.relative(OUT, f)} -> ${h}`);
  }
}

// 3. nội dung riêng tư không được xuất hiện: question bank, pitfalls, progress, README của lab
const allHtml = pages.map((f) => fs.readFileSync(f, "utf8")).join("\n");
const privateFiles = walk(ROOT).filter((f) => {
  const r = path.relative(ROOT, f).split(path.sep).join("/");
  if (/^(site|node_modules|\.git|\.agents|\.claude)\//.test(r)) return false;
  return /(interview-qa|pitfalls|behavioral|ai-workflow|log)\.md$/.test(r) || r === "progress.md" || r.startsWith("07-interview/question-bank/") || /\/labs\/[^/]+\/README\.md$/.test(r);
});
for (const f of privateFiles) {
  const lines = fs.readFileSync(f, "utf8").split("\n").map((l) => l.replace(/^[-*>#\s]+/, "").trim())
    .filter((l) => l.length > 50 && !l.startsWith("<!--") && !l.startsWith("|") && !/^[a-z_]+:/.test(l) && !/^Đề cương bài/.test(l) && !/^Bài \d+\./.test(l));
  for (const l of lines) if (allHtml.includes(l.slice(0, 50))) { fail("riêng tư", `${path.relative(ROOT, f)}: "${l.slice(0, 60)}"`); break; }
}

// 4. độ tương phản của token màu
const css = fs.readFileSync(path.join(SITE, "assets", "style.css"), "utf8");
const block = (re) => { const m = css.match(re); return Object.fromEntries([...(m ? m[1] : "").matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map((x) => [x[1], x[2]])); };
const light = block(/:root\s*\{([\s\S]*?)\}/), dark = block(/:root\[data-theme="dark"\]\s*\{([\s\S]*?)\}/);
const lum = (hx) => { const c = [1, 3, 5].map((i) => parseInt(hx.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
let pairs = 0;
for (const [name, t] of [["sáng", light], ["tối", dark]]) {
  const fgs = Object.keys(t).filter((k) => /^(text|muted|accent|ph-\d)$/.test(k));
  for (const fg of fgs) for (const bg of ["bg", "surface", "code-bg"]) {
    if (!t[bg]) continue; pairs++;
    const r = ratio(t[fg], t[bg]);
    if (r < 4.5) fail("tương phản", `${name}: --${fg} trên --${bg} = ${r.toFixed(2)} (cần từ 4.5)`);
  }
}

// 5. thanh trên cùng tối đa 5 mục
const home = fs.readFileSync(path.join(OUT, "index.html"), "utf8");
const bar = home.slice(home.indexOf('<header class="bar">'), home.indexOf("</header>"));
const items = (bar.match(/class="(home|top-link|search-open|theme)"/g) || []).length;
if (items > 5) fail("thanh trên", `có ${items} mục, tối đa 5`);

fs.rmSync(OUT, { recursive: true, force: true });
console.log(`Đã kiểm tra ${pages.length} trang, ${privateFiles.length} file riêng tư, ${pairs} cặp màu, ${items} mục trên thanh trên cùng.`);
if (errors.length) { console.error(`\n${errors.length} lỗi:\n` + errors.slice(0, 40).join("\n")); process.exit(1); }
console.log("Không có lỗi.");
