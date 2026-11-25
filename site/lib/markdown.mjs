// Bộ chuyển Markdown sang HTML tối giản, không dependency.
// Hỗ trợ đúng những gì repo dùng: tiêu đề, đoạn văn, danh sách lồng nhau (kể cả task list),
// bảng, code block (Mermaid), trích dẫn, đường kẻ, thẻ HTML đứng riêng một dòng (details, summary),
// và nhúng sơ đồ tương tác: một đoạn chỉ gồm link tới diagrams/*.html.

export function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function slugify(text) {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/[đĐ]/g, "d")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function stripFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { data: {}, body: src };
  const data = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).split(" #")[0].trim().replace(/^["']|["']$/g, "");
  }
  return { data, body: src.slice(m[0].length) };
}

// ---------- inline ----------
const PH_OPEN = "", PH_CLOSE = ""; // ký tự vùng riêng tư làm chỗ giữ cho code inline

const AU_OPEN = "\uE002", AU_CLOSE = "\uE003"; // chỗ giữ cho URL trần
const BARE_URL = /(?<![\](<\w\/="'])https?:\/\/[^\s<>"'`]+[^\s<>"'`.,;:!?)\]]/g;

export function inline(text, ctx) {
  const codes = [], autos = [];
  let s = text.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return PH_OPEN + (codes.length - 1) + PH_CLOSE; });
  // URL trần (không nằm trong cú pháp link Markdown) thành link bấm được
  s = s.replace(BARE_URL, (u) => { autos.push(u); return AU_OPEN + (autos.length - 1) + AU_CLOSE; });
  s = escapeHtml(s);
  s = s.replace(/!\[((?:[^\[\]]|\[[^\]]*\])*)\]\(([^)\s]+)\)/g, (_, alt, src) => {
    const url = ctx.href(src.replace(/&amp;/g, "&"));
    return url === null ? alt : '<img src="' + escapeHtml(url) + '" alt="' + alt + '" loading="lazy">';
  });
  s = s.replace(/\[((?:[^\[\]]|\[[^\]]*\])*)\]\(([^)\s]+)\)/g, (_, label, href) => {
    const url = ctx.href(href.replace(/&amp;/g, "&"));
    if (url === null) return label;
    const ext = /^https?:/.test(url) ? ' target="_blank" rel="noopener"' : "";
    return '<a href="' + escapeHtml(url) + '"' + ext + ">" + label + "</a>";
  });
  s = s.replace(/&lt;(https?:\/\/[^\s&]+)&gt;/g, (_, u) => '<a href="' + u + '" target="_blank" rel="noopener">' + u + "</a>");
  s = s.replace(/\*\*([^*]+?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[\s(])\*([^*\s][^*]*?)\*(?=[\s).,;:!?]|$)/g, "$1<em>$2</em>");
  s = s.replace(new RegExp(AU_OPEN + "(\\d+)" + AU_CLOSE, "g"), (_, i) => '<a class="url" href="' + escapeHtml(autos[+i]) + '" target="_blank" rel="noopener">' + escapeHtml(autos[+i].replace(/^https?:\/\//, "")) + "</a>");
  s = s.replace(new RegExp(PH_OPEN + "(\\d+)" + PH_CLOSE, "g"), (_, i) => "<code>" + escapeHtml(codes[+i]) + "</code>");
  return s;
}

// ---------- block ----------
const RE = {
  fence: /^(\s*)(```|~~~)\s*([\w-]*)\s*$/,
  heading: /^(#{1,6})\s+(.*?)\s*#*\s*$/,
  hr: /^\s*([-*_])(\s*\1){2,}\s*$/,
  list: /^(\s*)([-*+]|\d+[.)])\s+(.*)$/,
  quote: /^\s*>\s?(.*)$/,
  tableSep: /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/,
  htmlLine: /^\s*<\/?(details|summary|div|section|aside|figure|figcaption|br)\b[^>]*>.*$/i,
  comment: /^\s*<!--/,
};

function isBlockStart(line, next) {
  return RE.fence.test(line) || RE.heading.test(line) || RE.hr.test(line) || RE.list.test(line) ||
    RE.quote.test(line) || RE.htmlLine.test(line) || RE.comment.test(line) ||
    (line.trim().startsWith("|") && next !== undefined && RE.tableSep.test(next));
}

function splitRow(line) {
  let s = line.trim();
  if (s.startsWith("|")) s = s.slice(1);
  if (s.endsWith("|")) s = s.slice(0, -1);
  const cells = []; let cur = "", code = false;
  for (const ch of s) {
    if (ch === "`") code = !code;
    if (ch === "|" && !code) { cells.push(cur.trim()); cur = ""; } else cur += ch;
  }
  cells.push(cur.trim());
  return cells;
}

const indentOf = (line) => line.match(/^\s*/)[0].replace(/\t/g, "    ").length;

function renderList(lines, ctx) {
  const first = lines[0].match(RE.list);
  const ordered = /\d/.test(first[2]);
  const base = indentOf(lines[0]);
  const items = [];
  for (const line of lines) {
    const m = line.match(RE.list);
    if (m && indentOf(line) === base) items.push([m[3]]);
    else items[items.length - 1].push(line);
  }
  const start = ordered ? parseInt(first[2], 10) : 1;
  const tag = ordered ? "ol" : "ul";
  let task = false;
  const html = items.map(([head, ...rest]) => {
    let checkbox = "";
    const t = head.match(/^\[( |x|X)\]\s+(.*)$/);
    if (t) { task = true; checkbox = '<input type="checkbox" disabled' + (t[1] !== " " ? " checked" : "") + "> "; head = t[2]; }
    let inner = checkbox + inline(head, ctx);
    const body = rest.filter((l) => l.trim() !== "");
    if (body.length) {
      const minIndent = Math.min(...body.map(indentOf));
      const sub = rest.map((l) => l.slice(Math.min(minIndent, indentOf(l))));
      const subHtml = renderBlocks(sub, ctx);
      const hasList = body.some((l) => RE.list.test(l));
      inner += !hasList && subHtml.startsWith("<p>") ? " " + subHtml.replace(/^<p>|<\/p>$/g, "") : subHtml;
    }
    return "<li" + (t ? ' class="task"' : "") + ">" + inner + "</li>";
  }).join("");
  return "<" + tag + (ordered && start !== 1 ? ' start="' + start + '"' : "") + (task ? ' class="tasks"' : "") + ">" + html + "</" + tag + ">";
}

export function renderBlocks(lines, ctx) {
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "") { i++; continue; }
    let m;
    if ((m = line.match(RE.fence))) {
      const fence = m[2], lang = m[3]; const body = []; i++;
      while (i < lines.length && !lines[i].trim().startsWith(fence)) body.push(lines[i++]);
      i++;
      const code = escapeHtml(body.join("\n"));
      if (lang === "mermaid") out.push('<figure class="diagram"><pre class="mermaid" data-src="' + code + '">' + code + "</pre></figure>");
      else out.push('<figure class="code"><figcaption>' + escapeHtml(lang || "text") + "</figcaption><pre><code>" + code + "</code></pre></figure>");
      continue;
    }
    if (RE.comment.test(line)) { while (i < lines.length && !lines[i].includes("-->")) i++; i++; continue; }
    if ((m = line.match(RE.heading))) {
      const level = m[1].length;
      const h = inline(m[2], ctx);
      const id = ctx.uniqueId(slugify(m[2]) || "muc");
      out.push("<h" + level + ' id="' + id + '">' + h + ' <a class="anchor" href="#' + id + '" aria-label="Liên kết tới mục này">#</a></h' + level + ">");
      if (level === 2 || level === 3) ctx.toc.push({ level, id, text: h.replace(/<[^>]+>/g, "") });
      i++; continue;
    }
    if (RE.hr.test(line)) { out.push("<hr>"); i++; continue; }
    if (line.trim().startsWith("|") && lines[i + 1] !== undefined && RE.tableSep.test(lines[i + 1])) {
      const head = splitRow(line);
      const aligns = splitRow(lines[i + 1]).map((c) => (c.startsWith(":") && c.endsWith(":") ? "center" : c.endsWith(":") ? "right" : ""));
      i += 2; const rows = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) rows.push(splitRow(lines[i++]));
      const al = (j) => (aligns[j] ? ' style="text-align:' + aligns[j] + '"' : "");
      const th = head.map((c, j) => "<th" + al(j) + ">" + inline(c, ctx) + "</th>").join("");
      const tb = rows.map((r) => "<tr>" + head.map((_, j) => "<td" + al(j) + ">" + inline(r[j] ?? "", ctx) + "</td>").join("") + "</tr>").join("");
      out.push('<div class="table"><table><thead><tr>' + th + "</tr></thead><tbody>" + tb + "</tbody></table></div>");
      continue;
    }
    if (RE.quote.test(line)) {
      const body = [];
      while (i < lines.length && RE.quote.test(lines[i])) body.push(lines[i++].match(RE.quote)[1]);
      out.push("<blockquote>" + renderBlocks(body, ctx) + "</blockquote>");
      continue;
    }
    if (RE.list.test(line)) {
      const base = indentOf(line); const body = [];
      const kind = (l) => (/^\s*\d/.test(l) ? "ol" : "ul");
      const sameItem = (l) => RE.list.test(l) && indentOf(l) === base && kind(l) === kind(line);
      while (i < lines.length) {
        const l = lines[i];
        if (l.trim() === "") {
          const nxt = lines.slice(i + 1).find((x) => x.trim() !== "");
          if (nxt !== undefined && (indentOf(nxt) > base || sameItem(nxt))) { body.push(l); i++; continue; }
          break;
        }
        if (indentOf(l) < base) break;
        if (indentOf(l) === base && !sameItem(l)) break;
        body.push(l); i++;
      }
      out.push(renderList(body, ctx));
      continue;
    }
    if (RE.htmlLine.test(line)) {
      // tiêu đề đáp án có thể chứa thẻ HTML đơn giản: đổi về cú pháp Markdown rồi mới xử lý
      const md = (t) => t.replace(/<code>(.*?)<\/code>/gi, "`$1`").replace(/<(strong|b)>(.*?)<\/\1>/gi, "**$2**").replace(/<(em|i)>(.*?)<\/\1>/gi, "*$2*");
      out.push(line.trim().replace(/<summary>(.*?)<\/summary>/i, (_, t) => "<summary>" + inline(md(t), ctx) + "</summary>"));
      i++; continue;
    }
    const para = [];
    while (i < lines.length && lines[i].trim() !== "" && !(para.length && isBlockStart(lines[i], lines[i + 1]))) para.push(lines[i++].trim());
    const img = para.length === 1 && para[0].match(/^!\[((?:[^\[\]]|\[[^\]]*\])*)\]\(([^)\s]+)\)$/);
    if (img && ctx.figure) { out.push(ctx.figure(img[1], img[2])); continue; }
    const only = para.length === 1 && para[0].match(/^\[((?:[^\[\]]|\[[^\]]*\])*)\]\(((?:[^)\s]*\/)?diagrams\/[^)\s]+\.html)\)$/);
    if (only && ctx.embed) { out.push(ctx.embed(only[1], only[2])); continue; }
    out.push("<p>" + inline(para.join(" "), ctx) + "</p>");
  }
  return out.join("\n");
}

export function render(markdown, { href = (h) => h, embed = null, figure = null } = {}) {
  const ids = new Map();
  const ctx = {
    href, embed, figure, toc: [],
    uniqueId(base) { const n = ids.get(base) || 0; ids.set(base, n + 1); return n ? base + "-" + n : base; },
  };
  const html = renderBlocks(markdown.replace(/\r\n/g, "\n").split("\n"), ctx);
  return { html, toc: ctx.toc };
}
