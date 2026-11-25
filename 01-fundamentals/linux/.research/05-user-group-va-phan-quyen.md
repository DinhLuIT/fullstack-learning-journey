# Phiếu nghiên cứu: Bài 5. User, group và phân quyền
Soạn 2026-11-25.
- path_resolution(7): thiếu search permission trên thư mục → EACCES; 3 nhóm bit owner/group/other, chọn đúng một nhóm theo thứ tự; bit cuối là execute với file, search với thư mục; root vượt qua mọi kiểm tra, CAP_DAC_OVERRIDE.
- umask(2): bit trong umask bị tắt khỏi mode; mặc định thường 022; 0666 & ~022 = 0644.
- useradd(8): -r tạo system account, UID trong dải SYS_UID, không tạo home; -s login shell; FILES /etc/passwd, /etc/shadow, /etc/group.
- inode(7): hằng số 00400, 00040...; sticky bit trên thư mục.
- sudo.ws sudo manual: user được phép chạy lệnh như root/user khác theo chính sách; sudoers ở /etc/sudoers; sửa bằng visudo; cache 5 phút theo terminal; sudo shell/editor có thể thành root shell.
Kết quả chạy: id; umask 0022; file 644, dir 755; umask 077 → 600; dir 644: ls liệt kê, cat bị chặn; dir 555: touch và rm bị chặn; nologin in "This account is currently not available." exit 1.
Chưa chạy (không có root): useradd, chown, sudo.
