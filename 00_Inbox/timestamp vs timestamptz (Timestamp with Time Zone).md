- **`timestamp` (Without Time Zone):** Trả về thời gian vô tri. Nếu cậu lưu `2026-04-27 19:15:00`, nó sẽ nằm chết ở đó. Nếu server cậu đặt ở Mỹ (UTC-8) và cậu truy vấn, nó vẫn ra con số đó, dẫn đến lệch múi giờ toán loạn.
    
- **`timestamptz` (With Time Zone):** Lưu thời gian theo hệ quy chiếu tuyệt đối (**UTC**). Khi hệ thống insert dữ liệu, DB tự động convert giờ local của server sang UTC để lưu. Khi lấy ra, driver DB tự động convert ngược từ UTC sang múi giờ của client/server đang gọi.

👉 **Luật bất thành văn ở cấp độ Enterprise:** BẮT BUỘC dùng `timestamptz` cho mọi cột `created_at` và `updated_at`.