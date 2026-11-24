# DSA: lộ trình song song

15 bài theo pattern, chạy xuyên suốt khoảng 32 tuần, 3–4 giờ mỗi tuần. Mỗi bài: học cấu trúc dữ liệu hoặc kỹ thuật, tự cài đặt bằng Java, rồi giải 5–10 bài luyện từ Easy lên Medium.

**Quy ước cho mỗi bài giải trong `dsa/`:** đề tóm tắt, ý tưởng, độ phức tạp thời gian và bộ nhớ, code, và một dòng "dấu hiệu nhận dạng". Bài nào phải xem lời giải thì đánh dấu và giải lại sau một tuần.

### Bài 1. Độ phức tạp thuật toán

- Big O cho thời gian và bộ nhớ; trường hợp tốt, xấu, trung bình; chi phí khấu hao (amortized)
- Ước lượng từ giới hạn đầu vào: n khoảng 10⁵ thì cần O(n log n) trở xuống
- **Dấu hiệu:** luôn nói độ phức tạp trước khi code

### Bài 2. Array và Hashing

- `HashMap` để đếm, nhóm, tra cứu O(1); `HashSet` để kiểm tra tồn tại
- **Dấu hiệu:** "tìm cặp", "đếm tần suất", "nhóm theo"
- **Luyện:** Two Sum, Valid Anagram, Group Anagrams, Top K Frequent Elements, Longest Consecutive Sequence

### Bài 3. Two Pointers

- Hai con trỏ từ hai đầu; con trỏ nhanh và chậm
- **Dấu hiệu:** mảng đã sắp xếp, so sánh hai đầu, xóa phần tử tại chỗ
- **Luyện:** Valid Palindrome, Two Sum II, 3Sum, Container With Most Water, Move Zeroes

### Bài 4. Sliding Window

- Cửa sổ cố định và cửa sổ co giãn
- **Dấu hiệu:** "mảng con/chuỗi con liên tiếp dài nhất/ngắn nhất thỏa điều kiện"
- **Luyện:** Best Time to Buy and Sell Stock, Longest Substring Without Repeating Characters, Longest Repeating Character Replacement, Permutation in String, Minimum Window Substring

### Bài 5. Prefix Sum và xử lý chuỗi

- Mảng cộng dồn; kết hợp prefix sum với `HashMap`
- **Dấu hiệu:** "tổng đoạn con", "số đoạn con có tổng bằng k"
- **Luyện:** Range Sum Query, Subarray Sum Equals K, Product of Array Except Self, Encode and Decode Strings

### Bài 6. Stack và Queue

- Stack cho cặp ngoặc và biểu thức; monotonic stack; queue và `ArrayDeque`
- **Dấu hiệu:** "phần tử lớn hơn kế tiếp", lồng nhau, hoàn tác
- **Luyện:** Valid Parentheses, Min Stack, Evaluate Reverse Polish Notation, Daily Temperatures, Implement Queue using Stacks

### Bài 7. Linked List

- Đảo danh sách, node giả (dummy), con trỏ nhanh chậm
- **Dấu hiệu:** phát hiện chu trình, tìm giữa, gộp danh sách
- **Luyện:** Reverse Linked List, Merge Two Sorted Lists, Linked List Cycle, Remove Nth Node From End, LRU Cache

### Bài 8. Binary Search

- Tìm kiếm trên mảng và tìm kiếm trên không gian đáp án; tránh lỗi biên và tràn số khi tính `mid`
- **Dấu hiệu:** "tìm giá trị nhỏ nhất/lớn nhất thỏa điều kiện", mảng xoay
- **Luyện:** Binary Search, Search a 2D Matrix, Koko Eating Bananas, Find Minimum in Rotated Sorted Array, Time Based Key-Value Store

### Bài 9. Tree

- Duyệt DFS (pre, in, post-order) bằng đệ quy và bằng stack; BFS theo tầng; cây nhị phân tìm kiếm; trie
- **Dấu hiệu:** bài toán trên cây gần như luôn là đệ quy "giải cây con rồi ghép"
- **Luyện:** Invert Binary Tree, Maximum Depth, Diameter of Binary Tree, Level Order Traversal, Validate BST, Lowest Common Ancestor of a BST, Implement Trie

### Bài 10. Heap

- `PriorityQueue`; top K; hai heap
- **Dấu hiệu:** "K phần tử lớn nhất/nhỏ nhất", trung vị của luồng dữ liệu
- **Luyện:** Kth Largest Element in a Stream, Last Stone Weight, K Closest Points to Origin, Task Scheduler, Find Median from Data Stream

### Bài 11. Graph

- Biểu diễn đồ thị; BFS, DFS; topological sort; Union-Find; Dijkstra ở mức cơ bản
- **Dấu hiệu:** lưới ô, phụ thuộc giữa các việc, đường đi ngắn nhất
- **Luyện:** Number of Islands, Clone Graph, Rotting Oranges, Course Schedule, Number of Connected Components, Network Delay Time

### Bài 12. Backtracking

- Khung chọn, đệ quy, bỏ chọn; cắt nhánh
- **Dấu hiệu:** "liệt kê tất cả" tổ hợp, hoán vị, tập con
- **Luyện:** Subsets, Combination Sum, Permutations, Word Search, Generate Parentheses

### Bài 13. Greedy và Interval

- Khi nào chọn tham lam là đúng; sắp xếp theo điểm đầu hoặc điểm cuối
- **Dấu hiệu:** khoảng thời gian chồng lấn — liên hệ trực tiếp với bài toán khung giờ sân của capstone
- **Luyện:** Maximum Subarray, Jump Game, Merge Intervals, Insert Interval, Non-overlapping Intervals, Meeting Rooms II

### Bài 14. Dynamic Programming

- Từ đệ quy → nhớ kết quả (top-down) → bảng (bottom-up) → tối ưu bộ nhớ
- Xác định trạng thái, công thức chuyển, trường hợp cơ sở; DP một chiều, hai chiều, knapsack
- **Dấu hiệu:** "có bao nhiêu cách", "giá trị lớn nhất/nhỏ nhất", bài toán con lặp lại
- **Luyện:** Climbing Stairs, House Robber, Coin Change, Longest Increasing Subsequence, Word Break, Unique Paths, Longest Common Subsequence, Partition Equal Subset Sum

### Bài 15. Ôn tổng hợp theo đề thật

- Giải đề không biết trước pattern, bấm giờ 30–45 phút, nói suy nghĩ thành tiếng
- Giải lại các bài đã đánh dấu "phải xem lời giải"
- **Mục tiêu cuối:** hoàn thành bộ NeetCode 150 và giải được Medium trong 30 phút không cần gợi ý
