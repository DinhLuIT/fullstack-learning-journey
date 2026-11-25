# Phiếu nghiên cứu: Bài 2. Kiến trúc máy tính

Soạn ngày 2026-11-25. Không dùng ngôn ngữ lập trình (bài trước bài 14).

## [1] Drepper, LWN Part 1 — https://lwn.net/Articles/250967/
- CPU, bộ nhớ từng cân bằng; sau đó bộ nhớ chậm lại tương đối; giải pháp: thiết kế RAM, memory controller, CPU cache, DMA.
- Hyper-threading: một nhân chạy hai luồng với ít phần cứng thêm.
## [2] Drepper, LWN Part 2 (CPU caches) — https://lwn.net/Articles/252125/ (đọc 100.000 ký tự đầu)
- RAM nhanh như CPU đắt hơn nhiều bậc; SRAM làm cache; đĩa chậm hơn DRAM nhiều bậc.
- Tính cục bộ thời gian, không gian; ví dụ 200 chu kỳ RAM, 15 chu kỳ cache, 100 phần tử × 100 lần.
- 3.1: L1d, L1i, L2, L3; nhân có tài nguyên riêng, luồng chia sẻ gần hết, luồng chia sẻ L1.
- 3.2: cache line 32 byte trước, nay 64 byte; nạp cả line vào L1d; 6 bit thấp là offset; bảng Pentium M: thanh ghi ≤1, L1d ~3, L2 ~14, RAM ~240.
- 3.3.2: tuần tự ~9 chu kỳ nhờ prefetch; ngẫu nhiên 450+ chu kỳ.
- 3.3.4: MESI, RFO; nhất quán cache trong suốt với code người dùng (3.3.3); bảng 3.3: 4 luồng Seq Inc nhanh 2,07 lần.
- 3.4: lệnh qua các giai đoạn decode, chuẩn bị tham số, thực thi; pipeline.
## [3] Linux kernel memory barriers — https://www.kernel.org/doc/Documentation/memory-barriers.txt (trích đoạn tìm kiếm)
- CPU trừu tượng có thể thực hiện thao tác bộ nhớ theo thứ tự bất kỳ, miễn giữ quan hệ nhân quả của chương trình; ghi của một CPU có thể được CPU khác thấy theo thứ tự khác.
## [4] lscpu(1) — https://man7.org/linux/man-pages/man1/lscpu.1.html
- Lấy thông tin kiến trúc CPU từ sysfs, /proc/cpuinfo; -C in chi tiết cache.
## [5] JVMS SE 25 ch.1 — máy ảo không biết ngôn ngữ Java, chỉ biết định dạng class file.
## [6] JVMS SE 20 ch.1 — class file chứa lệnh máy ảo (bytecode) và bảng ký hiệu.
## [7] Oracle JRockit→HotSpot guide (JDK 11) — HotSpot mặc định thông dịch bytecode, JIT các phương thức chạy đủ số lần.
## [8] Red Hat Developer (Westrelin 2021) — JIT biến bytecode thành mã máy; trình thông dịch khởi động nhanh, chạy chậm; mã biên dịch chuẩn bị lâu, chạy nhanh.
## Kết quả chạy thật
- nproc → 4; getconf LEVEL1_DCACHE_LINESIZE → 64; lscpu -C → có tên L1d, L1i, L2 nhưng trống kích thước (máy ảo); dd 256 MiB → 0,246 s, 1,1 GB/s; 0x1234 & ~0x3F → 0x1200, & 0x3F → 52.
