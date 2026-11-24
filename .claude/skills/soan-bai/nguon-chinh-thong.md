# Nguồn chính thống theo chủ đề

Dùng cho skill `soan-bai` và mọi lúc cần dẫn nguồn trong repo. Đây là danh sách **trang chủ** của các nguồn; khi nghiên cứu, tìm và mở đúng trang con, đúng phiên bản.

## Phân hạng nguồn

| Hạng | Là gì | Dùng thế nào |
| --- | --- | --- |
| **A** | Đặc tả, tài liệu chính thức của dự án, RFC, man page | Nguồn chính cho mọi khẳng định |
| **B** | Bài viết kỹ thuật của chính nhóm phát triển hoặc công ty vận hành hệ thống (blog chính thức, JEP, release notes, paper gốc), tài liệu của tổ chức chuẩn như OWASP | Được dùng làm nguồn; ưu tiên A khi có |
| **C** | Blog cá nhân, Medium, Baeldung, GeeksforGeeks, Stack Overflow, video | Chỉ để tìm hướng hoặc ví dụ; **không bao giờ** là nguồn duy nhất của một khẳng định |

## Hạng A theo chủ đề

| Chủ đề | Nguồn |
| --- | --- |
| Java ngôn ngữ và JVM | Java Language Specification và JVM Specification (docs.oracle.com/javase/specs); Java SE API documentation trên docs.oracle.com; dev.java |
| Tính năng Java mới | OpenJDK JEP (openjdk.org/jeps) — hạng B nhưng là nguồn gốc của tính năng |
| Spring | docs.spring.io: Spring Framework, Spring Boot, Spring Security, Spring Data JPA, Spring AI |
| Hibernate | docs.hibernate.org |
| PostgreSQL | postgresql.org/docs (chọn đúng phiên bản) |
| MySQL (khi so sánh) | dev.mysql.com/doc |
| Redis | redis.io/docs |
| Kafka | kafka.apache.org/documentation |
| HTTP, TCP, TLS, DNS | RFC trên rfc-editor.org hoặc datatracker.ietf.org (ví dụ HTTP Semantics, TCP, TLS 1.3, DNS) |
| Web, HTML, CSS, JavaScript, trình duyệt | MDN Web Docs (developer.mozilla.org); đặc tả WHATWG (html.spec.whatwg.org); đặc tả ECMAScript (tc39.es) |
| Accessibility | WCAG trên w3.org |
| React | react.dev |
| TypeScript | typescriptlang.org/docs |
| Linux | man page (man7.org); tài liệu kernel (docs.kernel.org) |
| Git | git-scm.com/docs và sách Pro Git trên git-scm.com/book |
| Docker | docs.docker.com |
| Kubernetes | kubernetes.io/docs |
| Nginx | nginx.org/en/docs |
| GitHub Actions | docs.github.com |
| LLM API của Anthropic, MCP | docs.claude.com hoặc docs.anthropic.com; modelcontextprotocol.io |
| pgvector | README trên kho GitHub chính thức của pgvector |
| Bảo mật web | OWASP (owasp.org) — hạng B, là chuẩn tham chiếu của ngành |

## Hạng B gợi ý cho system design

- Paper gốc của hệ thống (ví dụ các paper về Dynamo, Bigtable, Raft)
- Blog kỹ thuật chính thức của công ty mô tả hệ thống của chính họ

## Sách trong lộ trình

Sách (Effective Java, Java Concurrency in Practice, Designing Data-Intensive Applications…) chỉ ghi ở mục "Đọc thêm". Khẳng định trong tài liệu phải dựa trên nguồn đã mở được trong phiên.
