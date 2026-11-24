# Giai đoạn 2: Backend, từ phân tích thiết kế đến Spring Boot

28 bài, 7 module. Module A phân tích và thiết kế capstone trước khi viết dòng code nào. Module B và C tạo phiên bản v1 bằng Java thuần; module D đến G chuyển sang Spring Boot và hoàn thiện thành v2.

**Vì sao học:** Tự viết lại HTTP server và JDBC trước khi dùng Spring giúp thấy rõ framework đang làm hộ những gì, nên dùng Spring Boot, JPA, Spring Security đúng cách và tránh được các lỗi kinh điển như N+1 hay `@Transactional` không có tác dụng.

Thời lượng là mức tối đa cho người học mới. Phần đã vững thì làm "Tự kiểm tra" trước, đạt thì chỉ làm lab rồi chuyển bài.

| Module | Bài | Thời lượng tối đa |
| --- | --- | --- |
| A. Phân tích và thiết kế | 1–4 | 4 buổi |
| B. HTTP server bằng Java thuần | 5–7 | 1 tuần |
| C. Truy cập dữ liệu bằng JDBC thuần | 8–9 | 4 buổi |
| D. Spring bên dưới | 10–14 | 1,5 tuần |
| E. API và bảo mật | 15–20 | 1,5 tuần |
| F. Tính năng dự án thực tế | 21–24 | 1 tuần |
| G. Cache, kiểm thử, chất lượng | 25–28 | 1 tuần |

## Module A. Phân tích và thiết kế

### Bài 1. Thu thập yêu cầu, use case và tài liệu SRS

**Mục tiêu:** biến ý tưởng sản phẩm thành yêu cầu rõ ràng, kiểm chứng được.

**Nội dung**

- Khảo sát và thu thập yêu cầu: phỏng vấn, quan sát, phân tích tài liệu; câu hỏi mở và câu hỏi đóng
- Yêu cầu chức năng và phi chức năng; yêu cầu tốt phải đo được, kiểm chứng được
- Use case diagram: actor, use case, quan hệ `include` và `extend`; đặc tả use case (luồng chính, luồng thay thế, ngoại lệ)
- User story và tiêu chí chấp nhận (acceptance criteria)
- Cấu trúc một tài liệu SRS và cách giữ nó sống cùng dự án
- Wireframe: phác thảo các màn hình chính trước khi thiết kế chi tiết

**Thực hành:** đối chiếu `capstone/README.md` với cấu trúc SRS và bổ sung chỗ còn thiếu; vẽ use case diagram cho 4 vai trò bằng PlantUML hoặc Mermaid; viết đặc tả đầy đủ cho use case "Đặt sân" và "Đặt định kỳ"; phác thảo wireframe 4 màn hình chính.

**Tự kiểm tra:** `include` khác `extend` thế nào? Vì sao "hệ thống phải nhanh" là một yêu cầu tồi, viết lại thế nào cho tốt?

### Bài 2. Class diagram và mô hình miền

**Mục tiêu:** mô hình hóa nghiệp vụ thành các class và quan hệ trước khi nghĩ đến database.

**Nội dung**

- Mô hình miền (domain model): tìm khái niệm nghiệp vụ từ yêu cầu
- Class diagram: thuộc tính, phương thức, mức truy cập
- Quan hệ: association, aggregation, composition, generalization, dependency; bội số (multiplicity)
- Từ class diagram sang code Java và sang ERD: chỗ giống và khác nhau
- Giữ sơ đồ dạng text (PlantUML, Mermaid) trong repo để version cùng code

**Thực hành:** vẽ class diagram cho miền đặt sân (cơ sở, sân, môn, bảng giá, giữ chỗ, đơn đặt, đơn định kỳ, đánh giá, người dùng) và đối chiếu với ERD đã làm ở Giai đoạn 1, bài 32.

**Tự kiểm tra:** aggregation khác composition thế nào, cho ví dụ trong capstone? Vì sao class diagram và ERD của cùng một hệ thống lại không giống hệt nhau?

### Bài 3. Sequence diagram và state diagram

**Mục tiêu:** mô tả được hành vi của hệ thống theo thời gian và theo trạng thái.

**Nội dung**

- Sequence diagram: lifeline, message đồng bộ và bất đồng bộ, message trả về, fragment `alt`, `opt`, `loop`
- State diagram: trạng thái, sự kiện, điều kiện chuyển (guard), hành động
- Dùng sequence diagram để thiết kế API và phát hiện chỗ thiếu trước khi code
- Dùng state diagram để tìm chuyển trạng thái không hợp lệ

**Thực hành:** vẽ sequence diagram cho luồng đặt sân (giữ chỗ, thanh toán, xác nhận, hết hạn giữ chỗ) và luồng đặt định kỳ theo R-09; vẽ state diagram vòng đời đơn đặt (giữ chỗ, đã xác nhận, đã check-in, không đến, đã hủy, hết hạn).

**Tự kiểm tra:** đơn "đã hủy" có được chuyển sang "đã check-in" không, sơ đồ của bạn chặn điều đó thế nào? Khi nào dùng sequence diagram, khi nào dùng activity diagram?

### Bài 4. Thiết kế kiến trúc hệ thống

**Mục tiêu:** chọn và trình bày được kiến trúc cho capstone, giải thích được đánh đổi.

**Nội dung**

- Kiến trúc phân tầng (controller, service, repository) và trách nhiệm của từng tầng
- Tổ chức theo tầng và theo tính năng (package by layer, package by feature)
- Hexagonal / clean architecture ở mức ý tưởng: tách nghiệp vụ khỏi framework
- Mô hình C4: context, container, component; vẽ đủ mức cần thiết
- Ghi lại quyết định kiến trúc (Architecture Decision Record)

**Thực hành:** vẽ sơ đồ C4 mức context và container cho capstone v2; viết 2 ADR đầu tiên (chọn PostgreSQL, chọn kiến trúc phân tầng theo tính năng) dựa trên mục "Quyết định đã chốt" của capstone.

**Tự kiểm tra:** logic tính giá nên nằm ở tầng nào, vì sao? ADR giúp gì cho một nhóm sau 6 tháng?

## Module B. HTTP server bằng Java thuần

### Bài 5. Tự viết HTTP server

**Mục tiêu:** hiểu Tomcat và Spring MVC làm gì với một request trước khi nó đến controller.

**Nội dung**

- Nhắc lại cấu trúc request và response HTTP (Giai đoạn 1, bài 11)
- Đọc byte từ socket, parse request line, header, body theo `Content-Length`
- Ghi response đúng định dạng: status line, header, body
- Mô hình mỗi request một thread và mô hình thread pool; so sánh với cách Tomcat làm

**Thực hành:** viết server trên `ServerSocket` trả về `Hello` cho `GET /`, chạy bằng thread pool; thử tải bằng công cụ như `wrk` hoặc `ab`.

**Tự kiểm tra:** server biết body kết thúc ở đâu? Thread pool quá nhỏ hoặc quá lớn gây vấn đề gì?

### Bài 6. Router, JSON và xử lý lỗi

**Mục tiêu:** tự xây được một "framework" tối giản để thấy rõ vai trò của `DispatcherServlet`.

**Nội dung**

- Router ánh xạ method + path sang handler; path parameter (`/bookings/{id}`) và query parameter
- Serialize và deserialize JSON: tự viết bản đơn giản, sau đó dùng Jackson và so sánh
- Xử lý lỗi tập trung, trả đúng status code và body lỗi thống nhất

**Thực hành:** viết CRUD in-memory cho tài nguyên `venues` (cơ sở) của capstone.

**Tự kiểm tra:** `DispatcherServlet` đóng vai trò gì tương ứng trong code bạn vừa viết?

### Bài 7. Middleware và cấu hình

**Mục tiêu:** hiểu filter/interceptor và cách ứng dụng đọc cấu hình theo môi trường.

**Nội dung**

- Chain of Responsibility: logging, đo thời gian xử lý, gắn request ID
- Đọc cấu hình từ file và biến môi trường; nguyên tắc 12-factor app
- Graceful shutdown khi nhận SIGTERM

**Thực hành:** thêm chuỗi middleware vào server; đọc cổng và thông tin database từ biến môi trường.

**Tự kiểm tra:** filter và interceptor trong Spring khác nhau ở đâu?

## Module C. Truy cập dữ liệu bằng JDBC thuần

### Bài 8. JDBC và repository

**Mục tiêu:** làm việc trực tiếp với database, hiểu những gì JPA che giấu.

**Nội dung**

- `DriverManager`, `Connection`, `PreparedStatement`, `ResultSet`; đóng tài nguyên đúng cách
- SQL injection và vì sao `PreparedStatement` ngăn được
- Map `ResultSet` sang object bằng tay; repository pattern
- Batch insert
- `CallableStatement`: gọi function và stored procedure (nối với Giai đoạn 1, bài 37)

**Thực hành:** thay bộ nhớ in-memory của bài 6 bằng PostgreSQL qua JDBC; thử tấn công SQL injection vào phiên bản dùng `Statement` nối chuỗi.

**Tự kiểm tra:** vì sao `PreparedStatement` chống được SQL injection?

### Bài 9. Transaction và connection pool

**Mục tiêu:** tự quản lý transaction để hiểu `@Transactional` sau này.

**Nội dung**

- `setAutoCommit(false)`, `commit`, `rollback`; transaction phải dùng chung một connection
- Truyền connection qua các tầng bằng `ThreadLocal` (đây là cách Spring làm)
- Vì sao tạo connection tốn kém; connection pool và HikariCP

**Thực hành:** viết luồng đặt sân gồm kiểm tra khung giờ trống + tạo giữ chỗ + ghi lịch sử trong một transaction; viết luồng đặt định kỳ theo nguyên tắc toàn bộ hoặc không (R-09); tự viết connection pool đơn giản bằng `BlockingQueue`, đo hiệu năng so với không có pool.

**Tự kiểm tra:** vì sao transaction cần giữ cùng một connection? Pool có 10 connection nhưng 50 request đến cùng lúc thì sao?

**Kết thúc module C:** gắn tag `v1-raw-java` cho capstone.

## Module D. Spring bên dưới

### Bài 10. IoC container và Dependency Injection

**Mục tiêu:** giải thích được Spring tạo và quản lý object thế nào.

**Nội dung**

- IoC và DI; `ApplicationContext`, `BeanDefinition`
- Vòng đời bean: khởi tạo, inject, `@PostConstruct`, `BeanPostProcessor`, hủy
- Scope: singleton, prototype, request, session; inject prototype vào singleton
- Constructor injection và field injection; phụ thuộc vòng
- `@Component`, `@Bean`, `@Configuration`; `@Qualifier`, `@Primary`, `@Profile`

**Thực hành:** tự viết IoC container mini: quét package, tìm class có annotation tự định nghĩa, tạo object và inject qua constructor bằng reflection.

**Tự kiểm tra:** singleton bean có thread-safe không? Vì sao nên dùng constructor injection?

### Bài 11. AOP và proxy

**Mục tiêu:** hiểu cơ chế nằm dưới `@Transactional`, `@Cacheable`, `@Async`.

**Nội dung**

- Cross-cutting concern; aspect, advice, pointcut, join point
- JDK dynamic proxy (dựa trên interface) và CGLIB (kế thừa class)
- Vì sao gọi method nội bộ trong cùng class không đi qua proxy

**Thực hành:** dùng `java.lang.reflect.Proxy` tự viết annotation `@MyTransactional` mở, commit, rollback transaction qua JDBC của bài 9.

**Tự kiểm tra:** vì sao `@Transactional` trên method `private` không có tác dụng?

### Bài 12. Spring Boot và Spring MVC

**Mục tiêu:** hiểu Spring Boot tự cấu hình thế nào và một request đi qua MVC ra sao.

**Nội dung**

- Auto-configuration, `@Conditional`, starter; embedded Tomcat
- `application.yml`, profile, `@ConfigurationProperties`
- Luồng request: filter → `DispatcherServlet` → handler mapping → interceptor → controller → message converter
- Actuator: health, metrics
- Jakarta EE trong Spring Boot 3: các đặc tả Spring dùng bên dưới (Servlet, Persistence, Validation, Transaction); đổi namespace `javax` sang `jakarta`; những việc cần làm khi nâng cấp từ Spring Boot 2 lên 3

**Thực hành:** chuyển API của capstone sang Spring Boot, giữ nguyên hành vi của v1; chạy với `--debug` để đọc báo cáo auto-configuration.

**Tự kiểm tra:** Spring Boot biết cần tạo `DataSource` dựa vào đâu? Nâng cấp một dự án từ Spring Boot 2 lên 3 cần làm những gì?

### Bài 13. Spring Data JPA và Hibernate

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

### Bài 14. Spring Data JPA nâng cao

**Mục tiêu:** giải quyết các yêu cầu truy vấn và dữ liệu thường gặp trong dự án thật.

**Nội dung**

- Truy vấn động: Specification (`JpaSpecificationExecutor`) cho bộ lọc nhiều điều kiện tùy chọn
- Projection: interface-based, class-based (DTO); vì sao không phải lúc nào cũng lấy cả entity
- Phân trang và sắp xếp: `Pageable`, `Page` và `Slice`; chi phí của câu đếm tổng
- Auditing: `@CreatedDate`, `@LastModifiedDate`, `@CreatedBy` và cách bật
- Soft delete: các cách cài đặt và cái giá phải trả (index, unique constraint, truy vấn)
- `@Query` với JPQL và native query; khi nào cần native

**Thực hành:** API tìm sân trống theo bộ lọc tùy chọn (môn, cơ sở, khoảng giờ, mức giá) bằng Specification; trả danh sách đơn đặt bằng projection; thêm auditing cho mọi bảng chính; soft delete cho sân ngừng hoạt động.

**Tự kiểm tra:** `Page` khác `Slice` ở đâu, khi nào chọn `Slice`? Soft delete gây vấn đề gì với unique constraint?

## Module E. API và bảo mật

### Bài 15. Thiết kế REST API chuyên nghiệp

**Mục tiêu:** thiết kế API mà frontend và bên thứ ba dùng dễ, ít lỗi.

**Nội dung**

- Đặt tên resource, dùng đúng method và status code
- Phân trang, lọc, sắp xếp; versioning
- Idempotency key cho request tạo mới; xử lý request lặp
- Validation với Bean Validation; `@ControllerAdvice` và chuẩn Problem Details (RFC 9457)
- DTO và entity: vì sao không trả entity ra ngoài; MapStruct
- i18n phía backend: `MessageSource`, `LocaleResolver`, header `Accept-Language`, thông báo lỗi validation theo ngôn ngữ (F-70)

**Thực hành:** viết tài liệu thiết kế API của capstone trước khi code, sau đó cài đặt theo đúng tài liệu.

**Tự kiểm tra:** người dùng bấm "đặt sân" hai lần thì API xử lý thế nào?

### Bài 16. Spring Security: kiến trúc và xác thực

**Mục tiêu:** hiểu một request đi qua Spring Security thế nào trước khi đến controller.

**Nội dung**

- Authentication và authorization; lưu mật khẩu bằng hàm băm chậm (BCrypt, Argon2), `PasswordEncoder`
- Kiến trúc: `DelegatingFilterProxy`, `FilterChainProxy`, `SecurityFilterChain`; thứ tự filter
- `AuthenticationManager`, `AuthenticationProvider`, `UserDetailsService`
- `SecurityContextHolder` và cách thông tin người dùng đi theo request
- Cấu hình bằng `SecurityFilterChain` bean (cách hiện hành) và vì sao cách cũ dựa trên kế thừa không còn dùng

**Thực hành:** tự viết một servlet filter xác thực bằng header đơn giản để hiểu cơ chế; sau đó chuyển sang Spring Security với đăng ký, đăng nhập bằng email và mật khẩu cho capstone; bật log debug của Spring Security và đọc chuỗi filter.

**Tự kiểm tra:** vì sao không lưu mật khẩu bằng SHA-256? Một request chưa đăng nhập bị chặn ở filter nào?

### Bài 17. JWT, refresh token và resource server

**Mục tiêu:** xây luồng xác thực bằng token an toàn cho SPA React.

**Nội dung**

- Session và token: đánh đổi; cấu trúc JWT, ký và xác minh chữ ký, các claim chuẩn
- Access token ngắn hạn, refresh token dài hạn; xoay vòng refresh token và phát hiện token bị dùng lại
- Thu hồi token và đăng xuất
- Spring Security OAuth2 Resource Server để xác minh JWT thay vì tự viết filter
- Lưu token phía client: bộ nhớ và cookie `HttpOnly` (nối với Giai đoạn 1, bài 12)

**Thực hành:** cài đặt đăng nhập trả access token và refresh token, endpoint làm mới token có xoay vòng, đăng xuất thu hồi refresh token; xác minh JWT bằng resource server.

**Tự kiểm tra:** JWT bị lộ thì xử lý thế nào? Vì sao refresh token cần xoay vòng?

### Bài 18. Phân quyền: theo role, theo method và theo dữ liệu

**Mục tiêu:** đảm bảo mỗi người chỉ làm được đúng việc của mình, kể cả khi gọi API trực tiếp.

**Nội dung**

- Phân quyền theo URL và theo method: `@EnableMethodSecurity`, `@PreAuthorize`, `@PostAuthorize`
- Role và authority; phân cấp role
- Phân quyền theo dữ liệu: "chỉ chủ đơn mới xem được đơn", "nhân viên chỉ thao tác trên cơ sở mình"
- Lỗi IDOR (broken access control) và cách phòng
- Viết biểu thức phân quyền dùng bean tùy chỉnh

**Thực hành:** áp dụng R-08 và N-03: người chơi chỉ xem và hủy đơn của mình, nhân viên chỉ thao tác trên cơ sở được gán, quản trị viên quản lý tất cả; tự tấn công IDOR vào API của mình rồi vá.

**Tự kiểm tra:** IDOR là gì, vì sao kiểm tra role thôi là chưa đủ? Nên đặt kiểm tra quyền theo dữ liệu ở controller hay service?

### Bài 19. CORS, CSRF, xử lý lỗi bảo mật và kiểm thử security

**Mục tiêu:** cấu hình đúng các phần bảo mật hay gây lỗi khi ghép frontend và backend.

**Nội dung**

- CORS trong Spring Security: cấu hình đúng origin, method, header, credentials
- CSRF: khi nào cần bật, khi nào được tắt (nối với cách lưu token ở bài 17)
- Trả lỗi 401 và 403 rõ ràng: `AuthenticationEntryPoint`, `AccessDeniedHandler`, định dạng Problem Details
- Security header; quản lý secret
- OWASP Top 10 ở mức nhận biết: injection, broken access control, XSS, SSRF
- Kiểm thử security: `spring-security-test`, `@WithMockUser`, test với JWT

**Thực hành:** cấu hình CORS cho frontend capstone; chuẩn hóa lỗi 401/403; viết test chứng minh từng role chỉ gọi được đúng API của mình.

**Tự kiểm tra:** CSRF còn là vấn đề khi dùng JWT trong header không, còn khi refresh token nằm trong cookie thì sao? 401 khác 403 thế nào?

### Bài 20. OAuth2 và OpenID Connect: đăng nhập bằng Google

**Mục tiêu:** tích hợp đăng nhập bằng tài khoản bên thứ ba đúng chuẩn.

**Nội dung**

- OAuth2: các vai trò (resource owner, client, authorization server, resource server)
- Authorization Code flow và PKCE; vì sao không dùng implicit flow
- OpenID Connect: ID token, thông tin người dùng
- Spring Security OAuth2 Client; liên kết tài khoản Google với tài khoản sẵn có
- Sau khi đăng nhập bằng Google, cấp JWT của hệ thống mình như bài 17

**Thực hành:** thêm đăng nhập bằng Google vào capstone (F-03), xử lý trường hợp email Google trùng với tài khoản đã đăng ký.

**Tự kiểm tra:** OAuth2 khác OpenID Connect thế nào? PKCE chống lại kiểu tấn công nào?

## Module F. Tính năng dự án thực tế

### Bài 21. Gọi API bên ngoài

**Mục tiêu:** gọi dịch vụ bên thứ ba ổn định, không để lỗi của họ làm sập hệ thống mình.

**Nội dung**

- Các client HTTP trong Spring hiện nay: `RestClient`, `WebClient`, HTTP interface; vì sao `RestTemplate` không còn là lựa chọn mặc định cho code mới
- Timeout kết nối và timeout đọc; retry có backoff, chỉ retry khi an toàn
- Map lỗi của bên thứ ba thành lỗi của hệ thống mình
- Test bằng mock server (WireMock hoặc MockWebServer)
- OpenFeign giới thiệu ở đây, dùng nhiều ở Giai đoạn 6

**Thực hành:** viết client gọi một API thời tiết công khai để cảnh báo sân ngoài trời khi có mưa; cấu hình timeout và retry; test bằng mock server.

**Tự kiểm tra:** vì sao mọi lời gọi ra ngoài đều phải có timeout? Khi nào retry gây hại?

### Bài 22. Upload file, lưu trữ và xuất báo cáo

**Mục tiêu:** xử lý file an toàn và xuất dữ liệu theo định dạng người dùng cần.

**Nội dung**

- Nhận file với `MultipartFile`; giới hạn kích thước; kiểm tra loại file thật, không tin đuôi file
- Lưu ở đâu: ổ đĩa server, object storage (S3, MinIO), dịch vụ ảnh (Cloudinary); đánh đổi
- Upload trực tiếp từ trình duyệt bằng URL ký sẵn (presigned URL) để giảm tải backend
- Phục vụ file: quyền truy cập, cache
- Xuất Excel và PDF: chọn thư viện, **kiểm tra giấy phép của thư viện** trước khi dùng; xuất file lớn theo luồng

**Thực hành:** upload ảnh cho cơ sở và sân lên MinIO chạy bằng Docker; xuất báo cáo doanh thu (F-42) ra Excel và PDF.

**Tự kiểm tra:** vì sao không được tin phần mở rộng tên file? Presigned URL giải quyết vấn đề gì?

### Bài 23. Email, Spring Events và tác vụ nền

**Mục tiêu:** xử lý việc phụ ngoài luồng request chính mà không làm chậm hay làm hỏng nó.

**Nội dung**

- Gửi email bằng `JavaMailSender`; mẫu email HTML bằng Thymeleaf; test bằng SMTP giả lập chạy bằng Docker
- Spring Events: `ApplicationEventPublisher`, `@EventListener`, `@TransactionalEventListener` (chỉ gửi email khi transaction đã commit)
- `@Async` và thread pool riêng; `@Scheduled` cho tác vụ định kỳ
- Điều gì xảy ra với tác vụ nền khi ứng dụng chạy nhiều instance (đi tiếp ở bài 26)

**Thực hành:** phát event `BookingConfirmed`, listener gửi email xác nhận bằng mẫu Thymeleaf (F-50); tác vụ định kỳ gửi email nhắc trước giờ chơi (F-51) và giải phóng giữ chỗ hết hạn (F-22).

**Tự kiểm tra:** vì sao gửi email trong một `@EventListener` thông thường có thể gửi email xác nhận cho một đơn mà sau đó transaction lại rollback? `@TransactionalEventListener` sửa điều đó thế nào?

### Bài 24. WebSocket và cập nhật thời gian thực

**Mục tiêu:** đẩy thay đổi từ server đến trình duyệt ngay khi nó xảy ra.

**Nội dung**

- Nhắc lại polling, SSE, WebSocket (Giai đoạn 1, bài 12); chọn cái nào cho bài toán nào
- Spring WebSocket với STOMP: endpoint, destination, `@MessageMapping`, gửi tới nhóm và tới một người
- Xác thực kết nối WebSocket
- Vấn đề khi chạy nhiều instance và hướng giải quyết bằng message broker

**Thực hành:** khi một khung giờ vừa được đặt, mọi người đang xem lưới lịch trống của cơ sở đó thấy khung giờ chuyển sang "đã đặt" ngay lập tức.

**Tự kiểm tra:** vì sao bài toán này dùng WebSocket hay SSE đều được, chọn cái nào và vì sao? Hai instance backend thì người dùng nối vào instance A có nhận được thay đổi từ instance B không?

## Module G. Cache, kiểm thử, chất lượng

### Bài 25. Redis và caching

**Mục tiêu:** dùng cache đúng chỗ và xử lý được các vấn đề đi kèm.

**Nội dung**

- Redis là gì, vì sao nhanh (chạy trong bộ nhớ, một luồng xử lý lệnh); các kiểu dữ liệu và trường hợp dùng
- TTL, chính sách thu hồi bộ nhớ; persistence (RDB, AOF) ở mức khái niệm
- Chiến lược: cache-aside, write-through, write-behind
- Vấn đề: invalidation, cache stampede, cache penetration, cache avalanche
- Spring Cache: `@Cacheable`, `@CacheEvict`

**Thực hành:** cache danh sách cơ sở và bảng giá, đo thời gian trả lời trước và sau; xóa cache đúng khi bảng giá bị sửa.

**Tự kiểm tra:** cập nhật database rồi xóa cache, hay xóa cache rồi cập nhật database? Vì sao?

### Bài 26. Rate limiting và khóa phân tán

**Mục tiêu:** bảo vệ hệ thống khỏi quá tải và phối hợp đúng giữa nhiều instance.

**Nội dung**

- Thuật toán rate limit: fixed window, sliding window, token bucket
- Khóa phân tán bằng Redis và hạn chế của nó

**Thực hành:** tự viết rate limiter token bucket bằng Redis cho API đăng nhập (N-05); dùng khóa phân tán để tác vụ giải phóng giữ chỗ hết hạn (F-22) chỉ chạy trên một instance khi có nhiều instance.

**Tự kiểm tra:** token bucket khác fixed window ở điểm nào?

### Bài 27. Kiểm thử

**Mục tiêu:** viết test có giá trị thật, không chỉ để tăng coverage.

**Nội dung**

- Kim tự tháp kiểm thử: unit, integration, end-to-end
- JUnit 5, AssertJ, Mockito: mock, stub, verify; khi nào không nên mock
- `@WebMvcTest`, `@DataJpaTest`, `@SpringBootTest`
- Testcontainers để test với database và Redis thật
- Đặt tên test, cấu trúc Given–When–Then; TDD ở mức cơ bản

**Thực hành:** viết unit test cho logic tính giá (R-05, R-11) và chính sách hủy (R-06); integration test với Testcontainers cho chống đặt trùng (N-01).

**Tự kiểm tra:** unit test khác integration test thế nào? Vì sao test với H2 có thể đánh lừa bạn?

### Bài 28. Logging, tài liệu và chất lượng code

**Mục tiêu:** đưa capstone v2 đến mức người khác đọc và vận hành được.

**Nội dung**

- SLF4J và Logback; log level; log có cấu trúc (JSON) kèm request ID
- OpenAPI/Swagger tự sinh tài liệu
- Cấu trúc project: theo tầng và theo tính năng (nối với bài 4)
- Lombok: những annotation hay dùng và chỗ không nên dùng (ví dụ `@Data` trên JPA entity)
- Kiểm tra tĩnh: Checkstyle hoặc Spotless, SonarLint

**Thực hành:** hoàn thiện README của capstone v2 với hướng dẫn chạy, tài liệu API và sơ đồ kiến trúc; gắn tag `v2-spring`.

**Tự kiểm tra:** khi có sự cố trên production, log của bạn đã đủ để lần theo một request cụ thể chưa?
