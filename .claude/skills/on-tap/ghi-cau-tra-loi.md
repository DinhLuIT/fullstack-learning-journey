# Ghi lại câu trả lời, đánh giá và câu trả lời hoàn chỉnh

Dùng chung cho `hoc-bai` (mục "Tự kiểm tra" trong file ghi chú của bài) và `on-tap` (file `interview-qa.md` của chủ đề).

## Thứ tự bắt buộc

1. Hỏi một câu, **chờ Đình trả lời**. Không bao giờ đưa đáp án trước.
2. Đánh giá: điểm 0–2, đúng ở đâu, thiếu gì, sai gì (sai thì nói vì sao sai).
3. Viết câu trả lời hoàn chỉnh theo nguyên tắc nguồn trong `CLAUDE.md`: khẳng định cụ thể phải dẫn về tài liệu chính thống đã mở trong phiên, hoặc về mục "Nguồn" của handout bài đó. Không có nguồn thì ghi rõ "chưa kiểm chứng".
4. Ghi vào file theo định dạng dưới đây, rồi báo Đình đã ghi ở đâu.

## Định dạng

```markdown
### <Câu hỏi>

**Lần 1, YYYY-MM-DD: câu trả lời của mình**

> <Câu trả lời của Đình, chép nguyên văn, không sửa chính tả hay diễn đạt>

**Đánh giá: 1/2.** <Đúng ở đâu. Thiếu gì. Sai gì và vì sao.>

**Câu trả lời hoàn chỉnh**

<Trả lời như trong buổi phỏng vấn thật: ý chính trước (1–2 câu), rồi cơ chế bên dưới, rồi ví dụ, ưu tiên ví dụ trong capstone. Khoảng 80–200 từ. Gắn link nguồn ngay sau khẳng định cụ thể.>
```

## Khi Đình trả lời lại câu đã có

Không xóa lần trước. Thêm khối `**Lần 2, YYYY-MM-DD: ...**` và phần đánh giá mới ngay dưới lần trước. Chỉ viết lại "Câu trả lời hoàn chỉnh" nếu lần trả lời mới cho thấy cần bổ sung ý. Lịch sử các lần trả lời giúp Đình thấy mình tiến bộ ở đâu.

## Vị trí ghi

- `hoc-bai`: thay chú thích `<!-- Trả lời từng câu... -->` trong mục `## Tự kiểm tra` của file ghi chú bài bằng các khối câu hỏi. Không động vào mục "Ghi chú" và "Sai lầm và hiểu nhầm".
- `on-tap`: thêm vào `interview-qa.md` của chủ đề chứa bài. Câu hỏi đã có trong file thì thêm "Lần N" như trên.

Cả hai file này là ghi chú cá nhân trong repo, **không** hiển thị trên learning hub.
