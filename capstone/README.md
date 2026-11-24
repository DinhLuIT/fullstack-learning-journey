# Capstone: hệ thống đặt sân thể thao đa cơ sở

Tên mã: `court-booking`

Một chuỗi sân thể thao có nhiều cơ sở trong thành phố, mỗi cơ sở có nhiều sân (bóng đá mini, cầu lông, pickleball). Người chơi tìm và đặt sân trực tuyến, nhân viên quản lý lịch tại cơ sở, quản trị viên quản lý toàn chuỗi.

Dự án lớn dần qua từng giai đoạn của lộ trình; mỗi phiên bản được gắn tag trên Git.

## 1. Bối cảnh và mục tiêu

**Vấn đề hiện tại (giả định):** người chơi đặt sân qua điện thoại hoặc tin nhắn, nhân viên ghi sổ tay. Hậu quả là đặt trùng giờ, khách đến không có sân, giờ trống không ai biết, chủ sân không thấy được doanh thu và tỉ lệ lấp đầy.

**Mục tiêu sản phẩm:**

- Người chơi thấy ngay giờ trống và đặt sân trong vòng một phút
- Không bao giờ có hai đơn cùng một sân, cùng một khung giờ
- Nhân viên nắm lịch trong ngày của cơ sở trên một màn hình
- Chủ chuỗi xem được doanh thu và tỉ lệ lấp đầy theo cơ sở, theo khung giờ

## 2. Thuật ngữ

| Thuật ngữ | Ý nghĩa |
| --- | --- |
| Cơ sở (venue) | Một địa điểm của chuỗi, có địa chỉ và giờ mở cửa riêng |
| Sân (court) | Một sân cụ thể trong cơ sở, thuộc một môn |
| Môn (sport) | Bóng đá mini 5 người, bóng đá mini 7 người, cầu lông, pickleball |
| Khung giờ (slot) | Đơn vị thời gian nhỏ nhất để đặt, 30 phút |
| Giữ chỗ (hold) | Trạng thái tạm khóa khung giờ trong lúc người chơi thanh toán |
| Đơn đặt (booking) | Một lần đặt: sân, ngày, giờ bắt đầu, giờ kết thúc, người đặt, trạng thái |
| Bảng giá (price rule) | Giá theo môn, theo cơ sở, theo giờ thường hoặc giờ cao điểm |

## 3. Người dùng và vai trò

| Vai trò | Là ai | Được làm gì |
| --- | --- | --- |
| Khách vãng lai | Người chưa đăng nhập | Xem cơ sở, sân, bảng giá, lịch trống |
| Người chơi | Người đã có tài khoản | Đặt, hủy, xem lịch sử đơn của **chính mình**; dùng trợ lý AI |
| Nhân viên cơ sở | Nhân viên trực tại một cơ sở | Xem và quản lý lịch của **cơ sở mình**: tạo đơn hộ khách gọi điện, check-in, khóa sân bảo trì |
| Quản trị viên | Chủ chuỗi hoặc người được ủy quyền | Quản lý mọi cơ sở, sân, bảng giá, tài khoản nhân viên; xem báo cáo |

## 4. Chức năng

Mỗi chức năng có mã để tham chiếu trong issue, commit và test. Cột "Từ" cho biết phiên bản bắt đầu có chức năng đó.

### Tài khoản

| Mã | Chức năng | Từ |
| --- | --- | --- |
| F-01 | Người chơi đăng ký bằng email và mật khẩu, đăng nhập, đăng xuất | v1 |
| F-02 | Người chơi đặt lại mật khẩu qua email | v2 |
| F-03 | Người chơi đăng nhập bằng Google | v2 |
| F-04 | Quản trị viên tạo tài khoản nhân viên và gán vào một cơ sở | v2 |

### Tìm và xem sân

| Mã | Chức năng | Từ |
| --- | --- | --- |
| F-10 | Xem danh sách cơ sở: địa chỉ, giờ mở cửa, các môn có sân | v1 |
| F-11 | Tìm khung giờ trống theo môn, cơ sở, ngày | v1 |
| F-12 | Xem lịch trống dạng lưới (sân × giờ) của một cơ sở trong một ngày | v3 |
| F-13 | Xem giá của khung giờ trước khi đặt (giá thường hoặc giờ cao điểm) | v1 |

### Đặt sân

| Mã | Chức năng | Từ |
| --- | --- | --- |
| F-20 | Người chơi chọn sân và khoảng giờ, hệ thống giữ chỗ trong 10 phút | v1 |
| F-21 | Người chơi thanh toán, đơn chuyển sang "đã xác nhận". Thanh toán đi qua interface `PaymentGateway`; v1–v5 dùng bản giả lập | v1 |
| F-22 | Hết 10 phút chưa thanh toán thì giữ chỗ tự hết hạn, khung giờ trống lại | v2 |
| F-23 | Người chơi hủy đơn, hoàn tiền theo chính sách hủy | v1 |
| F-24 | Người chơi xem lịch sử đơn và đơn sắp tới của mình | v1 |
| F-25 | Người chơi đặt định kỳ hằng tuần (ví dụ tối thứ Ba, 4 tuần liên tiếp), theo nguyên tắc toàn bộ hoặc không (R-09) | v2 |
| F-26 | Người chơi đánh giá (1–5 sao, kèm bình luận) cho đơn đã check-in, mỗi đơn một lần (R-10) | v2 |
| F-27 | Thanh toán bằng VietQR: sinh mã chuyển khoản, xác nhận tự động qua webhook (mở rộng tùy chọn) | sau v5 |

### Nhân viên cơ sở

| Mã | Chức năng | Từ |
| --- | --- | --- |
| F-30 | Xem lịch trong ngày của tất cả sân thuộc cơ sở mình | v1 |
| F-31 | Tạo đơn hộ khách đặt qua điện thoại (không cần tài khoản người chơi) | v2 |
| F-32 | Check-in khi khách đến; đánh dấu "không đến" sau 15 phút | v2 |
| F-33 | Khóa một sân trong một khoảng thời gian để bảo trì | v2 |

### Quản trị

| Mã | Chức năng | Từ |
| --- | --- | --- |
| F-40 | Quản lý cơ sở, sân, giờ mở cửa | v1 |
| F-41 | Quản lý bảng giá: giá gốc theo môn và cơ sở, kèm tỉ lệ tăng giờ cao điểm | v1 |
| F-42 | Báo cáo doanh thu và tỉ lệ lấp đầy theo cơ sở, theo ngày, theo khung giờ | v2 |
| F-43 | Ẩn đánh giá vi phạm | v2 |

### Thông báo

| Mã | Chức năng | Từ |
| --- | --- | --- |
| F-50 | Gửi email xác nhận khi đơn được xác nhận hoặc bị hủy | v2 |
| F-51 | Gửi email nhắc trước giờ chơi 2 tiếng | v2 |

### Trợ lý AI

| Mã | Chức năng | Từ |
| --- | --- | --- |
| F-60 | Trả lời câu hỏi về giá, chính sách hủy, tiện ích cơ sở dựa trên tài liệu của chuỗi (RAG), có trích nguồn, bằng ngôn ngữ người dùng hỏi | v4 |
| F-61 | Tìm sân bằng câu nói tự nhiên, ví dụ "tối mai 7 giờ có sân cầu lông nào ở Quận 7 không" | v4 |
| F-62 | Đặt sân qua trợ lý, bắt buộc hỏi xác nhận trước khi tạo đơn | v4 |

### Giao diện

| Mã | Chức năng | Từ |
| --- | --- | --- |
| F-70 | Giao diện song ngữ tiếng Việt và tiếng Anh (i18n): nút, nhãn, thông báo lỗi. Dữ liệu nghiệp vụ (tên sân, mô tả) giữ một ngôn ngữ | v3 |

## 5. Quy tắc nghiệp vụ

| Mã | Quy tắc |
| --- | --- |
| R-01 | Mỗi đơn dài tối thiểu 60 phút, tối đa 180 phút, là bội số của 30 phút |
| R-02 | Chỉ đặt được trong giờ mở cửa của cơ sở và trong vòng 14 ngày tới |
| R-03 | Giữ chỗ hết hạn sau 10 phút nếu chưa thanh toán |
| R-04 | Một người chơi có tối đa 2 giữ chỗ chưa thanh toán cùng lúc |
| R-05 | Giờ cao điểm: 17:00–22:00 các ngày trong tuần, cả ngày thứ Bảy và Chủ nhật. Giá cao điểm = giá gốc × (1 + tỉ lệ), tỉ lệ đặt theo cơ sở và môn, mặc định 30% |
| R-06 | Chính sách hủy: trước giờ chơi từ 24 tiếng trở lên hoàn 100%; từ 6 đến dưới 24 tiếng hoàn 50%; dưới 6 tiếng không hoàn |
| R-07 | Đơn định kỳ gồm các đơn con độc lập; hủy một buổi không ảnh hưởng các buổi khác |
| R-08 | Nhân viên chỉ thao tác trên cơ sở mình được gán |
| R-09 | Đặt định kỳ theo nguyên tắc toàn bộ hoặc không: chỉ cần một buổi trong chuỗi đã kín thì từ chối cả chuỗi, báo rõ buổi nào bị trùng |
| R-10 | Chỉ người đặt đơn, và chỉ khi đơn đã check-in, mới được đánh giá; trong vòng 7 ngày sau giờ chơi |
| R-11 | Đơn vắt qua mốc giờ cao điểm được tính tiền theo từng khung 30 phút: mỗi khung lấy giá của chính nó rồi cộng dồn |

## 6. Yêu cầu phi chức năng

Mỗi yêu cầu gắn với bài học sẽ giải quyết nó trong lộ trình.

| Mã | Yêu cầu | Bài học liên quan |
| --- | --- | --- |
| N-01 | **Không đặt trùng:** 100 request đồng thời cùng đặt một khung giờ thì đúng 1 request thành công | GĐ1 bài 26–27, GĐ2 bài 5, 9 |
| N-02 | **Idempotent:** người chơi bấm "đặt" hai lần hoặc mạng gửi lại request thì không tạo hai đơn | GĐ2 bài 10 |
| N-03 | **Phân quyền đúng:** người chơi không xem được đơn của người khác; nhân viên không thao tác được cơ sở khác | GĐ2 bài 11–12 |
| N-04 | **Mật khẩu và phiên đăng nhập:** mật khẩu băm bằng BCrypt; access token ngắn hạn, refresh token thu hồi được | GĐ2 bài 11 |
| N-05 | **Chống dò mật khẩu:** tối đa 5 lần đăng nhập sai mỗi phút cho một tài khoản | GĐ2 bài 14 |
| N-06 | **Hiệu năng:** tra lịch trống có p95 dưới 300 ms với dữ liệu 50 cơ sở, 500 sân, một năm đơn đặt | GĐ1 bài 25, GĐ2 bài 13 |
| N-07 | **Tiền và thời gian:** tiền lưu bằng số nguyên VND, không dùng số thực; thời gian lưu theo UTC, hiển thị theo giờ Việt Nam | GĐ1 bài 1, 23 |
| N-08 | **Truy vết:** mọi request có request ID xuất hiện trong log của mọi tầng (và mọi service từ v6) | GĐ2 bài 16, GĐ6 bài 12 |
| N-09 | **Giao diện:** ưu tiên điện thoại (mobile-first), dùng được bằng bàn phím, tương phản đạt WCAG AA | GĐ3 bài 1–2 |
| N-10 | **Kiểm thử:** logic đặt sân có unit test; chống đặt trùng có integration test với database thật | GĐ2 bài 15 |
| N-11 | **Triển khai:** từ v5, mỗi lần merge tự động test và deploy; health check thất bại thì tự rollback | GĐ5 bài 7 |
| N-12 | **Chịu lỗi:** từ v6, trợ lý AI hoặc dịch vụ thông báo bị chậm hay chết thì vẫn đặt sân bình thường | GĐ6 bài 10 |
| N-13 | **Đặt định kỳ nguyên tử:** kiểm tra và giữ mọi buổi trong cùng một transaction; thiếu một buổi thì không buổi nào được tạo | GĐ1 bài 26, GĐ2 bài 5 |
| N-14 | **Webhook thanh toán idempotent:** cùng một giao dịch gửi lại nhiều lần chỉ được ghi nhận một lần | GĐ2 bài 10, GĐ6 bài 11 |

## 7. Ngoài phạm vi

Những thứ **cố ý không làm**, để giữ dự án tập trung vào bài toán kỹ thuật:

- Thanh toán thật là bắt buộc (v1–v5 dùng bản giả lập; VietQR là mở rộng tùy chọn F-27)
- Ứng dụng mobile native (chỉ web responsive)
- Ghép đội, tìm bạn chơi, mạng xã hội
- Marketplace cho nhiều chủ sân khác nhau (chỉ một chuỗi)
- Dịch dữ liệu nghiệp vụ (tên sân, mô tả cơ sở) sang nhiều ngôn ngữ; chỉ giao diện là song ngữ

## 8. Dữ liệu chính

Các thực thể dự kiến: người dùng, vai trò, cơ sở, giờ mở cửa, môn, sân, bảng giá, giữ chỗ, đơn đặt, đơn định kỳ, thanh toán, đánh giá, khóa sân bảo trì.

Thiết kế schema chi tiết (ERD, khóa, ràng buộc, index) là phần thực hành của **Giai đoạn 1, Bài 23**: tự thiết kế, không làm sẵn ở đây.

## 9. Lộ trình phiên bản

| Phiên bản | Giai đoạn | Thay đổi kỹ thuật | Chức năng có thêm | Tag |
| --- | --- | --- | --- | --- |
| v1 | 2 | REST API bằng Java thuần + JDBC | F-01, F-10, F-11, F-13, F-20, F-21, F-23, F-24, F-30, F-40, F-41 | `v1-raw-java` |
| v2 | 2 | Spring Boot + JPA, Spring Security, JWT, Redis, test | F-02 đến F-04, F-22, F-25, F-26, F-31 đến F-33, F-42, F-43, F-50, F-51 | `v2-spring` |
| v3 | 3 | Frontend vanilla JS, sau đó React + TypeScript, i18n | F-12, F-70 và giao diện cho mọi chức năng | `v3-frontend` |
| v4 | 4 | Trợ lý AI: RAG, tool calling, streaming | F-60 đến F-62 | `v4-ai` |
| v5 | 5 | Docker, CI/CD, deploy VPS có HTTPS, giám sát | (không thêm chức năng) | `v5-devops` |
| v6 | 6 | Tách auth, booking, notification, AI assistant, payment giả lập; Kafka; Saga | (không thêm chức năng) | `v6-microservices` |

## 10. Quyết định đã chốt

| Ngày | Quyết định | Lý do |
| --- | --- | --- |
| 2026-11-25 | Lĩnh vực: đặt sân thể thao đa cơ sở | Tách bạch với dự án đang làm, có đủ bài toán chống đặt trùng, giữ chỗ, thanh toán |
| 2026-11-25 | Database: PostgreSQL cho toàn dự án | Có pgvector cho RAG ở v4; khi học SQL vẫn ghi chú điểm khác với MySQL InnoDB |
| 2026-11-25 | Đặt định kỳ: toàn bộ hoặc không (R-09) | Đơn giản, đúng; luyện tính nguyên tử của transaction. Hướng nâng cấp: đặt các buổi còn trống và báo buổi bị bỏ qua |
| 2026-11-25 | Thanh toán qua interface `PaymentGateway` | Giả lập trước, thêm VietQR sau mà không sửa logic đặt sân |
| 2026-11-25 | Thêm đánh giá sân và giao diện song ngữ | Đánh giá có quy tắc phân quyền đáng làm; song ngữ phục vụ ứng tuyển công ty nước ngoài |
| 2026-11-25 | Giá cao điểm = giá gốc + tỉ lệ phần trăm (R-05) | Quản trị viên chỉ cần đặt giá gốc và một tỉ lệ, không phải nhập hai bảng giá |
| 2026-11-25 | Đơn vắt mốc cao điểm tính theo từng khung 30 phút (R-11) | Chính xác, công bằng cho cả khách và chủ sân, dễ viết unit test |

## 11. Câu hỏi còn mở

Chưa có. Câu hỏi mới phát sinh khi làm lab thì ghi vào đây.

## Hành trình tiến hóa

<!-- Mỗi phiên bản: gặp vấn đề gì, chọn giải pháp nào, đánh đổi ra sao. Đây là phần kể khi phỏng vấn. -->
