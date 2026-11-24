// Learning hub: đổi giao diện, gõ lệnh ở trang chủ, nút chép code, vẽ sơ đồ Mermaid.
const root = document.documentElement;
root.classList.add("js");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- giao diện sáng / tối ----------
const order = ["auto", "dark", "light"];
const saved = () => { try { return localStorage.getItem("theme") || "auto"; } catch { return "auto"; } };
function applyTheme(mode) {
  if (mode === "auto") delete root.dataset.theme; else root.dataset.theme = mode;
  try { mode === "auto" ? localStorage.removeItem("theme") : localStorage.setItem("theme", mode); } catch {}
  document.querySelectorAll(".theme [data-label]").forEach((el) => (el.textContent = mode));
  document.dispatchEvent(new CustomEvent("themechange"));
}
document.querySelectorAll(".theme").forEach((btn) => {
  btn.querySelector("[data-label]").textContent = saved();
  btn.addEventListener("click", () => applyTheme(order[(order.indexOf(saved()) + 1) % order.length]));
});
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => document.dispatchEvent(new CustomEvent("themechange")));

// ---------- gõ lệnh một lần ở trang chủ ----------
const typed = document.querySelector(".session .cmd[data-type]");
if (typed && !reduceMotion) {
  const session = typed.closest(".session");
  const text = typed.textContent;
  session.classList.add("typing");
  typed.textContent = "";
  let i = 0;
  const tick = () => {
    typed.textContent = text.slice(0, ++i);
    if (i < text.length) setTimeout(tick, 45 + Math.random() * 40);
    else setTimeout(() => session.classList.remove("typing"), 180);
  };
  setTimeout(tick, 350);
}

// ---------- nút chép code ----------
document.querySelectorAll("figure.code").forEach((fig) => {
  const btn = document.createElement("button");
  btn.type = "button"; btn.className = "copy"; btn.textContent = "chép";
  btn.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(fig.querySelector("code").textContent); btn.textContent = "đã chép"; }
    catch { btn.textContent = "không chép được"; }
    setTimeout(() => (btn.textContent = "chép"), 1500);
  });
  fig.appendChild(btn);
});

// ---------- sơ đồ Mermaid (chỉ tải khi trang có sơ đồ) ----------
const diagrams = [...document.querySelectorAll("pre.mermaid")];
if (diagrams.length) {
  const css = (v) => getComputedStyle(root).getPropertyValue(v).trim();
  let mermaid;
  const draw = async () => {
    mermaid ??= (await import("https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs")).default;
    mermaid.initialize({
      startOnLoad: false, theme: "base", securityLevel: "strict",
      fontFamily: css("--mono"),
      themeVariables: {
        background: css("--surface"), primaryColor: css("--surface"), primaryTextColor: css("--text"),
        primaryBorderColor: css("--accent"), lineColor: css("--muted"), secondaryColor: css("--code-bg"),
        tertiaryColor: css("--bg"), textColor: css("--text"), noteBkgColor: css("--code-bg"), noteTextColor: css("--text"),
      },
    });
    for (const el of diagrams) { el.removeAttribute("data-processed"); el.textContent = el.dataset.src; }
    try { await mermaid.run({ nodes: diagrams }); } catch (e) { console.warn("Không vẽ được sơ đồ", e); }
  };
  draw();
  document.addEventListener("themechange", draw);
}

// ---------- sơ đồ tương tác nhúng: báo giao diện hiện tại qua tham số ?theme= ----------
const frames = [...document.querySelectorAll("figure.embed iframe")];
const currentTheme = () => root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
const syncFrames = () => frames.forEach((f) => {
  const url = new URL(f.getAttribute("src"), location.href);
  if (url.searchParams.get("theme") === currentTheme()) return;
  url.searchParams.set("theme", currentTheme());
  f.src = url.toString();
});
if (frames.length) { syncFrames(); document.addEventListener("themechange", syncFrames); }

// ---------- tìm kiếm: không phân biệt dấu, tải chỉ mục khi mở lần đầu ----------
const dlg = document.querySelector("dialog.search");
if (dlg) {
  const input = dlg.querySelector("input");
  const list = dlg.querySelector(".results");
  let index = null;
  const fold = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[đĐ]/g, "d").toLowerCase();
  const escapeHtml = (t) => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const mark = (text, terms) => {
    const f = fold(text); const hits = [];
    for (const t of terms) { let i = f.indexOf(t); while (i >= 0) { hits.push([i, i + t.length]); i = f.indexOf(t, i + t.length); } }
    hits.sort((a, b) => a[0] - b[0]);
    let out = "", pos = 0;
    for (const [a, b] of hits) { if (a < pos) continue; out += escapeHtml(text.slice(pos, a)) + "<mark>" + escapeHtml(text.slice(a, b)) + "</mark>"; pos = b; }
    return out + escapeHtml(text.slice(pos));
  };
  async function load() {
    if (index) return index;
    const res = await fetch(dlg.dataset.index);
    index = (await res.json()).map((it) => ({ ...it, ft: fold(it.t), fm: fold(it.m + " " + it.p), fx: fold(it.x) }));
    return index;
  }
  function search(q) {
    const terms = fold(q).split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return index.map((it) => {
      let score = 0;
      for (const t of terms) {
        const inT = it.ft.includes(t), inM = it.fm.includes(t), inX = it.fx.includes(t);
        if (!inT && !inM && !inX) return null;
        score += inT ? 10 : inM ? 4 : 1;
      }
      return { it, score: score + it.d * 0.5 };
    }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 20);
  }
  function snippet(it, terms) {
    const i = Math.max(0, ...terms.map((t) => it.fx.indexOf(t)).filter((n) => n >= 0).slice(0, 1));
    const start = Math.max(0, i - 50);
    return (start ? "…" : "") + it.x.slice(start, start + 150) + (it.x.length > start + 150 ? "…" : "");
  }
  function show(q) {
    const terms = fold(q).split(/\s+/).filter(Boolean);
    const rows = search(q);
    list.innerHTML = !terms.length ? "" : rows.length
      ? rows.map(({ it }) => `<li><a href="${it.u}"><span class="rt">${mark(it.t, terms)}</span><span class="rm">${escapeHtml(it.p)}${it.m ? " / " + escapeHtml(it.m) : ""}${it.d ? " / có tài liệu" : ""}</span>${it.ft.includes(terms[0]) ? "" : `<span class="rs">${mark(snippet(it, terms), terms)}</span>`}</a></li>`).join("")
      : `<li class="none">grep: không có bài nào khớp với "${escapeHtml(q)}". Thử từ khóa ngắn hơn hoặc tiếng Anh.</li>`;
  }
  async function open() {
    if (!dlg.open) dlg.showModal();
    input.select();
    try { await load(); show(input.value); } catch { list.innerHTML = '<li class="none">Không tải được chỉ mục tìm kiếm.</li>'; }
  }
  document.querySelectorAll(".search-open").forEach((b) => b.addEventListener("click", open));
  document.addEventListener("keydown", (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
    if (e.key === "/" && !typing && !dlg.open) { e.preventDefault(); open(); }
  });
  input.addEventListener("input", () => index && show(input.value));
  dlg.addEventListener("keydown", (e) => {
    const links = [...list.querySelectorAll("a")];
    const i = links.indexOf(document.activeElement);
    if (e.key === "ArrowDown") { e.preventDefault(); (links[i + 1] || links[0])?.focus(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); i <= 0 ? input.focus() : links[i - 1].focus(); }
    else if (e.key === "Enter" && document.activeElement === input && links[0]) { e.preventDefault(); location.href = links[0].href; }
  });
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
}

// ---------- tiến độ của người xem (lưu trên trình duyệt này) ----------
const KEY = "hub-progress-v1";
const STATES = ["todo", "doing", "done", "review"];
const SYM = { todo: "○", doing: "◐", done: "●", review: "↻" };
const NAME = { todo: "chưa học", doing: "đang học", done: "đã xong", review: "cần ôn" };
const escText = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const Progress = {
  all() { try { const v = JSON.parse(localStorage.getItem(KEY) || "{}"); return v && typeof v === "object" ? v : {}; } catch { return {}; } },
  get(id) { return this.all()[id] || "todo"; },
  set(id, s) {
    const all = this.all();
    if (s === "todo") delete all[id]; else all[id] = s;
    try { localStorage.setItem(KEY, JSON.stringify(all)); } catch {}
    document.dispatchEvent(new CustomEvent("progresschange"));
  },
  replace(obj) { try { localStorage.setItem(KEY, JSON.stringify(obj)); } catch {} document.dispatchEvent(new CustomEvent("progresschange")); },
};
window.addEventListener("storage", (e) => { if (e.key === KEY) document.dispatchEvent(new CustomEvent("progresschange")); });

// dấu trạng thái trên cây bài và danh sách bài
function paintLinks() {
  const all = Progress.all();
  document.querySelectorAll("a[data-lesson]").forEach((a) => {
    const s = all[a.dataset.lesson];
    if (s) a.dataset.status = s; else delete a.dataset.status;
  });
  document.querySelectorAll(".phase-progress").forEach((el) => {
    const ids = [...document.querySelectorAll(".lessons a[data-lesson]")].map((a) => a.dataset.lesson);
    const learned = ids.filter((id) => all[id] === "done" || all[id] === "review").length;
    el.textContent = learned ? `Bạn đã học ${learned}/${el.dataset.total} bài ở giai đoạn này.` : "";
  });
}
paintLinks();
document.addEventListener("progresschange", paintLinks);

// nút tiến độ ở trang bài
document.querySelectorAll(".progress-ctl").forEach((box) => {
  const id = box.dataset.lesson;
  const sync = () => box.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.s === Progress.get(id))));
  box.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) Progress.set(id, b.dataset.s); });
  sync();
  document.addEventListener("progresschange", sync);
});

// ---------- hải đồ ----------
const dataEl = document.getElementById("hub-data");
if (dataEl) {
  const phases = JSON.parse(dataEl.textContent);
  const byId = Object.fromEntries(phases.map((p) => [p.id, p]));
  const lessonsOf = (p) => p.groups.flatMap((g) => g.lessons);
  const order = phases.filter((p) => p.id !== "dsa");
  const svg = document.querySelector(".chart");
  const route = svg.querySelector(".route");
  const boat = svg.querySelector(".boat");
  const callout = svg.querySelector(".callout");
  const panel = document.querySelector(".panel");
  const FULL = svg.viewBox.baseVal ? [svg.viewBox.baseVal.x, svg.viewBox.baseVal.y, svg.viewBox.baseVal.width, svg.viewBox.baseVal.height] : [0, 0, 1200, 780];
  let openId = null, lastIsland = null, boatAt = null, liftAt = null, view = FULL.slice(), viewAnim = 0;
  const expanded = new Set();

  const isLearned = (st) => st === "done" || st === "review";
  const stats = (list) => {
    const all = Progress.all(); const c = { todo: 0, doing: 0, done: 0, review: 0 };
    for (const l of list) c[all[l.id] || "todo"]++;
    return { ...c, total: list.length, learned: c.done + c.review };
  };
  // bài người xem đang học: bài "đang học" đầu tiên, nếu không có thì bài chưa học đầu tiên theo thứ tự
  function currentLesson() {
    const all = Progress.all();
    for (const p of order) for (const g of p.groups) for (const l of g.lessons) if (all[l.id] === "doing") return { p, g, l, state: "doing" };
    for (const p of order) for (const g of p.groups) for (const l of g.lessons) if (!isLearned(all[l.id])) return { p, g, l, state: Object.keys(all).length ? "next" : "start" };
    const p = order[order.length - 1], g = p.groups[p.groups.length - 1];
    return { p, g, l: g.lessons[g.lessons.length - 1], state: "finished" };
  }

  // ----- camera: phóng tới đảo đang chọn -----
  const islandBox = (id) => { const g = svg.querySelector(`.island[data-phase="${id}"]`); const c = g.querySelector(".ring"); return [+c.getAttribute("cx"), +c.getAttribute("cy"), +g.dataset.ring]; };
  // khung nhìn khi chọn đảo: phóng nhẹ và đặt đảo vào giữa phần biển không bị bảng che
  function targetView(id) {
    if (!id) return FULL.slice();
    const [cx, cy, r] = islandBox(id);
    const wide = matchMedia("(min-width: 900px)").matches;
    const wrap = svg.parentElement;
    const cover = wide && !panel.hidden ? (panel.offsetWidth + 12) / wrap.clientWidth : 0;
    const zoom = Math.max(1.15, Math.min(1.6, (FULL[2] * 0.42) / (r * 2.6)));
    const w = FULL[2] / zoom, h = FULL[3] / zoom;
    const fx = wide ? (1 - cover) / 2 : 0.5;
    const x = cx - fx * w;
    const y = Math.max(FULL[1] - h * 0.1, Math.min(cy - h * (wide ? 0.5 : 0.32), FULL[1] + FULL[3] - h * 0.9));
    return [x, y, w, h];
  }
  function animateView(to) {
    cancelAnimationFrame(viewAnim);
    const from = view.slice();
    const setV = (v) => { view = v; svg.setAttribute("viewBox", v.map((n) => n.toFixed(1)).join(" ")); };
    if (reduceMotion) { setV(to); return; }
    const t0 = performance.now(), dur = 650;
    const step = (t) => { const k = Math.min(1, (t - t0) / dur), e = k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2; setV(from.map((f, i) => f + (to[i] - f) * e)); if (k < 1) viewAnim = requestAnimationFrame(step); };
    viewAnim = requestAnimationFrame(step);
  }

  // ----- thuyền và nhãn bài đang học -----
  const total = route.getTotalLength();
  function lengthAt(id) {
    const [cx, cy] = islandBox(id); let best = 0, bd = Infinity;
    for (let s = 0; s <= total; s += 4) { const pt = route.getPointAtLength(s); const d = (pt.x - cx) ** 2 + (pt.y - cy) ** 2; if (d < bd) { bd = d; best = s; } }
    return best;
  }
  const liftOf = (id) => islandBox(id)[2] + 14;
  const place = (s, lift) => { const pt = route.getPointAtLength(s); const q = route.getPointAtLength(Math.min(s + 6, total)); const flip = q.x < pt.x ? -1 : 1; boat.setAttribute("transform", `translate(${pt.x},${pt.y - lift}) scale(${flip},1)`); return [pt.x, pt.y - lift]; };
  function showCallout([x, y], text) {
    const t = callout.querySelector("text"), r = callout.querySelector("rect");
    t.textContent = text.length > 42 ? text.slice(0, 41) + "…" : text;
    const bb = t.getBBox ? t.getBBox() : { width: text.length * 8 };
    const w = bb.width + 20, left = Math.max(8, Math.min(x - w / 2, FULL[2] - w - 8));
    r.setAttribute("x", left); r.setAttribute("y", y - 62); r.setAttribute("width", w); r.setAttribute("height", 28);
    t.setAttribute("x", left + 10); t.setAttribute("y", y - 43);
    callout.classList.add("on");
  }
  function moveBoat(animate) {
    const cur = currentLesson(), to = lengthAt(cur.p.id), toLift = liftOf(cur.p.id);
    const label = cur.state === "doing" ? `Đang học: Bài ${cur.l.n}. ${cur.l.t}` : cur.state === "finished" ? "Đã đi hết hành trình" : `Bài tiếp theo: Bài ${cur.l.n}. ${cur.l.t}`;
    const done = () => { boatAt = to; liftAt = toLift; showCallout(place(to, toLift), label); };
    if (!animate || reduceMotion || boatAt === null || (boatAt === to && liftAt === toLift)) { done(); return; }
    callout.classList.remove("on");
    const from = boatAt, fromLift = liftAt, t0 = performance.now(), dur = Math.min(2200, 500 + Math.abs(to - from) * 0.9);
    const step = (t) => { const k = Math.min(1, (t - t0) / dur), e = 1 - (1 - k) ** 3, mid = Math.sin(Math.PI * e) * 12; place(from + (to - from) * e, fromLift + (toLift - fromLift) * e - mid); if (k < 1) requestAnimationFrame(step); else done(); };
    requestAnimationFrame(step);
  }

  // ----- dòng "tiếp tục học" -----
  const resume = document.querySelector(".resume");
  function paintResume() {
    const cur = currentLesson();
    resume.hidden = false;
    resume.querySelector(".resume-state").textContent = { doing: "Đang học:", next: "Bài tiếp theo:", start: "Chưa bắt đầu. Bài đầu tiên:", finished: "Đã đi hết hành trình. Bài cuối:" }[cur.state];
    resume.querySelector(".resume-path").textContent = `${cur.p.id} / ${cur.g.title || "Các bài"} / Bài ${cur.l.n}. ${cur.l.t}`;
    resume.querySelector(".resume-open").href = cur.l.u;
    resume.querySelector(".resume-show").onclick = () => { expanded.add(`${cur.p.id}:${cur.g.title}`); openPanel(cur.p.id, svg.querySelector(`.island[data-phase="${cur.p.id}"]`)); };
  }

  // ----- đảo -----
  function paintIslands() {
    svg.querySelectorAll(".island").forEach((g) => {
      const s = stats(lessonsOf(byId[g.dataset.phase]));
      const circ = parseFloat(getComputedStyle(g).getPropertyValue("--circ"));
      g.querySelector(".ring").style.strokeDashoffset = String(circ * (1 - s.learned / s.total));
      g.querySelector(".count").textContent = `${s.learned}/${s.total}`;
      g.classList.toggle("started", s.learned + s.doing > 0);
      g.classList.toggle("complete", s.learned === s.total);
    });
  }

  // ----- bảng chi tiết: chỉ hiện module, bấm để mở bài -----
  function renderPanel(id) {
    const p = byId[id], all = Progress.all(), s = stats(lessonsOf(p)), cur = currentLesson();
    const idx = order.findIndex((x) => x.id === id);
    panel.querySelector(".panel-where").textContent = idx >= 0 ? `Đảo ${idx + 1}/${order.length}` : "Dòng hải lưu, học song song";
    panel.querySelector("h2").textContent = p.title;
    panel.querySelector(".panel-why").textContent = p.why;
    panel.querySelector(".meter span").style.width = `${(s.learned / s.total) * 100}%`;
    panel.querySelector(".meter").setAttribute("aria-label", `Đã học ${s.learned} trên ${s.total} bài`);
    panel.querySelector(".panel-stats").textContent = `${s.learned}/${s.total} bài đã học, ${s.doing} đang học`;
    panel.querySelector(".panel-open").href = p.url;
    panel.querySelector(".panel-body").innerHTML = p.groups.map((g, gi) => {
      const key = `${id}:${g.title}`, gs = stats(g.lessons), hasCur = cur.p.id === id && cur.g === g;
      if (hasCur && !expanded.has(key + ":closed")) expanded.add(key);
      const open = expanded.has(key);
      return `<section class="mod-card${hasCur ? " is-current" : ""}${gs.learned === gs.total ? " is-done" : ""}">
  <button type="button" class="mod-toggle" aria-expanded="${open}" aria-controls="mod-${id}-${gi}" data-key="${escText(key)}">
    <span class="mod-title">${escText(g.title || "Các bài")}</span>
    <span class="mod-info">${gs.learned}/${gs.total} bài${g.dur ? `, tối đa ${escText(g.dur)}` : ""}${hasCur ? ", bạn đang ở đây" : ""}</span>
    <span class="mod-bar"><span style="width:${(gs.learned / gs.total) * 100}%"></span></span>
  </button>
  <div class="mod-body" id="mod-${id}-${gi}"><ul>${g.lessons.map((l) => {
        const st = all[l.id] || "todo", isCur = cur.l === l && cur.state !== "finished";
        return `<li${isCur ? ' class="current"' : ""}><button type="button" class="st" data-id="${l.id}" data-s="${st}" aria-label="Bài ${l.n}: ${NAME[st]}. Bấm để đổi trạng thái">${SYM[st]}</button><a href="${l.u}">${l.n}. ${escText(l.t)}</a>${l.d ? '<span class="doc-flag">tài liệu</span>' : ""}</li>`;
      }).join("")}</ul></div>
</section>`;
    }).join("");
  }
  function openPanel(id, from) {
    openId = id; if (from) lastIsland = from;
    svg.classList.add("focus-mode");
    svg.querySelectorAll(".island").forEach((g) => g.classList.toggle("selected", g.dataset.phase === id));
    renderPanel(id);
    panel.hidden = false;
    panel.scrollTop = 0;
    requestAnimationFrame(() => { panel.classList.add("in"); animateView(targetView(id)); });
    panel.focus({ preventScroll: true });
    svg.parentElement.scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
  }
  function closePanel() {
    openId = null; panel.classList.remove("in");
    svg.classList.remove("focus-mode");
    svg.querySelectorAll(".island.selected").forEach((g) => g.classList.remove("selected"));
    animateView(FULL.slice());
    setTimeout(() => { if (!openId) panel.hidden = true; }, reduceMotion ? 0 : 260);
    lastIsland?.focus({ preventScroll: true });
  }
  svg.querySelectorAll(".island").forEach((g) => {
    g.addEventListener("click", () => (openId === g.dataset.phase ? closePanel() : openPanel(g.dataset.phase, g)));
    g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openPanel(g.dataset.phase, g); } });
  });
  panel.querySelector(".panel-close").addEventListener("click", closePanel);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden && !document.querySelector("dialog[open]")) closePanel(); });
  panel.addEventListener("click", (e) => {
    const t = e.target.closest(".mod-toggle");
    if (t) {
      const key = t.dataset.key, open = t.getAttribute("aria-expanded") !== "true";
      t.setAttribute("aria-expanded", String(open));
      if (open) { expanded.add(key); expanded.delete(key + ":closed"); } else { expanded.delete(key); expanded.add(key + ":closed"); }
      return;
    }
    const b = e.target.closest(".st"); if (!b) return;
    Progress.set(b.dataset.id, STATES[(STATES.indexOf(b.dataset.s) + 1) % STATES.length]);
    panel.querySelector(`.st[data-id="${b.dataset.id}"]`)?.focus();
  });
  document.addEventListener("progresschange", () => {
    paintIslands(); paintResume();
    if (openId) { const f = document.activeElement?.dataset?.id; renderPanel(openId); if (f) panel.querySelector(`.st[data-id="${f}"]`)?.focus(); }
    moveBoat(true);
  });
  window.addEventListener("resize", () => { if (openId) animateView(targetView(openId)); });
  paintIslands(); paintResume();
  boatAt = 0; liftAt = liftOf(order[0].id); place(0, liftAt);
  moveBoat(true);

  // ----- sao lưu tiến độ -----
  const msg = document.querySelector(".backup-msg");
  document.querySelector('[data-progress="export"]').addEventListener("click", () => {
    const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), progress: Progress.all() }, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "tien-do-hoc-fullstack.json"; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    msg.textContent = "Đã xuất file tiến độ.";
  });
  document.querySelector('[data-progress="import"]').addEventListener("change", async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try {
      const data = JSON.parse(await f.text()); const p = data.progress;
      if (!(p && typeof p === "object" && Object.values(p).every((v) => STATES.includes(v)))) throw new Error();
      Progress.replace(p); msg.textContent = `Đã nhập tiến độ của ${Object.keys(p).length} bài.`;
    } catch { msg.textContent = "File không đúng định dạng tiến độ, không có gì thay đổi."; }
    e.target.value = "";
  });
  document.querySelector('[data-progress="reset"]').addEventListener("click", () => {
    if (confirm("Xóa toàn bộ tiến độ đã đánh dấu trên trình duyệt này?")) { Progress.replace({}); msg.textContent = "Đã xóa tiến độ."; }
  });
}
