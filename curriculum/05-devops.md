# Giai đoạn 5: DevOps

9 bài, 4 module, đưa capstone lên môi trường thật trên VPS với tên miền, HTTPS, CI/CD và giám sát. Chạy song song với khóa DevOps Fundamentals và dùng lại kiến thức Linux, mạng ở Giai đoạn 1.

**Vì sao học:** Một sản phẩm chỉ chạy trên máy mình thì chưa xong. Docker, CI/CD và deploy lên server thật giúp capstone có địa chỉ để đưa vào CV, và giúp hiểu điều gì xảy ra sau khi code được merge.

| Module | Bài | Thời lượng |
| --- | --- | --- |
| A. Container | 1–3 | 1 tuần |
| B. Triển khai | 4–5 | 4 buổi |
| C. CI/CD | 6–7 | 4 buổi |
| D. Giám sát và Kubernetes cơ bản | 8–9 | 3 buổi |

## Module A. Container

### Bài 1. Container từ bên trong

**Mục tiêu:** hiểu container không phải phép màu mà là tính năng của Linux.

**Nội dung**

- Container và máy ảo khác nhau thế nào
- Namespace (cô lập process, mạng, file system) và cgroup (giới hạn CPU, RAM)
- Image, layer, union file system; registry
- Vòng đời container: `run`, `exec`, `logs`, `stop`, `rm`

**Thực hành:** chạy một container rồi dùng `ps` trên máy chủ để thấy process của nó; giới hạn RAM của container và quan sát khi ứng dụng Java vượt giới hạn.

**Tự kiểm tra:** container khác máy ảo ở điểm nào? JVM nhận biết giới hạn bộ nhớ của container ra sao?

### Bài 2. Viết Dockerfile tốt

**Mục tiêu:** đóng gói backend và frontend thành image nhỏ, nhanh, an toàn.

**Nội dung**

- Các lệnh `FROM`, `COPY`, `RUN`, `ENV`, `EXPOSE`, `ENTRYPOINT` và `CMD`
- Tận dụng cache: thứ tự lệnh, copy file khai báo thư viện trước
- Multi-stage build; image nền nhỏ (JRE thay JDK, distroless, alpine); `.dockerignore`
- Chạy bằng user không phải root; quét lỗ hổng image

**Thực hành:** viết Dockerfile multi-stage cho Spring Boot và cho React (build rồi phục vụ bằng Nginx); so sánh kích thước image trước và sau tối ưu.

**Tự kiểm tra:** vì sao nên copy file khai báo dependency trước source code? `ENTRYPOINT` khác `CMD` thế nào?

### Bài 3. Network, volume và Docker Compose

**Mục tiêu:** chạy toàn bộ hệ thống bằng một lệnh.

**Nội dung**

- Network: bridge, DNS nội bộ giữa các container
- Volume và bind mount; lưu dữ liệu database
- Compose: service, `depends_on` và health check, biến môi trường, file `.env`
- Quản lý secret: không đưa vào image, không commit lên Git

**Thực hành:** viết `docker-compose.yml` chạy backend, frontend, PostgreSQL có pgvector, Redis; người khác clone repo về chỉ cần một lệnh là chạy được.

**Tự kiểm tra:** container backend kết nối database bằng địa chỉ nào? Xóa container thì dữ liệu database có mất không?

## Module B. Triển khai

### Bài 4. Nginx và reverse proxy

**Mục tiêu:** đặt Nginx đứng trước ứng dụng và hiểu vì sao cần nó.

**Nội dung**

- Reverse proxy và forward proxy; vai trò: định tuyến, TLS, nén, cache, giới hạn
- Cấu hình `server`, `location`, `proxy_pass`; header `X-Forwarded-For`
- Phục vụ file tĩnh của React, xử lý route phía client
- Proxy cho SSE và WebSocket (tắt buffering, nâng cấp kết nối)
- Load balancing cơ bản giữa hai instance

**Thực hành:** cấu hình Nginx: `/` cho frontend, `/api` cho backend, chat AI streaming hoạt động qua proxy.

**Tự kiểm tra:** vì sao streaming bị "dồn cục" khi đi qua Nginx và sửa thế nào? Backend lấy IP thật của người dùng bằng cách nào?

### Bài 5. Tên miền, HTTPS và chiến lược triển khai

**Mục tiêu:** có một địa chỉ thật để đưa vào CV.

**Nội dung**

- Mua tên miền, cấu hình record A trỏ về VPS (ôn lại bài DNS)
- Chứng chỉ miễn phí từ Let's Encrypt, tự gia hạn; chuyển hướng HTTP sang HTTPS
- Chiến lược triển khai: recreate, rolling, blue-green, canary; rollback
- Migration database khi triển khai không gián đoạn

**Thực hành:** đưa capstone lên tên miền thật có HTTPS; viết script triển khai blue-green đơn giản bằng hai container và Nginx.

**Tự kiểm tra:** blue-green khác rolling thế nào? Đổi tên cột trong database khi đang chạy thì làm sao để không lỗi?

## Module C. CI/CD

### Bài 6. Continuous Integration với GitHub Actions

**Mục tiêu:** mỗi pull request đều được kiểm tra tự động.

**Nội dung**

- CI, continuous delivery và continuous deployment khác nhau thế nào
- GitHub Actions: workflow, job, step, runner, trigger; cache Maven/npm
- Chạy test (kể cả Testcontainers), lint, build; quy tắc bảo vệ nhánh chính
- Secret trong GitHub Actions

**Thực hành:** viết workflow chạy test backend và frontend cho mọi pull request; chặn merge khi test thất bại.

**Tự kiểm tra:** continuous delivery khác continuous deployment ở đâu?

### Bài 7. Continuous Deployment

**Mục tiêu:** merge là tự động lên production, có đường lùi khi lỗi.

**Nội dung**

- Build image và đẩy lên registry (GitHub Container Registry); gắn tag theo commit
- Triển khai lên VPS qua SSH; health check sau triển khai
- Tự rollback khi health check thất bại
- Môi trường staging và production

**Thực hành:** hoàn thiện pipeline: merge vào nhánh chính → test → build image → triển khai → health check → rollback nếu lỗi (N-11).

**Tự kiểm tra:** vì sao gắn tag image theo commit thay vì chỉ dùng `latest`?

## Module D. Giám sát và Kubernetes cơ bản

### Bài 8. Observability

**Mục tiêu:** biết hệ thống đang khỏe hay ốm trước khi người dùng báo.

**Nội dung**

- Ba trụ cột: log, metric, trace
- Spring Boot Actuator và Micrometer; Prometheus thu metric, Grafana vẽ dashboard
- Các chỉ số quan trọng: độ trễ, tỉ lệ lỗi, lưu lượng, mức bão hòa; SLI, SLO
- Tập trung log (Loki hoặc ELK ở mức khái niệm); cảnh báo

**Thực hành:** thêm Prometheus và Grafana vào Compose; dựng dashboard độ trễ, tỉ lệ lỗi API và chi phí gọi LLM; tạo cảnh báo khi tỉ lệ lỗi tăng.

**Tự kiểm tra:** vì sao nên theo dõi độ trễ p95/p99 thay vì trung bình?

### Bài 9. Kubernetes ở mức khái niệm

**Mục tiêu:** trả lời được câu hỏi phỏng vấn về Kubernetes, chưa cần vận hành thật.

**Nội dung**

- Kubernetes giải quyết vấn đề gì mà Docker Compose không giải quyết
- Pod, Deployment, Service, Ingress, ConfigMap, Secret
- Liveness và readiness probe; tự mở rộng (HPA)

**Thực hành:** chạy backend của capstone trên một cụm Kubernetes cục bộ (kind hoặc minikube) với Deployment và Service; gắn tag `v5-devops` cho capstone.

**Tự kiểm tra:** liveness probe khác readiness probe thế nào?
