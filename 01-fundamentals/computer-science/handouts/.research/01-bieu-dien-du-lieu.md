# Phiếu nghiên cứu: Bài 1. Biểu diễn dữ liệu

Phiên bản mục tiêu: Java SE 21 (JDK 21), PostgreSQL 17 (bản 19 là bản hiện hành trên trang tài liệu; mục kiểu số đọc ở bản 17). Truy cập ngày 2026-11-24. Ghi chú: trang được mở bằng công cụ fetch; với trang dài, công cụ chỉ trả nguyên văn khoảng 40.000 ký tự đầu, phần sau là bản tóm tắt tự động. Điểm nào chỉ đến từ bản tóm tắt được đánh dấu (tóm tắt).

## [1] JLS SE 21 — Chapter 4. Types, Values, and Variables — https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html — truy cập 2026-11-24
- §4.2: byte, short, int, long là số nguyên có dấu bù hai 8, 16, 32, 64 bit; char là số nguyên không dấu 16 bit, biểu diễn UTF-16 code unit. float ứng với IEEE 754 binary32, double với binary64.
- §4.2.1: phạm vi byte -128..127; short -32768..32767; int -2147483648..2147483647; long -9223372036854775808..9223372036854775807; char 0..65535.
- §4.2.2: "The integer operators do not indicate overflow or underflow in any way." Chỉ / và % ném ArithmeticException khi chia cho 0. Ví dụ 4.2.2-1: 1000000 * 1000000 kiểu int in ra -727379968.
- §4.2.3: Từ Java SE 15 dùng IEEE 754 bản 2019. Bảng 4.2.3-A: float N=24, K=8; double N=53, K=11. NaN không có thứ tự; x != x đúng khi và chỉ khi x là NaN.
- §4.2.4: Số học dấu chấm động theo quy tắc IEEE 754; ví dụ 4.2.4-1 cho thấy kết quả không chính xác do làm tròn; 1.0E308*10 == Infinity (tràn thành vô cực, không ném ngoại lệ).

## [2] Java SE 21 API — Integer — https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Integer.html — truy cập 2026-11-24
- MAX_VALUE = 2^31-1, MIN_VALUE = -2^31 (Field Details).
- SIZE, BYTES: số bit, số byte biểu diễn int "in two's complement binary form".
- toBinaryString/toHexString: số âm được in như số không dấu bằng đối số cộng 2^32.

## [3] Java SE 21 API — BigDecimal — https://docs.oracle.com/en/java/javase/21/docs/api//java.base/java/math/BigDecimal.html — truy cập 2026-11-24
- Class description (nguyên văn): "Immutable, arbitrary-precision signed decimal numbers." Gồm unscaled value (số nguyên độ chính xác tùy ý) và scale 32 bit; giá trị = unscaledValue × 10^-scale.
- Class description: equals đòi cả giá trị và cách biểu diễn giống nhau; thứ tự tự nhiên (compareTo) coi cùng giá trị là bằng.
- Class description: không chỉ định rounding mode mà kết quả chính xác không biểu diễn được thì ném ArithmeticException; ví dụ 1 chia 3.
- (tóm tắt) Constructor BigDecimal(double): kết quả "somewhat unpredictable"; new BigDecimal(0.1) bằng 0.1000000000000000055511151231257827021181583404541015625; khuyên dùng constructor String hoặc valueOf(double). Đã xác nhận giá trị bằng chạy code.
- (tóm tắt) valueOf(double) dùng Double.toString(double).
- (tóm tắt) setScale(int, RoundingMode): giảm scale thì áp dụng rounding mode.

## [4] Java SE 21 API — Double — https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Double.html — truy cập 2026-11-24
- Mục "Floating-point Equality, Equivalence, and Comparison": == trên số thực không phải quan hệ tương đương; có +0.0, -0.0, NaN.
- toString(double): chọn số thập phân (hầu như luôn) ngắn nhất làm tròn về đúng giá trị double theo round to nearest.
- (tóm tắt) valueOf(String): 0.1 không biểu diễn chính xác được bằng số dấu chấm động nhị phân.

## [5] RFC 3629 — UTF-8, a transformation format of ISO 10646 — https://www.rfc-editor.org/rfc/rfc3629.html — truy cập 2026-11-24
- Mục 3: bảng mã hóa 1–4 octet: U+0000–007F → 0xxxxxxx; U+0080–07FF → 110xxxxx 10xxxxxx; U+0800–FFFF → 1110xxxx 10xxxxxx 10xxxxxx; U+10000–10FFFF → 11110xxx + 3 byte 10xxxxxx.
- Mục 1: ký tự US-ASCII mã hóa thành một octet đúng giá trị ASCII; chuỗi ASCII thuần cũng là UTF-8 hợp lệ.
- Mục 3: cấm mã hóa U+D800–U+DFFF (dành cho surrogate của UTF-16). Phạm vi giới hạn U+0000..U+10FFFF.
- Mục 6: BOM trong UTF-8 luôn là EF BB BF; vì đơn vị mã hóa là một octet nên chức năng chỉ thứ tự byte là vô dụng.

## [6] Unicode FAQ — UTF-8, UTF-16, UTF-32 & BOM — https://unicode.org/faq/utf_bom.html — truy cập 2026-11-24
- "What is a UTF?": ánh xạ thuật toán từ code point sang chuỗi byte duy nhất.
- "Is Unicode a 16-bit encoding?": một ký tự là 1–4 byte (UTF-8), một hoặc hai code unit 16 bit (UTF-16), hoặc một code unit 32 bit (UTF-32).
- "What is UTF-16?" / "What are surrogates?": ký tự thường gặp dùng một code unit; còn lại dùng cặp surrogate; leading D800–DBFF, trailing DC00–DFFF.
- "Why do some of the UTFs have a BE or LE...": UTF-16BE/LE; dạng không đánh dấu mặc định big-endian, có thể có BOM ở đầu.
- "Does it matter for the UTF-8 encoding scheme if the underlying processor is little endian or big endian?": BOM trong UTF-8 chỉ là chữ ký nhận diện mã hóa, không liên quan thứ tự byte.

## [7] Java SE 21 API — String — https://docs.oracle.com/en/java/javase/21/docs//api/java.base/java/lang/String.html — truy cập 2026-11-24
- Class description: String biểu diễn chuỗi theo UTF-16, supplementary character dùng cặp surrogate; index tính theo char code unit nên ký tự bổ sung chiếm hai vị trí.
- getBytes(Charset): mã hóa String thành mảng byte theo charset.

## [8] Java SE 21 API — Normalizer — https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/text/Normalizer.html — truy cập 2026-11-24
- Class description: ký tự có dấu có thể mã hóa nhiều cách; ví dụ U+00C1 (dạng composed) và U+0041 U+0301 (dạng decomposed); hai dãy cần được coi như cùng một ký tự ở mức người dùng.
- Hỗ trợ các dạng chuẩn hóa của UAX #15; tham số normalize nhận NFC, NFD, NFKC, NFKD.

## [9] UAX #15 Unicode Normalization Forms, revision 56, Unicode 16.0.0, 2024-08-14 — https://www.unicode.org/reports/tr15/tr15-56.html — truy cập 2026-11-24
- Bảng 1: NFD = Canonical Decomposition; NFC = Canonical Decomposition, followed by Canonical Composition.
- Mục 1.1: tương đương chính tắc là tương đương cơ bản, hiển thị đúng thì luôn trông và hành xử như nhau.
- Mục 1.2: sau khi chuẩn hóa, so sánh nhị phân xác định được sự tương đương.
- Mục 1.3: dãy dấu kết hợp được sắp theo thứ tự xác định (Canonical_Combining_Class).
- Ghi chú: URL https://www.unicode.org/reports/tr15/ bị vòng chuyển hướng, không mở được; dùng bản có số revision.

## [10] MDN — Endianness (Glossary) — https://developer.mozilla.org/en-US/docs/Glossary/Endianness — truy cập 2026-11-24
- Little-endian: lưu byte từ ít quan trọng đến quan trọng nhất; big-endian ngược lại.
- Ví dụ 0x12345678: LE = 78 56 34 12; BE = 12 34 56 78.
- Little-endian dùng trên mọi bộ xử lý Intel; chuẩn Internet thường yêu cầu big-endian.

## [11] Java SE 21 API — ByteOrder — https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/nio/ByteOrder.html — truy cập 2026-11-24
- BIG_ENDIAN: byte của giá trị nhiều byte xếp từ quan trọng nhất đến ít nhất; LITTLE_ENDIAN ngược lại. nativeOrder(): thứ tự byte gốc của nền tảng.

## [12] Java SE 21 API — ByteBuffer — https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/nio/ByteBuffer.html — truy cập 2026-11-24
- Mục "Access to binary data": "The initial order of a byte buffer is always BIG_ENDIAN."

## [13] The Java Tutorials — Bitwise and Bit Shift Operators (viết cho JDK 8) — https://docs.oracle.com/javase/tutorial/java/nutsandbolts/op3.html — truy cập 2026-11-24
- ~ đảo bit, áp dụng cho mọi kiểu nguyên; << dịch trái; >> dịch phải có dấu; >>> đưa 0 vào vị trí trái nhất, >> thì phụ thuộc sign extension; & AND, ^ XOR, | OR.
- dev.java (https://dev.java/learn/language/constructs/basics/using-operators/) có nội dung tương tự, không ghi phiên bản Java mục tiêu.

## [14] SEI CERT Oracle Coding Standard for Java — NUM14-J. Use shift operators correctly — https://cmu-sei.github.io/secure-coding-standards/sei-cert-oracle-coding-standard-for-java/rules/numeric-types-and-operations-num/num14-j — truy cập 2026-11-24 (hạng B)
- Trích JLS §15.19: với int chỉ dùng 5 bit thấp của khoảng dịch (0–31), long dùng 6 bit thấp (0–63).
- >> là arithmetic shift (sign extension); >>> là logical shift (zero extension).
- Dịch int 32 bit cho ra giá trị ban đầu. Toán hạng byte, short, char được nâng lên int trước khi dịch.

## [15] PostgreSQL 17 — 8.1 Numeric Types — https://www.postgresql.org/docs/17/datatype-numeric.html — truy cập 2026-11-24
- 8.1.1: smallint 2 byte, integer 4 byte, bigint 8 byte; lưu ngoài phạm vi thì báo lỗi.
- 8.1.2: numeric "especially recommended for storing monetary amounts and other quantities where exactness is required"; 23.5141 có precision 6, scale 4; thừa chữ số thập phân thì làm tròn theo scale.
- 8.1.3: real/double precision là kiểu "inexact, variable-precision"; cần chính xác (như tiền) thì dùng numeric; so sánh bằng hai số thực có thể không như mong đợi.

## Không mở được hoặc chưa đọc được
- JLS SE 21 Chapter 15 (https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html): trang mở được nhưng công cụ chỉ đọc tới §15.9, không tới §15.18–15.22. Phần dịch bit dùng [13] và [14] thay thế.

## Chưa có nguồn
- Khái niệm "word" (kích thước word phụ thuộc kiến trúc CPU): chưa tìm được nguồn hạng A/B trong phiên. Để lại cho Bài 2 (Kiến trúc máy tính).
- Nguyên nhân "lỗi font" tiếng Việt thời bảng mã TCVN3/VNI: không có nguồn; tài liệu chỉ nói hai nguyên nhân chứng minh được bằng code (giải mã sai charset, khác dạng chuẩn hóa).
