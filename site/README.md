# Learning hub

Trang tĩnh hiển thị tài liệu học công khai của repo, dựng bằng Node.js thuần, không cần cài package.

## Hub hiển thị gì

| Nội dung | Nguồn trong repo |
| --- | --- |
| Đề cương từng giai đoạn và từng bài | `curriculum/*.md` |
| Nội dung bài học do `/soan-bai` soạn | file bài học `<giai-đoạn>/<chủ-đề>/NN-*.md` có frontmatter `content: ready` (DSA: `dsa/NN-*/handout.md`) |
| Hình minh họa SVG, ảnh | `<chủ-đề>/assets/` |
| Sơ đồ tương tác (HTML) | `<chủ-đề>/diagrams/` |
| Đề bài lab | `labs/<tên-lab>/DE-BAI.md` |
| Yêu cầu capstone | `capstone/README.md` |

**Không bao giờ hiển thị:** `interview-qa.md`, `pitfalls.md`, `progress.md`, README của lab, `.research/`, `07-interview/question-bank/`. Link tới những file này trong tài liệu sẽ hiện thành chữ thường. Bài chưa soạn (không có `content: ready`) hiện trạng thái trống.

## Đường dẫn

| Trang | URL |
| --- | --- |
| Giai đoạn | `/gd1/` … `/gd7/`, `/dsa/` |
| Bài học | `/gd1/22-collections-tu-ben-trong/` (tên thư mục = tên file bài học) |
| Lab | `/gd1/22-collections-tu-ben-trong/labs/my-hashmap/` |
| Capstone | `/capstone/` |

## Hải đồ và tiến độ của người xem

- Trang `/lo-trinh/` vẽ lộ trình thành hải đồ: mỗi giai đoạn là một hòn đảo (`lib/chart.mjs`), DSA là dòng hải lưu chạy song song. Bấm vào đảo để mở bảng chi tiết các bài.
- Mỗi người xem tự đánh dấu tiến độ (chưa học, đang học, đã xong, cần ôn) ở đầu trang bài hoặc trong bảng chi tiết của đảo. Tiến độ lưu trong `localStorage` của trình duyệt (khóa `hub-progress-v1`, theo đường dẫn bài), có nút xuất và nhập file để sao lưu.
- Đổi tên file bài học sẽ đổi đường dẫn của bài đó, nên tiến độ đã đánh dấu cho bài đó sẽ không còn khớp.
- Dòng "Vì sao học" của mỗi đảo lấy từ dòng `**Vì sao học:**` ở đầu file đề cương của giai đoạn.

## Chạy trên máy

```bash
node site/build.mjs        # dựng vào site/dist
node site/serve.mjs        # mở http://localhost:4321/
```

## Deploy

Workflow `.github/workflows/hub.yml` tự build và deploy lên GitHub Pages mỗi lần push lên `main`. Lần đầu cần bật GitHub Pages cho repo và chọn nguồn là GitHub Actions.

## Quy ước cho hình và sơ đồ trong tài liệu

- **SVG** (`assets/*.svg`): được nhúng thẳng vào trang. Dùng biến CSS kèm màu dự phòng để tự đổi theo giao diện sáng/tối, ví dụ `fill: var(--accent, #0b5fa8)`. Các biến có sẵn: `--bg`, `--surface`, `--line`, `--text`, `--muted`, `--accent`, `--code-bg`. Không dùng `<script>` (sẽ bị gỡ).
- **Sơ đồ tương tác** (`diagrams/*.html`): đặt link một mình trên một dòng, ví dụ `[Sơ đồ tương tác: put() từng bước](diagrams/put-flow.html)`; hub sẽ nhúng thành khung. Trang được gọi kèm `?theme=dark` hoặc `?theme=light`.
- **Mermaid:** code block ` ```mermaid `, hub tự vẽ theo màu của giao diện.
