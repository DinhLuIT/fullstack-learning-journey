# Quy tắc thiết kế learning hub

Hub tên **"Nếu học lại Fullstack từ đầu, mình sẽ học những gì?"**. Đây là nơi để **đọc và học**. Mọi quyết định giao diện trả lời một câu hỏi: người học có tập trung vào bài học tốt hơn không?

Đọc file này trước mỗi lần sửa giao diện. Khi có điều chưa được quy định, thêm quy tắc vào đây trước rồi mới làm.

## 1. Nguyên tắc

1. **Nội dung là trung tâm.** Ở trang bài học, cột đọc là thứ duy nhất nổi bật; điều hướng, danh sách bài, mục lục đều lùi lại và có thể ẩn đi.
2. **Bản sắc nằm ở khung, không nằm trong bài.** Phong cách terminal (dấu nhắc `dinh@hub:~$`, chữ mono) và chủ đề biển cả của mệnh Thủy dùng cho logo, trang chủ, hải đồ. Bên trong nội dung bài học chỉ có chữ đọc dễ chịu.
3. **Một điểm nhấn cho mỗi trang.** Trang chủ: phiên terminal. Hải đồ: bản đồ. Trang bài: chính nội dung bài. Không thêm điểm nhấn thứ hai.
4. **Không bao giờ lộ cú pháp Markdown.** Không hiện `#`, `##`, `**`, `[]()`, `|`, `>` hay ký tự vẽ cây như `├──` ở bất kỳ đâu người học nhìn thấy. Tiêu đề phân cấp bằng cỡ chữ, độ đậm và khoảng cách.
5. **Hiện ít, mở khi cần.** Danh sách dài được gom nhóm và thu gọn; chỉ nhóm liên quan tới vị trí hiện tại được mở sẵn.

## 2. Màu (mệnh Thủy)

Màu theo hành Thủy (xanh nước, xanh đen) và Kim sinh Thủy (bạc, xám ánh kim). **Không dùng** vàng đất, nâu (Thổ khắc Thủy).

| Token | Tối | Sáng | Dùng cho |
| --- | --- | --- | --- |
| `--bg` | `#07111c` | `#eef3f7` | Nền trang |
| `--surface` | `#0d1a28` | `#f8fbfd` | Thẻ, bảng, khối code, bảng nổi |
| `--line` | `#1e3247` | `#c9d6e2` | Đường viền, đường kẻ |
| `--text` | `#d3dce5` | `#0f2133` | Chữ chính |
| `--muted` | `#8fa3b6` | `#4b6075` | Chữ phụ, nhãn |
| `--accent` | `#5cb4f0` | `#0b5fa8` | Link, trạng thái, thứ đang được nói tới |
| `--code-bg` | `#0a1522` | `#e4ecf3` | Nền code |

- Màu nhấn dùng tiết kiệm: link, trạng thái được chọn, tiến độ, phần tử đang được giải thích trong hình. Không tô nền lớn bằng màu nhấn.
- Mọi cặp chữ và nền đạt tương phản WCAG AA (từ 4,5 trở lên). Đổi token thì chạy lại phép đo.
- Không dùng gradient, không bóng đổ trang trí. Bóng chỉ dùng cho lớp nổi (bảng chi tiết, hộp tìm kiếm) để tách khỏi nền.

### Phổ màu Thủy

Tám sắc trong dải ngọc lam, xanh nước, xanh biển, chàm, cùng một sắc bạc thép. Mỗi giai đoạn có một sắc riêng để người học nhận ra mình đang ở đâu; ba trạng thái tiến độ dùng lại ba sắc trong phổ.

| Token | Tên | Tối | Sáng | Dùng cho |
| --- | --- | --- | --- | --- |
| `--ph-1` | Ngọc lam | `#35b8a2` | `#1e675b` | gd1 Nền tảng; trạng thái **đã xong** |
| `--ph-2` | Xanh nước | `#2eb5c4` | `#1a656d` | gd2 Backend; trạng thái **đang học** |
| `--ph-3` | Xanh trời | `#47aede` | `#186386` | gd3 Frontend |
| `--ph-4` | Xanh biển | `#70a8e8` | `#1b5da9` | gd4 AI Engineering |
| `--ph-5` | Biển sâu | `#88a2e7` | `#2953c7` | gd5 DevOps |
| `--ph-6` | Chàm | `#9b9ee6` | `#454ad1` | gd6 Microservices |
| `--ph-7` | Chàm tím | `#a99ae2` | `#6045c9` | gd7 Phỏng vấn; trạng thái **cần ôn** |
| `--ph-8` | Bạc thép | `#96a6b6` | `#4d5e6f` | DSA (bạc, Kim sinh Thủy) |

- Mọi sắc đạt tương phản từ 7 trở lên ở giao diện tối và từ 5,5 trở lên ở giao diện sáng, trên cả nền trang, bề mặt và nền code, nên dùng được cho chữ.
- Gắn màu giai đoạn bằng thuộc tính `data-ph="gdN"` (hoặc `dsa`, `capstone`); bên trong dùng biến `--ph`. Không viết mã màu trực tiếp.
- Màu giai đoạn chỉ dùng để **nhận diện**: viền trái tiêu đề giai đoạn, số bài, đảo trên hải đồ, thanh tiến độ, nhãn trong menu. Link và nút vẫn dùng `--accent`.
- Trạng thái tiến độ: `--st-doing`, `--st-done`, `--st-review`; trạng thái chưa học dùng `--muted`. Luôn đi kèm ký hiệu (◐ ● ↻) và chữ.
- Mỗi màn hình chỉ nên có một sắc giai đoạn chiếm ưu thế (trang của giai đoạn đó). Trang tổng quan (trang chủ, hải đồ) được hiện nhiều sắc vì nhiệm vụ của nó là phân biệt các giai đoạn.

## 3. Chữ

| Vai trò | Font | Cỡ, độ đậm |
| --- | --- | --- |
| Thân bài, giao diện, danh sách bài, mục lục | Be Vietnam Pro | 17px, dòng 1,75; nhãn 13–14px |
| Tiêu đề trang (h1) | JetBrains Mono | 700, 1,6–2,15rem |
| Tiêu đề mục trong bài (h2, h3, h4) | Be Vietnam Pro | h2 600 1,45rem; h3 600 1,15rem; h4 600 1rem |
| Code, dấu nhắc terminal, phím tắt | JetBrains Mono | 0,875em |

- Hai font đều hỗ trợ tiếng Việt; font mới phải kiểm tra bảng ngôn ngữ có Vietnamese.
- Cột đọc tối đa khoảng 70 ký tự.
- Không viết hoa toàn bộ, không thêm nhãn nhỏ phía trên tiêu đề, không tô màu riêng một từ trong tiêu đề.
- Mono chỉ dùng cho những gì thật sự là code hoặc dòng lệnh. Không dùng mono cho danh sách bài hay mục lục.

## 4. Bố cục

**Thanh trên cùng: 5 mục điều hướng và 1 link chủ nhân.** Dấu nhắc (về trang chủ), Hải đồ, Giai đoạn (menu thả xuống gồm 7 giai đoạn, DSA, capstone), Tìm (`/`), Giao diện sáng tối; cuối thanh là link GitHub của chủ nhân (logo kèm tên tài khoản, màn hình hẹp chỉ hiện logo). Không liệt kê từng giai đoạn trên thanh, không thêm mục khác.

**Trang bài học: ba vùng.**

| Vùng | Hành vi |
| --- | --- |
| Danh sách bài (trái) | Thu gọn hoặc mở bằng nút ở đầu bài, ghi nhớ lựa chọn. Bài trong giai đoạn được gom theo module; chỉ module chứa bài hiện tại mở sẵn. Màn hình hẹp: thành ngăn kéo. |
| Cột đọc (giữa) | Luôn hiện, tối đa ~70 ký tự. |
| Mục lục (phải) | Chỉ hiện trên màn hình rộng từ 1440px. |

**Chế độ tập trung** (nút ở đầu bài, phím `f`) ẩn danh sách bài và mục lục, để lại cột đọc và thanh trên cùng.

## 5. Thành phần

| Thành phần | Quy tắc |
| --- | --- |
| Link | Màu nhấn, gạch chân mảnh; link ra ngoài mở tab mới. URL trần trong tài liệu tự thành link, hiện bỏ `https://` |
| Nút | Viền mảnh, chữ thường, nhãn là động từ ("Mở bài", "Xuất file tiến độ") |
| Trạng thái tiến độ | Bốn trạng thái: chưa học, đang học, đã xong, cần ôn; ký hiệu ○ ◐ ● ↻ kèm chữ, màu theo `--st-*`, không chỉ dựa vào màu |
| Code | Khối nền `--code-bg`, nhãn ngôn ngữ nhỏ góc trên, nút chép |
| Bảng | Viền mảnh, tiêu đề cột chữ phụ, cuộn ngang khi hẹp |
| Đáp án ẩn | `details` có tiêu đề rõ việc người học sẽ làm ("Xem đáp án") |
| Hình và sơ đồ | Theo `.claude/skills/soan-bai/truc-quan.md`; luôn có chú thích |
| Công nghệ | Trang chủ: dải chạy (xem mục 6). Trang giai đoạn: nhãn bo tròn. Tô màu theo giai đoạn học nó (`site/data/stack.mjs`); chưa có logo thì hiện chữ viết tắt. Logo lấy từ Devicon bằng `site/scripts/fetch-logos.mjs`, đặt trên ô nền sáng để logo màu tối vẫn rõ; không tự vẽ logo |
| Trạng thái trống | Nói rõ chuyện gì đang thiếu và làm gì để có |

## 6. Chuyển động

- Chỉ hai loại: **phản hồi hành động** (mở bảng, mở module, đổi trạng thái) và **một khoảnh khắc mỗi trang** (gõ lệnh ở trang chủ, thuyền chạy trên hải đồ).
- Thời lượng: phản hồi giao diện 150–300ms; chuyển cảnh camera hải đồ tối đa khoảng 650ms. Dùng ease-out cho thứ xuất hiện, ease-in-out cho thứ di chuyển.
- Không chuyển động trang trí chạy liên tục. Không hiệu ứng xuất hiện cho từng khối khi cuộn.
- **Ngoại lệ duy nhất: dải công nghệ ở trang chủ** (chủ nhân hub chọn). Điều kiện bắt buộc: chạy chậm (mỗi vòng từ 50 giây trở lên), dừng khi di chuột hoặc focus bằng bàn phím, có nút Tạm dừng và ghi nhớ lựa chọn (WCAG 2.2.2), đứng yên thành lưới khi bật giảm chuyển động, bản sao dùng cho vòng lặp phải có `aria-hidden` và không nhận focus. Không thêm dải chạy ở trang khác.
- Luôn tôn trọng `prefers-reduced-motion`.
- Khi cần chi tiết hơn về thời lượng và easing, dùng skill `motion-design`; nếu mâu thuẫn, file này thắng.

## 7. Truy cập

- Mọi thứ bấm được đều dùng được bằng bàn phím, có viền focus rõ.
- Nút bật tắt có `aria-expanded` hoặc `aria-pressed`. Hình có chú thích hoặc `aria-label`.
- Trạng thái không bao giờ chỉ thể hiện bằng màu.
- Kiểm tra ở bề rộng 360px, 768px, 1280px, 1600px.

## 8. Ngôn từ

Tiếng Việt, câu ngắn, giọng tự nhiên. Đặt tên theo điều người học hiểu, không theo cách hệ thống làm. Không dùng mũi tên `→` gắn sau nút hay link, không nối thông tin bằng dấu chấm giữa (`A · B`).

## 9. Kiểm tra trước khi đưa lên

- [ ] Không còn ký hiệu Markdown lộ ra trên trang (chạy kiểm tra trong `build.mjs` hoặc tìm `#`, `**`, `](` trong chữ hiển thị)
- [ ] Thanh trên cùng: 5 mục điều hướng và 1 link GitHub
- [ ] Trang bài học đọc được khi đã ẩn danh sách bài và mục lục
- [ ] Tương phản đạt AA ở cả hai giao diện
- [ ] Dùng được bằng bàn phím; chuyển động tắt khi bật giảm chuyển động
- [ ] Không có link hỏng (`node site/build.mjs` rồi chạy kiểm tra link)
