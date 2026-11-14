---
tags: [type/concept, status/permanent]
date: 2026-08-13
description: "Nguyên lý Khoa học Máy tính cốt lõi về thuật toán tăng trưởng lũy thừa của Mảng động (Dynamic Arrays) giúp đạt độ phức tạp khấu trắc Amortized O(1) thay vì O(N^2)."
---

# Dynamic Array Exponential Growth

Ghi chép Layer 1 về tăng trưởng lũy thừa của Mảng động (C++ `std::vector`, Java `ArrayList`, Python `list`, Rust `Vec`, Go `slice`): vì sao nhân sức chứa đưa thao tác chèn cuối về khấu trắc Amortized $O(1)$.

## TL;DR

- **Bản chất**: Mảng động tăng sức chứa theo hệ số nhân (1.25x đến 2x) thay vì cộng thêm từng phần tử, nên số lần cấp phát giảm từ O(N) xuống O(log N).
- **Mục đích**: Đưa chi phí trung bình của mỗi thao tác `append` về amortized O(1) thay vì O(N) khi phải copy toàn bộ mảng.
- **Điểm mấu chốt**: Amortized O(1) là trung bình cộng dồn, không phải mọi lần gọi đều nhanh; lần vượt capacity vẫn là O(N) và có thể gây spike latency.

---

## Core Concept & Rationales

### 1. Thảm Họa Tăng Trưởng Tuyến Tính ($O(N^2)$)

Trong một mảng động (Dynamic Array), khi mảng hiện tại bị đầy, trình quản lý bộ nhớ không thể mở rộng trực tiếp ô nhớ cũ nếu các ô nhớ tiếp theo trên RAM đã bị đối tượng khác chiếm giữ. Trình quản lý bộ nhớ buộc phải:

1. Cấp phát một vùng nhớ mới lớn hơn trên Heap.
2. Copy toàn bộ dữ liệu từ mảng cũ sang mảng mới.
3. Hủy bỏ mảng cũ.

Nếu mỗi lần tràn capacity, hệ thống chỉ tăng thêm 1 phần tử ($+1$):

- Phần tử 1: Copy 0 phần tử.
- Phần tử 2: Copy 1 phần tử.
- ...
- Phần tử $N$: Copy $N-1$ phần tử.

Tổng số lượt copy dữ liệu dưới RAM là:
$$T(N) = 1 + 2 + 3 + \dots + (N-1) = \frac{N(N-1)}{2} \in O(N^2)$$

Với $N = 1.000.000$, hệ thống phải thực hiện gần **500 tỷ lượt copy bộ nhớ**, khiến ứng dụng bị đóng băng hoàn toàn.

---

### 2. Nguyên Lý Khấu Trắc Amortized $O(1)$ Qua Tăng Trưởng Lũy Thừa

Bằng cách nhân sức chứa theo tỷ lệ lũy thừa (ví dụ hệ số nhân $k = 2.0$ hoặc $k = 1.5$):

- Mảng không tăng từng đơn vị mà nhân đôi sức chứa: $1 \to 2 \to 4 \to 8 \to 16 \to \dots \to 2^k$.
- Số lần phải xin RAM trên Heap giảm từ $N$ lần xuống chỉ còn $\log_k N$ lần.

#### Phân tích chi phí khấu trắc (Amortized Cost):

Tổng chi phí copy bộ nhớ để chèn $N$ phần tử là:
$$\sum_{i=0}^{\log_k N} k^i = \frac{k^{\log_k N + 1} - 1}{k - 1} \approx \frac{k \cdot N}{k - 1} \in O(N)$$

Chia trung bình chi phí cho $N$ phần tử:
$$\text{Amortized Cost per Insert} = \frac{O(N)}{N} = O(1)$$

Thao tác `append` đạt hiệu năng cực cao ở mức trung bình **Amortized $O(1)$**.

---

## Bảng so sánh Growth Factor giữa các ngôn ngữ

Dưới đây là so sánh hệ số tăng trưởng (Growth Factor) của mảng động trên các ngôn ngữ lập trình phổ biến:

| Ngôn ngữ / Library       | Cấu trúc dữ liệu      | Growth Factor ($k$)                                     | Ghi chú thiết kế                                                    |
| :----------------------- | :-------------------- | :------------------------------------------------------ | :------------------------------------------------------------------ |
| **C++ Standard Library** | `std::vector`         | $2.0\times$ (GCC) / $1.5\times$ (MSVC)                  | MSVC dùng $1.5\times$ để tái sử dụng lại các vùng nhớ cũ trên Heap. |
| **Java**                 | `java.util.ArrayList` | $1.5\times$ (`oldCap + (oldCap >> 1)`)                  | Tối ưu cân bằng giữa RAM và tốc độ copy.                            |
| **Python**               | `PyListObject`        | $\sim 1.125\times + 6$ (`newsize + (newsize >> 3) + 6`) | Tăng trưởng mịn để tiết kiệm RAM trên hệ thống nhúng/scripting.     |
| **Rust**                 | `std::vec::Vec`       | $2.0\times$                                             | Ưu tiên tốc độ tối đa, nhân đôi capacity mỗi khi tràn.              |
| **Go**                   | `runtime.slice`       | $2.0\times$ (cap < 256) $\to 1.25\times + 192$          | Chuyển tiếp mượt (Smooth Transition) loại bỏ điểm gẫy đột ngột.     |

---

## Related Notes

- Cấp phát lại mảng động trên Heap: [[Stack_vs_Heap_Memory_Fundamentals]]
- [[Heap_Memory_Size_Classes_and_Alignment]] - Cơ chế phân chia ô nhớ tiêu chuẩn để tránh phân mảnh RAM.
- [[Go_Append_Growth_and_Reallocation]] - Ứng dụng thuật toán tăng trưởng mượt trên Slice của Go.
