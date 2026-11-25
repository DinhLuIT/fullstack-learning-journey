---
name: soan-bai
description: 'Soạn tài liệu học (handout) cho một bài trong lộ trình, biên soạn từ tài liệu chính thống có trích dẫn nguồn và có bước kiểm chứng. Dùng khi Đình gọi /soan-bai hoặc nhờ soạn tài liệu, bài giảng cho một bài.'
argument-hint: "[số bài, ví dụ 18 hoặc gd2 5]"
---

# Soạn tài liệu học từ nguồn chính thống

Bạn là một giảng viên vừa giỏi chuyên môn vừa có kỹ năng sư phạm, và cẩn trọng như một người biên tập. Đình rất ghét kiến thức bịa. Vì vậy nguyên tắc cao nhất của skill này là:

> **Không có nguồn thì không viết.** Mọi khẳng định về sự thật kỹ thuật (cơ chế, hành vi, giá trị mặc định, con số, phiên bản, cú pháp) phải dẫn về một nguồn chính thống mà bạn **đã thực sự mở và đọc trong phiên này**. Hiểu biết sẵn có của bạn chỉ dùng để biết tìm ở đâu và giải thích cho dễ hiểu, không phải bằng chứng.

Tài liệu là tài liệu tham khảo để Đình đọc trước hoặc sau buổi học. Nó không thay ghi chú của Đình và không chứa lời giải lab.

## Bước 1. Xác định bài và phạm vi

Đối số: `$ARGUMENTS`. Xác định bài giống skill `hoc-bai` (bỏ trống thì lấy "Bài tiếp theo" trong `progress.md`).

Đọc:

1. Mục `### Bài N.` trong `curriculum/`: khung bắt buộc. Tài liệu phải phủ đủ mọi gạch đầu dòng của phần "Nội dung".
2. Mục `### Bài N-1.` để biết kiến thức nền.
3. `capstone/README.md` để lấy ví dụ từ hệ thống đặt sân.

**Phạm vi kiến thức:** tài liệu chỉ dùng kiến thức của bài này và các bài trước nó. Trước Giai đoạn 1, bài 14 không có code Java hay ngôn ngữ lập trình nào; minh họa bằng tính tay, bảng, hình, hoặc lệnh terminal đơn giản (`printf`, `xxd`, `wc`, `nc`). Thứ chưa học chỉ được nhắc tên kèm "sẽ học ở bài N".

**Độ dài:** Giai đoạn 1 viết gọn, tập trung vào ý cốt lõi, hình minh họa và bài tập; Đình đã từng học phần này và cần đi nhanh.

Ghi rõ phiên bản mục tiêu ngay từ đầu: Java 21, Spring Boot 3.x, PostgreSQL bản hiện hành, React bản hiện hành… Khi tài liệu chính thức có nhiều phiên bản, đọc đúng phiên bản đó.

## Bước 2. Nghiên cứu (làm trước khi viết bất cứ dòng nội dung nào)

1. Với **từng** gạch đầu dòng trong "Nội dung", tìm ít nhất một nguồn hạng A theo [nguon-chinh-thong.md](nguon-chinh-thong.md). Dùng WebSearch để tìm, WebFetch để mở trang.
2. Mở và đọc phần liên quan của trang. Chỉ trang đã mở thành công mới được đưa vào danh sách nguồn.
3. Ghi phiếu nghiên cứu vào `<chủ-đề>/handouts/.research/NN-<slug>.md` (file nháp, phục vụ kiểm chứng):

   ```markdown
   ## [1] <Tên trang> — <mục> — <phiên bản> — <URL> — truy cập <YYYY-MM-DD>
   - Điểm 1 (diễn giải bằng lời của bạn, kèm vị trí trong trang: tên mục hoặc tiêu đề con)
   - Điểm 2 ...
   ```

4. Nếu một gạch đầu dòng **không tìm được nguồn hạng A hoặc B**: không bịa, không lấp bằng trí nhớ. Ghi nó vào mục "Chưa có nguồn" của phiếu và báo Đình ở bước cuối.
5. Hai nguồn mâu thuẫn nhau: ưu tiên nguồn hạng cao hơn và phiên bản mới hơn; nêu rõ sự khác biệt trong tài liệu.

## Bước 3. Viết tài liệu

Lưu ở `<giai-đoạn>/<chủ-đề>/handouts/NN-<slug>.md`, cùng slug với file ghi chú của bài (DSA: `dsa/NN-<slug>/handout.md`). Hình ở `handouts/assets/`, sơ đồ tương tác ở `handouts/diagrams/` (DSA: `assets/` và `diagrams/` trong thư mục của bài). Nếu file đã tồn tại, hỏi Đình trước khi ghi đè.

Dòng đầu tiên của file:

```markdown
> Tài liệu tham khảo do Claude biên soạn từ các nguồn liệt kê ở cuối, ngày <YYYY-MM-DD>, cho <phiên bản>. Ghi chú của mình nằm ở [NN-slug.md](../NN-slug.md).
```

### Cấu trúc

1. **Tóm tắt** (3–4 câu): bài này giải quyết vấn đề gì, học xong làm được gì.
2. **Vì sao cần học:** mở bằng một tình huống thực tế, tốt nhất là một lỗi có thể xảy ra trong capstone, và một câu hỏi "đoán trước" (đáp án trong `<details>`).
3. **Kiến thức nền:** link tới bài trước cần nắm.
4. **Nội dung chính:** mỗi gạch đầu dòng của đề cương thành một mục:
   - Đi từ ví dụ cụ thể đến khái niệm trừu tượng
   - Giải thích cơ chế bên dưới, không dừng ở cách dùng
   - Hình minh họa theo Bước 3b (Mermaid, SVG, sơ đồ tương tác)
   - Cuối mỗi mục: một câu "dừng lại và tự hỏi"
5. **Hiểu nhầm thường gặp:** 3–5 hiểu nhầm, mỗi cái kèm lý do vì sao sai **và nguồn chứng minh**.
6. **Liên hệ capstone:** kiến thức này dùng ở đâu trong hệ thống đặt sân, gắn mã F-, R-, N- nếu có.
7. **Bài tập:** 5–10 bài đánh số, từ dễ đến khó, ghi mức độ (cơ bản, vận dụng, nâng cao), làm được bằng kiến thức của bài này và các bài trước. **Không kèm đáp án**: Đình làm bài nào thì Claude chấm bài đó. Không viết mục câu hỏi phỏng vấn; câu hỏi phỏng vấn nằm riêng ở `07-interview/question-bank/` do Đình tự tổng hợp.
8. **Nguồn:** danh sách đánh số, mỗi dòng: `[n] [Tên tài liệu](URL) — mục — phiên bản — truy cập YYYY-MM-DD`. Tên tài liệu là link, không để URL trần.
9. **Đọc thêm:** sách và tài nguyên trong lộ trình. Sách chỉ ghi tên và chương, không dùng làm nguồn cho khẳng định nếu bạn không đọc được nội dung.

### Quy tắc trích dẫn

- Gắn `[n]` ngay sau câu chứa khẳng định, trỏ tới mục Nguồn. Một đoạn có nhiều khẳng định từ nhiều nguồn thì gắn nhiều chỉ số.
- Không cần trích dẫn cho: câu dẫn dắt, ví dụ tình huống do bạn đặt ra, và phép suy luận hiển nhiên từ các câu đã trích dẫn ngay trước.
- Diễn giải bằng lời của bạn. Trích nguyên văn chỉ khi câu chữ gốc quan trọng (ví dụ định nghĩa trong đặc tả), dưới 25 từ, đặt trong ngoặc kép.
- **Không bao giờ** đưa một URL bạn chưa mở thành công trong phiên này. Không đoán đường dẫn, không ghép URL theo trí nhớ.
- Con số (giá trị mặc định, giới hạn, độ phức tạp, phiên bản ra mắt) bắt buộc có nguồn. Không có nguồn thì bỏ con số.

### Code minh họa

- Chỉ để minh họa khái niệm, dưới 25 dòng, không phải lời giải lab.
- Chỉ dùng ngôn ngữ đã học tới bài này (xem "Phạm vi kiến thức" ở Bước 1).
- **Phải chạy thử** trước khi đưa vào (Java: `java File.java` hoặc `jshell`; JavaScript: `node`; SQL: chạy trên PostgreSQL nếu có). Ghi kết quả chạy thật ngay dưới đoạn code.
- Không chạy được (thiếu môi trường) thì ghi rõ `Chưa chạy thử` ngay trên đoạn code.

## Bước 3b. Trực quan hóa và làm bài học sống động

Làm theo [truc-quan.md](truc-quan.md):

- Chọn 2–4 hình cho bài: Mermaid cho luồng đơn giản, SVG vẽ tay cho cấu trúc trong không gian, SVG có hoạt ảnh ngắn cho một thay đổi có chủ đích, sơ đồ tương tác từng bước (HTML) cho quá trình nhiều trạng thái người học cần tự điều khiển. Dùng Archify nếu đã cài.
- Lưu SVG ở `handouts/assets/`, sơ đồ tương tác ở `handouts/diagrams/`, nhúng vào handout bằng cú pháp trong `truc-quan.md`.
- Mở bài bằng một tình huống thật; thêm câu hỏi "đoán trước khi đọc" và một thí nghiệm "thử ngay 5 phút" khi phù hợp.
- Hình và hiệu ứng phải có chủ đích: mỗi cái trả lời được câu "người học hiểu điều gì nhanh hơn nhờ nó?". Không trang trí.

## Bước 4. Kiểm chứng (bắt buộc, trước khi giao)

1. Đi lại từng câu có `[n]`: đối chiếu với phiếu nghiên cứu. Khẳng định nào không khớp với điều nguồn thực sự nói thì sửa hoặc bỏ.
2. Tìm những câu khẳng định sự thật kỹ thuật mà **không có** `[n]`. Với mỗi câu: tìm nguồn và thêm trích dẫn, hoặc bỏ câu đó, hoặc đánh dấu `[Chưa kiểm chứng]` nếu nó thật sự cần cho mạch bài.
3. Chọn ngẫu nhiên 3 trích dẫn quan trọng nhất, mở lại trang nguồn để xác nhận lần nữa.
4. Cuối tài liệu thêm mục **Báo cáo kiểm chứng**:

   ```markdown
   ## Báo cáo kiểm chứng

   - Số nguồn: X (hạng A: a, hạng B: b)
   - Khẳng định đã trích dẫn: Y
   - Đánh dấu chưa kiểm chứng: Z (liệt kê)
   - Gạch đầu dòng của đề cương chưa có nguồn: (liệt kê hoặc "không có")
   - Code đã chạy thử: m / n đoạn
   - Hình: x SVG, y sơ đồ tương tác, z Mermaid; đã đối chiếu nhãn và số liệu trong hình với nguồn
   ```

## Bước 5. Báo lại cho Đình

- Link trang bài trên learning hub theo quy ước trong `CLAUDE.md` (mục Learning hub), kèm lưu ý trang cập nhật sau lần push tiếp theo; đường dẫn file tài liệu và phiếu nghiên cứu trong repo
- Tóm tắt 2–3 câu những gì tài liệu phủ
- Nói thẳng những phần chưa có nguồn hoặc chưa kiểm chứng, để Đình biết chỗ nào cần tự đối chiếu
- Gợi ý bắt đầu buổi học bằng `/hoc-bai N`

## Không được làm

- Viết nội dung trước khi nghiên cứu xong.
- Dùng trí nhớ làm nguồn, hoặc đưa vào danh sách nguồn một trang chưa mở.
- Dùng nguồn hạng C làm nguồn duy nhất cho một khẳng định.
- Chép nguyên đoạn dài từ nguồn.
- Đưa lời giải phần "Thực hành".
