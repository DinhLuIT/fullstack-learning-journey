#!/usr/bin/env node
// Dựng learning hub tĩnh từ nội dung công khai của repo. Không cần cài gì thêm ngoài Node.js.
//   node site/build.mjs                         -> site/dist, base "/"
//   node site/build.mjs --base /fullstack-learning-journey/
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { render, escapeHtml as esc } from "./lib/markdown.mjs";
import { loadContent } from "./lib/content.mjs";
import { seaChart } from "./lib/chart.mjs";

const SITE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SITE, "..");
const REPO = "DinhLuIT/fullstack-learning-journey";
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const BASE = ("/" + arg("--base", "/").replace(/^\/|\/$/g, "") + "/").replace(/\/+/g, "/");
const OUT = path.resolve(arg("--out", path.join(SITE, "dist")));
const u = (p = "") => BASE + p;

const { phases, capstone } = loadContent(ROOT);
for (const p of phases) for (const l of p.lessons) l.phase = p;
const allLessons = phases.flatMap((p) => p.lessons);

// ---------- phân giải link trong Markdown ----------
const published = new Map(); // đường dẫn file trong repo -> URL trên hub
for (const p of phases) published.set(`curriculum/${p.file}`, u(p.url));
published.set("capstone/README.md", u("capstone/"));
for (const l of allLessons) {
  if (l.handout) published.set(path.relative(ROOT, l.handout.file), u(l.url));
  for (const lab of l.labs) published.set(path.relative(ROOT, lab.file), u(`${l.url}labs/${lab.slug}/`));
}
const PRIVATE = /(^|\/)(progress\.md|interview-qa\.md|pitfalls\.md|behavioral\.md|ai-workflow\.md|log\.md|CLAUDE\.md)$|\/labs\/[^/]+\/README\.md$|\/\.research\/|^(0[1-7]-[^/]+\/)([^/]+\/)?\d{2}-[^/]+\.md$/;

function hrefFor(srcFile, extra = {}) {
  return (href) => {
    if (/^(https?:|mailto:|#)/.test(href)) return href;
    const [p, hash] = href.split("#");
    const rel = path.relative(ROOT, path.resolve(path.dirname(srcFile), decodeURIComponent(p))).split(path.sep).join("/");
    if (extra[rel]) return extra[rel];
    if (published.has(rel)) return published.get(rel) + (hash && rel.startsWith("curriculum/") ? "" : hash ? "#" + hash : "");
    if (PRIVATE.test(rel)) return null; // ghi chú cá nhân: không đưa link lên hub
    if (rel.startsWith("..")) return null;
    return `https://github.com/${REPO}/blob/main/${rel}`;
  };
}

function figure(srcFile, extra) {
  return (alt, src) => {
    const abs = path.resolve(path.dirname(srcFile), decodeURIComponent(src));
    // SVG cục bộ: nhúng thẳng để màu theo giao diện sáng/tối (SVG dùng biến CSS kèm màu dự phòng)
    if (/\.svg$/i.test(abs) && fs.existsSync(abs)) {
      let svg = fs.readFileSync(abs, "utf8").replace(/<\?xml[^>]*>\s*/, "").replace(/<!DOCTYPE[^>]*>\s*/i, "").replace(/<script[\s\S]*?<\/script>/gi, "");
      if (!/role="img"/.test(svg)) svg = svg.replace(/<svg\b/, `<svg role="img" aria-label="${esc(alt)}"`);
      return `<figure class="figure">${svg}<figcaption>${esc(alt)}</figcaption></figure>`;
    }
    const url = hrefFor(srcFile, extra)(src);
    return url === null ? "" : `<figure class="figure"><img src="${esc(url)}" alt="${esc(alt)}" loading="lazy"><figcaption>${esc(alt)}</figcaption></figure>`;
  };
}

function md(text, srcFile, opts = {}) {
  return render(text, {
    figure: figure(srcFile, opts.extra),
    href: hrefFor(srcFile, opts.extra),
    embed: (title, src) => {
      const url = hrefFor(srcFile, opts.extra)(src);
      return `<figure class="embed"><iframe src="${esc(url)}" title="${esc(title)}" loading="lazy"></iframe><figcaption>${esc(title)} <a href="${esc(url)}" target="_blank" rel="noopener">Mở toàn màn hình</a></figcaption></figure>`;
    },
  });
}

// ---------- khung trang ----------
const phaseLabel = (p) => (p.num ? `Giai đoạn ${p.num}` : "DSA");
function layout({ title, description, body, current, wide = false, crumbs = "~" }) {
  const nav = phases.map((p) => `<a href="${u(p.url)}"${current === p.id ? ' aria-current="page"' : ""}>${esc(p.num ? `gd${p.num}` : "dsa")}<span>${esc(p.short)}</span></a>`).join("");
  return `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description || "")}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500;700&display=swap">
<link rel="stylesheet" href="${u("assets/style.css")}">
<script>try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}</script>
<script type="module" src="${u("assets/app.js")}"></script>
</head>
<body>
<a class="skip" href="#noi-dung">Bỏ qua điều hướng</a>
<header class="bar">
  <a class="home" href="${u()}"><span class="prompt">dinh@hub</span><span class="path">${esc(crumbs)}</span><span class="caret" aria-hidden="true"></span></a>
  <nav class="phases" aria-label="Các giai đoạn"><a href="${u("lo-trinh/")}"${current === "roadmap" ? ' aria-current="page"' : ""}>hải-đồ<span>Lộ trình</span></a>${nav}<a href="${u("capstone/")}"${current === "capstone" ? ' aria-current="page"' : ""}>capstone<span>Dự án</span></a></nav>
  <button class="search-open" type="button" aria-label="Tìm bài học" aria-keyshortcuts="/"><span>tìm</span><kbd>/</kbd></button>
  <button class="theme" type="button" aria-label="Đổi giao diện sáng tối"><span data-label>auto</span></button>
</header>
<dialog class="search" aria-label="Tìm bài học" data-index="${u("search.json")}">
  <form method="dialog" class="search-box">
    <label for="q"><span class="ps">dinh@hub:~$</span> grep -i</label>
    <input id="q" type="search" autocomplete="off" spellcheck="false" placeholder="hashmap, jwt, event loop..." aria-describedby="search-help">
  </form>
  <p id="search-help" class="search-help">Tìm theo tên bài và nội dung đề cương, không cần gõ dấu. Mũi tên để chọn, Enter để mở, Esc để đóng.</p>
  <ol class="results" aria-live="polite"></ol>
</dialog>
<main id="noi-dung" class="${wide ? "wide" : ""}">
${body}
</main>
<footer class="foot">
  <p>Học lại FullStack từ nền tảng, ghi lại trên <a href="https://github.com/${REPO}" target="_blank" rel="noopener">GitHub</a>. Tài liệu được biên soạn từ nguồn chính thống, mỗi bài đều có danh sách nguồn.</p>
</footer>
</body>
</html>`;
}

function write(rel, html) {
  const f = path.join(OUT, rel, rel.endsWith(".html") ? "" : "index.html");
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
}

// ---------- các trang ----------
const flags = (l) =>
  (l.handout ? '<span class="flag doc">tài liệu</span>' : "") +
  (l.labs.length ? `<span class="flag lab">lab ${l.labs.length}</span>` : "");

function homePage() {
  const total = allLessons.length;
  const rows = phases.map((p) => {
    const docs = p.lessons.filter((l) => l.handout).length;
    const name = p.num ? `gd${p.num}-${p.dir.replace(/^\d+-/, "")}/` : "dsa/";
    return `<li><a href="${u(p.url)}"><span class="perm">drwxr-xr-x</span><span class="size">${p.lessons.length} bài</span><span class="docs">${docs}/${p.lessons.length} tài liệu</span><span class="name">${esc(name)}</span><span class="desc">${esc(p.id === "dsa" ? "Cấu trúc dữ liệu và giải thuật, chạy song song suốt lộ trình" : p.title.replace(/^Giai đoạn \d+: /, ""))}</span></a></li>`;
  }).join("");
  const body = `
<section class="session" aria-labelledby="hero">
  <h1 id="hero" class="hero"><span class="hash-sign" aria-hidden="true"># </span>Nếu học lại Fullstack từ đầu, mình sẽ học những gì?</h1>
  <p class="line"><span class="ps">dinh@hub:~$</span> <span class="cmd" data-type>ls -l lo-trinh/</span></p>
  <div class="output">
    <p class="total">total ${total}</p>
    <ul class="ls">${rows}<li><a href="${u("capstone/")}"><span class="perm">-rw-r--r--</span><span class="size">v1–v6</span><span class="docs"></span><span class="name">capstone.md</span><span class="desc">Hệ thống đặt sân thể thao đa cơ sở, lớn dần qua từng giai đoạn</span></a></li></ul>
  </div>
  <p class="line"><span class="ps">dinh@hub:~$</span> <span class="cmd">cat README</span></p>
  <div class="output readme">
    <p>Mình là Đình. Đây là nơi mình học lại FullStack từ nền tảng: từ cách máy tính lưu một con số đến Spring, React, AI và microservices. Mỗi bài có đề cương, tài liệu biên soạn từ nguồn chính thống kèm trích dẫn, và đề bài lab để tự viết lại những gì framework đang làm hộ.</p>
  </div>
  <p class="line"><span class="ps">dinh@hub:~$</span> <span class="cmd">open <a href="${u("lo-trinh/")}">hai-do</a></span></p>
  <div class="output"><p class="hint">Mở hải đồ: mỗi giai đoạn là một hòn đảo, bấm vào để xem bài và tự đánh dấu tiến độ của bạn. Gõ <kbd>/</kbd> ở bất kỳ trang nào để tìm bài.</p></div>
  <p class="line idle"><span class="ps">dinh@hub:~$</span> <span class="caret" aria-hidden="true"></span></p>
</section>`;
  write("", layout({ title: "Nếu học lại Fullstack từ đầu, mình sẽ học những gì?", description: `Lộ trình FullStack ${total} bài: đề cương, tài liệu có nguồn, đề bài lab.`, body }));
}

function phasePage(p) {
  const groups = p.groups.map((g) => `
<section class="group">
  ${g.title ? `<h2>${esc(g.title)}</h2>` : ""}
  ${g.intro ? md(g.intro, path.join(ROOT, "curriculum", p.file)).html : ""}
  <ol class="lessons">${g.lessons.map((l) => `<li><a href="${u(l.url)}" data-lesson="${l.url.replace(/\/$/, "")}"><span class="n">${l.n}</span><span class="t">${esc(l.title)}</span>${flags(l)}</a></li>`).join("")}</ol>
</section>`).join("");
  const extras = p.extras.map((x) => `<section class="group extra"><h2>${esc(x.title)}</h2>${md(x.body, path.join(ROOT, "curriculum", p.file)).html}</section>`).join("");
  const body = `<article class="doc phase">
  <h1>${esc(p.title)}</h1>
  <p class="phase-progress" data-phase="${p.id}" data-total="${p.lessons.length}"></p>
  ${md(p.intro, path.join(ROOT, "curriculum", p.file)).html}
  ${groups}${extras}
</article>`;
  write(p.url, layout({ title: `${p.title} | Nếu học lại Fullstack`, description: p.title, body, current: p.id, crumbs: `~/${p.id}` }));
}

function tree(p, current) {
  return `<nav class="tree" aria-label="Bài trong ${esc(phaseLabel(p))}"><a class="root" href="${u(p.url)}">${esc(p.id)}/</a>${p.groups.map((g) => {
    const items = g.lessons.map((l, i) => `<li><a href="${u(l.url)}" data-lesson="${l.url.replace(/\/$/, "")}"${l === current ? ' aria-current="page"' : ""}><span class="branch" aria-hidden="true">${i === g.lessons.length - 1 ? "└──" : "├──"}</span><span class="n">${l.n}</span> ${esc(l.title)}</a></li>`).join("");
    return `${g.title ? `<p class="g">${esc(g.title)}</p>` : ""}<ul>${items}</ul>`;
  }).join("")}</nav>`;
}

function lessonPage(l, prev, next) {
  const p = l.phase;
  const cur = path.join(ROOT, "curriculum", p.file);
  const syllabus = md(l.body, cur).html;
  const outDir = path.join(OUT, l.url);
  const extra = {};
  for (const f of l.assets) {
    const name = path.basename(f);
    fs.mkdirSync(path.join(outDir, "assets"), { recursive: true });
    fs.copyFileSync(f, path.join(outDir, "assets", name));
    extra[path.relative(ROOT, f).split(path.sep).join("/")] = u(`${l.url}assets/${name}`);
  }
  for (const f of l.diagrams) {
    const name = path.basename(f);
    fs.mkdirSync(path.join(outDir, "diagrams"), { recursive: true });
    fs.copyFileSync(f, path.join(outDir, "diagrams", name));
    extra[path.relative(ROOT, f).split(path.sep).join("/")] = u(`${l.url}diagrams/${name}`);
  }
  let handout = `<div class="empty"><p>Bài này chưa có tài liệu.</p><p>Soạn bằng lệnh <code>/soan-bai ${p.num ? `gd${p.num} ` : "dsa "}${l.n}</code> trong Claude Code. Tài liệu sẽ xuất hiện ở đây sau lần push tiếp theo.</p></div>`;
  let toc = [];
  if (l.handout) {
    const body = l.handout.body.replace(/\s*Ghi chú của mình nằm ở \[[^\]]*\]\([^)]*\)\.?/, "");
    const r = md(body, l.handout.file, { extra });
    handout = r.html; toc = r.toc.filter((t) => t.level === 2);
  }
  const labs = l.labs.length
    ? `<ul class="labs">${l.labs.map((lab) => `<li><a href="${u(`${l.url}labs/${lab.slug}/`)}"><span class="name">labs/${esc(lab.slug)}/</span><span class="t">${esc(lab.title)}</span></a></li>`).join("")}</ul>`
    : `<div class="empty"><p>Chưa có lab nào được giao.</p><p>Lab được giao trong buổi học bằng <code>/hoc-bai ${p.num ? `gd${p.num} ` : "dsa "}${l.n}</code>.</p></div>`;
  const pager = `<nav class="pager" aria-label="Bài trước và bài sau">${prev ? `<a class="prev" href="${u(prev.url)}"><span>Bài trước</span>${prev.n}. ${esc(prev.title)}</a>` : "<span></span>"}${next ? `<a class="next" href="${u(next.url)}"><span>Bài sau</span>${next.n}. ${esc(next.title)}</a>` : ""}</nav>`;
  const onPage = [{ id: "sec-de-cuong", text: "Đề cương" }, { id: "sec-tai-lieu", text: "Tài liệu" }, ...toc.map((t) => ({ ...t, sub: true })), { id: "sec-lab", text: "Lab" }];
  const body = `<div class="lesson">
${tree(p, l)}
<article class="doc">
  <p class="where"><a href="${u(p.url)}">${esc(phaseLabel(p))}</a>${l.group ? ` / ${esc(l.group.replace(/^Module /, ""))}` : ""}</p>
  <h1><span class="n">Bài ${l.n}.</span> ${esc(l.title)}</h1>
  <div class="progress-ctl" data-lesson="${l.url.replace(/\/$/, "")}" role="group" aria-label="Tiến độ của bạn với bài này">
    <span class="lbl">Tiến độ của bạn</span>
    <button type="button" data-s="todo" aria-pressed="true">Chưa học</button><button type="button" data-s="doing" aria-pressed="false">Đang học</button><button type="button" data-s="done" aria-pressed="false">Đã xong</button><button type="button" data-s="review" aria-pressed="false">Cần ôn</button>
  </div>
  <section id="sec-de-cuong" class="part"><h2>Đề cương</h2>${syllabus}</section>
  <section id="sec-tai-lieu" class="part handout"><h2>Tài liệu</h2>${handout}</section>
  <section id="sec-lab" class="part"><h2>Lab</h2>${labs}</section>
  ${pager}
</article>
<nav class="toc" aria-label="Trên trang này"><p>Trên trang này</p><ul>${onPage.map((t) => `<li${t.sub ? ' class="sub"' : ""}><a href="#${t.id}">${esc(t.text)}</a></li>`).join("")}</ul></nav>
</div>`;
  write(l.url, layout({ title: `Bài ${l.n}. ${l.title} | ${phaseLabel(p)}`, description: `${phaseLabel(p)}, bài ${l.n}: ${l.title}`, body, current: p.id, wide: true, crumbs: `~/${p.id}/${l.stem}` }));
  for (const lab of l.labs) labPage(l, lab);
}

function labPage(l, lab) {
  const p = l.phase;
  const folder = path.relative(ROOT, path.dirname(lab.file)).split(path.sep).join("/");
  const body = `<article class="doc lab">
  <p class="where"><a href="${u(p.url)}">${esc(phaseLabel(p))}</a> / <a href="${u(l.url)}">Bài ${l.n}. ${esc(l.title)}</a></p>
  <h1>${esc(lab.title)}</h1>
  ${md(lab.body, lab.file).html}
  <p class="source">Code của lab: <a href="https://github.com/${REPO}/tree/main/${folder}" target="_blank" rel="noopener">${esc(folder)}/</a></p>
</article>`;
  write(`${l.url}labs/${lab.slug}/`, layout({ title: `${lab.title} | Lab bài ${l.n}`, description: lab.title, body, current: p.id, crumbs: `~/${p.id}/${l.stem}/labs/${lab.slug}` }));
}

function capstonePage() {
  const r = md(capstone, path.join(ROOT, "capstone", "README.md"));
  write("capstone/", layout({ title: "Capstone: đặt sân thể thao | Nếu học lại Fullstack", description: "Yêu cầu sản phẩm của dự án capstone", body: `<article class="doc">${r.html}</article>`, current: "capstone", crumbs: "~/capstone" }));
}

// thời lượng tối đa của từng module, đọc từ bảng ở đầu file đề cương
function moduleDurations(p) {
  const d = {};
  for (const m of p.intro.matchAll(/^\|\s*([A-Z])\.[^|]*\|[^|]*\|\s*([^|]+?)\s*\|\s*$/gm)) d[m[1]] = m[2];
  return d;
}

function roadmapPage() {
  const lid = (l) => l.url.replace(/\/$/, "");
  const data = phases.map((p) => ({
    id: p.id, title: p.title, short: p.short, why: p.why, url: u(p.url),
    groups: p.groups.map((g) => ({ title: g.title ? g.title.replace(/^Module /, "") : "", dur: (moduleDurations(p)[g.title?.match(/^Module ([A-Z])\./)?.[1]] || ""), lessons: g.lessons.map((l) => ({ id: lid(l), n: l.n, t: l.title, u: u(l.url), d: l.handout ? 1 : 0 })) })),
  }));
  const capVersions = [["v1", "gd2", "REST API bằng Java thuần + JDBC"], ["v2", "gd2", "Spring Boot, Spring Security, Redis, test"], ["v3", "gd3", "React + TypeScript, Redux Toolkit"], ["v4", "gd4", "Trợ lý AI: RAG, tool calling"], ["v5", "gd5", "Docker, CI/CD, deploy có HTTPS"], ["v6", "gd6", "Microservices, Kafka, Saga"]];
  const fallback = phases.map((p) => `<li><a href="${u(p.url)}">${esc(p.title)}</a> (${p.lessons.length} bài)</li>`).join("");
  const body = `<article class="roadmap">
  <header class="chart-head">
    <h1>Hải đồ lộ trình</h1>
    <p class="lead">${allLessons.length} bài, chia thành 7 hòn đảo học theo thứ tự và một dòng hải lưu DSA chạy song song. Bấm vào một đảo để xem các bài và đánh dấu tiến độ của bạn. Tiến độ được lưu ngay trên trình duyệt này, không cần đăng nhập.</p>
    <div class="resume" hidden>
      <p class="line"><span class="ps">dinh@hub:~$</span> <span class="cmd">tiep-tuc</span></p>
      <p class="resume-out"><span class="resume-state"></span> <span class="resume-path"></span></p>
      <p class="resume-actions"><a class="resume-open" href="#">Mở bài</a><button type="button" class="resume-show">Xem trên hải đồ</button></p>
    </div>
  </header>
  <div class="chart-area">
  <div class="chart-wrap">
    ${seaChart(phases, esc)}
  <aside class="panel" hidden aria-labelledby="panel-title" tabindex="-1">
    <button class="panel-close" type="button" aria-label="Đóng bảng chi tiết">esc</button>
    <p class="panel-where"></p>
    <h2 id="panel-title"></h2>
    <p class="panel-why"></p>
    <div class="meter" role="img"><span></span></div>
    <p class="panel-stats"></p>
    <div class="panel-body"></div>
    <a class="panel-open" href="#">Mở trang giai đoạn</a>
  </aside>
  </div>
  <noscript><ul>${fallback}</ul></noscript>

  </div>
  <section class="backup" aria-labelledby="backup-title">
    <h2 id="backup-title">Tiến độ của bạn</h2>
    <p>Tiến độ nằm trong trình duyệt này. Xóa dữ liệu duyệt web hoặc đổi máy sẽ mất, nên thỉnh thoảng hãy xuất ra file.</p>
    <p class="actions"><button type="button" data-progress="export">Xuất file tiến độ</button><label class="import">Nhập file tiến độ<input type="file" accept="application/json" data-progress="import"></label><button type="button" data-progress="reset">Xóa tiến độ</button></p>
    <p class="backup-msg" role="status"></p>
  </section>
  <div class="doc">
  <h2 id="mot-buoi-hoc">Một buổi học</h2>
  <ol class="steps">
    <li><strong>Mở đầu.</strong> Xem đề cương và tài liệu của bài, đánh dấu "Đang học".</li>
    <li><strong>Học lý thuyết.</strong> Đọc tài liệu và hình minh họa, ghi chú bằng lời của mình.</li>
    <li><strong>Làm lab.</strong> Tự viết lại thứ framework đang làm hộ, theo đề bài của bài.</li>
    <li><strong>Review lab.</strong> Đối chiếu với yêu cầu, sửa đến khi đạt.</li>
    <li><strong>Chốt bài.</strong> Trả lời các câu tự kiểm tra; trả lời trôi chảy thì đánh dấu "Đã xong", còn ấp úng thì "Cần ôn".</li>
  </ol>
  <h2 id="capstone-lon-dan">Capstone lớn dần theo hành trình</h2>
  <p>Một hệ thống đặt sân thể thao đa cơ sở, mỗi giai đoạn nâng lên một phiên bản. <a href="${u("capstone/")}">Xem yêu cầu sản phẩm</a>.</p>
  <ol class="versions">${capVersions.map(([v, ph, t]) => `<li><span class="hash">${v}</span><a href="${u(ph + "/")}">${ph}</a><span>${t}</span></li>`).join("")}</ol>
  </div>
  <script type="application/json" id="hub-data">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>
</article>`;
  write("lo-trinh/", layout({ title: "Hải đồ lộ trình | Nếu học lại Fullstack từ đầu", description: `Hải đồ ${allLessons.length} bài: bấm vào từng đảo để xem bài và đánh dấu tiến độ của bạn`, body, current: "roadmap", crumbs: "~/lo-trinh", wide: true }));
}

// chỉ mục tìm kiếm: tên bài, module và chữ thuần của đề cương (không có ghi chú cá nhân)
const plain = (t) => t.replace(/```[\s\S]*?```/g, " ").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[`*_>#|]/g, " ").replace(/\s+/g, " ").trim();
function searchIndex() {
  const items = allLessons.map((l) => ({
    t: `Bài ${l.n}. ${l.title}`,
    p: phaseLabel(l.phase),
    m: l.group ? l.group.replace(/^Module /, "") : "",
    u: u(l.url),
    d: l.handout ? 1 : 0,
    x: plain(l.body),
  }));
  fs.writeFileSync(path.join(OUT, "search.json"), JSON.stringify(items));
}

function notFound() {
  const body = `<section class="session"><p class="line"><span class="ps">dinh@hub:~$</span> <span class="cmd">cd trang-nay</span></p><div class="output"><p>bash: cd: trang-nay: Không có trang này. Có thể bài đã đổi số sau khi lộ trình được cập nhật.</p><p><a href="${u()}">Về danh sách giai đoạn</a></p></div></section>`;
  write("404.html", layout({ title: "Không tìm thấy trang | Nếu học lại Fullstack", body }));
}

// ---------- chạy ----------
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, "assets"), { recursive: true });
for (const f of fs.readdirSync(path.join(SITE, "assets"))) fs.copyFileSync(path.join(SITE, "assets", f), path.join(OUT, "assets", f));
fs.writeFileSync(path.join(OUT, ".nojekyll"), "");
homePage(); roadmapPage(); capstonePage(); notFound();
for (const p of phases) {
  phasePage(p);
  p.lessons.forEach((l, i) => lessonPage(l, p.lessons[i - 1], p.lessons[i + 1]));
}
searchIndex();
const docs = allLessons.filter((l) => l.handout).length, labsN = allLessons.reduce((a, l) => a + l.labs.length, 0);
console.log(`Đã dựng ${allLessons.length} bài (${docs} có tài liệu, ${labsN} lab) vào ${path.relative(ROOT, OUT)} với base ${BASE}`);
