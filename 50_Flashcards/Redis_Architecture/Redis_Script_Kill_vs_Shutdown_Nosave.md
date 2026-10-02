---
noteId: 1790958170411
---

Khi một Lua Script bị vòng lặp vô tận (Infinite Loop) làm treo Event Loop của Redis, lệnh `SCRIPT KILL` có giải cứu được hệ thống trong mọi trường hợp không?

---

- **Chỉ thành công với Read-only Script:** Lệnh `SCRIPT KILL` chỉ ngắt được những script chưa thực hiện bất kỳ thao tác ghi dữ liệu nào (chỉ gọi các lệnh READ).
- **Từ chối Kill khi đã có Write:** Nếu script đã thực thi ít nhất một lệnh WRITE (như `SET`, `HSET`), Redis sẽ trả về lỗi `UNKILLABLE` và từ chối hủy nhằm bảo toàn tính Nguyên tử (**Atomicity**) và tính Nhất quán (**Consistency**).
- **Biện pháp khẩn cấp (Emergency Fallback):** Khi script ghi bị treo, phương án duy nhất là phát lệnh `SHUTDOWN NOSAVE` để tắt nóng tiến trình Redis mà không lưu trạng thái dữ liệu lỗi xuống đĩa, sau đó để Sentinel/Cluster kích hoạt Failover sang node Replica.

---

Extra: Script chạy vượt ngưỡng `lua-time-limit` sẽ bắt đầu trả về lỗi `BUSY` cho các Client khác, chỉ chấp nhận lệnh `SCRIPT KILL` hoặc `SHUTDOWN NOSAVE`.
