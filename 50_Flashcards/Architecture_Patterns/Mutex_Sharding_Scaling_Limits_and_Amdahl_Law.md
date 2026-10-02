---
noteId: 1790265532893
---

Trong Mutex Sharding, khi tăng từ 1 lên 32 shards thông lượng tăng gấp 4 lần, nhưng tăng tiếp lên 64 shards thì đi ngang. Định luật nào giải thích điều này và đâu là nút thắt mới?

---

- **Định luật Amdahl:** Tốc độ tăng tốc tối đa bị giới hạn bởi phần tuần tự (Sequential Fraction - phần không thể song song hóa như hash slot lookup, memory bus).
- **Nút thắt cổ chai mới:**
  - Chi phí CPU Cache Miss và False Sharing khi các mutex nằm cùng một Cache Line.
  - Hash Collision trên các hot keys khiến tải dồn cục bộ vào vài shard nhất định.

---

Extra: **Quy tắc ngón tay cái (Rule of Thumb):** Số lượng Shards tối ưu thường nằm trong khoảng từ $2\times$ đến $4\times$ số lượng CPU Threads của máy chủ (ví dụ: máy chủ 12 threads thì 16 hoặc 32 Shards là điểm ngọt tối ưu).
