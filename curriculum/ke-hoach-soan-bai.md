# Kế hoạch soạn tài liệu

Nội dung bài (viết thẳng vào file bài học) được soạn **theo đợt**, mỗi đợt 4–6 bài, luôn đi trước tiến độ học khoảng 1–2 tuần. Không soạn xa hơn: phiên bản thư viện có thể thay đổi, và định dạng còn được chỉnh theo góp ý sau mỗi đợt.

## Cách chạy một đợt

1. Mở **một cuộc trò chuyện mới** trong Claude Project, có kết nối folder repo.
2. Gửi: `Soạn đợt N theo curriculum/ke-hoach-soan-bai.md`.
3. Claude đọc `CLAUDE.md`, file này và skill `soan-bai` (kèm `truc-quan.md`), rồi soạn từng bài theo đúng quy trình: nghiên cứu nguồn chính thống, chạy thử mọi ví dụ, vẽ hình, kiểm chứng.
4. Xong mỗi bài, Claude cập nhật cột "Tài liệu" trong bảng dưới. Xong đợt, Đình xem trên hub, góp ý, rồi commit.

## Quy tắc nhắc lại

- Chỉ dùng kiến thức của bài đó và các bài trước nó. Trước bài 14 không có code Java.
- Giai đoạn 1 viết gọn: ý cốt lõi, hình minh họa, bài tập; không có mục câu hỏi phỏng vấn.
- Nguồn viết dạng `[n] [Tên tài liệu](URL) — mục — phiên bản — truy cập YYYY-MM-DD`.
- Góp ý của Đình sau mỗi đợt: ghi vào mục "Góp ý đã áp dụng" bên dưới để các đợt sau làm theo.

## Giai đoạn 1: Nền tảng

| Đợt | Bài | Tên | Tài liệu |
| --- | --- | --- | --- |
| Đã xong | 1 | Biểu diễn dữ liệu | xong |
| Đợt 1 | 2 | Kiến trúc máy tính | xong |
| Đợt 1 | 3 | Hệ điều hành | xong |
| Đợt 1 | 4 | Shell và hệ thống file | xong |
| Đợt 1 | 5 | User, group và phân quyền | chưa |
| Đợt 1 | 6 | Xử lý văn bản và pipe | chưa |
| Đợt 2 | 7 | Process, service và lập lịch | chưa |
| Đợt 2 | 8 | Gói phần mềm, ổ đĩa, mạng và bảo mật server | chưa |
| Đợt 2 | 9 | Mô hình mạng và địa chỉ IP | chưa |
| Đợt 2 | 10 | TCP và UDP | chưa |
| Đợt 2 | 11 | DNS và HTTP | chưa |
| Đợt 2 | 12 | HTTPS, cookie, CORS và giao tiếp thời gian thực | chưa |
| Đợt 3 | 13 | Git từ bên trong và quy trình nhóm | chưa |
| Đợt 3 | 14 | Java chạy thế nào và kiểu dữ liệu | chưa |
| Đợt 3 | 15 | Maven và Gradle | chưa |
| Đợt 3 | 16 | Lập trình hướng đối tượng | chưa |
| Đợt 3 | 17 | Nguyên lý SOLID và thiết kế hướng đối tượng | chưa |
| Đợt 4 | 18 | Design pattern nhóm khởi tạo | chưa |
| Đợt 4 | 19 | Design pattern nhóm cấu trúc | chưa |
| Đợt 4 | 20 | Design pattern nhóm hành vi | chưa |
| Đợt 4 | 21 | Exception và Generics | chưa |
| Đợt 4 | 22 | Collections từ bên trong | chưa |
| Đợt 4 | 23 | Java 8: lambda, Stream, Optional và java.time | chưa |
| Đợt 5 | 24 | Java 9 đến 17: những gì dự án hiện đại dùng | chưa |
| Đợt 5 | 25 | Java 21 | chưa |
| Đợt 5 | 26 | I/O và NIO.2 | chưa |
| Đợt 5 | 27 | Reflection và annotation | chưa |
| Đợt 5 | 28 | Kiểm thử đơn vị với JUnit 5 | chưa |
| Đợt 5 | 29 | Concurrency phần 1: thread và đồng bộ | chưa |
| Đợt 6 | 30 | Concurrency phần 2: công cụ cấp cao | chưa |
| Đợt 6 | 31 | JVM: bộ nhớ và garbage collection | chưa |
| Đợt 6 | 32 | Mô hình quan hệ và thiết kế schema | chưa |
| Đợt 6 | 33 | Truy vấn từ cơ bản đến nâng cao | chưa |
| Đợt 6 | 34 | Index và tối ưu truy vấn | chưa |
| Đợt 7 | 35 | Transaction, ACID và isolation | chưa |
| Đợt 7 | 36 | Lock và xử lý đồng thời trong database | chưa |
| Đợt 7 | 37 | View, function, stored procedure và trigger | chưa |
| Đợt 7 | 38 | Vận hành database và NoSQL | chưa |

Các giai đoạn sau sẽ được chia đợt khi Giai đoạn 1 gần xong.

## Góp ý đã áp dụng

- 2026-11-25 (sau Bài 1): bỏ mục câu hỏi phỏng vấn; thêm mục Bài tập không kèm đáp án; Giai đoạn 1 học chế độ nhanh; không dùng kiến thức chưa học.
