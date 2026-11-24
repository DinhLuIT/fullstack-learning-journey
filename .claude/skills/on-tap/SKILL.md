---
name: on-tap
description: 'Ôn tập và phỏng vấn thử cho Đình: hỏi lại điểm yếu trong progress.md, kiểm tra theo chủ đề, hoặc mock interview kỹ thuật và system design. Dùng khi Đình gọi /on-tap, muốn ôn bài, kiểm tra kiến thức hay phỏng vấn thử.'
argument-hint: "[trống | <bài hoặc chủ đề> | phong-van <chủ đề> | system-design <case>]"
---

# Ôn tập và phỏng vấn thử

Đối số: `$ARGUMENTS`

## Chọn chế độ

| Đối số | Chế độ | Nguồn câu hỏi |
| --- | --- | --- |
| trống | **Ôn điểm yếu** | Bảng "Cần ôn lại" trong `progress.md`, cộng 2–3 câu ngẫu nhiên từ các bài có `status: done` |
| bài hoặc chủ đề (`18`, `java-core`, `sql`) | **Ôn chủ đề** | Phần "Tự kiểm tra" trong `curriculum/` của các bài đó, cùng `interview-qa.md` của chủ đề |
| `phong-van <chủ đề>` | **Phỏng vấn kỹ thuật** | Như ôn chủ đề, cộng câu hỏi vặn sâu tự nghĩ ra |
| `system-design <case>` | **Phỏng vấn system design** | Case trong `curriculum/06-microservices-system-design.md`, Module C |

Chỉ hỏi về bài Đình đã học (`status` là `doing`, `done` hoặc `review`), trừ khi Đình yêu cầu khác.

## Luật chung

- Hỏi **từng câu một**, chờ Đình trả lời. Không bao giờ đưa đáp án trước khi Đình thử.
- Chấm mỗi câu theo thang: **2** đúng và giải thích được cơ chế, **1** đúng ý nhưng thiếu cơ chế hoặc ví dụ, **0** sai hoặc không trả lời. Nói rõ còn thiếu gì, ngắn gọn.
- Sau câu 0 hoặc 1 điểm: giải thích phần thiếu trong tối đa 150 từ, rồi hỏi lại bằng cách khác để chắc Đình đã hiểu.
- Mọi câu đã hỏi đều được ghi vào `interview-qa.md` của chủ đề: câu trả lời nguyên văn, đánh giá, câu trả lời hoàn chỉnh có nguồn, theo [ghi-cau-tra-loi.md](ghi-cau-tra-loi.md). Ở chế độ phỏng vấn, ghi sau khi kết thúc buổi để không phá không khí phỏng vấn.

## Chế độ ôn điểm yếu và ôn chủ đề

- Khoảng 8–10 câu mỗi buổi, xen kẽ câu khái niệm, câu "tại sao" và câu tình huống từ capstone.
- Cuối buổi, cập nhật bảng "Cần ôn lại" trong `progress.md`:
  - Câu mới đạt dưới 2: thêm dòng mới
  - Điểm yếu cũ trả lời đạt 2 điểm: ghi ngày vào cột "Đã ôn?"; đạt 2 điểm ở hai buổi khác nhau thì đánh dấu "xong"

## Chế độ phỏng vấn kỹ thuật

Đóng vai người phỏng vấn ở một công ty công nghệ, vị trí FullStack Java Spring Boot + React, mức Junior/Mid.

- Buổi khoảng 30 phút, 6–8 câu. Mỗi câu chính kèm 1–2 câu hỏi vặn ("vì sao?", "nếu tải tăng 10 lần thì sao?", "trong dự án của bạn thì thế nào?").
- Trong buổi không chấm từng câu, giữ không khí phỏng vấn thật. Chấm tổng ở cuối.
- Cuối buổi, nhận xét theo 4 tiêu chí, mỗi tiêu chí 1–5 điểm kèm dẫn chứng từ câu trả lời:
  1. Độ chính xác kiến thức
  2. Hiểu cơ chế bên dưới
  3. Liên hệ thực tế, dự án
  4. Cách trình bày: rõ ràng, có cấu trúc, ngắn gọn
- Ghi toàn bộ câu hỏi của buổi vào `interview-qa.md` theo [ghi-cau-tra-loi.md](ghi-cau-tra-loi.md), kể cả các câu hỏi vặn. Chỉ ra 3 câu Đình nên luyện nói lại nhiều nhất.

## Chế độ phỏng vấn system design

- Đưa đề bài mở, để Đình dẫn dắt theo khung 6 bước: yêu cầu, ước lượng, API, dữ liệu, kiến trúc, điểm nghẽn.
- Chỉ trả lời câu hỏi làm rõ yêu cầu khi Đình hỏi. Không gợi ý kiến trúc.
- Khi Đình đề xuất thành phần nào, hỏi đánh đổi của nó.
- Cuối buổi, nhận xét theo khung 6 bước: bước nào làm tốt, bước nào bỏ sót, đánh đổi nào chưa được nêu.

## Không được làm

- Đưa đáp án trước khi Đình trả lời.
- Viết câu trả lời hoàn chỉnh vào `interview-qa.md` cho câu Đình chưa trả lời.
- Chấm dễ để động viên. Điểm phải phản ánh đúng câu trả lời.
