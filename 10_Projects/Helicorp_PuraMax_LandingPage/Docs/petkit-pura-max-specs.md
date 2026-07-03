---
tags: [type/spec, topic/pet-tech]
date: 2026-06-29
aliases: [Thông số kỹ thuật PETKIT Pura Max, PETKIT Pura Max Specs]
---

# Thông số kỹ thuật PETKIT Pura Max

## TL;DR

Tài liệu lưu trữ thông số kỹ thuật chính thức của máy dọn phân mèo thông minh PETKIT Pura Max (bao gồm kích thước, dung tích, dải cân nặng hỗ trợ và hệ thống cảm biến an toàn xSecure).

---

## Core Specification

### 1. Kích thước và Trọng lượng (Dimensions & Weight)
- **Kích thước máy:** 620 × 538 × 552 mm
- **Chiều cao lối vào:** 200 mm (20 cm)
- **Trọng lượng máy:** ~10.8 kg

### 2. Dung tích chứa (Capacity)
- **Thể tích lồng quay (Cylinder Volume):** 76 L
- **Dung tích ngăn chứa chất thải (Waste Drawer):** 7 L (đáp ứng nhu cầu dọn dẹp lên tới 15 ngày cho 1 chú mèo)

### 3. Tương thích cân nặng (Weight Range)
- **Trọng lượng mèo hỗ trợ:** Từ 1.5 kg đến 10 kg
- **Khuyến cáo:** Không dùng cho mèo dưới 1.5 kg hoặc mèo con đang phát triển quá nhỏ để hệ thống cảm biến trọng lượng kích hoạt chính xác.

### 4. Hệ thống an toàn xSecure (Safety System Sensors)
- **Cảm biến nhiệt (Thermal Sensor):** Nhận diện bức xạ nhiệt sinh học từ cơ thể mèo trong khoảng cách gần để tạm dừng máy.
- **Cảm biến hồng ngoại (Infrared Sensor):** Đặt ở cửa vào để phát hiện mèo đi qua hoặc tiến gần cửa máy.
- **Cảm biến trọng lượng (Weight Sensors):** 4 cảm biến trọng lượng chịu lực cao đặt ở 4 chân đế, đo tải trọng chính xác từ 500g để ghi nhận trạng thái mèo ra vào và tự động ghi chép dữ liệu sức khỏe.
- **Cảm biến chống kẹp cơ học (Anti-pinch / Hall Sensor):** Cảm biến phản hồi lực trên lồng quay; nếu phát hiện lực cản vật lý bất ngờ trong quá trình sàng cát, máy sẽ dừng lập tức và xoay ngược chiều để giải phóng vật cản.

### 5. Kháng khuẩn và Khử mùi (Odor Control)
- **Smart Spray:** Bộ phun khử mùi không khí thông minh PURA AIR kết hợp dung dịch lọc khí kháng khuẩn, tự động phun sương sau mỗi chu kỳ vệ sinh.

---

## Concrete Examples

- **Mèo nặng 9.5 kg:** Hoàn toàn tương thích và sử dụng thoải mái trong lồng chứa 76L.
- **Vị trí đặt máy:** Cần đặt trên bề mặt phẳng cứng (sàn gạch, sàn gỗ). Đặt trên thảm mềm sẽ làm giảm độ nhạy của cảm biến trọng lượng ở 4 chân máy.

---

## Related Notes

- Đặc tả thiết kế Landing Page: [[Docs/Landing_Page_Spec.md|Landing Page Spec]]
- Đặc tả Kiến trúc kỹ thuật: [[Docs/Architecture_and_Spec.md|Architecture and Spec]]
- MOC Dự án: [[000_Helicorp_PuraMax_MOC.md|Helicorp Pura Max MOC]]
