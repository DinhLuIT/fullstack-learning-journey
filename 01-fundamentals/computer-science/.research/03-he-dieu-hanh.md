# Phiếu nghiên cứu: Bài 3. Hệ điều hành
Soạn 2026-11-25. Không dùng ngôn ngữ lập trình.
- [2] OSTEP ch.6: user/kernel mode; trap, return-from-trap; timer interrupt; scheduler; context switch lưu/nạp thanh ghi; 1996 syscall ~4 µs, context switch ~6 µs, nay dưới 1 µs.
- [3] OSTEP ch.26: thread chung address space, riêng PC, thanh ghi, stack; switch giữa thread không đổi page table; ví dụ counter 19.345.221 / 19.221.041; race condition, critical section, mutual exclusion; dùng thread khi chia sẻ dữ liệu, process khi tách biệt.
- [4] OSTEP ch.32: deadlock L1/L2; 4 điều kiện; lock ordering là cách thực tế nhất.
- [5] pthreads(7): chung global memory, heap, PID, fd...; riêng stack, thread ID; NPTL 1:1.
- [6] sem_overview(7): số nguyên không âm; post tăng, wait giảm, chờ khi bằng 0.
- [7] kernel docs Page Tables (trích đoạn tìm kiếm): page table ánh xạ ảo sang vật lý, mỗi process có pgd riêng; trang 4KB dùng bit 12–31; MMU, TLB; page fault, lazy allocation, copy-on-write, swap; SIGSEGV; OOM killer.
- [8] man-pages commit open.2: fd là chỉ số vào bảng fd của process.
- [9] epoll(7): theo dõi nhiều fd, mở rộng tốt; epoll_wait chặn tới khi có sự kiện; epoll_create trả về fd.
- [10] inode(7): metadata gồm inode number, type/mode, link count, uid, gid, size, timestamps.
- [11] nginx events.html: tự chọn phương thức hiệu quả nhất; epoll trên Linux 2.6+.
Kết quả chạy: strace cat (openat=3, read 3 byte, write 3 byte); strace -c ls / (openat 34, mmap 28, close 24); sleep 300 & (State S, Threads 1); /proc/$$/fd 0,1,2; stat inode=871; getconf PAGESIZE=4096.
