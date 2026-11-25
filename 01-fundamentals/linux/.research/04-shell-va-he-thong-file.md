# Phiếu nghiên cứu: Bài 4. Shell và hệ thống file
Soạn 2026-11-25.
- [1][3] bash(1): bash là trình thông dịch lệnh; simple command: từ đầu là lệnh, còn lại là đối số; $? là mã thoát; INVOCATION: login shell đọc /etc/profile rồi file đầu tiên trong ~/.bash_profile, ~/.bash_login, ~/.profile; interactive non-login đọc ~/.bashrc; PATH là danh sách thư mục cách nhau bởi dấu hai chấm. Pipeline (để dành cho bài 6): stdout lệnh 1 nối qua pipe vào stdin lệnh 2; |& là viết tắt của 2>&1 |.
- [2] hier(7): mô tả /, /etc, /home, /root, /usr/bin, /usr/local, /opt, /var, /var/log, /var/lib, /tmp, /proc, /dev; theo FHS 3.0 (19/3/2015); danh sách không đầy đủ.
- [4] symlink(7): hard link cùng inode, không trỏ thư mục, không qua filesystem khác; symlink chứa pathname, trỏ được thư mục, khác filesystem, có thể treo.
- [5] tail(1): mặc định 10 dòng cuối; -f in dữ liệu mới khi file lớn lên, mặc định theo descriptor; -F = --follow=name --retry; dùng --follow=name khi xoay vòng log.
- [6] GNU Bash manual Command Search and Execution: tìm trong PATH, bảng băm, không thấy thì lỗi và mã thoát 127.
- FHS trên refspecs.linuxfoundation.org: bị chặn bởi Anubis, không đọc được.
Kết quả chạy: ls -li (inode 876 links 2 cho goc/cung, 877 cho symlink); sau rm goc.txt: cung.txt đọc được, mem.txt No such file; type cd → builtin, ls → hashed /usr/bin/ls; command -v git → /usr/bin/git; mkdir -p demo/{src,docs,logs}.
