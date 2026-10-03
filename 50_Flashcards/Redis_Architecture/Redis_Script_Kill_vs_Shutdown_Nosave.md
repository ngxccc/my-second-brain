---
noteId: 1790958170411
---

Khi một Lua Script bị vòng lặp vô tận làm treo Event Loop của Redis, tại sao lệnh `SCRIPT KILL` có thể bị từ chối?

---

- **Bảo toàn Atomicity**: `SCRIPT KILL` chỉ ngắt được Read-only script; nếu script đã ghi ít nhất một lệnh Write (`SET`/`HSET`), Redis sẽ từ chối (`UNKILLABLE`) để tránh corrupt dữ liệu.

---

Extra: Khi script ghi bị treo và trả về lỗi `BUSY`, giải pháp duy nhất là `SHUTDOWN NOSAVE` để tắt nóng tiến trình mà không lưu dữ liệu dở dang xuống đĩa, sau đó để Sentinel/Cluster failover sang Replica.
