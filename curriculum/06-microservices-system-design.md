# Giai đoạn 6: Microservices và System Design

17 bài, 3 module. Module A học các khối xây dựng của hệ thống lớn, module B áp dụng chúng để tách capstone thành microservices với hệ sinh thái Spring Cloud, module C luyện phỏng vấn system design theo case.

Thời lượng là mức tối đa cho người học mới. Phần đã vững thì làm "Tự kiểm tra" trước, đạt thì chỉ làm lab rồi chuyển bài.

| Module | Bài | Thời lượng tối đa |
| --- | --- | --- |
| A. Nguyên lý system design | 1–6 | 1,5 tuần |
| B. Microservices | 7–14 | 2,5 tuần |
| C. Luyện case system design | 15–17 | 1,5 tuần, sau đó duy trì |

## Module A. Nguyên lý system design

### Bài 1. Khung trả lời và ước lượng nhanh

**Mục tiêu:** có một quy trình cố định để không bị lúng túng trước đề bài mở.

**Nội dung**

- Khung 6 bước: làm rõ yêu cầu (chức năng và phi chức năng) → ước lượng → thiết kế API → mô hình dữ liệu → kiến trúc tổng thể → đào sâu điểm nghẽn
- Ước lượng: người dùng hoạt động mỗi ngày → QPS trung bình và đỉnh, dung lượng lưu trữ, băng thông
- Các con số cần nhớ ở mức bậc độ lớn (ôn lại bài kiến trúc máy tính ở Giai đoạn 1)
- Luôn nói rõ đánh đổi của mỗi lựa chọn

**Thực hành:** ước lượng QPS và dung lượng 5 năm cho capstone nếu có 500 cơ sở và 1 triệu người chơi.

**Tự kiểm tra:** 10 triệu request mỗi ngày tương ứng khoảng bao nhiêu request mỗi giây?

### Bài 2. Mở rộng và cân bằng tải

**Mục tiêu:** biết cách cho hệ thống phục vụ nhiều người hơn.

**Nội dung**

- Scale dọc và scale ngang; vì sao service phải stateless
- Load balancer tầng 4 và tầng 7; thuật toán round robin, least connections, consistent hashing
- Health check, sticky session và vì sao nên tránh
- Độ sẵn sàng: loại bỏ điểm lỗi đơn (single point of failure); các mức 99,9% và 99,99%

**Thực hành:** chạy 3 instance backend sau Nginx, tắt một instance và quan sát hệ thống vẫn chạy.

**Tự kiểm tra:** vì sao lưu session trong bộ nhớ của server gây khó khăn khi scale ngang? Consistent hashing giải quyết vấn đề gì?

### Bài 3. Cache trong hệ thống phân tán

**Mục tiêu:** đặt cache đúng tầng và hiểu cái giá của nó.

**Nội dung**

- Các tầng cache: trình duyệt, CDN, reverse proxy, ứng dụng, database
- Cache cục bộ và cache phân tán; đồng bộ cache giữa nhiều instance
- Ôn lại chiến lược và các vấn đề cache ở Giai đoạn 2; hot key

**Thực hành:** thêm cache cục bộ (Caffeine) trước Redis cho danh sách cơ sở và bảng giá, xử lý việc xóa cache trên mọi instance.

**Tự kiểm tra:** khi nào cache cục bộ tốt hơn Redis? Hot key là gì và xử lý ra sao?

### Bài 4. Mở rộng database

**Mục tiêu:** biết các cách database chịu được tải lớn và cái giá của từng cách.

**Nội dung**

- Replication primary–replica; tách đọc ghi; độ trễ replication và đọc dữ liệu cũ
- Partitioning và sharding; chọn shard key; các vấn đề khi sharding (join, giao dịch xuyên shard, phân bổ lệch)
- Connection pooling phía database (PgBouncer) ở mức khái niệm
- Chọn loại database theo bài toán

**Thực hành:** dựng PostgreSQL primary–replica bằng Docker Compose; cấu hình Spring đọc từ replica, ghi vào primary; quan sát đọc dữ liệu cũ ngay sau khi ghi.

**Tự kiểm tra:** vừa đặt sân xong mà tải lại trang không thấy đơn thì nguyên nhân là gì, xử lý ra sao? Chọn shard key cho bảng đơn đặt thế nào?

### Bài 5. Nhất quán dữ liệu và định lý CAP

**Mục tiêu:** hiểu đánh đổi giữa đúng và nhanh trong hệ thống phân tán.

**Nội dung**

- Định lý CAP và cách hiểu đúng; PACELC
- Các mức nhất quán: strong, eventual, read-your-writes
- Đồng thuận (consensus) và leader election ở mức khái niệm
- Idempotency và exactly-once trong thực tế

**Thực hành:** viết bài phân tích: trong capstone, nghiệp vụ nào bắt buộc nhất quán mạnh, nghiệp vụ nào chấp nhận eventual consistency, vì sao.

**Tự kiểm tra:** vì sao nói "exactly-once" thực ra là "at-least-once + idempotent"?

### Bài 6. Xử lý bất đồng bộ và message queue

**Mục tiêu:** biết khi nào đưa việc vào hàng đợi và chọn đúng công cụ.

**Nội dung**

- Point-to-point và publish/subscribe; tách rời service, hấp thụ đỉnh tải
- Kafka: topic, partition, offset, consumer group, giữ thứ tự theo key
- RabbitMQ: exchange, queue, routing; so sánh với Kafka
- Đảm bảo gửi: at-most-once, at-least-once; dead letter queue, retry

**Thực hành:** chạy Kafka bằng Docker; viết producer và consumer bằng Java thuần trước, sau đó bằng Spring Kafka; thử tắt consumer rồi bật lại để thấy message không mất.

**Tự kiểm tra:** Kafka giữ thứ tự message thế nào? Khi nào chọn RabbitMQ thay Kafka?

## Module B. Microservices

### Bài 7. Khi nào và tách thế nào

**Mục tiêu:** quyết định tách service có lý do, không tách theo phong trào.

**Nội dung**

- Monolith, modular monolith, microservices: ưu nhược điểm và chi phí vận hành
- Domain-Driven Design ở mức vừa đủ: bounded context, aggregate, ubiquitous language
- Mỗi service một database; dữ liệu dùng chung giữa service xử lý ra sao
- Chiến lược tách dần từ monolith (strangler fig)

**Thực hành:** vẽ context map của capstone, đề xuất ranh giới các service (auth, booking, payment giả lập, notification, AI assistant) và viết lý do cho mỗi ranh giới.

**Tự kiểm tra:** khi nào không nên dùng microservices? "Distributed monolith" là gì?

### Bài 8. Spring Cloud: cấu hình tập trung và service discovery

**Mục tiêu:** cho nhiều service dùng chung cấu hình và tìm thấy nhau mà không cấu hình địa chỉ cứng.

**Nội dung**

- Vì sao cần cấu hình tập trung khi có nhiều service và nhiều môi trường
- Spring Cloud Config Server: lưu cấu hình trong Git, profile, làm mới cấu hình khi đang chạy; không đặt secret dạng văn bản thường trong kho cấu hình
- Service registry và discovery: đăng ký, heartbeat, client-side discovery
- Eureka server và client
- So sánh với discovery dựa trên DNS của Docker Compose và Kubernetes; khi nào không cần Eureka

**Thực hành:** dựng Config Server đọc cấu hình từ một repo Git và Eureka server; các service của capstone (auth, booking, payment giả lập, notification, AI assistant) đăng ký và tìm nhau qua Eureka.

**Tự kiểm tra:** một service chết thì registry biết bằng cách nào? Trên Kubernetes có còn cần Eureka không, vì sao?

### Bài 9. Giao tiếp giữa các service

**Mục tiêu:** chọn đúng kiểu giao tiếp cho từng tình huống.

**Nội dung**

- Đồng bộ qua HTTP: OpenFeign (khai báo client bằng interface), kết hợp với service discovery và load balancing phía client
- gRPC: Protocol Buffers, HTTP/2; khi nào đáng dùng thay REST
- Bất đồng bộ qua Kafka: event notification và event-carried state transfer
- Thiết kế event: tên, schema, version; tương thích ngược
- Timeout cho mọi lời gọi giữa các service (đi tiếp ở bài 12)

**Thực hành:** booking service gọi auth service qua OpenFeign để kiểm tra người dùng; viết lại lời gọi đó bằng gRPC và so sánh; phát event `BookingConfirmed` qua Kafka cho notification service.

**Tự kiểm tra:** khi nào gọi đồng bộ, khi nào phát event? OpenFeign khác `RestClient` ở đâu? gRPC nhanh hơn REST vì sao?

### Bài 10. API Gateway và cân bằng tải

**Mục tiêu:** cho client một điểm vào duy nhất và phân tải đều giữa các instance.

**Nội dung**

- API Gateway: định tuyến, filter, xác thực tập trung, rate limit; Spring Cloud Gateway
- Backend for Frontend (BFF)
- Cân bằng tải phía server (Nginx, load balancer của hạ tầng) và phía client (Spring Cloud LoadBalancer)
- Truyền thông tin người dùng từ gateway xuống service an toàn

**Thực hành:** đặt Spring Cloud Gateway trước các service; kiểm tra JWT tại gateway và chuyển thông tin người dùng xuống qua header; chạy 2 instance booking service và quan sát tải được chia.

**Tự kiểm tra:** nên kiểm tra JWT ở gateway hay ở từng service, hay cả hai? Cân bằng tải phía client khác phía server thế nào?

### Bài 11. Lập trình reactive với Spring WebFlux

**Mục tiêu:** hiểu mô hình reactive, biết khi nào dùng và khi nào không.

**Nội dung**

- Vì sao có lập trình reactive: phục vụ nhiều kết nối I/O với ít thread (nối với Giai đoạn 1, bài 3)
- Reactive Streams, backpressure; Project Reactor với `Mono` và `Flux`, các toán tử thường dùng
- Spring WebFlux trên event loop; `WebClient`
- Truy cập database theo kiểu reactive ở mức khái niệm (R2DBC)
- WebFlux và Spring MVC kết hợp virtual thread: đánh đổi về độ phức tạp, debug, hệ sinh thái
- Lỗi kinh điển: gọi code chặn (blocking) trong luồng reactive

**Thực hành:** viết AI assistant service bằng WebFlux, stream câu trả lời của LLM tới frontend qua SSE; cố ý gọi một hàm chặn trong luồng reactive và quan sát hậu quả.

**Tự kiểm tra:** backpressure là gì? Vì sao gọi JDBC trong một handler WebFlux là sai? Khi nào chọn Spring MVC + virtual thread thay vì WebFlux?

### Bài 12. Chịu lỗi (resilience)

**Mục tiêu:** một service chết không kéo sập cả hệ thống.

**Nội dung**

- Lỗi dây chuyền (cascading failure)
- Timeout, retry có backoff và jitter; circuit breaker; bulkhead; fallback
- Resilience4j
- Graceful degradation: tắt tính năng phụ khi quá tải

**Thực hành:** cho AI assistant service trả lời chậm 10 giây; cấu hình timeout và circuit breaker sao cho đặt sân vẫn hoạt động bình thường (N-12).

**Tự kiểm tra:** retry không có jitter gây vấn đề gì? Circuit breaker có những trạng thái nào?

### Bài 13. Giao dịch phân tán

**Mục tiêu:** giữ dữ liệu nhất quán khi một nghiệp vụ đi qua nhiều service.

**Nội dung**

- Vì sao không dùng được `@Transactional` xuyên service; two-phase commit và hạn chế
- Saga: choreography và orchestration; compensating transaction
- Transactional Outbox: ghi dữ liệu và event trong cùng một transaction
- Consumer idempotent; xử lý message trùng

**Thực hành:** cài đặt Saga cho luồng đặt sân có thanh toán giả lập: giữ chỗ → thanh toán → xác nhận; thanh toán lỗi thì nhả giữ chỗ. Dùng Outbox để phát event; webhook thanh toán idempotent (N-14).

**Tự kiểm tra:** vì sao ghi database rồi gửi lên Kafka trong cùng một method vẫn có thể mất event? Outbox giải quyết ra sao?

### Bài 14. Observability cho hệ thống phân tán

**Mục tiêu:** lần theo một request đi qua nhiều service.

**Nội dung**

- Distributed tracing: trace, span, truyền context qua HTTP và Kafka
- OpenTelemetry; Jaeger hoặc Zipkin
- Correlation ID trong log

**Thực hành:** gắn OpenTelemetry cho các service, xem toàn bộ hành trình của một lần đặt sân trên Jaeger; gắn tag `v6-microservices`.

**Tự kiểm tra:** làm sao biết service nào làm một request chậm?

## Module C. Luyện case system design

Mỗi case viết thành một file trong `06-microservices-system-design/cases/`, đi đủ 6 bước của bài 1, có sơ đồ kiến trúc. Sau khi tự làm, đối chiếu với lời giải tham khảo và ghi lại chỗ mình thiếu.

### Bài 15. Bộ case nền tảng

- **URL shortener:** sinh mã ngắn, đọc nhiều hơn ghi, cache, thống kê lượt bấm
- **Rate limiter phân tán:** thuật toán, lưu trạng thái ở Redis, xử lý nhiều gateway
- **Hệ thống thông báo:** nhiều kênh (email, SMS, push), hàng đợi, retry, chống gửi trùng

**Tự kiểm tra:** trình bày mỗi case trong 35 phút, có bấm giờ.

### Bài 16. Bộ case thời gian thực và dữ liệu lớn

- **Ứng dụng chat:** WebSocket, lưu tin nhắn, trạng thái online, nhóm
- **News feed:** fan-out khi ghi và khi đọc, người dùng có nhiều người theo dõi
- **Tìm kiếm gợi ý (autocomplete):** trie, cache theo tiền tố

**Tự kiểm tra:** giải thích được vì sao fan-out khi ghi không phù hợp với tài khoản có hàng triệu người theo dõi.

### Bài 17. Bộ case giao dịch và AI

- **Hệ thống đặt chỗ (vé, phòng, sân):** chống đặt trùng khi tải cao, giữ chỗ tạm thời có hết hạn — liên hệ trực tiếp với capstone
- **Thanh toán và ví:** idempotency, sổ cái (ledger), đối soát
- **Chatbot RAG cho doanh nghiệp:** nạp tài liệu quy mô lớn, phân quyền tài liệu theo người dùng, chi phí và độ trễ

**Tự kiểm tra:** case đặt chỗ phải trình bày được ít nhất hai cách chống trùng và so sánh đánh đổi, dựa trên thực nghiệm bạn đã làm ở Giai đoạn 1 và 2.
