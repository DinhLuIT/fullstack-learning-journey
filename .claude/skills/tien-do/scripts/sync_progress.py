#!/usr/bin/env python3
"""Đồng bộ tiến độ từ frontmatter của các file bài học.

- Cập nhật bảng "Tổng quan" trong progress.md (số bài done / tổng theo giai đoạn)
- Cập nhật cột trạng thái trong README.md của từng chủ đề
- In ra tóm tắt: bài đang học, bài cần ôn, bài tiếp theo

Chạy từ thư mục gốc của repo:
    python3 .claude/skills/tien-do/scripts/sync_progress.py
Thêm --dry-run để chỉ xem, không ghi file.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
DRY = "--dry-run" in sys.argv
STATUSES = ("todo", "doing", "done", "review")


def frontmatter(path):
    text = path.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---", text, re.S)
    if not m:
        return None
    data = {}
    for line in m.group(1).splitlines():
        k, sep, v = line.partition(":")
        if sep:
            data[k.strip()] = v.split("#", 1)[0].strip().strip('"')
    return data


def collect():
    lessons = []
    for path in sorted(ROOT.glob("0[1-7]-*/**/[0-9][0-9]-*.md")):
        rel = path.relative_to(ROOT).as_posix()
        if "/labs/" in rel or "/handouts/" in rel:
            continue
        fm = frontmatter(path)
        if not fm or "phase" not in fm or "lesson" not in fm:
            continue
        status = fm.get("status", "todo")
        if status not in STATUSES:
            print(f"Cảnh báo: {rel} có status '{status}' không hợp lệ, coi như todo")
            status = "todo"
        lessons.append({
            "path": path, "rel": rel, "phase": int(fm["phase"]),
            "lesson": int(fm["lesson"]), "title": fm.get("title", path.stem),
            "status": status,
        })
    lessons.sort(key=lambda x: (x["phase"], x["lesson"]))
    return lessons


def write(path, old, new):
    if old != new and not DRY:
        path.write_text(new, encoding="utf-8")
    return old != new


def sync_progress(lessons):
    path = ROOT / "progress.md"
    old = path.read_text(encoding="utf-8")
    totals, done = {}, {}
    for l in lessons:
        totals[l["phase"]] = totals.get(l["phase"], 0) + 1
        done[l["phase"]] = done.get(l["phase"], 0) + (l["status"] == "done")

    def repl(m):
        ph = int(m.group(1))
        if ph not in totals:
            return m.group(0)
        return f"| {ph}. {m.group(2)} | {done[ph]} / {totals[ph]} |"

    new = re.sub(r"^\| (\d)\. (.+?) \| \d+ / \d+ \|$", repl, old, flags=re.M)
    return write(path, old, new), totals, done


def sync_topic_readmes(lessons):
    by_dir = {}
    for l in lessons:
        by_dir.setdefault(l["path"].parent, {})[l["path"].name] = l["status"]
    changed = 0
    for folder, statuses in by_dir.items():
        readme = folder / "README.md"
        if not readme.exists():
            continue
        old = readme.read_text(encoding="utf-8")

        def repl(m):
            st = statuses.get(m.group(2))
            return f"| [{m.group(1)}]({m.group(2)}) | {st} |" if st else m.group(0)

        new = re.sub(r"^\| \[(.+?)\]\(([0-9]{2}-[^)]+\.md)\) \| \w+ \|$", repl, old, flags=re.M)
        changed += write(readme, old, new)
    return changed


def main():
    lessons = collect()
    if not lessons:
        print("Không tìm thấy file bài học nào. Hãy chạy từ thư mục gốc của repo.")
        return 1
    progress_changed, totals, done = sync_progress(lessons)
    readmes_changed = sync_topic_readmes(lessons)

    print("Tiến độ theo giai đoạn:")
    for ph in sorted(totals):
        print(f"  Giai đoạn {ph}: {done[ph]} / {totals[ph]}")
    for st, label in (("doing", "Đang học"), ("review", "Cần ôn lại")):
        items = [l for l in lessons if l["status"] == st]
        if items:
            print(f"{label}:")
            for l in items:
                print(f"  GĐ{l['phase']} bài {l['lesson']}. {l['title']} ({l['rel']})")
    nxt = next((l for l in lessons if l["status"] == "todo"), None)
    if nxt:
        print(f"Bài tiếp theo: GĐ{nxt['phase']} bài {nxt['lesson']}. {nxt['title']}")
    mode = " (dry-run, chưa ghi file)" if DRY else ""
    print(f"Đã cập nhật{mode}: progress.md {'có' if progress_changed else 'không'} thay đổi, "
          f"{readmes_changed} README chủ đề thay đổi")
    return 0


if __name__ == "__main__":
    sys.exit(main())
