// Vẽ hải đồ lộ trình: mỗi giai đoạn là một hòn đảo vẽ bằng đường đồng mức,
// tuyến học là đường đứt nét nối các đảo, DSA là dòng hải lưu chạy song song.
// Hình dạng đảo sinh tất định từ tên giai đoạn nên mỗi lần build đều giống nhau.

const W = 1200, H = 780;
// vị trí đảo theo thứ tự học (gd1 → gd7), DSA nằm trên dòng hải lưu phía dưới
const SPOTS = {
  gd1: [175, 205], gd2: [450, 135], gd3: [730, 215], gd4: [990, 150],
  gd5: [1015, 430], gd6: [745, 515], gd7: [470, 455], dsa: [205, 590],
};

function rng(seed) { // mulberry32
  let a = 0; for (const c of seed) a = (a * 31 + c.charCodeAt(0)) >>> 0;
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

function blob(cx, cy, r, seed, scale = 1) {
  const rand = rng(seed);
  const s1 = rand() * 6.28, s2 = rand() * 6.28, s3 = rand() * 6.28, sq = 0.8 + rand() * 0.35;
  const pts = [];
  for (let i = 0; i < 40; i++) {
    const t = (i / 40) * Math.PI * 2;
    const k = 1 + 0.11 * Math.sin(2 * t + s1) + 0.07 * Math.sin(3 * t + s2) + 0.04 * Math.sin(5 * t + s3);
    pts.push([cx + Math.cos(t) * r * k * scale * (1 / sq), cy + Math.sin(t) * r * k * scale * sq]);
  }
  // Catmull-Rom khép kín sang cubic Bezier cho đường bờ mềm
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length; i++) {
    const p0 = pts[(i - 1 + pts.length) % pts.length], p1 = pts[i], p2 = pts[(i + 1) % pts.length], p3 = pts[(i + 2) % pts.length];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d + "Z";
}

const radius = (n) => Math.round(36 + Math.sqrt(n) * 8.5);

function routePath(ids) {
  // đường cong qua tâm các đảo theo thứ tự học
  const P = ids.map((id) => SPOTS[id]);
  let d = `M${P[0][0]},${P[0][1]}`;
  for (let i = 1; i < P.length; i++) {
    const [x0, y0] = P[i - 1], [x1, y1] = P[i];
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, dx = x1 - x0, dy = y1 - y0;
    const bend = 0.18 * (i % 2 ? 1 : -1);
    d += ` Q${(mx - dy * bend).toFixed(1)},${(my + dx * bend).toFixed(1)} ${x1},${y1}`;
  }
  return d;
}

export function seaChart(phases, esc) {
  const order = phases.filter((p) => p.id !== "dsa").map((p) => p.id);
  const waves = Array.from({ length: 9 }, (_, i) => {
    const y = 60 + i * 85 + (i % 2) * 18, x = 40 + ((i * 137) % 900);
    return `<path class="wave" d="M${x},${y} q12,-7 24,0 t24,0 t24,0"/>`;
  }).join("");
  const current = `<path class="current" d="M40,${H - 95} C220,${H - 150} 330,${H - 60} 520,${H - 105} S860,${H - 55} 1160,${H - 120}"/>`;
  const islands = phases.map((p) => {
    const [cx, cy] = SPOTS[p.id];
    const r = p.id === "dsa" ? 58 : radius(p.lessons.length);
    const circ = 2 * Math.PI * (r + 16);
    const label = p.id === "dsa" ? "dsa" : `gd${p.num}`;
    return `<g class="island" data-phase="${p.id}" data-ring="${r + 16}" tabindex="0" role="button" aria-label="${esc(p.title)}, ${p.lessons.length} bài. Mở chi tiết" style="--circ:${circ.toFixed(1)}">
  <path class="coast" d="${blob(cx, cy, r, p.id)}"/>
  <path class="contour" d="${blob(cx, cy, r, p.id, 0.68)}"/>
  <path class="contour inner" d="${blob(cx, cy, r, p.id + "x", 0.38)}"/>
  <circle class="ring-bg" cx="${cx}" cy="${cy}" r="${r + 16}"/>
  <circle class="ring" cx="${cx}" cy="${cy}" r="${r + 16}" transform="rotate(-90 ${cx} ${cy})"/>
  <text class="name" x="${cx}" y="${cy - 4}" text-anchor="middle">${label}</text>
  <text class="sub" x="${cx}" y="${cy + 16}" text-anchor="middle">${esc(p.short)}</text>
  <text class="count" x="${cx}" y="${cy + r + 40}" text-anchor="middle" data-count="${p.lessons.length}">0/${p.lessons.length}</text>
</g>`;
  }).join("");
  const callout = `<g class="callout" aria-hidden="true"><rect rx="5" ry="5"/><text></text></g>`;
  const boat = `<g class="boat" aria-hidden="true"><path class="hull" d="M-15,4 L15,4 L9,12 L-9,12 Z"/><path class="sail" d="M-1,-20 L-1,2 L12,2 Z"/><path class="sail2" d="M-3,-14 L-3,2 L-12,2 Z"/></g>`;
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="group" aria-label="Hải đồ lộ trình: các đảo theo thứ tự học, nhánh DSA chạy song song">
<g class="sea">${waves}</g>
${current}
<path class="route" d="${routePath(order)}" id="route"/>
<text class="current-label" x="${W - 40}" y="${H - 28}" text-anchor="end">dòng hải lưu dsa: học song song suốt hành trình</text>
${islands}
${boat}
${callout}
</svg>`;
}
