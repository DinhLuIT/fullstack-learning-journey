# Phiếu nghiên cứu: Bài 6. Xử lý văn bản và pipe
Soạn 2026-11-25.
- bash(1) Pipelines: stdout lệnh 1 nối qua pipe vào stdin lệnh 2; |& = 2>&1 |; mã thoát là của lệnh cuối trừ khi pipefail; mỗi lệnh chạy trong subshell riêng. Mục REDIRECTION không đọc được (nằm ngoài đoạn 0–100000 và 170000–270000); chứng minh bằng thí nghiệm.
- grep(1): in dòng khớp; -E, -i, -v, -c, -n, -o, -r.
- uniq(1): lọc dòng trùng liền kề; -c đếm; không phát hiện trùng nếu không liền kề, nên sort trước.
- xargs(1): đọc mục ngăn bởi khoảng trắng/xuống dòng; tên file có khoảng trắng bị xử lý sai; dùng -0 với find -print0.
- nginx ngx_http_log_module: log_format combined; access_log mặc định dùng combined.
Kết quả chạy: status 4×200, 2×404, 1×500/409/403/201; top IP 5/3/2; uniq không sort đếm tách; grep -cE ' (4|5)[0-9]{2} ' = 8 trên log mẫu (đúng là 5), trên bộ 4 dòng grep 4 / awk 2; redirect: '> f 2>&1' lỗi vào file, '2>&1 > f' lỗi ra màn hình, file 0 byte; xargs không -0 tách 'a b.log'.
