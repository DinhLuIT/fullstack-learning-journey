# Trực quan hóa và làm bài học sống động

Hướng dẫn cho `/soan-bai` (và đề bài lab của `/hoc-bai`). Mục tiêu: Đình **nhìn thấy** cơ chế thay vì phải tự tưởng tượng. Mỗi hình và mỗi hiệu ứng phải trả lời được câu hỏi: *người học sẽ hiểu điều gì nhanh hơn nhờ nó?* Không trả lời được thì bỏ.

## Chọn loại hình

| Muốn cho thấy | Dùng | Lưu ở |
| --- | --- | --- |
| Luồng, trình tự gọi, vòng đời trạng thái đơn giản | Mermaid (sequence, flowchart, state) | ngay trong handout |
| Cấu trúc trong không gian: bộ nhớ, bucket của HashMap, cây B+Tree, tầng mạng, layer của image | SVG vẽ tay | `handouts/assets/<ten>.svg` |
| Một thay đổi có chủ đích theo thời gian: con trỏ di chuyển, gói tin đi qua, phần tử được chèn | SVG có hoạt ảnh CSS ngắn | `handouts/assets/<ten>.svg` |
| Quá trình nhiều bước mà người học cần **tự điều khiển**: event loop, TCP handshake, 3 bước resize HashMap, Saga bù trừ | Sơ đồ tương tác từng bước (HTML) | `handouts/diagrams/<ten>.html` |
| Kiến trúc hệ thống, sequence nhiều thành phần, ERD, vòng đời phức tạp | Archify nếu đã cài trong Claude Code; không có thì Mermaid hoặc HTML từng bước | `handouts/diagrams/<ten>.html` |

Mỗi tài liệu thường có 2–4 hình. Ít nhất một hình cho khái niệm khó hình dung nhất của bài. Sơ đồ tương tác chỉ dùng khi quá trình có từ 3 trạng thái trở lên thay đổi theo thời gian.

Cách nhúng vào handout:

- SVG: `![Chú thích nói rõ hình cho thấy điều gì [n]](assets/ten.svg)` đứng riêng một dòng. Chú thích là câu đầy đủ và có trích dẫn nếu hình thể hiện một sự thật kỹ thuật.
- Sơ đồ tương tác: `[Sơ đồ tương tác: <việc người học sẽ làm>](diagrams/ten.html)` đứng riêng một dòng. Learning hub nhúng thành khung; trên GitHub nó là link mở file.

## Quy ước SVG

- Có `viewBox`, không đặt `width` và `height` cố định; chữ tối thiểu tương đương 12px ở bề rộng 680px.
- Màu chỉ dùng biến CSS của hub **kèm màu dự phòng**, khai báo trong `<style>` của SVG: `--bg #eef3f7`, `--surface #f8fbfd`, `--line #c9d6e2`, `--text #0f2133`, `--muted #4b6075`, `--accent #0b5fa8`, `--code-bg #e4ecf3`. Ví dụ `.node { fill: var(--surface, #f8fbfd); stroke: var(--line, #c9d6e2); }`. Nhờ vậy hình tự đổi theo giao diện sáng/tối trên hub, và vẫn đọc được khi mở trên GitHub.
- `--accent` chỉ dành cho **thứ đang được nói tới** (bucket bị va chạm, gói tin đang đi). Phần còn lại dùng màu trung tính.
- Chữ trong hình bằng tiếng Việt, tên kỹ thuật giữ tiếng Anh; font: `font-family: "JetBrains Mono", ui-monospace, monospace`.
- Có `<title>` mô tả ngắn. Không dùng `<script>` (hub sẽ gỡ), không nhúng ảnh ngoài, không dùng font ngoài.
- Không trang trí: không gradient, không bóng đổ, không icon minh họa vô nghĩa.

## Hoạt ảnh: chỉ khi có chủ đích

- Hoạt ảnh chỉ để cho thấy **một thay đổi** mà ảnh tĩnh khó diễn tả: con trỏ `next` đổi hướng khi đảo linked list, phần tử dời bucket khi resize.
- Một hoạt ảnh làm một việc, dài 1–4 giây, chạy tối đa vài lần hoặc lặp lại có khoảng nghỉ rõ ràng. Không nhấp nháy, không lặp vô tận chỉ để "cho sinh động".
- Luôn có trạng thái tĩnh đọc được đầy đủ, và tắt hoạt ảnh khi người dùng chọn giảm chuyển động:
  `@media (prefers-reduced-motion: reduce) { * { animation: none !important; } }`

## Sơ đồ tương tác từng bước (HTML)

- Một file HTML tự chứa (CSS, JS bên trong), không tải gì từ mạng.
- Có nút **Bước trước**, **Bước sau**, **Làm lại** và chỉ số "Bước 2/5"; dùng được bằng bàn phím (phím mũi tên trái phải).
- Mỗi bước có một câu giải thích ngắn bên dưới hình: chuyện gì vừa thay đổi và vì sao.
- Đọc `?theme=dark` hoặc `?theme=light` từ URL để chọn màu, dùng đúng bảng màu của hub (tối: nền `#07111c`, bề mặt `#0d1a28`, viền `#1e3247`, chữ `#d3dce5`, chữ phụ `#8fa3b6`, nhấn `#5cb4f0`; sáng như bảng biến ở trên). Không có tham số thì theo `prefers-color-scheme`.
- Tôn trọng `prefers-reduced-motion`: chuyển bước không có hiệu ứng trượt.
- Nội dung của từng bước cũng phải đúng với nguồn đã trích dẫn trong handout.

## Archify (nếu đã cài)

Nếu skill `archify` có trong Claude Code, dùng nó cho sơ đồ kiến trúc, sequence nhiều thành phần, ERD, lifecycle. Mô tả sơ đồ dựa trên đúng các khẳng định đã có nguồn trong handout; xuất file HTML vào `handouts/diagrams/`; chọn giao diện tối hoặc sáng gần với bảng màu của hub. Archify chưa cài thì dùng Mermaid hoặc HTML từng bước, không yêu cầu Đình cài.

## Làm bài học hứng thú hơn (không đánh đổi độ chính xác)

Dùng những yếu tố sau trong handout, mỗi yếu tố ở đúng chỗ của nó:

- **Mở bằng một tình huống thật**, ưu tiên một lỗi có thể xảy ra trong hệ thống đặt sân: "Hai người cùng bấm đặt sân lúc 19:00 và cả hai đều nhận email xác nhận. Chuyện gì đã xảy ra?"
- **Đoán trước khi đọc:** đặt một câu hỏi dự đoán trước phần giải thích, đáp án trong `<details>`. Ví dụ: "Theo bạn, chương trình này in ra gì?"
- **Thử ngay 5 phút:** một thí nghiệm nhỏ chạy được (code minh họa đã chạy thử) cho thấy hiện tượng tận mắt, khác với lab của bài.
- **So sánh đời thường:** chỉ dùng khi nó thật sự giúp hiểu, và ghi rõ chỗ phép so sánh không còn đúng.
- **Chốt mỗi mục bằng một câu hỏi "dừng lại và tự hỏi"**, như trong cấu trúc chuẩn của tài liệu.

## Kiểm chứng hình

Trong bước kiểm chứng của `/soan-bai`, rà cả hình: mọi con số, nhãn, thứ tự bước trong SVG và sơ đồ tương tác phải khớp với nguồn đã trích dẫn. Ghi số hình vào "Báo cáo kiểm chứng".
