---
tags: [type/concept, status/permanent]
date: 2026-08-09
description: "Cơ chế dọn rác phân thế hệ (Generational GC) trong V8 Engine gồm Scavenger và Mark-Sweep-Compact."
---

# JS Generational Garbage Collection

Tài liệu này là một ghi chép Layer 2 mô tả chi tiết cách JavaScript (V8 Engine) triển khai cơ chế dọn rác phân thế hệ (Generational Garbage Collection), dựa trên nguyên lý khoa học máy tính cốt lõi của [[Garbage_Collection_Fundamentals]].

## TL;DR

- **Bản chất**: V8 chia heap thành New Space (Scavenger) và Old Space (Mark-Sweep-Compact), dựa trên giả thuyết phần lớn object chết trẻ.
- **Mục đích**: Giảm chi phí dọn rác bằng cách chỉ chạy thuật toán đắt trên vùng có ít object sống lâu.
- **Điểm mấu chốt**: Object sống sót qua nhiều lần Scavenge sẽ được promote lên Old Space; giữ object lâu là chi phí thật, không phải chi tiết nội bộ của engine.

---

## Core Concept

### 1. Phân vùng New Space

- **Kích thước:** Nhỏ (1MB đến 64MB), lưu giữ các đối tượng vừa tạo.
- **Thuật toán:** Dùng **Scavenger** (Copying Collector) chia đôi vùng nhớ thành _From-Space_ và _To-Space_.
- **Hoạt động:** Khi chạy Minor GC, V8 quét các đối tượng sống ở _From-Space_ và chép sang _To-Space_. Sau 2 chu kỳ sống sót, đối tượng được thăng cấp (promote) lên Old Space. Quá trình di chuyển này giải quyết triệt để rủi ro phân mảnh bộ nhớ.

### 2. Phân vùng Old Space

- **Kích thước:** Lớn, chứa đối tượng sống qua nhiều chu kỳ Minor GC hoặc đối tượng có kích thước siêu lớn.
- **Thuật toán:** Dùng **Mark-Sweep-Compact** (Major GC).
  - **Marking:** Quét đồ thị đối tượng từ GC Roots (Global Variables, Stack Frames) để gắn nhãn đối tượng còn khả năng truy cập (reachable).
  - **Sweeping:** Giải phóng các ô nhớ chứa đối tượng không thể truy cập (unreachable).
  - **Compacting:** Dồn dập các vùng nhớ còn sống lại gần nhau để tối ưu không gian trống liên tục.

---

## Tối ưu hóa GC trong V8

### Kỹ thuật Tối ưu Hóa Orinoco trong V8

- **Incremental Marking:** Chia nhỏ quá trình đánh dấu thành các bước ngắn xen kẽ với luồng thực thi JavaScript chính, tránh đóng băng giao diện người dùng hoặc nghẽn server.
- **Concurrent & Parallel GC:** Chuyển các tác vụ quét và nén bộ nhớ sang các Worker Threads chạy ngầm song song với main thread.

---

## Related Notes

- [[Garbage_Collection_Fundamentals]] - Nguyên lý khoa học máy tính cốt lõi về cơ chế dọn rác tự động.
- [[Memory_Leaks_Core_Mechanics]] - Bản chất rò rỉ bộ nhớ ở mức độ nền tảng.
- Hai phân vùng V8 phải quản lý: [[Stack_vs_Heap_Memory_Fundamentals]]
- Bố cục bộ nhớ mà V8 chia thế hệ: [[JS_Stack_vs_Heap_Memory]]
- Hệ quả khi object sống quá lâu: [[JS_Memory_Leaks_and_Mitigation]]
- Khác biệt engine khiến GC khác nhau: [[JS_Runtimes_Bun_vs_NodeJS]]
- [[000_Tech_MOC]]
