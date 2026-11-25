// Đọc nội dung công khai của repo: đề cương, file bài học (content: ready), đề bài lab, capstone.
// Question bank, tiến độ, README của lab KHÔNG được đọc ở đây.
import fs from "node:fs";
import path from "node:path";
import { stripFrontmatter } from "./markdown.mjs";

export const PHASES = [
  { id: "gd1", num: 1, file: "01-nen-tang.md", dir: "01-fundamentals", short: "Nền tảng" },
  { id: "gd2", num: 2, file: "02-backend.md", dir: "02-backend", short: "Backend" },
  { id: "gd3", num: 3, file: "03-frontend.md", dir: "03-frontend", short: "Frontend" },
  { id: "gd4", num: 4, file: "04-ai-engineering.md", dir: "04-ai-engineering", short: "AI Engineering" },
  { id: "gd5", num: 5, file: "05-devops.md", dir: "05-devops", short: "DevOps" },
  { id: "gd6", num: 6, file: "06-microservices-system-design.md", dir: "06-microservices-system-design", short: "Microservices" },
  { id: "gd7", num: 7, file: "07-phong-van.md", dir: "07-interview", short: "Phỏng vấn" },
  { id: "dsa", num: null, file: "dsa.md", dir: "dsa", short: "DSA" },
];

const read = (p) => fs.readFileSync(p, "utf8");
const exists = (p) => fs.existsSync(p);

function walk(dir, out = []) {
  if (!exists(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".")) continue; // bỏ .research và file ẩn
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}

// Tách file đề cương: tiêu đề, phần mở đầu, các module, các bài, các mục phụ
export function parseCurriculum(text) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const phase = { title: "", intro: [], groups: [], extras: [] };
  let group = null, lesson = null, extra = null;
  const flush = () => { lesson = null; extra = null; };
  for (const line of lines) {
    let m;
    if (!phase.title && (m = line.match(/^# (.+)$/))) { phase.title = m[1].trim(); continue; }
    if ((m = line.match(/^## (.+)$/))) {
      flush();
      if (/^Module /.test(m[1])) { group = { title: m[1].trim(), intro: [], lessons: [] }; phase.groups.push(group); }
      else { extra = { title: m[1].trim(), body: [] }; phase.extras.push(extra); group = null; }
      continue;
    }
    if ((m = line.match(/^### Bài (\d+)\. (.+)$/))) {
      if (!group) { group = { title: null, intro: [], lessons: [] }; phase.groups.push(group); }
      extra = null;
      lesson = { n: +m[1], title: m[2].trim(), body: [] };
      group.lessons.push(lesson);
      continue;
    }
    if (lesson) lesson.body.push(line);
    else if (extra) extra.body.push(line);
    else if (!group) phase.intro.push(line);
    else group.intro.push(line);
  }
  for (const g of phase.groups) { g.intro = g.intro.join("\n").trim(); for (const l of g.lessons) l.body = l.body.join("\n").trim(); }
  for (const x of phase.extras) x.body = x.body.join("\n").trim();
  phase.intro = phase.intro.join("\n").trim();
  const why = phase.intro.match(/^\*\*Vì sao học:\*\*\s*(.+)$/m);
  phase.why = why ? why[1].trim() : "";
  return phase;
}

// Tìm file bài học của mỗi bài để lấy slug và thư mục chủ đề
function indexLessons(root, ph) {
  const map = new Map();
  const base = path.join(root, ph.dir);
  if (ph.id === "dsa") {
    for (const d of fs.readdirSync(base, { withFileTypes: true })) {
      const m = d.isDirectory() && d.name.match(/^(\d{2})-/);
      if (m) map.set(+m[1], { stem: d.name, dir: path.join(base, d.name) });
    }
    return map;
  }
  for (const f of walk(base)) {
    const rel = path.relative(base, f);
    if (/(^|\/)(labs|handouts|assets|diagrams)\//.test(rel) || !/^\d{2}-.*\.md$/.test(path.basename(f))) continue;
    const head = read(f).slice(0, 400);
    const lm = head.match(/^lesson:\s*(\d+)/m);
    if (lm) map.set(+lm[1], { stem: path.basename(f, ".md"), dir: path.dirname(f) });
  }
  return map;
}

export function loadContent(root) {
  const phases = [];
  for (const def of PHASES) {
    const parsed = parseCurriculum(read(path.join(root, "curriculum", def.file)));
    const idx = indexLessons(root, def);
    const lessons = [];
    for (const g of parsed.groups) {
      for (const l of g.lessons) {
        const loc = idx.get(l.n);
        if (!loc) throw new Error(`Không tìm thấy thư mục cho ${def.id} bài ${l.n}`);
        // nội dung bài nằm ngay trong file bài học (frontmatter content: ready); DSA dùng handout.md trong thư mục bài
        const handoutPath = def.id === "dsa" ? path.join(loc.dir, "handout.md") : path.join(loc.dir, loc.stem + ".md");
        const diagramsDir = path.join(loc.dir, "diagrams");
        const assetsDir = path.join(loc.dir, "assets");
        const labs = [];
        if (def.id !== "dsa") {
          const labsDir = path.join(loc.dir, "labs");
          if (exists(labsDir)) for (const d of fs.readdirSync(labsDir, { withFileTypes: true })) {
            const spec = path.join(labsDir, d.name, "DE-BAI.md");
            if (!d.isDirectory() || !exists(spec)) continue;
            const { data, body } = stripFrontmatter(read(spec));
            if (+data.lesson === l.n) labs.push({ slug: d.name, title: data.title || d.name, file: spec, body });
          }
        }
        Object.assign(l, {
          phase: def, group: g.title, stem: loc.stem, topicDir: loc.dir,
          url: `${def.id}/${loc.stem}/`,
          handout: (() => {
            if (!exists(handoutPath)) return null;
            const { data, body } = stripFrontmatter(read(handoutPath));
            return def.id === "dsa" || data.content === "ready" ? { file: handoutPath, body } : null;
          })(),
          diagrams: exists(diagramsDir) ? fs.readdirSync(diagramsDir).filter((f) => f.endsWith(".html")).map((f) => path.join(diagramsDir, f)) : [],
          assets: exists(assetsDir) ? fs.readdirSync(assetsDir).filter((f) => /\.(svg|png|jpe?g|webp|gif)$/i.test(f)).map((f) => path.join(assetsDir, f)) : [],
          labs: labs.sort((a, b) => a.slug.localeCompare(b.slug)),
        });
        lessons.push(l);
      }
    }
    phases.push({ ...def, ...parsed, lessons, url: `${def.id}/` });
  }
  const capstone = read(path.join(root, "capstone", "README.md"));
  return { phases, capstone };
}
