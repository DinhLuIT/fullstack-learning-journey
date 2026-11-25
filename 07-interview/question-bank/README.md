# Question bank phỏng vấn

Nơi gom câu hỏi phỏng vấn do **mình tự tổng hợp**: từ buổi phỏng vấn thật, bài chia sẻ, sách, hoặc câu mình thấy hay khi học. Claude không tự thêm câu nào; chỉ thêm khi mình yêu cầu.

## Cách dùng

- Gửi câu hỏi kèm yêu cầu, ví dụ: "thêm câu này vào question bank: HashMap khác ConcurrentHashMap thế nào?"
- Muốn được chấm thì gửi kèm câu trả lời của mình; Claude đánh giá rồi ghi câu trả lời gốc, đánh giá và câu trả lời hoàn chỉnh có nguồn, theo `.claude/skills/on-tap/ghi-cau-tra-loi.md`.
- Chỉ muốn lưu câu hỏi để luyện sau thì Claude ghi câu hỏi và nguồn gốc (gặp ở đâu), chưa có đáp án.
- Ôn bằng `/on-tap phong-van <chủ đề>`: Claude dùng câu hỏi ở đây làm nguồn.

## File theo chủ đề

Tạo khi có câu đầu tiên của chủ đề đó:

| File | Chủ đề |
| --- | --- |
| `java.md` | Java core, collections, concurrency, JVM |
| `spring.md` | Spring, Spring Boot, JPA, Security |
| `database.md` | SQL, index, transaction, NoSQL, Redis |
| `web-frontend.md` | HTML, CSS, trình duyệt, JavaScript, React |
| `networking-os.md` | Mạng, hệ điều hành, Linux |
| `system-design.md` | System design, microservices |
| `devops.md` | Docker, CI/CD, triển khai |
| `ai.md` | LLM, RAG, agent |

Câu hỏi hành vi nằm ở [`../behavioral.md`](../behavioral.md).

File trong thư mục này là ghi chú cá nhân, không hiển thị trên learning hub.
