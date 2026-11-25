# Phiếu nghiên cứu: Bài 1. Biểu diễn dữ liệu (bản 2)

Soạn lại ngày 2026-11-25 theo quy tắc phạm vi kiến thức: bài nằm trước bài Java đầu tiên nên không dùng ngôn ngữ lập trình; ví dụ bằng tính tay và lệnh terminal (`printf`, `bc`, `xxd`, `wc`, `iconv`, `awk`, phép toán số học của shell). Mọi nguồn dưới đây được mở trong phiên này.

## [1] RFC 3629 — https://www.rfc-editor.org/rfc/rfc3629.html — truy cập 2026-11-25
- Mục 1: US-ASCII mã hóa trong một octet với giá trị ASCII; chuỗi ASCII thuần cũng là UTF-8 hợp lệ.
- Mục 3: ký tự U+0000..U+10FFFF mã hóa bằng 1–4 octet; bảng mẫu 0xxxxxxx / 110xxxxx 10xxxxxx / 1110xxxx 10xxxxxx 10xxxxxx / 11110xxx + 3 byte 10xxxxxx; cách điền bit.
- Mục 10: cùng một chữ có dấu có thể biểu diễn bằng ký tự dựng sẵn hoặc chuỗi tương đương chính tắc (chữ gốc + dấu kết hợp); vấn đề khi so khớp chuỗi; giải pháp dựa trên Unicode Normalization Forms (UAX #15).

## [2] Unicode FAQ: UTF-8, UTF-16, UTF-32 & BOM — https://unicode.org/faq/utf_bom.html — truy cập 2026-11-25
- Code space U+0000..U+10FFFF; mỗi ký tự là 1–4 byte (UTF-8), một hoặc hai code unit 16 bit (UTF-16), hoặc một code unit 32 bit (UTF-32).
- UTF-16: một code unit cho phần lớn ký tự thường gặp, cặp surrogate cho phần còn lại.
- UTF-16BE/LE; UTF-8 đọc theo byte nên không có vấn đề thứ tự byte.

## [3] MDN Glossary: Endianness — https://developer.mozilla.org/en-US/docs/Glossary/Endianness — truy cập 2026-11-25
- Little-endian: byte ít quan trọng nhất trước, dùng trên mọi bộ xử lý Intel. Big-endian: ngược lại, còn gọi network byte order, chuẩn Internet thường yêu cầu.
- Ví dụ 0x12345678: LE 78 56 34 12; BE 12 34 56 78.

## [4] PostgreSQL 17: 8.1 Numeric Types — https://www.postgresql.org/docs/17/datatype-numeric.html — truy cập 2026-11-25
- Bảng 8.2: smallint 2 byte −32768..32767; integer 4 byte −2147483648..2147483647; bigint 8 byte −9223372036854775808..9223372036854775807.
- 8.1.1: lưu giá trị ngoài phạm vi thì báo lỗi.
- 8.1.2: numeric đặc biệt được khuyên dùng cho số tiền và các đại lượng cần chính xác.
- 8.1.3: real, double precision là kiểu không chính xác; cần chính xác (như tiền) thì dùng numeric; so sánh bằng hai số thực có thể không như mong đợi.

## [5] Python Tutorial: Floating-Point Arithmetic: Issues and Limitations — https://docs.python.org/tutorial/floatingpoint — truy cập 2026-11-25 (đọc qua trích đoạn của kết quả tìm kiếm)
- Số thực được biểu diễn trong phần cứng dưới dạng phân số nhị phân; số thập phân nhập vào chỉ được xấp xỉ.
- 0.1 + 0.2 cho 0.30000000000000004; đây là bản chất của số thực nhị phân, mọi ngôn ngữ dùng số thực phần cứng đều gặp.

## [6] GNU Awk User's Guide 16.1 — https://www.gnu.org/software/gawk/manual/html_node/Computer-Arithmetic.html — truy cập 2026-11-25
- POSIX awk dùng số thực dấu phẩy động độ chính xác kép.

## [7] JLS SE 21 Chapter 4 — https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html — truy cập 2026-11-25 (đọc 100.000 ký tự đầu, đủ cho §4.2)
- §4.2: byte, short, int, long là số nguyên có dấu bù hai 8, 16, 32, 64 bit.
- §4.2.1: phạm vi byte −128..127 (và các kiểu khác).
- §4.2.2: các phép toán số nguyên không báo tràn số theo bất kỳ cách nào.

## Kết quả chạy thật (máy Linux trong phiên)
- printf '%X\n' 42 → 2A; echo "obase=2; 42" | bc → 101010; printf '%X\n' -5 → FFFFFFFFFFFFFFFB
- echo $(( 12 & 10 )) $(( 12 | 10 )) $(( 12 ^ 10 )) $(( 5 << 1 )) $(( 40 >> 2 )) → 8 14 6 10 10
- awk 0.1 + 0.2 với %.17g → 0.30000000000000004; so sánh bằng 0.3 → 0
- printf 'Việt' | wc -c → 6; xxd → 5669 e1bb 8774; iconv -f windows-1252 → Viá»‡t
- "ệ" dựng sẵn 3 byte, dạng tách dấu e + U+0323 + U+0302 là 5 byte
- UTF-16LE của "A" → 4100; UTF-16BE → 0041

## Chưa có nguồn
- Khái niệm word: để sang bài 2.
