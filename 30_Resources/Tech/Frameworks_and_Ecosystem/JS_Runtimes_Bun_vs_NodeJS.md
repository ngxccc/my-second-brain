---
tags: [type/concept, status/permanent]
date: 2026-06-20
description: "So sánh kiến trúc runtime Bun (JavaScriptCore + Zig) vs Node.js (V8 + Libuv) và hệ quả lên tốc độ khởi động cùng hiệu năng I/O."
---

# JS Runtime Architecture: Bun vs. Node.js

## TL;DR

- **Bản chất**: Node.js chạy trên V8 cộng Libuv; Bun chạy trên JavaScriptCore cộng runtime viết bằng Zig.
- **Mục đích**: Giải thích vì sao Bun khởi động nhanh và ít overhead chuyển ngữ cảnh, thay vì chỉ so con số benchmark.
- **Điểm mấu chốt**: Đổi lại là độ trưởng thành hệ sinh thái; chọn runtime là chọn mức rủi ro tương thích, không chỉ chọn tốc độ.

---

## Core Concept

### 1. Kiến trúc Động cơ: JavaScriptCore vs. V8 Engine

- **V8 Engine (Node.js):**
  - Biên dịch JIT qua hai bộ biên dịch: _Ignition_ (Interpreter) và _TurboFan_ (Optimizing Compiler).
  - **Garbage Collection:** dùng bộ dọn rác **Orinoco** theo mô hình thế hệ (Generational GC). Bộ nhớ chia thành _New Space_ (đối tượng sống ngắn, dọn bằng thuật toán Scavenge) và _Old Space_ (đối tượng sống lâu, dọn bằng Mark-Sweep-Compact). Cơ chế này được tối ưu cho tác vụ máy chủ dài hạn.
- **JavaScriptCore (JSC) (Bun):**
  - Cấu trúc biên dịch 3 tầng (LLInt, Baseline JIT, DFG/FTL JIT) giúp tối ưu thời gian khởi động và tiêu thụ ít RAM hơn.
  - **Garbage Collection:** dùng bộ dọn rác phân cấp vốn tối ưu cho di động và trình duyệt (Safari). Bun đã tinh chỉnh lại tham số dọn rác của JSC cho môi trường máy chủ chạy liên tục, tránh hiện tượng dừng hệ thống ("Stop the World" lag).

### 2. Vòng lặp sự kiện: Custom Zig Event Loop vs. Libuv

Cả hai runtime đều hỗ trợ lập trình bất đồng bộ đơn luồng (Single-threaded, Non-blocking I/O) theo chuẩn JavaScript, nhưng cách triển khai ở tầng hệ thống khác nhau:

- **Node.js (`libuv`):**
  - Dựa vào thư viện C-based **`libuv`** để tương tác với nhân hệ điều hành qua các cơ chế I/O Multiplexing (`epoll` trên Linux, `kqueue` trên macOS, `IOCP` trên Windows).
  - Mã nguồn viết bằng JavaScript và C++; mỗi lần gọi hàm I/O, V8 phải bắc cầu dữ liệu qua lại giữa môi trường JS và mã máy C++ của `libuv`, tạo chi phí trễ chuyển đổi ngữ cảnh (JS-to-C++ binding overhead).
- **Bun (Zig-native):**
  - Bun tự viết thư viện chạy vòng lặp sự kiện trực tiếp bằng **Zig**.
  - Nhờ khả năng tương tác trực tiếp không tốn chi phí với nhân hệ điều hành (zero-overhead FFI) và gọi thẳng system call, Bun tích hợp sâu hệ thống I/O vào bên trong API của JavaScriptCore, loại bỏ chi phí binding của Node.js.

### 3. Khác biệt API trong thực tế

```typescript
// Node.js: Đọc file bất đồng bộ qua Libuv thread pool
import fs from "node:fs/promises";
const data = await fs.readFile("large_file.txt", "utf-8");

// Bun: Đọc file tối ưu hóa tốc độ cao qua Zig system calls
const data = await Bun.file("large_file.txt").text();
```

## Related Notes

- Thứ tự ưu tiên Microtask và Macrotask dùng chung cho cả hai runtime: [[JS_Event_Loop_Ordering]]
- Câu hỏi phỏng vấn và câu trả lời mẫu: [[JS_Runtimes_Interview_QA]]
- [[000_Tech_MOC]]
- Cơ chế GC thế hệ: [[JS_Generational_Garbage_Collection]]
- Quản lý bộ nhớ: [[JS_Stack_vs_Heap_Memory]]
