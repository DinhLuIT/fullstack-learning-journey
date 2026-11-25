# Learning hub: hướng dẫn cho Claude khi làm việc trong `site/`

Hub là trang tĩnh "Nếu học lại Fullstack từ đầu, mình sẽ học những gì?", dựng từ nội dung công khai của repo bằng Node.js thuần. Trước khi sửa giao diện, đọc **[DESIGN.md](DESIGN.md)**. Trước khi kết thúc, chạy **`node site/check.mjs`**.

## Cấu trúc

```
site/
├── CLAUDE.md          # file này: cấu trúc, quy tắc code, công thức làm việc
├── DESIGN.md          # quy tắc thiết kế (màu, chữ, bố cục, chuyển động, truy cập)
├── README.md          # hub hiển thị gì, đường dẫn, cách chạy và deploy
├── build.mjs          # dựng toàn bộ trang: khung trang, trang chủ, hải đồ, giai đoạn, bài, lab, capstone, 404, chỉ mục tìm kiếm
├── serve.mjs          # server xem thử tại http://localhost:4321/
├── check.mjs          # kiểm tra: lộ Markdown, link hỏng, lộ nội dung riêng tư, tương phản màu, số mục thanh trên
├── lib/
│   ├── markdown.mjs   # Markdown sang HTML (khối, inline, nhúng SVG, sơ đồ tương tác, tự nhận URL)
│   ├── content.mjs    # đọc curriculum/, file bài học (content: ready), labs/*/DE-BAI.md, capstone/
│   └── chart.mjs      # vẽ hải đồ SVG (đảo, tuyến học, hải lưu DSA, thuyền)
├── data/
│   ├── stack.mjs      # công nghệ theo nhóm, mỗi công nghệ gắn giai đoạn học
│   └── owner.mjs      # thông tin chủ nhân hub (tên, GitHub, repo, link khác)
├── scripts/
│   └── fetch-logos.mjs # tải logo công nghệ từ Devicon (chạy trên máy có mạng)
├── assets/
│   ├── style.css      # toàn bộ CSS; token màu ở đầu file
│   ├── app.js         # tương tác phía trình duyệt (giao diện sáng tối, tìm kiếm, tiến độ, hải đồ, danh sách bài, dải công nghệ)
│   ├── stack/         # logo công nghệ <slug>.svg (tải bằng scripts/fetch-logos.mjs)
│   └── icons/         # biểu tượng giao diện, ví dụ github.svg (tải bằng cùng script)
└── dist/              # kết quả build (gitignore, không sửa tay)
```

## Luồng dữ liệu

```
curriculum/*.md ─┐
bài học NN-*.md ─┤  lib/content.mjs  ──►  build.mjs  ──►  dist/*.html, search.json
labs/*/DE-BAI.md ┤   (phases, lessons)     (lib/markdown.mjs, lib/chart.mjs, data/*)
capstone/README  ┘
```

- `loadContent()` trả về các giai đoạn, mỗi giai đoạn có `groups` (module) và `lessons`. Mỗi bài có `url` (`gd1/22-ten-bai/`), `handout`, `labs`, `assets`, `diagrams`.
- Đường dẫn bài lấy từ **tên file bài học**; frontmatter `lesson:` để ghép với đề cương, `content: ready` để biết bài đã có nội dung.
- Tiến độ của người xem chỉ sống trong trình duyệt (`localStorage`, khóa `hub-progress-v1`, theo `url` của bài).

## Quy tắc code

**Chung**

- Không thêm dependency npm. Hub phải build được chỉ với `node`. Nếu thật sự cần thư viện, hỏi Đình trước và ghi lý do vào file này.
- ES modules, hàm nhỏ, tên tiếng Anh; chú thích tiếng Việt, giải thích "vì sao" chứ không lặp lại code.
- Mọi dữ liệu đưa vào HTML đi qua `esc()` (build) hoặc `escText()` (trình duyệt). Không ghép chuỗi người dùng vào `innerHTML` khi chưa escape.
- Mọi đường dẫn nội bộ đi qua `u()` để chạy đúng với base path của GitHub Pages.
- Link trong Markdown đi qua `hrefFor()`: file công khai thành link hub, file riêng tư thành chữ thường, còn lại thành link GitHub.

**Quyền riêng tư (không được phá)**

- Không xuất bản: `interview-qa.md`, `pitfalls.md`, `progress.md`, README của lab, `.research/`, `07-interview/` ngoài đề cương. Danh sách nằm ở biểu thức `PRIVATE` trong `build.mjs`; `check.mjs` kiểm tra lại.

**HTML và truy cập**

- Thẻ đúng nghĩa: `nav`, `main`, `article`, `section`, `button` cho hành động, `a` cho điều hướng.
- Nút bật tắt có `aria-pressed` hoặc `aria-expanded`; thứ ẩn khỏi trình đọc màn hình có `aria-hidden` và không nhận focus.
- Trang phải đọc được khi JavaScript tắt; JavaScript chỉ làm tốt hơn.

**CSS**

- Chỉ dùng token (`--bg`, `--text`, `--accent`, `--ph`, `--st-*`…), không viết mã màu trực tiếp ngoài khối token.
- Màu giai đoạn gắn bằng `data-ph="gdN"`, bên trong dùng `var(--ph)`.
- Sửa rule gốc thay vì thêm rule ghi đè ở cuối file. (Hiện `style.css` còn vài khối ghi đè do làm nhanh; khi chạm vào phần nào thì gộp phần đó lại.)
- Mọi chuyển động có nhánh `prefers-reduced-motion: reduce`.

**JavaScript phía trình duyệt**

- Không framework. Mỗi tính năng là một khối độc lập, tự kiểm tra phần tử có tồn tại trước khi chạy.
- `localStorage` luôn bọc `try/catch`.
- Không tải script ngoài, trừ Mermaid (chỉ tải khi trang có sơ đồ) và font Google.

## Công thức

| Việc | Làm thế nào |
| --- | --- |
| Thêm một trang | Viết hàm `xxxPage()` trong `build.mjs` dùng `layout()` và `write()`, gọi nó ở phần "chạy" cuối file |
| Thêm thành phần giao diện | Ghi quy tắc vào `DESIGN.md` mục 5 trước, rồi viết HTML trong `build.mjs` và CSS trong `style.css` |
| Thêm công nghệ | Thêm `[slug, tên, giai đoạn]` vào `data/stack.mjs`; thêm tên icon Devicon vào bảng `DEVICON` trong `scripts/fetch-logos.mjs`, rồi Đình chạy script trên máy có mạng. Không tự vẽ logo |
| Đổi thông tin chủ nhân | Sửa `data/owner.mjs` |
| Đổi màu | Sửa token trong `style.css` và bảng ở `DESIGN.md`, chạy `check.mjs` để đo tương phản |
| Hỗ trợ cú pháp Markdown mới | Sửa `lib/markdown.mjs`, thử bằng một đoạn mẫu, chạy `check.mjs` |

## Trước khi xong việc

```bash
node site/check.mjs     # phải in "Không có lỗi."
node site/build.mjs && node site/serve.mjs   # xem bằng mắt ở 360px, 768px, 1280px, 1600px
```

Rồi báo Đình những gì đã đổi và những gì chưa kiểm tra được bằng mắt.
