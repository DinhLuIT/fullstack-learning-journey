# Giai đoạn 2: Backend, từ code chay đến Spring

16 bài, 5 module. Mọi bài đều làm trên capstone: module A và B tạo ra v1 bằng Java thuần, module C đến E chuyển sang Spring Boot thành v2.

| Module | Bài | Thời lượng |
| --- | --- | --- |
| A. HTTP server bằng Java thuần | 1–3 | 1 tuần |
| B. Truy cập dữ liệu bằng JDBC thuần | 4–5 | 1 tuần |
| C. Spring bên dưới | 6–9 | 1 tuần |
| D. API và bảo mật | 10–12 | 1 tuần |
| E. Cache, kiểm thử, chất lượng | 13–16 | 1 tuần |

## Module A. HTTP server bằng Java thuần

### Bài 1. Tự viết HTTP server

**Mục tiêu:** hiểu Tomcat và Spring MVC làm gì với một request trước khi nó đến controller.

**Nội dung**

- Nhắc lại cấu trúc request và response HTTP (Giai đoạn 1, bài 11)
- Đọc byte từ socket, parse request line, header, body theo `Content-Length`
- Ghi response đúng định dạng: status line, header, body
- Mô hình mỗi request một thread và mô hình thread pool; so sánh với cách Tomcat làm

**Thực hành:** viết server trên `ServerSocket` trả về `Hello` cho `GET /`, chạy bằng thread pool; thử tải bằng công cụ như `wrk` hoặc `ab`.

**Tự kiểm tra:** server biết body kết thúc ở đâu? Thread pool quá nhỏ hoặc quá lớn gây vấn đề gì?

### Bài 2. Router, JSON và xử lý lỗi

**Mục tiêu:** tự xây được một "framework" tối giản để thấy rõ vai trò của `DispatcherServlet`.

**Nội dung**

- Router ánh xạ method + path sang handler; path parameter (`/bookings/{id}`) và query parameter
- Serialize và deserialize JSON: tự viết bản đơn giản, sau đó dùng Jackson và so sánh
- Xử lý lỗi tập trung, trả đúng status code và body lỗi thống nhất

**Thực hành:** viết CRUD in-memory cho tài nguyên `venues` (cơ sở) của capstone.

**Tự kiểm tra:** `DispatcherServlet` đóng vai trò gì tương ứng trong code bạn vừa viết?

### Bài 3. Middleware và cấu hình

**Mục tiêu:** hiểu filter/interceptor và cách ứng dụng đọc cấu hình theo môi trường.

**Nội dung**

- Chain of Responsibility: logging, đo thời gian xử lý, gắn request ID
- Đọc cấu hình từ file và biến môi trường; nguyên tắc 12-factor app
- Graceful shutdown khi nhận SIGTERM

**Thực hành:** thêm chuỗi middleware vào server; đọc cổng và thông tin database từ biến môi trường.

**Tự kiểm tra:** filter và interceptor trong Spring khác nhau ở đâu?

## Module B. Truy cập dữ liệu bằng JDBC thuần

### Bài 4. JDBC và repository

**Mục tiêu:** làm việc trực tiếp với database, hiểu những gì JPA che giấu.

**Nội dung**

- `DriverManager`, `Connection`, `PreparedStatement`, `ResultSet`; đóng tài nguyên đúng cách
- SQL injection và vì sao `PreparedStatement` ngăn được
- Map `ResultSet` sang object bằng tay; repository pattern
- Batch insert

**Thực hành:** thay bộ nhớ in-memory của bài 2 bằng PostgreSQL qua JDBC; thử tấn công SQL injection vào phiên bản dùng `Statement` nối chuỗi.

**Tự kiểm tra:** vì sao `PreparedStatement` chống được SQL injection?

### Bài 5. Transaction và connection pool

**Mục tiêu:** tự quản lý transaction để hiểu `@Transactional` sau này.

**Nội dung**

- `setAutoCommit(false)`, `commit`, `rollback`; transaction phải dùng chung một connection
- Truyền connection qua các tầng bằng `ThreadLocal` (đây là cách Spring làm)
- Vì sao tạo connection tốn kém; connection pool và HikariCP

**Thực hành:** viết luồng đặt sân gồm kiểm tra khung giờ trống + tạo giữ chỗ + ghi lịch sử trong một transaction; viết luồng đặt định kỳ theo nguyên tắc toàn bộ hoặc không (R-09); tự viết connection pool đơn giản bằng `BlockingQueue`, đo hiệu năng so với không có pool.

**Tự kiểm tra:** vì sao transaction cần giữ cùng một connection? Pool có 10 connection nhưng 50 request đến cùng lúc thì sao?

**Kết thúc module B:** gắn tag `v1-raw-java` cho capstone.

## Module C. Spring bên dưới

### Bài 6. IoC container và Dependency Injection

**Mục tiêu:** giải thích được Spring tạo và quản lý object thế nào.

**Nội dung**

- IoC và DI; `ApplicationContext`, `BeanDefinition`
- Vòng đời bean: khởi tạo, inject, `@PostConstruct`, `BeanPostProcessor`, hủy
- Scope: singleton, prototype, request, session; inject prototype vào singleton
- Constructor injection và field injection; phụ thuộc vòng
- `@Component`, `@Bean`, `@Configuration`; `@Qualifier`, `@Primary`, `@Profile`

**Thực hành:** tự viết IoC container mini: quét package, tìm class có annotation tự định nghĩa, tạo object và inject qua constructor bằng reflection.

**Tự kiểm tra:** singleton bean có thread-safe không? Vì sao nên dùng constructor injection?

### Bài 7. AOP và proxy

**Mục tiêu:** hiểu cơ chế nằm dưới `@Transactional`, `@Cacheable`, `@Async`.

**Nội dung**

- Cross-cutting concern; aspect, advice, pointcut, join point
- JDK dynamic proxy (dựa trên interface) và CGLIB (kế thừa class)
- Vì sao gọi method nội bộ trong cùng class không đi qua proxy

**Thực hành:** dùng `java.lang.reflect.Proxy` tự viết annotation `@MyTransactional` mở, commit, rollback transaction qua JDBC của bài 5.

**Tự kiểm tra:** vì sao `@Transactional` trên method `private` không có tác dụng?

### Bài 8. Spring Boot và Spring MVC

**Mục tiêu:** hiểu Spring Boot tự cấu hình thế nào và một request đi qua MVC ra sao.

**Nội dung**

- Auto-configuration, `@Conditional`, starter; embedded Tomcat
- `application.yml`, profile, `@ConfigurationProperties`
- Luồng request: filter → `DispatcherServlet` → handler mapping → interceptor → controller → message converter
- Actuator: health, metrics

**Thực hành:** chuyển API của capstone sang Spring Boot, giữ nguyên hành vi của v1; chạy với `--debug` để đọc báo cáo auto-configuration.

**Tự kiểm tra:** Spring Boot biết cần tạo `DataSource` dựa vào đâu?

### Bài 9. Spring Data JPA và Hibernate

**Mục tiêu:** dùng JPA mà không dính các lỗi hiệu năng kinh điển.

**Nội dung**

- Entity, quan hệ (`@OneToMany`, `@ManyToOne`, `@ManyToMany`), owning side
- Persistence context, trạng thái entity, dirty checking, flush
- Lazy và eager loading; `LazyInitializationException`
- Lỗi N+1 và cách xử lý: `JOIN FETCH`, `@EntityGraph`, batch size, projection/DTO
- `@Transactional`: propagation (REQUIRED, REQUIRES_NEW), `readOnly`, rollback với checked exception
- Optimistic locking bằng `@Version`

**Thực hành:** bật log SQL, cố ý tạo lỗi N+1 khi lấy danh sách đơn đặt kèm sân và cơ sở, đếm số câu query rồi sửa; dùng `@Version` chống đặt trùng.

**Tự kiểm tra:** N+1 là gì và có những cách nào xử lý? Khi nào dùng `REQUIRES_NEW`?

## Module D. API và bảo mật

### Bài 10. Thiết kế REST API chuyên nghiệp

**Mục tiêu:** thiết kế API mà frontend và bên thứ ba dùng dễ, ít lỗi.

**Nội dung**

- Đặt tên resource, dùng đúng method và status code
- Phân trang, lọc, sắp xếp; versioning
- Idempotency key cho request tạo mới; xử lý request lặp
- Validation với Bean Validation; `@ControllerAdvice` và chuẩn Problem Details (RFC 9457)
- DTO và entity: vì sao không trả entity ra ngoài; MapStruct

**Thực hành:** viết tài liệu thiết kế API của capstone trước khi code, sau đó cài đặt theo đúng tài liệu.

**Tự kiểm tra:** người dùng bấm "đặt sân" hai lần thì API xử lý thế nào?

### Bài 11. Xác thực và phân quyền

**Mục tiêu:** tự xây được luồng đăng nhập an toàn và hiểu Spring Security từ bên trong.

**Nội dung**

- Authentication và authorization; lưu mật khẩu bằng BCrypt/Argon2
- Session và token; cấu trúc JWT, ký và xác minh chữ ký
- Access token và refresh token, xoay vòng refresh token, thu hồi token
- Spring Security: `SecurityFilterChain`, `AuthenticationManager`, `UserDetailsService`, `SecurityContextHolder`
- Phân quyền theo role và theo quyền chi tiết; `@PreAuthorize`

**Thực hành:** tự viết servlet filter xác thực JWT trước; sau đó chuyển sang Spring Security với các role người chơi, nhân viên cơ sở, quản trị viên; nhân viên chỉ thao tác trên cơ sở mình (R-08).

**Tự kiểm tra:** JWT bị lộ thì xử lý thế nào? Vì sao không lưu mật khẩu bằng SHA-256?

### Bài 12. OAuth2 và bảo mật ứng dụng web

**Mục tiêu:** nhận ra và phòng chống các lỗ hổng phổ biến.

**Nội dung**

- OAuth2 và OpenID Connect: các vai trò, Authorization Code + PKCE
- OWASP Top 10: injection, broken access control (IDOR), XSS, CSRF, SSRF ở mức nhận biết
- Security header, rate limit đăng nhập, quản lý secret

**Thực hành:** thêm đăng nhập bằng Google vào capstone; tự kiểm tra lỗi IDOR (người chơi A xem được đơn của người chơi B) và sửa.

**Tự kiểm tra:** IDOR là gì? CSRF còn là vấn đề khi dùng JWT trong header không?

## Module E. Cache, kiểm thử, chất lượng

### Bài 13. Redis và caching

**Mục tiêu:** dùng cache đúng chỗ và xử lý được các vấn đề đi kèm.

**Nội dung**

- Redis là gì, vì sao nhanh (chạy trong bộ nhớ, một luồng xử lý lệnh); các kiểu dữ liệu và trường hợp dùng
- TTL, chính sách thu hồi bộ nhớ; persistence (RDB, AOF) ở mức khái niệm
- Chiến lược: cache-aside, write-through, write-behind
- Vấn đề: invalidation, cache stampede, cache penetration, cache avalanche
- Spring Cache: `@Cacheable`, `@CacheEvict`

**Thực hành:** cache danh sách cơ sở và bảng giá, đo thời gian trả lời trước và sau; xóa cache đúng khi bảng giá bị sửa.

**Tự kiểm tra:** cập nhật database rồi xóa cache, hay xóa cache rồi cập nhật database? Vì sao?

### Bài 14. Rate limiting, khóa phân tán và tác vụ nền

**Mục tiêu:** bảo vệ hệ thống khỏi quá tải và xử lý việc nặng ngoài luồng request.

**Nội dung**

- Thuật toán rate limit: fixed window, sliding window, token bucket
- Khóa phân tán bằng Redis và hạn chế của nó
- `@Async`, `@Scheduled`; gửi email/thông báo không chặn request

**Thực hành:** tự viết rate limiter token bucket bằng Redis cho API đăng nhập (N-05); gửi email xác nhận đơn bất đồng bộ; tác vụ định kỳ giải phóng giữ chỗ hết hạn (F-22).

**Tự kiểm tra:** token bucket khác fixed window ở điểm nào?

### Bài 15. Kiểm thử

**Mục tiêu:** viết test có giá trị thật, không chỉ để tăng coverage.

**Nội dung**

- Kim tự tháp kiểm thử: unit, integration, end-to-end
- JUnit 5, AssertJ, Mockito: mock, stub, verify; khi nào không nên mock
- `@WebMvcTest`, `@DataJpaTest`, `@SpringBootTest`
- Testcontainers để test với database và Redis thật
- Đặt tên test, cấu trúc Given–When–Then; TDD ở mức cơ bản

**Thực hành:** viết unit test cho logic tính giá (R-05, R-11) và chính sách hủy (R-06); integration test với Testcontainers cho chống đặt trùng (N-01).

**Tự kiểm tra:** unit test khác integration test thế nào? Vì sao test với H2 có thể đánh lừa bạn?

### Bài 16. Logging, tài liệu và chất lượng code

**Mục tiêu:** đưa capstone v2 đến mức người khác đọc và vận hành được.

**Nội dung**

- SLF4J và Logback; log level; log có cấu trúc (JSON) kèm request ID
- OpenAPI/Swagger tự sinh tài liệu
- Cấu trúc project: theo tầng và theo tính năng; clean architecture ở mức vừa đủ
- Kiểm tra tĩnh: Checkstyle hoặc Spotless, SonarLint

**Thực hành:** hoàn thiện README của capstone v2 với hướng dẫn chạy, tài liệu API và sơ đồ kiến trúc; gắn tag `v2-spring`.

**Tự kiểm tra:** khi có sự cố trên production, log của bạn đã đủ để lần theo một request cụ thể chưa?
