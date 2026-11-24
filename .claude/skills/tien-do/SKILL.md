---
name: tien-do
description: 'Đồng bộ và báo cáo tiến độ học của Đình, đề xuất buổi học tiếp theo, viết phần dữ kiện cho nhật ký tuần. Dùng khi Đình gọi /tien-do, hỏi đang ở đâu trong lộ trình, nên học gì tiếp, hoặc muốn tổng kết tuần.'
argument-hint: "[trống | tuan]"
---

# Tiến độ lộ trình

Đối số: `$ARGUMENTS`

## Chế độ mặc định: đồng bộ và đề xuất

1. Chạy script đồng bộ từ thư mục gốc của repo:

   ```bash
   python3 .claude/skills/tien-do/scripts/sync_progress.py
   ```

   Script đọc `status` trong frontmatter của mọi file bài học, cập nhật bảng "Tổng quan" trong `progress.md` và cột trạng thái trong README của từng chủ đề, rồi in tóm tắt.

2. Đọc `progress.md` (mục "Hiện tại" và "Cần ôn lại") cùng kết quả của script.

3. Cập nhật mục "Hiện tại" trong `progress.md` cho khớp: giai đoạn, bài đang học, bài tiếp theo.

4. Báo cáo cho Đình, ngắn gọn:
   - Đã xong bao nhiêu bài mỗi giai đoạn đang học, so với thời lượng dự kiến trong `curriculum/` (nhanh hay chậm hơn kế hoạch)
   - Bài đang dở và điểm yếu cần ôn
   - **Đề xuất buổi học tiếp theo**, một trong ba hướng:
     - Có điểm yếu chưa ôn quá 7 ngày: ôn trước bằng `/on-tap`
     - Có bài `doing` còn lab dở: làm nốt lab, rồi `/review-lab`
     - Còn lại: học bài tiếp theo bằng `/hoc-bai`

## Chế độ `tuan`: tổng kết tuần

1. Chạy script đồng bộ như trên.
2. Thu thập dữ kiện của 7 ngày qua:

   ```bash
   git log --since="7 days ago" --pretty=format:'%ad %s' --date=short
   grep -rl --include='*.md' -E '^finished: [0-9]{4}-' 0*/ 
   ```

   Lọc các bài có `finished` trong 7 ngày qua; đếm số bài DSA mới trong `dsa/` từ git log.

3. Thêm vào mục "Nhật ký tuần" của `progress.md` một khối mới:

   ```markdown
   ### Tuần <ngày thứ Hai của tuần>

   - Bài đã xong: ...
   - Lab đã làm: ...
   - DSA: ... bài
   - Điểm yếu mới / đã ôn: ...
   - Cảm nhận và kế hoạch tuần sau: (Đình tự viết)
   ```

   Chỉ ghi **dữ kiện có thật** từ git và frontmatter. Không đoán số giờ học, không viết thay phần cảm nhận.

4. Nhắc Đình viết dòng cảm nhận và kế hoạch tuần sau, rồi commit `docs(progress): weekly log`.

## Không được làm

- Sửa `status` của bài học khi Đình chưa xác nhận. Script chỉ đọc `status`, không tự đổi.
- Bịa dữ kiện vào nhật ký tuần.
