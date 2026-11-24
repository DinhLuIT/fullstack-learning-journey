# Fullstack Learning Journey

Hành trình học lại FullStack từ nền tảng: từ cách máy tính hoạt động đến Spring, React, AI Engineering, DevOps, microservices và system design. Mỗi chủ đề đi từ lý thuyết đến **code chay** (tự viết lại những gì framework làm hộ), rồi mới dùng framework.

## Mục tiêu

- Hiểu sâu đến tầng dưới của những công nghệ đang dùng hằng ngày
- Lấp các lỗ hổng chưa học bài bản: Linux, networking, SQL nâng cao, system design
- Chuẩn bị phỏng vấn vị trí FullStack (Java Spring Boot + React)
- Xây một dự án capstone tiến hóa từ Java thuần đến microservices có trợ lý AI

## Lộ trình

| Giai đoạn | Nội dung | Số bài | Thời lượng |
| --- | --- | --- | --- |
| [0. Khởi động](00-setup/README.md) | Dựng repo, môi trường, đề tài capstone | – | 4 tuần, học nhẹ |
| [1. Nền tảng](01-fundamentals/README.md) | Máy tính và hệ điều hành, Linux, mạng, Git, Java Core, SQL | 28 | 6 tuần |
| [2. Backend](02-backend/README.md) | HTTP server và JDBC thuần, Spring bên dưới, bảo mật, Redis, kiểm thử | 16 | 5 tuần |
| [3. Frontend](03-frontend/README.md) | HTML/CSS, trình duyệt, JavaScript core, TypeScript, React | 13 | 3 tuần |
| [4. AI Engineering](04-ai-engineering/README.md) | LLM API, prompt, tool calling, agent, MCP, RAG, đánh giá | 12 | 4 tuần |
| [5. DevOps](05-devops/README.md) | Container, Nginx, HTTPS, CI/CD, giám sát | 9 | 3 tuần |
| [6. Microservices và System Design](06-microservices-system-design/README.md) | Nguyên lý, microservices, 9 case luyện tập | 15 | 5 tuần |
| [7. Phỏng vấn](07-interview/README.md) | CV, kể dự án, behavioral, phỏng vấn thử | 6 | 2 tuần + duy trì |
| [DSA](dsa/README.md) | 14 pattern, chạy song song suốt lộ trình | 15 | 3–4 giờ/tuần |

Đề cương chi tiết từng bài: [curriculum/](curriculum/README.md). Tiến độ hiện tại: [progress.md](progress.md).

## Cấu trúc repo

```
├── progress.md           # đang học gì, đã xong gì, cần ôn gì
├── curriculum/           # đề cương chi tiết 114 bài
├── 00-setup/ ... 07-interview/
│   └── <chủ-đề>/
│       ├── NN-ten-bai.md # ghi chú từng bài
│       ├── labs/         # code chay
│       ├── interview-qa.md
│       └── pitfalls.md
├── dsa/                  # lời giải theo pattern
├── capstone/             # dự án xuyên suốt
├── templates/            # mẫu bài học, mẫu lab
└── site/                 # learning hub (Astro), làm sau
```

## Mỗi bài học gồm

1. **Mục tiêu:** học xong phải làm được gì
2. **Ghi chú:** viết bằng lời của mình
3. **Thực hành:** lab code chay trong `labs/`
4. **Tự kiểm tra:** trả lời như đang phỏng vấn

## Quy ước

- Ghi chú tiếng Việt; tên code, commit, thư mục bằng tiếng Anh
- Commit theo Conventional Commits: `docs(java-core): explain HashMap resize`, `feat(raw-jdbc): add transaction demo`
- Mỗi giai đoạn là một milestone, mỗi chủ đề là một issue trên GitHub
