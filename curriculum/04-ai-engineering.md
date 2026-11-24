# Giai đoạn 4: AI Engineering

13 bài, 4 module, đưa capstone lên v4 có trợ lý AI. Trọng tâm là tích hợp LLM vào sản phẩm một cách đáng tin cậy, không phải huấn luyện model. Từ cuối giai đoạn này bắt đầu nộp CV.

| Module | Bài | Thời lượng tối đa |
| --- | --- | --- |
| A. LLM và gọi API | 1–4 | 1 tuần |
| B. Tool calling, agent và MCP | 5–7 | 1 tuần |
| C. RAG | 8–10 | 1 tuần |
| D. Đánh giá, LLMOps và vận hành | 11–13 | 1,5 tuần |

## Module A. LLM và gọi API

### Bài 1. LLM hoạt động thế nào (ở mức kỹ sư cần biết)

**Mục tiêu:** hiểu đủ về LLM để đoán trước khi nào nó làm tốt, khi nào nó sai.

**Nội dung**

- Token và tokenizer; vì sao tiếng Việt tốn nhiều token hơn tiếng Anh
- Model sinh văn bản bằng cách dự đoán token tiếp theo; temperature và các tham số lấy mẫu
- Context window; model không có trí nhớ giữa các lần gọi
- Nguyên nhân hallucination; knowledge cutoff
- Phân biệt pre-training, fine-tuning và cung cấp ngữ cảnh trong prompt
- Chi phí và độ trễ tính theo token đầu vào và đầu ra

**Thực hành:** dùng công cụ đếm token của nhà cung cấp, so sánh số token của cùng một đoạn văn tiếng Việt và tiếng Anh; thử cùng một prompt với temperature khác nhau.

**Tự kiểm tra:** vì sao LLM "bịa"? Vì sao chatbot "nhớ" được hội thoại dù model không có trí nhớ?

### Bài 2. Gọi LLM API bằng code chay

**Mục tiêu:** tự gọi API không qua SDK, hiểu rõ request và response.

**Nội dung**

- Cấu trúc request: model, system prompt, danh sách message, giới hạn token đầu ra
- Cấu trúc response: nội dung, lý do dừng, số token đã dùng
- Quản lý API key an toàn: biến môi trường, không bao giờ để ở frontend
- Xử lý lỗi: rate limit, quá tải, timeout; retry với exponential backoff

**Thực hành:** dùng `java.net.http.HttpClient` gọi API của một nhà cung cấp LLM, tự parse JSON, ghi lại số token và chi phí ước tính mỗi lần gọi.

**Tự kiểm tra:** vì sao không gọi LLM API trực tiếp từ React? Nên retry với loại lỗi nào và không nên retry với loại nào?

### Bài 3. Prompt engineering có hệ thống

**Mục tiêu:** viết prompt cho kết quả ổn định và quản lý prompt như code.

**Nội dung**

- System prompt: vai trò, phạm vi, quy tắc, định dạng đầu ra
- Chỉ dẫn rõ ràng, cung cấp ngữ cảnh, ví dụ mẫu (few-shot), tách dữ liệu bằng thẻ XML
- Cho model suy nghĩ từng bước với bài toán phức tạp
- Lưu prompt trong file riêng có version, không viết cứng trong code
- Prompt caching để giảm chi phí với phần prompt dài lặp lại

**Thực hành:** viết system prompt cho trợ lý đặt sân của capstone (chỉ trả lời về sân, giá, lịch, cơ sở; từ chối lịch sự phần còn lại; trả lời bằng ngôn ngữ người dùng hỏi); thử với 15 câu hỏi khác nhau và cải tiến qua 3 phiên bản.

**Tự kiểm tra:** few-shot giúp gì và có rủi ro gì? Vì sao cần version cho prompt?

### Bài 4. Streaming và structured output

**Mục tiêu:** làm giao diện chat mượt và lấy được dữ liệu có cấu trúc từ model.

**Nội dung**

- Streaming qua Server-Sent Events: nhận từng phần từ API, chuyển tiếp lên React
- `SseEmitter` hoặc WebFlux phía Spring; `EventSource`/`fetch` stream phía React
- Structured output: ép model trả JSON theo schema, validate, xử lý khi sai
- Trích xuất thông tin từ văn bản tự do sang object Java

**Thực hành:** làm giao diện chat streaming trong capstone; viết tính năng chuyển câu "tối mai 7 giờ mình muốn đặt sân cầu lông ở cơ sở Quận 7" thành object `BookingRequest`.

**Tự kiểm tra:** vì sao streaming cải thiện trải nghiệm dù tổng thời gian không đổi? Model trả JSON sai schema thì xử lý ra sao?

## Module B. Tool calling, agent và MCP

### Bài 5. Tool calling

**Mục tiêu:** cho model gọi các hàm trong backend một cách an toàn.

**Nội dung**

- Định nghĩa tool: tên, mô tả, JSON schema của tham số; mô tả tốt quyết định model chọn đúng
- Vòng lặp: model yêu cầu gọi tool, backend thực thi, trả kết quả, model trả lời
- Kiểm tra quyền trước khi thực thi; xác nhận của người dùng với hành động có hậu quả (đặt, hủy sân)

**Thực hành:** tạo các tool `searchVenues`, `checkAvailability`, `createBooking`; trợ lý phải hỏi lại xác nhận trước khi gọi `createBooking` (F-62).

**Tự kiểm tra:** vì sao không được tin tham số model truyền vào tool? Nên đặt kiểm tra quyền ở đâu?

### Bài 6. Agent loop

**Mục tiêu:** tự xây agent đơn giản và biết giới hạn của nó.

**Nội dung**

- Agent là gì: model tự quyết định chuỗi hành động qua nhiều vòng tool calling
- Workflow cố định và agent tự do: khi nào dùng cái nào (ưu tiên cái đơn giản nhất chạy được)
- Giới hạn số vòng, ngân sách token, timeout; ghi log từng bước
- Quản lý hội thoại dài: cắt bớt, tóm tắt

**Thực hành:** viết agent loop bằng Java thuần xử lý yêu cầu "tìm giúp mình sân pickleball trống sớm nhất tuần này rồi đặt luôn"; ghi log từng bước model đã làm.

**Tự kiểm tra:** agent bị lặp vô hạn thì xử lý thế nào? Khi nào không nên dùng agent?

### Bài 7. MCP (Model Context Protocol)

**Mục tiêu:** hiểu chuẩn kết nối AI với hệ thống bên ngoài và tự viết một server.

**Nội dung**

- Vấn đề MCP giải quyết; kiến trúc host, client, server
- Ba thành phần: tool, resource, prompt
- Các phương thức truyền tải; vấn đề bảo mật khi cấp quyền cho AI

**Thực hành:** viết MCP server (Java hoặc TypeScript) cung cấp tool tra cứu lịch sân của capstone; kết nối vào Claude Desktop hoặc Claude Code để thử.

**Tự kiểm tra:** MCP khác tool calling thông thường ở đâu?

## Module C. RAG

### Bài 8. Embedding và tìm kiếm ngữ nghĩa

**Mục tiêu:** hiểu cách máy tính đo "ý nghĩa giống nhau" giữa hai đoạn văn.

**Nội dung**

- Embedding là vector biểu diễn ngữ nghĩa; số chiều
- Độ tương đồng cosine, tích vô hướng, khoảng cách Euclid
- Tìm kiếm theo từ khóa (BM25) và theo ngữ nghĩa: ưu nhược điểm
- Chọn model embedding hỗ trợ tiếng Việt

**Thực hành:** tạo embedding cho 30 câu mô tả cơ sở và tiện ích, tự viết hàm cosine bằng Java và tìm top 3 câu gần nhất với một câu hỏi, không dùng thư viện.

**Tự kiểm tra:** khi nào tìm theo từ khóa lại tốt hơn tìm theo ngữ nghĩa?

### Bài 9. Xây pipeline RAG bằng code chay

**Mục tiêu:** tự xây RAG đầy đủ từ tài liệu gốc đến câu trả lời có trích dẫn.

**Nội dung**

- Hai giai đoạn: nạp dữ liệu (đọc, làm sạch, chunk, embed, lưu) và truy vấn (embed câu hỏi, tìm, ghép ngữ cảnh, sinh câu trả lời)
- Chiến lược chunk: theo kích thước, theo cấu trúc tài liệu, có chồng lấn; metadata cho mỗi chunk
- pgvector: kiểu `vector`, index HNSW, truy vấn top-k kèm lọc theo metadata
- Prompt cho RAG: chỉ trả lời dựa trên ngữ cảnh, nói "không biết" khi không có, trích nguồn

**Thực hành:** nạp bộ tài liệu của capstone (bảng giá, chính sách hủy, nội quy sân, câu hỏi thường gặp) vào pgvector bằng JDBC thuần; trợ lý trả lời có trích dẫn đúng đoạn nguồn (F-60).

**Tự kiểm tra:** chunk quá nhỏ hoặc quá lớn gây vấn đề gì? RAG khác fine-tuning thế nào, khi nào dùng cái nào?

### Bài 10. Nâng cấp RAG và chuyển sang Spring AI

**Mục tiêu:** cải thiện chất lượng tìm kiếm và biết framework giúp được gì.

**Nội dung**

- Hybrid search: kết hợp từ khóa và vector; reranking
- Viết lại câu hỏi (query rewriting) với hội thoại nhiều lượt
- Cập nhật dữ liệu khi tài liệu gốc thay đổi
- Spring AI: `ChatClient`, `VectorStore`, advisor; so sánh với bản tự viết

**Thực hành:** thêm hybrid search, đo sự cải thiện bằng bộ câu hỏi mẫu; viết lại pipeline bằng Spring AI và ghi chú phần nào framework đã làm thay.

**Tự kiểm tra:** vì sao câu hỏi tiếp nối như "còn sân kia giá bao nhiêu?" làm RAG tìm sai, xử lý ra sao?

## Module D. Đánh giá, LLMOps và vận hành

### Bài 11. Đánh giá hệ thống AI

**Mục tiêu:** đo được chất lượng thay vì "thử thấy ổn".

**Nội dung**

- Xây bộ test: câu hỏi, câu trả lời mong đợi, nguồn đúng
- Đánh giá riêng phần tìm kiếm (tìm đúng nguồn không) và phần sinh câu trả lời (đúng, đủ, bám nguồn không)
- Dùng LLM làm giám khảo và hạn chế của cách này
- Chạy lại bộ test mỗi khi đổi prompt, model, cách chunk

**Thực hành:** xây bộ 30 câu hỏi test cho trợ lý capstone, viết script chấm tự động, đưa kết quả vào README.

**Tự kiểm tra:** làm sao biết đổi prompt làm hệ thống tốt hơn hay tệ hơn?

### Bài 12. LLMOps, Langfuse và LangChain4j

**Mục tiêu:** quan sát và quản lý được hệ thống AI trong suốt vòng đời, và biết các framework thay thế Spring AI.

**Nội dung**

- LLMOps là gì: theo dõi, quản lý prompt có phiên bản, bộ dữ liệu đánh giá, chi phí, trong suốt vòng đời sản phẩm AI
- Tracing một lời gọi LLM và một chuỗi nhiều bước (RAG, agent gọi tool): mỗi bước là một span
- Langfuse: tracing, quản lý prompt, dataset và chấm điểm; tự host bằng Docker; cách tích hợp với ứng dụng Java theo tài liệu chính thức của Langfuse
- LangChain (Python, JavaScript) và LangChain4j (Java): các khái niệm chung như chat model, memory, tool, retriever
- So sánh LangChain4j với Spring AI; khi nào chọn cái nào

**Thực hành:** tự host Langfuse bằng Docker; gửi trace của trợ lý capstone (từng bước tìm kiếm, gọi tool, sinh câu trả lời) và theo dõi độ trễ, chi phí; viết lại tính năng hỏi đáp về chính sách hủy bằng LangChain4j để so sánh với bản Spring AI.

**Tự kiểm tra:** vì sao log thông thường không đủ để tìm lỗi một agent nhiều bước? Spring AI và LangChain4j giống và khác nhau ở đâu?

### Bài 13. Bảo mật, chi phí và vận hành

**Mục tiêu:** đưa tính năng AI lên production một cách an toàn.

**Nội dung**

- Prompt injection trực tiếp và gián tiếp (qua tài liệu trong RAG); cách giảm thiểu
- Không đưa dữ liệu nhạy cảm vào prompt khi không cần; giới hạn quyền của tool
- Ghi log prompt, response, token, độ trễ; theo dõi chi phí theo tính năng và theo người dùng
- Rate limit theo người dùng, cache câu trả lời, chọn model nhỏ cho việc đơn giản
- Fallback khi API lỗi

**Thực hành:** thử tấn công prompt injection vào trợ lý của bạn và vá lại; thêm bảng theo dõi chi phí; gắn tag `v4-ai`.

**Tự kiểm tra:** tài liệu trong RAG chứa câu "bỏ qua mọi hướng dẫn trước đó" thì hệ thống bạn phản ứng ra sao?

## Song song: làm việc cùng AI

Trong suốt giai đoạn, ghi lại quy trình dùng Claude Code vào `07-interview/ai-workflow.md`: cách viết yêu cầu cho AI, cách review code AI sinh ra, những lỗi AI đã mắc mà bạn bắt được.
