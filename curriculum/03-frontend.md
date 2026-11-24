# Giai đoạn 3: Frontend, từ code chay đến React + TypeScript

13 bài, 4 module. Trọng tâm là nền tảng web và JavaScript core, vì đây là phần hay bị hỏi xoáy; React và TypeScript đã vững nên có thể đi nhanh.

| Module | Bài | Thời lượng |
| --- | --- | --- |
| A. Nền tảng web: HTML, CSS, trình duyệt | 1–3 | 3–4 buổi |
| B. JavaScript core | 4–7 | 1 tuần |
| C. TypeScript | 8 | 2 buổi |
| D. React và hệ sinh thái | 9–13 | 1 tuần |

## Module A. Nền tảng web

### Bài 1. HTML ngữ nghĩa và accessibility

**Mục tiêu:** viết HTML đúng nghĩa, thân thiện với công cụ tìm kiếm và trình đọc màn hình.

**Nội dung**

- Thẻ ngữ nghĩa: `header`, `nav`, `main`, `section`, `article`, `button` thay vì `div` bấm được
- Form: các loại input, `label`, validation có sẵn của trình duyệt
- Accessibility cơ bản: `alt`, thuộc tính ARIA, điều hướng bằng bàn phím, độ tương phản màu
- Thẻ meta, SEO cơ bản

**Thực hành:** dựng trang đặt sân của capstone chỉ bằng HTML, dùng được hoàn toàn bằng bàn phím; kiểm tra bằng Lighthouse.

**Tự kiểm tra:** vì sao không nên dùng `div` có `onclick` thay cho `button`?

### Bài 2. CSS và bố cục

**Mục tiêu:** tự dựng giao diện responsive mà không cần thư viện UI.

**Nội dung**

- Cascade, specificity, kế thừa; box model và `box-sizing`
- `display`, `position`, `z-index` và stacking context
- Flexbox và Grid: khi nào dùng cái nào
- Responsive: mobile-first, media query, đơn vị `rem`, `%`, `vw`
- CSS variables; tổ chức CSS (BEM, CSS Modules, Tailwind)

**Thực hành:** làm giao diện trang danh sách cơ sở và lưới lịch trống (sân × giờ) responsive bằng CSS thuần.

**Tự kiểm tra:** specificity tính thế nào? `position: absolute` căn theo phần tử nào?

### Bài 3. Trình duyệt hoạt động thế nào

**Mục tiêu:** hiểu đường đi từ HTML tải về đến pixel trên màn hình để tối ưu hiệu năng.

**Nội dung**

- Critical rendering path: DOM, CSSOM, render tree, layout, paint, composite
- Reflow và repaint; thuộc tính nào gây reflow
- Script chặn render; `async` và `defer`
- Cache của trình duyệt, lưu trữ phía client (cookie, localStorage, sessionStorage, IndexedDB)
- DevTools: tab Network, Performance, Application

**Thực hành:** dùng tab Performance ghi lại quá trình tải trang của bạn và chỉ ra các giai đoạn render.

**Tự kiểm tra:** `async` khác `defer` thế nào? Vì sao không nên lưu token trong localStorage?

## Module B. JavaScript core

### Bài 4. Giá trị, kiểu và scope

**Mục tiêu:** tránh các lỗi "kỳ lạ" của JavaScript bằng cách hiểu cơ chế.

**Nội dung**

- Kiểu nguyên thủy và object; tham trị và tham chiếu; sao chép nông và sâu
- Ép kiểu ngầm, `==` và `===`, truthy và falsy
- `var`, `let`, `const`; hoisting và temporal dead zone
- Scope và closure

**Thực hành:** viết hàm `deepClone`; dùng closure viết hàm đếm và hàm `once`.

**Tự kiểm tra:** vì sao vòng `for` dùng `var` với `setTimeout` in ra cùng một giá trị? Closure là gì, cho ví dụ thực tế?

### Bài 5. this, prototype và class

**Mục tiêu:** hiểu mô hình đối tượng của JavaScript, khác với Java.

**Nội dung**

- Quy tắc xác định `this`; `call`, `apply`, `bind`; arrow function không có `this` riêng
- Prototype chain, kế thừa qua prototype
- `class` là cú pháp trên prototype

**Thực hành:** tự viết `Function.prototype.bind`; viết kế thừa bằng prototype rồi bằng `class`.

**Tự kiểm tra:** `this` trong arrow function và function thường khác nhau thế nào?

### Bài 6. Bất đồng bộ và event loop

**Mục tiêu:** đoán đúng thứ tự chạy của bất kỳ đoạn code bất đồng bộ nào.

**Nội dung**

- Call stack, Web API, macrotask queue, microtask queue
- Callback, Promise, `async/await`; xử lý lỗi bất đồng bộ
- `Promise.all`, `allSettled`, `race`, `any`
- `fetch`, `AbortController`, timeout cho request

**Thực hành:** tự viết `Promise.all`, `debounce`, `throttle`, và hàm `retry` có backoff.

**Tự kiểm tra:** đoạn code trộn `setTimeout`, `Promise.then` và `console.log` in theo thứ tự nào, vì sao?

### Bài 7. DOM, sự kiện và ứng dụng vanilla

**Mục tiêu:** xây một ứng dụng hoàn chỉnh không framework để cảm nhận React giải quyết vấn đề gì.

**Nội dung**

- Truy vấn và thay đổi DOM; tạo phần tử hiệu quả
- Event bubbling, capturing, `preventDefault`, `stopPropagation`; event delegation
- ES modules, tổ chức code theo module
- Quản lý state thủ công và render lại giao diện khi state đổi

**Thực hành:** hoàn thiện frontend capstone bằng JavaScript thuần: đăng nhập, xem cơ sở và sân, xem lịch trống, đặt sân, gọi API từ Giai đoạn 2; tự viết một `EventEmitter` dùng làm store.

**Tự kiểm tra:** event delegation là gì, vì sao hiệu quả? Khi làm vanilla, phần nào khó nhất mà React giải quyết hộ?

## Module C. TypeScript

### Bài 8. TypeScript từ cơ bản đến nâng cao

**Mục tiêu:** dùng hệ thống kiểu để bắt lỗi trước khi chạy.

**Nội dung**

- `type` và `interface`; union, intersection, literal type
- Type narrowing, discriminated union, `unknown` và `any`, `never`
- Generics và ràng buộc; utility type (`Partial`, `Pick`, `Omit`, `Record`, `ReturnType`)
- Cấu hình `strict`; kiểm tra dữ liệu lúc chạy bằng Zod

**Thực hành:** chuyển frontend vanilla sang TypeScript; định nghĩa kiểu cho mọi response API và validate bằng Zod.

**Tự kiểm tra:** `unknown` khác `any` thế nào? Vì sao TypeScript không đủ để đảm bảo dữ liệu từ API là đúng?

## Module D. React và hệ sinh thái

### Bài 9. React bên dưới

**Mục tiêu:** giải thích được khi nào và vì sao component render lại.

**Nội dung**

- JSX biên dịch thành gì; element và component
- Render và commit; reconciliation, vai trò của `key`
- Khi nào component render lại; state là snapshot; cập nhật state theo batch
- StrictMode và vì sao effect chạy hai lần khi phát triển

**Thực hành:** tự viết một React mini (hàm `createElement`, `render`, `useState` đơn giản) theo hướng dẫn "Build your own React".

**Tự kiểm tra:** vì sao dùng index làm `key` gây lỗi? `setCount(count + 1)` gọi ba lần liên tiếp cho kết quả gì?

### Bài 10. Hooks và các lỗi thường gặp

**Mục tiêu:** dùng hooks đúng, tránh effect thừa và closure cũ.

**Nội dung**

- `useState`, `useReducer`, `useRef`, `useContext`
- `useEffect`: dependency, cleanup, stale closure; khi nào không cần effect
- `useMemo`, `useCallback`, `React.memo`: khi nào có ích, khi nào thừa
- Custom hook

**Thực hành:** viết lại frontend capstone bằng React + TypeScript; tự viết `useFetch` có loading, error và hủy request bằng `AbortController`.

**Tự kiểm tra:** stale closure trong `useEffect` là gì? Khi nào `useMemo` làm chậm hơn?

### Bài 11. Quản lý state và dữ liệu từ server

**Mục tiêu:** chọn đúng nơi đặt state cho từng loại dữ liệu.

**Nội dung**

- Phân loại state: local, chia sẻ, URL, server state
- Lifting state, Context và vấn đề render lại
- Zustand hoặc Redux Toolkit cho client state
- TanStack Query cho server state: cache, refetch, invalidate, optimistic update

**Thực hành:** dùng TanStack Query cho danh sách đơn đặt, cập nhật lạc quan khi hủy đơn và hoàn tác khi API lỗi.

**Tự kiểm tra:** server state khác client state thế nào, vì sao không nên bỏ hết vào Redux?

### Bài 12. Routing, form, xác thực và đa ngôn ngữ

**Mục tiêu:** hoàn thiện các luồng người dùng thật của capstone.

**Nội dung**

- React Router: route lồng, layout, bảo vệ route theo role
- React Hook Form kết hợp Zod
- Luồng JWT: lưu access token trong bộ nhớ, refresh token trong cookie `HttpOnly`, tự refresh khi hết hạn
- Error boundary, trạng thái loading và trống
- i18n: tách chuỗi giao diện, chuyển tiếng Việt và tiếng Anh (F-70)

**Thực hành:** hoàn thiện đăng nhập, phân quyền giao diện cho ba role, form đặt sân có validation, giao diện song ngữ.

**Tự kiểm tra:** nhiều request cùng gặp lỗi 401 cùng lúc thì xử lý refresh token ra sao để chỉ gọi refresh một lần?

### Bài 13. Hiệu năng, kiểm thử và render phía server

**Mục tiêu:** đưa frontend đến mức sẵn sàng cho production.

**Nội dung**

- Code splitting, `lazy`, `Suspense`; tối ưu ảnh và bundle
- Core Web Vitals (LCP, INP, CLS) và cách đo
- React Profiler tìm render thừa; virtualization cho danh sách dài
- CSR, SSR, SSG, ISR; khi nào dùng Next.js hay Astro
- Vitest, React Testing Library, mock API bằng MSW; Playwright cho test end-to-end

**Thực hành:** đo và cải thiện điểm Lighthouse của capstone; viết test cho form đặt sân và một test end-to-end cho luồng đặt sân; gắn tag `v3-frontend`.

**Tự kiểm tra:** SSR giải quyết vấn đề gì và tạo ra vấn đề gì? Làm sao tìm component render thừa?
