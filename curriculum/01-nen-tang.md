# Giai đoạn 1: Nền tảng

38 bài, 6 module, đi từ cách máy tính hoạt động đến Linux, mạng, Git, công cụ build, Java Core và SQL. Module A là nền móng cho mọi thứ phía sau: thread, bộ nhớ, cache, I/O đều quay lại đây.

**Vì sao học:** Phỏng vấn hỏi nhiều nhất về những thứ nằm dưới framework: HashMap chạy thế nào, transaction và isolation, thread và deadlock, gõ URL thì chuyện gì xảy ra. Hiểu tầng này thì học framework nào cũng nhanh và debug được lỗi khó.

Thời lượng là mức tối đa cho người học mới. Phần đã vững thì làm "Tự kiểm tra" trước, đạt thì chỉ làm lab rồi chuyển bài.

| Module | Bài | Thời lượng tối đa |
| --- | --- | --- |
| A. Máy tính hoạt động thế nào | 1–3 | 4–5 buổi |
| B. Linux | 4–8 | 1 tuần |
| C. Networking | 9–12 | 1 tuần |
| D. Git và công cụ build | 13–14 | 3 buổi |
| E. Java Core | 15–31 | 3 tuần |
| F. SQL và cơ sở dữ liệu | 32–38 | 1,5 tuần |

## Module A. Máy tính hoạt động thế nào

### Bài 1. Biểu diễn dữ liệu

**Mục tiêu:** hiểu mọi dữ liệu trong máy đều là bit, và vì sao có những lỗi như tràn số hay `0.1 + 0.2 != 0.3`.

**Nội dung**

- Hệ nhị phân, thập lục phân, chuyển đổi qua lại; bit, byte, word
- Số nguyên có dấu và số bù hai; phạm vi của `byte`, `int`, `long` trong Java; tràn số
- Phép toán bit: AND, OR, XOR, dịch trái, dịch phải
- Số thực theo chuẩn IEEE 754; vì sao không dùng `double` cho tiền, dùng `BigDecimal`
- Ký tự: ASCII, Unicode, UTF-8, UTF-16; vì sao tiếng Việt hay bị lỗi font
- Endianness (big-endian, little-endian) ở mức khái niệm

**Thực hành:** viết chương trình Java in biểu diễn nhị phân của số âm; tái hiện tràn `int`; so sánh cộng tiền bằng `double` và `BigDecimal`; đếm số byte của một chuỗi tiếng Việt trong UTF-8.

**Tự kiểm tra:** `Integer.MAX_VALUE + 1` bằng bao nhiêu, vì sao? Vì sao `0.1 + 0.2` không bằng `0.3`? Chuỗi "Việt" chiếm bao nhiêu byte trong UTF-8?

### Bài 2. Kiến trúc máy tính

**Mục tiêu:** hiểu chương trình chạy trên phần cứng ra sao, và vì sao truy cập bộ nhớ, ổ đĩa, mạng có tốc độ chênh nhau hàng nghìn lần.

**Nội dung**

- CPU: thanh ghi, chu kỳ nạp, giải mã, thực thi lệnh; đa nhân và siêu phân luồng
- Phân cấp bộ nhớ: thanh ghi, cache L1/L2/L3, RAM, SSD, HDD, mạng; độ trễ tương đối giữa các tầng
- Tính cục bộ (locality) theo thời gian và không gian; vì sao duyệt mảng nhanh hơn duyệt danh sách liên kết
- Từ mã nguồn đến mã máy: biên dịch, thông dịch, bytecode và JIT
- Cache của CPU và vấn đề đồng bộ giữa các nhân (nền cho bài `volatile` sau này)

**Thực hành:** đo thời gian duyệt mảng hai chiều theo hàng và theo cột; đo thời gian duyệt `ArrayList` và `LinkedList` có 1 triệu phần tử. Ghi kết quả và giải thích.

**Tự kiểm tra:** vì sao duyệt theo hàng nhanh hơn theo cột? Cache phía CPU liên quan gì đến việc một thread không thấy thay đổi của thread khác?

### Bài 3. Hệ điều hành

**Mục tiêu:** nắm các khái niệm hệ điều hành mà backend dùng hằng ngày: process, thread, bộ nhớ ảo, I/O.

**Nội dung**

- Kernel space và user space; system call
- Process và thread: khác nhau ở đâu, chia sẻ những gì; context switch và chi phí của nó
- Lập lịch CPU ở mức khái niệm
- Bộ nhớ ảo, phân trang (paging), page fault, swap
- Đồng bộ: race condition, mutex, semaphore, deadlock và bốn điều kiện gây deadlock
- File system: file descriptor, inode; mọi thứ trong Linux là file
- Mô hình I/O: blocking, non-blocking, I/O multiplexing (select, epoll) — nền cho Nginx, Netty, virtual thread

**Thực hành:** trên VPS, dùng `ps`, `top`, `/proc` để xem process và thread của một ứng dụng Java đang chạy; dùng `strace` xem các system call khi đọc một file.

**Tự kiểm tra:** process khác thread thế nào? Context switch tốn kém vì sao? Deadlock xảy ra khi nào, phòng tránh ra sao? Vì sao Nginx phục vụ được hàng nghìn kết nối với ít thread?

## Module B. Linux

### Bài 4. Shell và hệ thống file

**Mục tiêu:** làm việc thoải mái trên terminal, không cần giao diện.

**Nội dung**

- Shell là gì, bash và zsh; cấu trúc một lệnh, tham số, option
- Cấu trúc thư mục chuẩn (FHS): `/etc`, `/var`, `/home`, `/opt`, `/usr`, `/tmp`
- Đường dẫn tuyệt đối và tương đối; `ls`, `cd`, `cp`, `mv`, `rm`, `mkdir`, `find`, `ln` (hard link và symlink)
- Xem file: `cat`, `less`, `head`, `tail -f`
- Biến môi trường, `PATH`, file cấu hình `.bashrc`/`.zshrc`; dùng `man` và `--help`

**Thực hành:** tự tạo cấu trúc thư mục dự án chỉ bằng lệnh; theo dõi log thời gian thực bằng `tail -f`.

**Tự kiểm tra:** hard link khác symlink thế nào? Khi gõ `java`, shell tìm chương trình ở đâu?

### Bài 5. User, group và phân quyền

**Mục tiêu:** cấu hình quyền đúng và an toàn cho ứng dụng trên server.

**Nội dung**

- User, group, root; `sudo` và file sudoers
- Quyền r/w/x cho owner, group, others; biểu diễn số (755, 644, 600)
- `chmod`, `chown`, `umask`; quyền trên thư mục khác quyền trên file thế nào
- Nguyên tắc quyền tối thiểu: chạy ứng dụng bằng user riêng, không dùng root

**Thực hành:** tạo user `appuser` không có quyền đăng nhập, cấp quyền đúng cho thư mục chứa ứng dụng và file cấu hình chứa mật khẩu.

**Tự kiểm tra:** quyền 750 nghĩa là gì? Vì sao file chứa secret nên để 600?

### Bài 6. Xử lý văn bản và pipe

**Mục tiêu:** tìm và phân tích log nhanh bằng dòng lệnh.

**Nội dung**

- stdin, stdout, stderr; redirect `>`, `>>`, `2>&1`; pipe `|`
- `grep` (kèm regex cơ bản), `sed`, `awk`, `cut`, `sort`, `uniq -c`, `wc`, `xargs`

**Thực hành:** từ một file access log của Nginx, đếm số request theo status code và tìm 10 IP gọi nhiều nhất chỉ bằng một dòng lệnh.

**Tự kiểm tra:** `2>&1` nghĩa là gì? Viết lệnh tìm tất cả dòng chứa ERROR trong 1.000 dòng log cuối.

### Bài 7. Process, service và lập lịch

**Mục tiêu:** chạy và quản lý ứng dụng như một service thật trên server.

**Nội dung**

- `ps`, `top`/`htop`, `kill` và các signal (SIGTERM, SIGKILL, SIGHUP); graceful shutdown
- Chạy nền: `&`, `nohup`, `jobs`; vì sao cần systemd thay vì `nohup`
- systemd: viết unit file, `systemctl start/enable/status`, tự khởi động lại khi lỗi; xem log bằng `journalctl`
- `cron` và cú pháp lập lịch

**Thực hành:** đóng gói một ứng dụng Spring Boot thành JAR, chạy bằng systemd với user `appuser`, tự khởi động khi server reboot; viết cron backup database mỗi đêm.

**Tự kiểm tra:** SIGTERM khác SIGKILL thế nào, Spring Boot xử lý SIGTERM ra sao?

### Bài 8. Gói phần mềm, ổ đĩa, mạng và bảo mật server

**Mục tiêu:** tự dựng và bảo vệ một VPS từ đầu.

**Nội dung**

- `apt`; kiểm tra ổ đĩa bằng `df -h`, `du -sh`
- Mạng trên máy: `ip a`, `ss -tulpn`, `ping`, `curl -v`
- SSH key, tắt đăng nhập bằng mật khẩu và đăng nhập root, firewall `ufw`, `fail2ban`
- Shell script: biến, điều kiện, vòng lặp, hàm, mã thoát, `set -euo pipefail`

**Thực hành:** viết script `setup-server.sh` tự động tạo user, cấu hình SSH, bật firewall cho một VPS mới.

**Tự kiểm tra:** làm sao biết cổng 8080 đang do process nào chiếm? Vì sao nên tắt đăng nhập SSH bằng mật khẩu?

## Module C. Networking

### Bài 9. Mô hình mạng và địa chỉ IP

**Mục tiêu:** hiểu gói tin đi từ máy bạn đến server qua những tầng nào.

**Nội dung**

- Mô hình OSI 7 tầng và TCP/IP 4 tầng; đóng gói dữ liệu qua từng tầng
- Địa chỉ IPv4, IPv6; subnet và CIDR (/24, /16); IP public và private; NAT
- MAC address, ARP, router, gateway ở mức khái niệm
- Port và socket: cặp (IP, port) xác định một kết nối

**Thực hành:** dùng `traceroute` xem đường đi tới một trang web; tính số địa chỉ trong dải `10.0.0.0/24`.

**Tự kiểm tra:** vì sao nhiều máy trong nhà dùng chung một IP public? `192.168.1.0/24` có bao nhiêu địa chỉ dùng được?

### Bài 10. TCP và UDP

**Mục tiêu:** hiểu cách TCP đảm bảo dữ liệu đến đúng và đủ, và khi nào dùng UDP.

**Nội dung**

- Three-way handshake, four-way termination, trạng thái TIME_WAIT
- Sequence number, ACK, retransmission; flow control và congestion control ở mức khái niệm
- UDP: không kết nối, không đảm bảo; dùng cho DNS, video call, game
- Socket API: `bind`, `listen`, `accept`, `connect`

**Thực hành:** viết TCP echo server và client bằng Java `ServerSocket`/`Socket`; dùng Wireshark bắt gói và chỉ ra 3 bước handshake.

**Tự kiểm tra:** vì sao cần ba bước bắt tay chứ không phải hai? Khi nào chọn UDP thay TCP?

### Bài 11. DNS và HTTP

**Mục tiêu:** trả lời trọn vẹn câu "gõ URL vào trình duyệt thì chuyện gì xảy ra".

**Nội dung**

- DNS: quá trình phân giải (resolver, root, TLD, authoritative), cache và TTL; record A, AAAA, CNAME, MX, TXT
- HTTP: cấu trúc request và response, method và tính idempotent, nhóm status code
- Header quan trọng: `Content-Type`, `Authorization`, `Cache-Control`, `ETag`, `Location`
- HTTP/1.1 keep-alive, HTTP/2 multiplexing, HTTP/3 trên QUIC ở mức khái niệm

**Thực hành:** dùng `dig` theo dõi phân giải một tên miền; dùng `curl -v` gửi request thủ công; viết bài "Gõ URL vào trình duyệt" của riêng bạn vào repo.

**Tự kiểm tra:** PUT khác PATCH thế nào, cái nào idempotent? 401 khác 403 ra sao? `ETag` dùng để làm gì?

### Bài 12. HTTPS, cookie, CORS và giao tiếp thời gian thực

**Mục tiêu:** hiểu các cơ chế bảo mật và kết nối mà web app nào cũng dùng.

**Nội dung**

- Mã hóa đối xứng và bất đối xứng, hash; chữ ký số
- TLS handshake, certificate và CA, vì sao HTTPS chống được nghe lén
- Cookie và các thuộc tính `HttpOnly`, `Secure`, `SameSite`; session phía server
- Same-origin policy, CORS, preflight request
- Polling, long polling, Server-Sent Events, WebSocket

**Thực hành:** dùng `openssl s_client` xem certificate của một trang; cố ý tạo lỗi CORS giữa frontend và backend rồi sửa.

**Tự kiểm tra:** CORS chặn ở phía nào, trình duyệt hay server? Khi nào chọn SSE thay WebSocket?

## Module D. Git và công cụ build

### Bài 13. Git từ bên trong và quy trình nhóm

**Mục tiêu:** dùng Git tự tin trong nhóm, sửa được khi lỡ tay.

**Nội dung**

- Git lưu dữ liệu thế nào: blob, tree, commit, branch là con trỏ
- Working directory, staging, repository; `reset` (soft, mixed, hard), `restore`, `revert`
- Merge và rebase, interactive rebase, `cherry-pick`, `stash`, giải quyết conflict
- Cứu commit bị mất bằng `reflog`
- Git Flow, trunk-based, pull request, Conventional Commits

**Thực hành:** tạo repo thử, cố ý gây conflict, rebase lại lịch sử, xóa nhầm commit bằng `reset --hard` rồi cứu lại.

**Tự kiểm tra:** merge khác rebase thế nào, khi nào không nên rebase? `revert` khác `reset` ra sao?

### Bài 14. Maven và Gradle

**Mục tiêu:** hiểu công cụ build làm gì và tự cấu hình được dự án Java nhiều module.

**Nội dung**

- Vì sao cần công cụ build: quản lý dependency, biên dịch, chạy test, đóng gói
- Maven: `pom.xml`, tọa độ (groupId, artifactId, version), scope của dependency, vòng đời và phase (`compile`, `test`, `package`, `install`)
- Dependency bắc cầu, xung đột phiên bản, `dependency:tree`, BOM và `dependencyManagement`
- Dự án nhiều module (parent và module con)
- Gradle ở mức đọc hiểu: `build.gradle`, task, so sánh với Maven
- Maven Wrapper và Gradle Wrapper: vì sao nên commit wrapper vào repo

**Thực hành:** tạo dự án Maven hai module (`core` và `app`) cho capstone; cố ý tạo xung đột phiên bản một thư viện và đọc `dependency:tree` để tìm nguyên nhân.

**Tự kiểm tra:** scope `provided` khác `runtime` thế nào? Hai thư viện kéo về hai phiên bản khác nhau của cùng một dependency thì Maven chọn bản nào?

## Module E. Java Core

### Bài 15. Java chạy thế nào và kiểu dữ liệu

**Mục tiêu:** hiểu đường đi từ file `.java` đến lệnh chạy trên CPU và cách Java lưu biến.

**Nội dung**

- JDK, JRE, JVM; biên dịch ra bytecode, JIT
- Kiểu nguyên thủy và kiểu tham chiếu; wrapper class, autoboxing và cache `Integer` (-128 đến 127)
- Stack và heap; Java luôn truyền tham trị (pass-by-value), kể cả với object
- `String` bất biến, String pool, `==` và `equals`; `StringBuilder`
- Regex: cú pháp cơ bản, `Pattern` và `Matcher`, kiểm tra định dạng (email, số điện thoại)
- `static`, `final`, khối khởi tạo, thứ tự khởi tạo object

**Thực hành:** dùng `javac` và `javap -c` xem bytecode; viết ví dụ chứng minh pass-by-value; so sánh `Integer` 127 và 128 bằng `==`; viết regex kiểm tra số điện thoại Việt Nam.

**Tự kiểm tra:** Java pass-by-value hay pass-by-reference? Vì sao `String` được thiết kế bất biến?

### Bài 16. Lập trình hướng đối tượng

**Mục tiêu:** thiết kế class đúng, không chỉ thuộc định nghĩa.

**Nội dung**

- Đóng gói, kế thừa, đa hình, trừu tượng; overloading và overriding
- Interface và abstract class, default method; ưu tiên composition hơn inheritance
- Các phương thức của `Object`; hợp đồng giữa `equals` và `hashCode`
- Immutable class: cách viết và lợi ích

**Thực hành:** viết class `Money` bất biến có `equals`/`hashCode` đúng; chứng minh lỗi khi chỉ override `equals` mà quên `hashCode` rồi đưa vào `HashSet`.

**Tự kiểm tra:** khi nào dùng interface, khi nào dùng abstract class? Vì sao composition thường tốt hơn inheritance?

### Bài 17. Nguyên lý SOLID và thiết kế hướng đối tượng

**Mục tiêu:** đánh giá được một thiết kế class tốt hay xấu và sửa được thiết kế xấu.

**Nội dung**

- Phân tích và thiết kế hướng đối tượng (OOAD): từ yêu cầu đến class và trách nhiệm
- 5 nguyên lý SOLID, mỗi nguyên lý một ví dụ vi phạm và cách sửa
- Coupling và cohesion; "program to an interface"
- Dependency Inversion khác Dependency Injection thế nào
- Design pattern là gì, vì sao cần, ba nhóm khởi tạo, cấu trúc, hành vi

**Thực hành:** lấy một class "làm mọi thứ" (kiểm tra giờ trống, tính giá, lưu đơn, gửi email cho capstone), chỉ ra các nguyên lý bị vi phạm và tách lại.

**Tự kiểm tra:** Open/Closed nghĩa là gì trong thực tế? Liskov Substitution bị vi phạm thì gây lỗi gì?

### Bài 18. Design pattern nhóm khởi tạo

**Mục tiêu:** chọn đúng cách tạo object cho từng tình huống.

**Nội dung**

- Singleton: các cách cài đặt, cách nào an toàn đa luồng, vì sao Singleton thường bị coi là anti-pattern khi lạm dụng
- Factory Method và Abstract Factory
- Builder: khi object có nhiều tham số tùy chọn
- Prototype ở mức khái niệm
- Pattern khởi tạo xuất hiện ở đâu trong JDK và Spring (ví dụ bean scope singleton, `BeanFactory`)

**Thực hành:** viết Singleton thread-safe theo 3 cách; dùng Builder tạo đối tượng đơn đặt sân; dùng Factory chọn cách tính giá theo môn.

**Tự kiểm tra:** singleton bean của Spring khác Singleton pattern ở đâu? Khi nào Builder tốt hơn constructor nhiều tham số?

### Bài 19. Design pattern nhóm cấu trúc

**Mục tiêu:** ghép các object lại với nhau mà không làm code cứng nhắc.

**Nội dung**

- Adapter: nối hai interface không khớp nhau
- Decorator: thêm hành vi mà không sửa class gốc (liên hệ `java.io`)
- Proxy: kiểm soát truy cập, nền tảng của AOP trong Spring
- Facade: một cửa vào đơn giản cho hệ thống phức tạp
- Composite ở mức khái niệm
- So sánh Proxy và Decorator

**Thực hành:** dùng Adapter bọc một cổng thanh toán giả lập vào interface `PaymentGateway` của capstone; dùng Decorator thêm ghi log và đo thời gian cho một service.

**Tự kiểm tra:** Proxy khác Decorator ở đâu? Vì sao `@Transactional` của Spring dựa trên Proxy?

### Bài 20. Design pattern nhóm hành vi

**Mục tiêu:** tổ chức logic thay đổi theo tình huống mà không cần chuỗi `if-else` dài.

**Nội dung**

- Strategy: thay thuật toán lúc chạy
- Observer: thông báo khi trạng thái thay đổi (liên hệ event trong Spring)
- Template Method (liên hệ `JdbcTemplate`)
- Chain of Responsibility (liên hệ filter chain của Spring Security)
- State: đối tượng đổi hành vi theo trạng thái
- Command ở mức khái niệm

**Thực hành:** dùng Strategy cho chính sách hủy và tính giá cao điểm (R-05, R-06, R-11); dùng State cho vòng đời đơn đặt (giữ chỗ, đã xác nhận, đã check-in, không đến, đã hủy).

**Tự kiểm tra:** Strategy khác State thế nào? Observer có rủi ro gì khi có nhiều listener?

### Bài 21. Exception và Generics

**Mục tiêu:** xử lý lỗi đúng cách và viết code dùng lại được với generics.

**Nội dung**

- Cây exception: `Throwable`, `Error`, `Exception`, `RuntimeException`; checked và unchecked
- try-with-resources, `finally`, custom exception, không nuốt exception
- Generics: class, method, bounded type; wildcard `? extends` và `? super` (nguyên tắc PECS); type erasure

**Thực hành:** viết class `Result<T>` biểu diễn thành công hoặc lỗi; viết hàm `copy` giữa hai list dùng PECS.

**Tự kiểm tra:** checked và unchecked exception khác nhau thế nào, Spring rollback với loại nào? Type erasure gây hạn chế gì?

### Bài 22. Collections từ bên trong

**Mục tiêu:** chọn đúng cấu trúc dữ liệu và giải thích được cách nó hoạt động.

**Nội dung**

- `ArrayList` (mảng động, cơ chế tăng kích thước) và `LinkedList`
- `HashMap`: hàm băm, bucket, va chạm, load factor, resize, chuyển sang cây đỏ đen khi một bucket quá dài
- `LinkedHashMap` (làm LRU cache), `TreeMap`, `HashSet`, `PriorityQueue`, `ArrayDeque`
- `Comparable` và `Comparator`; `Iterator` và lỗi `ConcurrentModificationException`
- Độ phức tạp của các thao tác chính

**Thực hành:** tự cài đặt `MyHashMap` có resize; cài đặt LRU cache bằng `LinkedHashMap`.

**Tự kiểm tra:** điều gì xảy ra khi hai key trùng hash? Vì sao key của `HashMap` nên bất biến?

### Bài 23. Java 8: lambda, Stream, Optional và java.time

**Mục tiêu:** viết Java theo phong cách hàm, đúng và dễ đọc.

**Nội dung**

- Lambda, functional interface (`Function`, `Predicate`, `Supplier`, `Consumer`, `BiFunction`), method reference
- Default method và static method trong interface
- Stream API: tính lười, intermediate và terminal operation, `Collectors` (`groupingBy`, `partitioningBy`, `toMap`, `joining`), `flatMap`, `reduce`; parallel stream và khi nào không nên dùng
- `Optional`: dùng đúng và dùng sai
- `java.time`: `LocalDate`, `LocalDateTime`, `Instant`, `ZonedDateTime`, `Duration`, `Period`; vì sao thay `Date` và `Calendar`

**Thực hành:** từ danh sách đơn đặt sân, dùng Stream tính doanh thu theo cơ sở và theo tháng, top 3 khách đặt nhiều nhất; viết hàm sinh các khung 30 phút của một ngày bằng `java.time`, xử lý đúng múi giờ Việt Nam.

**Tự kiểm tra:** vì sao nói Stream là lười? `map` khác `flatMap` thế nào? Lưu thời gian đặt sân nên dùng `LocalDateTime` hay `Instant`, vì sao?

### Bài 24. Java 9 đến 17: những gì dự án hiện đại dùng

**Mục tiêu:** dùng được các tính năng ngôn ngữ mà dự án Spring Boot 3 (yêu cầu tối thiểu Java 17) hay gặp.

**Nội dung**

- Factory method cho collection không đổi (`List.of`, `Map.of`) và khác biệt với `Collections.unmodifiableList`
- Hệ thống module (JPMS) ở mức khái niệm
- `var` cho biến cục bộ: khi nào nên và không nên dùng
- HTTP Client mới (`java.net.http`)
- Các method mới hay dùng của `String`, `Stream`, `Optional`
- Switch expression, text block
- `record`: khi nào dùng thay class, giới hạn của record
- Pattern matching cho `instanceof`
- `sealed` class và interface

**Thực hành:** viết lại các DTO của capstone bằng `record`; mô hình hóa kết quả đặt sân (thành công, khung giờ đã kín, vi phạm quy tắc) bằng `sealed interface` và xử lý bằng switch expression.

**Tự kiểm tra:** record có phù hợp làm JPA entity không, vì sao? `sealed` giúp gì khi viết switch?

### Bài 25. Java 21

**Mục tiêu:** biết các tính năng của bản LTS Java 21 và dùng được trong code.

**Nội dung**

- Pattern matching cho `switch` và record pattern
- Sequenced collections: thứ tự phần tử có định nghĩa rõ ràng
- Virtual thread: ý tưởng và khi nào dùng (đi sâu ở bài Concurrency phần 2)
- Các tính năng còn ở dạng preview: biết tên và trạng thái, không dùng trong code production
- Cách đọc JEP để biết một tính năng ra đời ở phiên bản nào và đã chính thức hay chưa

**Thực hành:** viết lại phần xử lý kết quả đặt sân ở bài trước bằng pattern matching cho `switch` kết hợp record pattern; tra JEP của từng tính năng đã dùng và ghi phiên bản vào ghi chú.

**Tự kiểm tra:** pattern matching cho `switch` giúp gì so với chuỗi `if-instanceof`? Vì sao không nên dùng tính năng preview trong production?

### Bài 26. I/O và NIO.2

**Mục tiêu:** đọc, ghi file và luồng dữ liệu đúng cách, không rò tài nguyên.

**Nội dung**

- Byte stream và character stream; buffering; charset khi đọc ghi văn bản (nối với bài 1)
- try-with-resources với stream
- NIO.2: `Path`, `Files` (đọc, ghi, duyệt thư mục), thao tác file an toàn
- Đọc file lớn theo dòng thay vì đọc hết vào bộ nhớ
- Serialization của Java và vì sao các dự án hiện đại thường dùng JSON thay thế

**Thực hành:** viết công cụ đọc một file CSV lịch đặt sân lớn theo từng dòng, thống kê số đơn theo cơ sở, xuất kết quả ra file mới; so sánh bộ nhớ dùng khi đọc theo dòng và đọc toàn bộ.

**Tự kiểm tra:** vì sao phải chỉ định charset khi đọc file văn bản? Đọc file 2 GB thế nào để không hết bộ nhớ?

### Bài 27. Reflection và annotation

**Mục tiêu:** hiểu cơ chế mà Spring, JPA, Jackson dùng để "tự động" làm việc với class của bạn.

**Nội dung**

- `Class`, `Field`, `Method`, `Constructor`; tạo object và gọi method lúc chạy
- Annotation: khai báo, `@Retention`, `@Target`, đọc annotation lúc chạy
- Quét class trong một package
- Chi phí và rủi ro của reflection; khi nào không nên dùng
- Liên hệ: Spring tìm `@Component`, Jackson đọc field, JPA đọc `@Entity` thế nào

**Thực hành:** viết annotation `@Validate(min, max)` và một validator dùng reflection để kiểm tra object; đây là bước chuẩn bị cho lab tự viết IoC container ở Giai đoạn 2.

**Tự kiểm tra:** `RetentionPolicy.RUNTIME` khác `SOURCE` thế nào, annotation nào của Spring cần `RUNTIME`? Reflection chậm ở chỗ nào?

### Bài 28. Kiểm thử đơn vị với JUnit 5

**Mục tiêu:** viết unit test cho mọi lab từ đây trở đi.

**Nội dung**

- Vì sao viết test; unit test là gì và không là gì
- JUnit 5: `@Test`, assertion, `@BeforeEach`, `@DisplayName`, test có tham số
- AssertJ cho assertion dễ đọc
- Cấu trúc Given–When–Then; đặt tên test
- Chạy test bằng Maven, đọc báo cáo
- Test-first ở mức cơ bản

**Thực hành:** viết test cho bộ tính giá của capstone (giờ thường, giờ cao điểm, đơn vắt mốc theo R-11) và chính sách hủy (R-06) trước, rồi mới viết code cho test chạy qua.

**Tự kiểm tra:** một unit test tốt có những đặc điểm gì? Vì sao test chỉ nên kiểm tra một hành vi?

### Bài 29. Concurrency phần 1: thread và đồng bộ

**Mục tiêu:** hiểu vì sao code đa luồng sai và sửa bằng các công cụ cơ bản.

**Nội dung**

- Tạo thread, vòng đời của thread
- Race condition, critical section; `synchronized` (method và block), monitor
- Java Memory Model: visibility, reordering, quan hệ happens-before; `volatile`
- `wait`, `notify`; deadlock trong Java và cách phát hiện bằng thread dump

**Thực hành:** tái hiện race condition khi nhiều thread cộng một biến đếm; tái hiện deadlock và đọc nó bằng `jstack`; viết producer–consumer bằng `wait/notify`.

**Tự kiểm tra:** `volatile` giải quyết vấn đề gì và không giải quyết vấn đề gì? Vì sao `count++` không an toàn?

### Bài 30. Concurrency phần 2: công cụ cấp cao

**Mục tiêu:** dùng đúng công cụ đồng thời trong code thật.

**Nội dung**

- `ExecutorService`, các tham số của `ThreadPoolExecutor` (core, max, queue, chính sách từ chối)
- `Future`, `CompletableFuture`: kết hợp nhiều tác vụ bất đồng bộ, xử lý lỗi
- `ReentrantLock`, `ReadWriteLock`; lớp `Atomic*` và CAS
- `ConcurrentHashMap`, `BlockingQueue`, `CountDownLatch`, `Semaphore`
- `ThreadLocal` và rủi ro rò bộ nhớ; virtual thread (Java 21) khác platform thread thế nào

**Thực hành:** gọi 3 API giả lập song song bằng `CompletableFuture` rồi ghép kết quả; so sánh 10.000 tác vụ I/O chạy bằng thread pool và bằng virtual thread.

**Tự kiểm tra:** thread pool đầy queue thì chuyện gì xảy ra? Virtual thread phù hợp với loại tác vụ nào?

### Bài 31. JVM: bộ nhớ và garbage collection

**Mục tiêu:** đọc được tình trạng bộ nhớ của ứng dụng và xử lý được lỗi hết bộ nhớ.

**Nội dung**

- Các vùng nhớ: heap (young, old), stack, metaspace
- Class loading và cơ chế ủy quyền cho class loader cha
- GC: đánh dấu và dọn, generational, stop-the-world; G1 và ZGC ở mức khái niệm
- Rò rỉ bộ nhớ trong Java, `OutOfMemoryError`, `StackOverflowError`
- Công cụ: `-Xms`/`-Xmx`, `jstat`, `jmap`, heap dump, VisualVM hoặc Java Flight Recorder

**Thực hành:** viết chương trình gây rò bộ nhớ bằng một `static List`, chạy với heap nhỏ, lấy heap dump và tìm ra nguyên nhân.

**Tự kiểm tra:** Java có GC rồi vì sao vẫn bị rò bộ nhớ? Stack và heap lưu những gì?

## Module F. SQL và cơ sở dữ liệu

Capstone dùng PostgreSQL. Khi học các bài 34–36, ghi thêm điểm khác nhau với MySQL InnoDB.

### Bài 32. Mô hình quan hệ và thiết kế schema

**Mục tiêu:** tự thiết kế được database cho capstone.

**Nội dung**

- Nhóm lệnh DDL: `CREATE`, `ALTER`, `DROP`; kiểu dữ liệu
- Bảng, khóa chính, khóa ngoại, ràng buộc; quan hệ 1-1, 1-n, n-n
- Vẽ ERD; chọn kiểu dữ liệu (đặc biệt tiền tệ và thời gian, múi giờ)
- Chuẩn hóa 1NF, 2NF, 3NF; khi nào phi chuẩn hóa
- Khóa tự tăng và UUID: ưu nhược điểm

**Thực hành:** vẽ ERD và viết script tạo bảng cho capstone (người dùng, cơ sở, sân, môn, bảng giá, giữ chỗ, đơn đặt, đánh giá…), bám theo `capstone/README.md`.

**Tự kiểm tra:** quan hệ n-n cài đặt thế nào? Khi nào chấp nhận dữ liệu lặp?

### Bài 33. Truy vấn từ cơ bản đến nâng cao

**Mục tiêu:** viết được truy vấn báo cáo phức tạp mà không phải xử lý trong code Java.

**Nội dung**

- Nhóm lệnh DML: `INSERT`, `UPDATE`, `DELETE`; `INSERT ... ON CONFLICT` của PostgreSQL
- Thứ tự thực thi logic của một câu SELECT
- INNER, LEFT, RIGHT, FULL, CROSS, SELF JOIN
- `GROUP BY`, `HAVING`, hàm tổng hợp; subquery, `EXISTS` và `IN`
- CTE (`WITH`), CTE đệ quy
- Window function: `ROW_NUMBER`, `RANK`, `LAG`, `SUM() OVER`
- Xử lý `NULL` đúng cách

**Thực hành:** giải 20 bài SQL theo mức tăng dần (ví dụ bộ SQL 50 trên LeetCode); viết truy vấn top 3 sân mỗi cơ sở theo doanh thu.

**Tự kiểm tra:** `WHERE` khác `HAVING` thế nào? `RANK` khác `DENSE_RANK` ra sao?

### Bài 34. Index và tối ưu truy vấn

**Mục tiêu:** tìm và sửa được truy vấn chậm.

**Nội dung**

- Cấu trúc B+Tree; clustered index và secondary index
- Composite index và quy tắc leftmost prefix; covering index
- Khi index không được dùng: hàm trên cột, `LIKE '%...'`, ép kiểu, độ chọn lọc thấp
- Đọc `EXPLAIN` / `EXPLAIN ANALYZE`; phân trang bằng `OFFSET` và bằng con trỏ (keyset)
- Cái giá của index khi ghi

**Thực hành:** sinh bảng 1 triệu dòng, đo truy vấn trước và sau khi thêm index; so sánh phân trang `OFFSET 900000` với keyset.

**Tự kiểm tra:** index `(a, b, c)` có dùng được cho `WHERE b = ?` không? Vì sao không nên đánh index mọi cột?

### Bài 35. Transaction, ACID và isolation

**Mục tiêu:** hiểu dữ liệu bị sai thế nào khi nhiều người cùng thao tác, và cách database ngăn điều đó.

**Nội dung**

- ACID: từng chữ nghĩa là gì trong thực tế
- Dirty read, non-repeatable read, phantom read, lost update
- 4 isolation level và hiện tượng mỗi mức ngăn được; mức mặc định của MySQL và PostgreSQL
- MVCC hoạt động thế nào ở mức khái niệm; undo log và redo log

**Thực hành:** mở hai phiên SQL song song, tái hiện từng hiện tượng ở các isolation level khác nhau và ghi lại kết quả.

**Tự kiểm tra:** Repeatable Read có chặn được phantom read trong MySQL không? Lost update là gì?

### Bài 36. Lock và xử lý đồng thời trong database

**Mục tiêu:** chống đặt trùng, trừ kho sai trong hệ thống thật.

**Nội dung**

- Shared lock và exclusive lock; row lock, gap lock, next-key lock (InnoDB)
- `SELECT ... FOR UPDATE`; pessimistic locking
- Optimistic locking bằng cột version
- Deadlock trong database: cách đọc log và cách tránh
- Unique constraint và exclusion constraint (PostgreSQL) như cách chống trùng đơn giản nhất

**Thực hành:** mô phỏng 100 request cùng đặt một khung giờ của một sân; giải quyết bằng ba cách (ràng buộc, pessimistic, optimistic) và so sánh.

**Tự kiểm tra:** khi nào dùng optimistic, khi nào dùng pessimistic locking?

### Bài 37. View, function, stored procedure và trigger

**Mục tiêu:** biết các đối tượng lập trình phía database, dùng được và biết khi nào **không** nên dùng.

**Nội dung**

- View và materialized view: khác nhau thế nào, khi nào dùng
- Function và stored procedure trong PostgreSQL (PL/pgSQL); so sánh với MySQL
- Trigger: chạy khi nào, ví dụ ghi lịch sử thay đổi
- Gọi stored procedure từ Java (`CallableStatement`, nối với bài JDBC ở Giai đoạn 2)
- Đánh đổi khi đặt logic nghiệp vụ trong database: hiệu năng, khó test, khó version, khó đọc

**Thực hành:** tạo view báo cáo doanh thu theo cơ sở; viết trigger ghi lịch sử mỗi lần đơn đặt đổi trạng thái; viết một function tính tỉ lệ lấp đầy của một sân trong ngày.

**Tự kiểm tra:** view có lưu dữ liệu không? Vì sao nhiều dự án hạn chế đặt logic nghiệp vụ trong stored procedure?

### Bài 38. Vận hành database và NoSQL

**Mục tiêu:** biết database vận hành thế nào ở mức cần cho backend, và chọn đúng loại database.

**Nội dung**

- Backup và restore; migration schema bằng Flyway hoặc Liquibase
- Connection và giới hạn kết nối; slow query log
- Replication (primary–replica) ở mức khái niệm (đào sâu ở Giai đoạn 6)
- NoSQL: key-value (Redis), document (MongoDB), wide-column, graph; khi nào dùng thay cho SQL

**Thực hành:** thêm Flyway vào capstone; viết script backup và thử restore sang một database khác.

**Tự kiểm tra:** khi nào chọn MongoDB thay PostgreSQL? Vì sao cần migration tool thay vì sửa bảng bằng tay?
