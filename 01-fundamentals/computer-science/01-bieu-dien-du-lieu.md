---
title: "Biểu diễn dữ liệu"
phase: 1
lesson: 1
module: "A. Máy tính hoạt động thế nào"
status: todo        # todo | doing | done | review
started:
finished:
tags: [fundamentals, computer-science]
content: ready      # ready = đã soạn xong nội dung bài
---

# Bài 1. Biểu diễn dữ liệu

> Tài liệu tham khảo do Claude biên soạn từ các nguồn liệt kê ở cuối, ngày 2026-11-25. Bài này chưa dùng ngôn ngữ lập trình nào: mọi ví dụ làm bằng tính tay hoặc vài lệnh terminal.

## Tóm tắt

Trong máy tính, số, chữ, ảnh hay tiền đều chỉ là dãy bit. Cùng một dãy bit có thể là số 65, chữ "A" hay một phần của số tiền, tùy cách ta **diễn giải** nó. Bài này đi qua bốn cách diễn giải quan trọng nhất: số nguyên, số âm, số thực và chữ, để hiểu vì sao có những lỗi như tràn số, `0.1 + 0.2` không bằng `0.3`, hay tiếng Việt bị biến thành "Viá»‡t".

## Vì sao cần học

Hai lỗi có thể xảy ra trong chính hệ thống đặt sân mình sẽ xây:

- Tổng tiền 3 khung giờ, mỗi khung 0,1 triệu, hiện ra 0,30000000000000004 triệu.
- Tên sân "Sân Việt" lưu vào database xong hiện thành "SÃ¢n Viá»‡t".

<details>
<summary>Đoán trước khi đọc: hai lỗi này có chung nguyên nhân không?</summary>

Có, ở mức sâu nhất: máy chỉ lưu bit, và lỗi xảy ra khi **cách biểu diễn** không chứa được giá trị ta muốn (số thực nhị phân không biểu diễn chính xác 0,1), hoặc khi **cách diễn giải** lúc đọc khác lúc ghi (byte UTF-8 bị đọc bằng bảng mã khác). Đọc hết bài là bạn tự giải thích được cả hai.

</details>

## Nội dung chính

### 1. Nhị phân và thập lục phân

Số 42 ở hệ thập phân nghĩa là 4×10 + 2. Ở hệ nhị phân, mỗi vị trí là một lũy thừa của 2: 42 = 32 + 8 + 2, viết là `101010`.

- **Đổi thập phân sang nhị phân:** chia liên tiếp cho 2, ghi số dư, đọc ngược từ dưới lên.
- **Nhị phân và thập lục phân (hex):** 16 = 2⁴, nên mỗi chữ số hex ứng với đúng 4 bit. Gom 4 bit từ phải sang: `0010 1010` thành `2A`. Hex chỉ là cách viết gọn của nhị phân, vì vậy lập trình viên đọc dữ liệu thô bằng hex.
- **Bit, byte:** một bit là 0 hoặc 1; một byte là 8 bit, biểu diễn được 2⁸ = 256 giá trị.

Thử ngay trong terminal (kết quả chạy thật):

```bash
printf '%X\n' 42            # 2A
echo "obase=2; 42" | bc     # 101010
```

Dừng lại và tự hỏi: vì sao một byte luôn viết được bằng đúng 2 chữ số hex?

### 2. Số âm: số bù hai và tràn số

Máy cần lưu cả số âm trong cùng số bit. Bài này học cách biểu diễn **số bù hai** (two's complement). Đây không chỉ là lý thuyết: ví dụ, đặc tả ngôn ngữ Java định nghĩa các kiểu số nguyên 8, 16, 32, 64 bit đều là số nguyên có dấu dạng bù hai [7].

**Cách lấy −5 ở dạng 8 bit:** viết 5 = `0000 0101`, đảo mọi bit thành `1111 1010`, rồi cộng 1 được `1111 1011`.

**Phạm vi:** với n bit có dấu, phạm vi là từ −2ⁿ⁻¹ đến 2ⁿ⁻¹ − 1. Bit đầu tiên bằng 1 nghĩa là số âm.

| Số bit | Nhỏ nhất | Lớn nhất |
| --- | --- | --- |
| 8 | −128 | 127 |
| 16 | −32768 | 32767 |
| 32 | −2147483648 | 2147483647 |
| 64 | −9223372036854775808 | 9223372036854775807 |

Phạm vi 8 bit theo đặc tả [7]; 16, 32, 64 bit khớp với bảng kiểu số nguyên 2, 4, 8 byte của PostgreSQL [4].

**Tràn số:** số bù hai giống một cái vòng. Đi qua giá trị lớn nhất thì quay về giá trị nhỏ nhất: với 8 bit, 127 + 1 cho ra −128.

![Vòng số bù hai 8 bit: đi tiếp từ 127 thì sang −128 [7]](assets/vong-so-bu-hai.svg)

Điều nguy hiểm là ở nhiều ngôn ngữ, phép toán số nguyên **không báo lỗi** khi tràn [7]; chương trình cứ chạy tiếp với kết quả sai. PostgreSQL thì ngược lại: lưu giá trị ngoài phạm vi sẽ báo lỗi [4].

Thử ngay:

```bash
printf '%X\n' -5    # FFFFFFFFFFFFFFFB
```

Kết quả có 16 chữ số hex, tức 64 bit. Byte cuối `FB` = `1111 1011`, đúng là −5 ở dạng 8 bit ta vừa tính tay; các byte `FF` phía trước là phần mở rộng dấu lên 64 bit.

Dừng lại và tự hỏi: nếu số tiền đặt sân được cộng dồn bằng số nguyên 32 bit theo đơn vị đồng, khoảng bao nhiêu tiền thì tràn?

### 3. Phép toán bit

Làm việc trực tiếp trên từng bit, từng cặp bit tương ứng:

| Phép | Quy tắc | 12 và 10 (`1100`, `1010`) |
| --- | --- | --- |
| AND | 1 khi cả hai là 1 | `1000` = 8 |
| OR | 1 khi ít nhất một là 1 | `1110` = 14 |
| XOR | 1 khi hai bit khác nhau | `0110` = 6 |
| Dịch trái 1 | đẩy bit sang trái, thêm 0 bên phải: nhân 2 | 5 thành 10 |
| Dịch phải 2 | đẩy bit sang phải 2 vị trí: chia 4, bỏ phần dư | 40 thành 10 |

Thử ngay (kết quả chạy thật: `8 14 6 10 10`):

```bash
echo $(( 12 & 10 )) $(( 12 | 10 )) $(( 12 ^ 10 )) $(( 5 << 1 )) $(( 40 >> 2 ))
```

Ứng dụng quen thuộc: dùng mỗi bit như một cờ bật tắt, ví dụ quyền đọc, ghi, chạy của file trên Linux (sẽ gặp ở bài 5).

Dừng lại và tự hỏi: làm sao kiểm tra bit thứ 3 của một số có bật hay không, chỉ bằng một phép AND?

### 4. Số thực và vì sao không dùng nó cho tiền

Số thực trong máy được lưu dưới dạng **phân số nhị phân** [5]. Giống như 1/3 không viết hết được ở hệ thập phân (0,333…), số 0,1 không viết hết được ở hệ nhị phân, nên máy chỉ lưu một giá trị **gần đúng** [5].

Thử ngay (awk tính toán bằng số thực dấu phẩy động độ chính xác kép [6]):

```bash
awk 'BEGIN { printf "%.17g\n", 0.1 + 0.2 }'   # 0.30000000000000004
awk 'BEGIN { print (0.1 + 0.2 == 0.3) }'      # 0, tức là "không bằng"
```

Đây không phải lỗi của awk hay của bất kỳ ngôn ngữ nào; mọi ngôn ngữ dùng số thực dấu phẩy động của phần cứng đều cho kết quả tương tự [5]. PostgreSQL mô tả các kiểu `real` và `double precision` là kiểu **không chính xác**, và khuyên: cần lưu và tính chính xác như tiền thì dùng kiểu `numeric` [4].

**Hai cách lưu tiền đúng:**

- **Số nguyên theo đơn vị nhỏ nhất của tiền tệ.** Capstone chọn cách này: lưu số nguyên theo đơn vị đồng (yêu cầu N-07 trong [capstone](../../capstone/README.md)).
- **Kiểu thập phân chính xác,** như `numeric` của PostgreSQL [4].

Dừng lại và tự hỏi: vì sao so sánh hai số thực bằng phép "bằng nhau" là một thói quen nguy hiểm?

### 5. Chữ: ASCII, Unicode, UTF-8, UTF-16

**Unicode** gán cho mỗi ký tự một con số gọi là **code point**, viết dạng U+XXXX, trong khoảng U+0000 đến U+10FFFF [2]. Ví dụ "ệ" là U+1EC7. Code point mới chỉ là con số; để lưu thành byte cần một **cách mã hóa**.

**UTF-8** dùng từ 1 đến 4 byte cho một ký tự [1]:

| Khoảng code point | Mẫu byte |
| --- | --- |
| U+0000 đến U+007F | `0xxxxxxx` |
| U+0080 đến U+07FF | `110xxxxx 10xxxxxx` |
| U+0800 đến U+FFFF | `1110xxxx 10xxxxxx 10xxxxxx` |
| U+10000 đến U+10FFFF | `11110xxx 10xxxxxx 10xxxxxx 10xxxxxx` |

Ký tự ASCII (U+0000 đến U+007F) chỉ chiếm 1 byte với đúng giá trị ASCII, nên văn bản ASCII thuần cũng là UTF-8 hợp lệ [1]. Chữ có dấu tiếng Việt như "ệ" rơi vào dòng thứ ba nên cần 3 byte.

![Chữ "Việt": 4 ký tự nhưng 6 byte UTF-8, vì "ệ" chiếm 3 byte [1]](assets/utf8-viet.svg)

[Sơ đồ tương tác: mã hóa chữ "ệ" sang UTF-8 từng bước](diagrams/utf8-ma-hoa-tung-buoc.html)

Thử ngay:

```bash
printf 'Việt' | wc -c   # 6
printf 'Việt' | xxd     # 5669 e1bb 8774   (V i [ệ = e1 bb 87] t)
```

**UTF-16** dùng đơn vị 16 bit: phần lớn ký tự thường gặp chiếm một đơn vị, phần còn lại (như nhiều emoji) cần một cặp đơn vị gọi là **surrogate** [2].

**Vì sao tiếng Việt hay bị lỗi?** Có hai nguyên nhân thường gặp, đều thử lại được:

1. **Đọc sai bảng mã.** Byte UTF-8 bị một chương trình đọc bằng bảng mã cũ một byte một ký tự (ví dụ Windows-1252). Mỗi byte bị hiểu thành một ký tự riêng:

   ```bash
   printf 'Việt' | iconv -f windows-1252 -t utf-8   # Viá»‡t
   ```

2. **Một chữ, hai cách viết.** Một ký tự có dấu có thể lưu ở dạng dựng sẵn (một code point) hoặc dạng tách dấu (chữ cái gốc cộng các dấu kết hợp) [1]. Hai dạng trông giống hệt nhau nhưng byte khác nhau, nên so sánh, tìm kiếm có thể trượt. Cách xử lý là **chuẩn hóa Unicode** về một dạng trước khi so sánh [1].

   ```bash
   printf '\xe1\xbb\x87' | wc -c        # 3: "ệ" dựng sẵn
   printf 'e\xcc\xa3\xcc\x82' | wc -c   # 5: "e" + dấu nặng + dấu mũ
   ```

Dừng lại và tự hỏi: người dùng gõ "Sân Việt" trên điện thoại và trên máy tính, liệu hai chuỗi có luôn cùng byte không?

### 6. Thứ tự byte (endianness)

Một giá trị nhiều byte có thể được xếp theo hai thứ tự [3]:

- **Big-endian:** byte quan trọng nhất đứng trước. Số `0x12345678` lưu thành `12 34 56 78`. Các chuẩn Internet thường dùng thứ tự này, nên còn gọi là "network byte order".
- **Little-endian:** byte ít quan trọng nhất đứng trước: `78 56 34 12`. Đây là thứ tự của mọi bộ xử lý Intel.

Thứ tự byte chỉ là vấn đề với mã hóa dùng đơn vị lớn hơn 1 byte như UTF-16; UTF-8 đọc từng byte nên không có vấn đề này [2]. Thử ngay với chữ "A" (U+0041):

```bash
printf 'A' | iconv -f utf-8 -t utf-16le | xxd   # 4100   (little-endian)
printf 'A' | iconv -f utf-8 -t utf-16be | xxd   # 0041   (big-endian)
```

Dừng lại và tự hỏi: khi gửi số qua mạng giữa hai máy khác thứ tự byte, nếu không thống nhất thì chuyện gì xảy ra?

## Hiểu nhầm thường gặp

- **"Một ký tự là một byte."** Sai với UTF-8: một ký tự chiếm 1 đến 4 byte [1]. Đếm byte và đếm ký tự cho ra hai con số khác nhau.
- **"Tràn số thì chương trình báo lỗi."** Không phải lúc nào cũng vậy: có nơi lặng lẽ quay vòng sang giá trị âm [7], có nơi báo lỗi như PostgreSQL [4]. Phải biết hệ thống mình dùng xử lý thế nào.
- **"`0.1 + 0.2` ra `0.30000000000000004` là lỗi của ngôn ngữ."** Đó là bản chất của số thực nhị phân, ngôn ngữ nào dùng số thực phần cứng cũng gặp [5].
- **"Lỗi font là do thiếu font."** Thường là do đọc byte bằng sai bảng mã, hoặc do khác dạng chuẩn hóa; cả hai tái hiện được ở phần 5.

## Liên hệ capstone

- **Tiền:** lưu bằng số nguyên VND, không dùng số thực (N-07). Khi học SQL ở bài 32, cột tiền sẽ dùng kiểu số nguyên hoặc `numeric` [4].
- **Tên sân, tên khách:** lưu và truyền bằng UTF-8 từ đầu đến cuối; tìm kiếm tên có dấu cần chuẩn hóa Unicode trước khi so sánh.
- **Mã định danh và số lượng:** chọn số bit đủ lớn cho phạm vi giá trị trong nhiều năm vận hành.

## Bài tập

Làm bằng giấy bút hoặc terminal. Làm bài nào thì gửi bài đó để được chấm; không cần làm hết.

1. **(cơ bản)** Đổi 42, 255, 1000 sang nhị phân và hex bằng tay, rồi kiểm tra lại bằng `printf` và `bc`.
2. **(cơ bản)** Đổi `0x7F`, `0xFF`, `0x100` sang thập phân.
3. **(cơ bản)** Viết −1, −5, −128 ở dạng bù hai 8 bit.
4. **(vận dụng)** Với số nguyên có dấu 8 bit, tính 100 + 100. Giải thích kết quả bằng hình vòng số bù hai.
5. **(vận dụng)** Không dùng máy, tính `13 & 7`, `13 | 7`, `13 ^ 7`, `3 << 4`; rồi kiểm tra lại bằng terminal.
6. **(vận dụng)** Đổi 0,1 sang nhị phân, viết ra 8 chữ số đầu sau dấu phẩy, và chỉ ra quy luật lặp.
7. **(vận dụng)** Dự đoán số byte UTF-8 của "Đặt sân", rồi kiểm tra bằng `printf ... | wc -c` và `xxd`. Mỗi chữ có dấu chiếm mấy byte?
8. **(vận dụng)** Mã hóa chữ "đ" (U+0111) sang UTF-8 bằng tay theo bảng ở phần 5, rồi kiểm tra bằng `xxd`.
9. **(nâng cao)** Giải thích vì sao "Việt" đọc bằng Windows-1252 lại thành đúng "Viá»‡t": byte nào biến thành ký tự nào?
10. **(nâng cao)** Đề xuất cách lưu số tiền đặt sân và tổng doanh thu cả năm của 50 cơ sở sao cho không bao giờ sai và không tràn. Ước lượng số bit cần dùng.

## Nguồn

1. [RFC 3629: UTF-8, a transformation format of ISO 10646](https://www.rfc-editor.org/rfc/rfc3629.html) — mục 1, 3, 10 — STD 63, 2003 — truy cập 2026-11-25
2. [Unicode FAQ: UTF-8, UTF-16, UTF-32 & BOM](https://unicode.org/faq/utf_bom.html) — các mục chung, UTF-16, endian — truy cập 2026-11-25
3. [MDN Web Docs: Endianness](https://developer.mozilla.org/en-US/docs/Glossary/Endianness) — truy cập 2026-11-25
4. [PostgreSQL 17: 8.1 Numeric Types](https://www.postgresql.org/docs/17/datatype-numeric.html) — bảng 8.2, mục 8.1.1 đến 8.1.3 — truy cập 2026-11-25
5. [Python Tutorial: Floating-Point Arithmetic: Issues and Limitations](https://docs.python.org/tutorial/floatingpoint) — truy cập 2026-11-25
6. [GNU Awk User's Guide: 16.1 A General Description of Computer Arithmetic](https://www.gnu.org/software/gawk/manual/html_node/Computer-Arithmetic.html) — truy cập 2026-11-25
7. [Java Language Specification SE 21: Chapter 4, §4.2, §4.2.1, §4.2.2](https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html) — dùng làm đặc tả tham chiếu cho số bù hai, không cần biết Java để đọc phần này — truy cập 2026-11-25

## Đọc thêm

- Sách *Computer Systems: A Programmer's Perspective* (Bryant, O'Hallaron), chương 2: biểu diễn và xử lý thông tin.

## Báo cáo kiểm chứng

- Số nguồn: 7 (hạng A: 6 gồm RFC, Unicode, PostgreSQL, Python, GNU awk, đặc tả Java; hạng B: 1 là MDN). Tất cả được mở trong phiên ngày 2026-11-25 (trang đặc tả Java chỉ đọc phần đầu, đủ cho §4.2).
- Khẳng định đã trích dẫn: 19. Hai câu không có nguồn ở bản nháp ("gần như mọi hệ thống dùng số bù hai", "tiền Việt không có đơn vị lẻ") đã được viết lại để không khẳng định điều chưa kiểm chứng.
- Đánh dấu chưa kiểm chứng: 0. Khái niệm "word" (độ rộng phụ thuộc kiến trúc CPU) được để sang bài 2 vì chưa có nguồn trong phiên.
- Lệnh terminal: 9 / 9 đã chạy thật, kết quả ghi đúng như máy in ra.
- Hình: 2 SVG, 1 sơ đồ tương tác; đã đối chiếu U+1EC7 = E1 BB 87 với RFC 3629 và với `xxd`; các giá trị trên vòng số bù hai đã kiểm lại bằng tay.
