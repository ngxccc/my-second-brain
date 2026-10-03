---
noteId: 1790265532893
---

Trong Mutex Sharding, định luật nào giải thích việc tăng từ 32 lên 64 shards thì thông lượng đi ngang thay vì tăng tiếp?

---

- **Định luật Amdahl**: Tốc độ tăng tốc bị giới hạn bởi phần tuần tự (Sequential Fraction như hash lookup, memory bus); shards quá lớn còn gây False Sharing trên CPU Cache Line.

---

Extra: Quy tắc ngón tay cái: Số lượng Shards tối ưu thường nằm trong khoảng $2\times$ đến $4\times$ số lượng CPU Threads của máy chủ (ví dụ máy chủ 12 threads thì 16 hoặc 32 Shards là tối ưu).
