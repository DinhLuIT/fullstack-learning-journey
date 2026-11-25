#!/usr/bin/env node
// Tải logo công nghệ từ Devicon (https://github.com/devicons/devicon, giấy phép MIT) vào site/assets/stack/.
// Chạy trên máy có mạng:  node site/scripts/fetch-logos.mjs
// Logo thuộc về chủ sở hữu của từng thương hiệu; hub chỉ dùng để nhận diện công nghệ trong lộ trình.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { STACK } from "../data/stack.mjs";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(SITE, "assets", "stack");
const CDN = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

// slug trong data/stack.mjs  ->  tên icon trong Devicon (thử lần lượt). Khái niệm không có logo thì không liệt kê.
const DEVICON = {
  "java-21": ["java"],
  "javascript": ["javascript"],
  "typescript": ["typescript"],
  "spring-boot-3": ["spring"],
  "spring-security": ["spring"],
  "spring-data-jpa": ["spring"],
  "spring-cloud": ["spring"],
  "spring-ai": ["spring"],
  "webflux": ["spring"],
  "hibernate": ["hibernate"],
  "maven": ["maven"],
  "junit-5": ["junit"],
  "react": ["react"],
  "redux-toolkit": ["redux"],
  "rtk-query": ["redux"],
  "vite": ["vitejs", "vite"],
  "tailwind-css": ["tailwindcss"],
  "react-router": ["reactrouter"],
  "postgresql": ["postgresql"],
  "redis": ["redis"],
  "minio": ["minio"],
  "kafka": ["apachekafka", "kafka"],
  "linux": ["linux"],
  "git": ["git"],
  "docker": ["docker"],
  "nginx": ["nginx"],
  "github-actions": ["githubactions"],
  "prometheus": ["prometheus"],
  "grafana": ["grafana"],
  "kubernetes": ["kubernetes"],
};

const looksSafe = (svg) => /<svg[\s>]/i.test(svg) && !/<script|javascript:|on\w+\s*=/i.test(svg) && svg.length < 200_000;

async function tryFetch(name) {
  for (const v of ["original", "plain", "original-wordmark", "plain-wordmark"]) {
    const url = `${CDN}/${name}/${name}-${v}.svg`;
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const svg = await res.text();
      if (looksSafe(svg)) return { svg, url };
    } catch (e) {
      throw new Error(`Không kết nối được tới cdn.jsdelivr.net (${e.cause?.code || e.message}). Kiểm tra mạng rồi chạy lại.`);
    }
  }
  return null;
}

fs.mkdirSync(OUT, { recursive: true });
const all = STACK.flatMap((g) => g.items);
const ok = [], missing = [], concept = [];
try {
  for (const [slug, name] of all) {
    const names = DEVICON[slug];
    if (!names) { concept.push(name); continue; }
    let got = null;
    for (const n of names) { got = await tryFetch(n); if (got) break; }
    if (!got) { missing.push(`${name} (${names.join(", ")})`); continue; }
    fs.writeFileSync(path.join(OUT, `${slug}.svg`), got.svg);
    ok.push(`${name}  <-  ${got.url}`);
  }
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
// logo GitHub cho link chủ nhân trên thanh trên cùng (dùng làm mặt nạ, nên màu gốc không quan trọng)
try {
  const gh = await tryFetch("github");
  if (gh) { fs.mkdirSync(path.join(SITE, "assets", "icons"), { recursive: true }); fs.writeFileSync(path.join(SITE, "assets", "icons", "github.svg"), gh.svg); ok.push(`GitHub (thanh trên cùng)  <-  ${gh.url}`); }
  else missing.push("GitHub (thanh trên cùng)");
} catch (e) { console.error(e.message); process.exit(1); }

console.log(`Đã tải ${ok.length} logo:\n  ` + ok.join("\n  "));
if (missing.length) console.log(`\nKhông tìm thấy trên Devicon (${missing.length}), sẽ hiện chữ viết tắt:\n  ` + missing.join("\n  "));
console.log(`\nKhái niệm không có logo (${concept.length}), hiện chữ viết tắt: ${concept.join(", ")}`);
console.log(`\nXong. Chạy lại: node site/build.mjs && node site/serve.mjs`);
