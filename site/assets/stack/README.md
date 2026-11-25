# Logo công nghệ

Logo trong thư mục này được tải bằng script, không vẽ tay:

```bash
node site/scripts/fetch-logos.mjs
```

- **Nguồn:** [Devicon](https://github.com/devicons/devicon) (giấy phép MIT), tải qua cdn.jsdelivr.net. Bảng ánh xạ từ slug sang tên icon nằm trong `site/scripts/fetch-logos.mjs`.
- **Thương hiệu:** mọi logo thuộc về chủ sở hữu của từng sản phẩm. Hub chỉ dùng để nhận diện công nghệ có trong lộ trình, không ngụ ý được bảo trợ.
- Tên file là slug trong `site/data/stack.mjs`. Công nghệ không có logo (khái niệm như RAG, MCP, Saga) hiện chữ viết tắt.
- Muốn thay một logo bằng bản chính thức khác: đặt file `<slug>.svg` vào đây, script sẽ ghi đè nếu chạy lại, nên bỏ slug đó khỏi bảng trong script.
