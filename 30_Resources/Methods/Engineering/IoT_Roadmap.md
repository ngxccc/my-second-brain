---
tags: [type/method, status/permanent]
date: 2026-10-23
description: "Cẩm nang lộ trình Ultralearning làm chủ IoT và Nông nghiệp thông minh: Metalearning Canvas phân rã Concepts-Facts-Procedures và 5 tiêu chuẩn nắm chắc hệ thống nhúng, The Milestone Hierarchy theo 5 cấp độ Boss Gates, Real-World Failure Modes ruộng vườn và Verification Checklist phân tầng kèm tài liệu tham khảo chính thống."
---

# Lộ trình Ultralearning IoT và Nông nghiệp Thông minh: Từ ESP32 đến Hệ thống Tự hành

## TL;DR

- **Bản chất**: Lộ trình chắt 20% kiến thức IoT & Hệ thống nhúng cốt lõi: Non-blocking Event Loop, RS485 Modbus RTU, LoRa Sub-GHz, Pub/Sub với MQTT, và tiết kiệm năng lượng Deep Sleep.
- **Mục đích**: Lập trình Firmware (ESP32, C/C++, FreeRTOS), truyền thông (Wi-Fi, MQTT, LoRaWAN) và kết nối công nghiệp (RS485/Modbus RTU) cho Portfolio Embedded/IoT hoặc tự động hóa trang trại.
- **Điểm mấu chốt**: Năm cấp năng lực (Level 1-5) kiểm soát bằng Boss Gates; tách bạch Bench Prototype (< 800k VNĐ) để học/phỏng vấn với Field Deployment thật để tránh ảo tưởng ôm đồm.

---

## 1. Metalearning Canvas

- **Phân rã hệ thống:** Ultralearning phân rã IoT Nông nghiệp thành các trụ cột nhận thức rõ ràng.
- **Ranh giới năng lực:** giữa người chỉ nạp code Arduino mẫu và kỹ sư nắm chắc IoT & Hệ thống Nhúng nằm ở tư duy **System Reliability & Constrained Computing**.
- **Ba năng lực của ranh giới đó:** điều khiển thiết bị chạy 24/7 không treo đơ, duy trì truyền thông ổn định trong môi trường nhiễu sóng khắc nghiệt, và tối ưu từng micro-ampe dòng điện khi chạy pin.

### Bảng Phân rã 3 Cột trụ Tri thức IoT (Concepts - Facts - Procedures)

| Concepts (Khái niệm & Tiêu chuẩn Nắm chắc)                                                                                                                                                       | Facts (Dữ kiện & Chuẩn Công nghiệp)                                                                                                                | Procedures (Kỹ năng Lập trình & Thực hành)                                                                       |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------- |
| **Non-blocking Event Loop & Máy trạng thái**: Cấm dùng `delay()`. Nắm chắc là điều phối toàn bộ tác vụ định kỳ qua `millis()` và FSM để chip không bị mù trước sự kiện mạng và nút bấm.          | Cấu hình ESP32: Dual-core Xtensa 240MHz, 520KB SRAM, Flash Partitioning, Strapping Pins (GPIO 0, 2, 12, 15).                                       | Lập trình ngắt ngoài `attachInterrupt()` và quản lý thời gian đa nhiệm với `millis()`.                           |
| **Truyền thông Vi sai Chống nhiễu (RS485)**: Mã hóa tín hiệu bằng hiệu điện thế vi sai giữa dây A và B ($V_A - V_B$). Nắm chắc là kéo dây xa 1.200m ngoài vườn triệt tiêu sóng hài từ motor bơm. | Cấu trúc khung truyền Modbus RTU: Slave ID (1 Byte) + Function Code (1 Byte: 0x03) + Register Address (2 Bytes) + Data + CRC16 (2 Bytes).          | Viết code giao tiếp cổng `HardwareSerial2`, giải mã bản tin Hex và tính toán kiểm tra mã toàn vẹn dữ liệu CRC16. |
| **Sóng Vô tuyến Sub-GHz LoRa**: Điều chế trải phổ Chirp Spread Spectrum (CSS). Nắm chắc là truyền xuyên tán cây 1–3 km mà không cần mạng di động 4G hay Wi-Fi.                                   | Tham số LoRa: Tần số 433MHz/915MHz, Spreading Factor (SF7 - SF12), Bandwidth 125kHz, Coding Rate 4/5.                                              | Lập trình bus SPI kết nối module LoRa SX1278, đóng gói dữ liệu dạng cấu trúc nhị phân (Binary Struct Packaging). |
| **Kiến trúc Mạng Phân tán MQTT**: Header gói tin tối thiểu chỉ 2 bytes. Nắm chắc là thiết kế cấu trúc Topic phân tầng, duy trì kết nối Keep-Alive và xử lý Auto-reconnect ngầm khi mất mạng.     | Cấu trúc Topic chuẩn: `farm/<id>/zone1/telemetry`, `farm/<id>/zone1/pump_cmd`. Các mức QoS: QoS 0 (dữ liệu cảm biến), QoS 1 (lệnh bật bơm có ACK). | Xây dựng MQTT Client kết nối Broker đám mây, tích hợp gọi HTTPS Webhook gửi cảnh báo khẩn cấp qua Telegram Bot.  |
| **Ngân sách Năng lượng & Deep Sleep**: Tối ưu dòng tiêu thụ micro-ampe. Nắm chắc là tắt toàn bộ nhân CPU và khối sóng vô tuyến, kết hợp Power Gating cảm biến để chạy pin mặt trời tự trị.       | Dòng tiêu thụ ESP32: Bật Wi-Fi phát sóng: ~160mA - 240mA; Modem Sleep: ~30mA; Deep Sleep: ~10uA - 15uA.                                            | Lập trình hàm `esp_deep_sleep_start()` đánh thức bằng Timer hoặc ngắt ngoài; dùng VOM đo kiểm tra dòng tĩnh.     |

### Ngăn xếp 4 Tầng Công nghệ IoT Thực tế

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. TẦNG ỨNG DỤNG & CẢNH BÁO (Application & Notification)                   │
│    - Telegram Bot API (Thông báo khẩn cấp, nhận lệnh điều khiển từ xa)      │
│    - Dashboard trực quan hóa (Home Assistant, Node-RED, Grafana)            │
└──────────────────────────────────────▲──────────────────────────────────────┘
                                       │ (HTTPS / WebSockets)
┌──────────────────────────────────────┴──────────────────────────────────────┐
│ 3. TẦNG MẠNG & GIAO THỨC TRUNG GIAN (Networking & Transport)                │
│    - Giao thức tầng ứng dụng: MQTT (Publish/Subscribe, QoS, Retain)         │
│    - Giao thức mạng diện rộng: LoRa / LoRaWAN (Băng tần Sub-GHz 433/915MHz) │
└──────────────────────────────────────▲──────────────────────────────────────┘
                                       │ (Sóng vô tuyến LoRa / Wi-Fi)
┌──────────────────────────────────────┴──────────────────────────────────────┐
│ 2. TẦNG XỬ LÝ NHÚNG & FIRMWARE (Embedded Compute & RTOS)                    │
│    - Vi điều khiển: ESP32 (Dual-core Xtensa, FreeRTOS Tasks, NVS Storage)   │
│    - Quản lý năng lượng: Deep Sleep Mode, ULP Coprocessor, Timer Wakeup     │
└──────────────────────────────────────▲──────────────────────────────────────┘
                                       │ (UART, I2C, SPI, RS485 Modbus)
┌──────────────────────────────────────┴──────────────────────────────────────┐
│ 1. TẦNG CẢM BIẾN & CÔNG SUẤT (Sensors & Actuators Interface)                │
│    - Cảm biến công nghiệp: Đầu dò độ ẩm đất NPK chuẩn RS485 Modbus RTU      │
│    - Cơ cấu chấp hành: Relay, Contactor, Van điện từ, Bơm tưới 220V         │
│    - Nền tảng điện tử bảo vệ: [[Electronics_Roadmap]]                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Phân tầng Ngân sách Phần cứng (Honest Hardware Budget)

- **Tier 0: 0 VNĐ (Mô phỏng thuần túy)**:
  - _Nền tảng_: Wokwi ESP32 Simulator, Public MQTT Broker (HiveMQ Cloud / EMQX Free Tier), Telegram Bot API.
  - _Mục tiêu_: Viết firmware C/C++, giả lập mạng Wi-Fi và truyền nhận dữ liệu hoàn toàn miễn phí trên trình duyệt máy tính.
- **Tier 1: ~180.000 – 250.000 VNĐ (Node phần cứng cơ bản trong nhà)**:
  - 01 Kit ESP32 NodeMCU-32S (~75.000đ).
  - 01 Cảm biến nhiệt ẩm DHT22 (~45.000đ).
  - 01 Module Relay 5V 10A cách ly quang (~15.000đ).
  - 01 Màn hình OLED 0.96 inch I2C SSD1306 (~45.000đ).
  - Tận dụng củ sạc và cáp microUSB điện thoại có sẵn.
- **Tier 2: ~450.000 – 600.000 VNĐ (Trạm ngoài trời RS485 & Solar)**:
  - Thêm: 01 Cảm biến độ ẩm đất chuẩn điện dung chống nước (Capacitive v1.2) hoặc đầu dò Modbus RTU (~150.000đ).
  - 01 Module chuyển đổi TTL to RS485 MAX485 (~15.000đ).
  - 01 Pin Lithium 18650 dung lượng thật 2500mAh + Khay pin (~60.000đ).
  - 01 Mạch sạc pin kiêm tăng áp tích hợp bảo vệ TP4056 + Boost 5V (~25.000đ).
  - 01 Tấm pin năng lượng mặt trời mini 5V 2W (~50.000đ).
  - 01 Hộp nhựa kỹ thuật chống nước chuẩn ngoài trời IP65 (~30.000đ).
- **Tier 3: ~900.000 – 1.200.000 VNĐ (Hệ thống Hai Trạm LoRa Master-Slave hoàn chỉnh)**:
  - 02 Module LoRa SX1278 433MHz có anten (~160.000đ).
  - 01 Kit ESP32 thứ hai làm Master Gateway thu sóng trong nhà (~75.000đ).
  - 01 Bơm mini 12V DC lưu lượng 4L/phút (~120.000đ) phục vụ test trên bàn Lab.
  - 01 Van điện từ nhựa phi 21 12VDC (~80.000đ) kèm nguồn tổ ong 12V 2A.

---

## 2. The Milestone Hierarchy

Tiến độ được kiểm soát bằng năng lực thực tế. Nếu bận hoặc nghỉ ngắt quãng, tiến độ được đóng băng tại Level hiện tại; chỉ mở khóa Level tiếp theo khi vượt qua bài kiểm tra Boss Gate.

### Level 1: Mô phỏng Wokwi & Lập trình Non-blocking Không Delay (Virtual Lab)

- **Mục tiêu Năng lực**: Viết code điều khiển đa tác vụ không dùng `delay()`; hiểu sâu vòng đời firmware vi điều khiển và xử lý sự kiện ngắt tức thời.
- **Bài tập cô lập (Drills)**:
  - _Drill 1.1_: Mở Wokwi, viết chương trình nhấp nháy 2 LED ở 2 chu kỳ khác nhau (LED 1: 500ms, LED 2: 1300ms) trên cùng một vòng lặp `loop()` dùng `millis()`.
  - _Drill 1.2_: Gắn nút bấm vào chân GPIO có ngắt `attachInterrupt()`. Mỗi lần bấm nút, biến đếm tăng tức thời và in ra Serial Monitor mà không bị lag dù hệ thống đang bận tính toán.
- **Boss Gate Level 1 (Điều kiện mở khóa Level 2)**:
  - Dựng project trên Wokwi gồm: ESP32, biến trở (giả lập độ ẩm), màn hình OLED I2C và Relay. Viết code: Vừa cập nhật đồ thị độ ẩm lên OLED ở tần số 2Hz, vừa giám sát nút bấm chuyển chế độ Auto/Manual bằng ngắt, vừa tự động đóng ngắt Relay khi độ ẩm giảm dưới ngưỡng thiết lập mà màn hình không hề bị giật/đơ.

### Level 2: Làm chủ Bus Ngoại vi Phần cứng Thật (UART, I2C, SPI)

- **Mục tiêu Năng lực**: Giao tiếp và xử lý dữ liệu giữa vi điều khiển với các IC ngoại vi vật lý; bắt lỗi đứt bus hoặc trùng lặp địa chỉ truyền thông.
- **Bài tập cô lập (Drills)**:
  - _Drill 2.1 (Bus I2C)_: Nối màn hình OLED SSD1306 vào ESP32 (SDA chân 21, SCL chân 22). Nạp code I2C Scanner để quét và in ra địa chỉ Hex chính xác (`0x3C`). Thử rút một dây tín hiệu để quan sát hiện tượng hàm khởi tạo bị treo nếu không cấu hình timeout.
  - _Drill 2.2 (Bus UART)_: Cấu hình `Serial2` trên ESP32 (TX2 chân 17, RX2 chân 16). Kết nối với máy tính qua module USB-to-UART để truyền nhận chuỗi lệnh text ở tốc độ Baud 115200.
  - _Drill 2.3 (Bộ lọc số)_: Đọc giá trị ADC từ cảm biến, áp dụng thuật toán Lọc trung bình di động (Moving Average Filter với kích thước cửa sổ 10 mẫu) để loại bỏ gai nhiễu điện áp trước khi xuất dữ liệu.
- **Boss Gate Level 2 (Điều kiện mở khóa Level 3)**:
  - Lắp ráp mạch thực tế trên Breadboard: Đọc dữ liệu nhiệt ẩm từ cảm biến DHT22, lọc nhiễu, hiển thị song song lên màn hình OLED và in log có cấu trúc ra cổng Serial; kiểm tra mạch chạy liên tục 2 giờ không bị văng lỗi.

### Level 3: Giao thức Mạng MQTT & Cảnh báo Hai chiều qua Telegram

- **Mục tiêu Năng lực**: Đưa thiết bị lên mạng Internet; tối ưu hóa băng thông truyền thông qua mô hình Pub/Sub; xây dựng hệ thống báo động tức thời về điện thoại di động.
- **Bài tập cô lập (Drills)**:
  - _Drill 3.1 (State Machine Reconnect)_: Viết hàm quản lý kết nối Wi-Fi không chặn: Khi mất sóng Wi-Fi, vi điều khiển vẫn tiếp tục giám sát cảm biến và bật bơm tự động ở chế độ Offline, đồng thời tự động thử kết nối lại ngầm mỗi 5 giây.
  - _Drill 3.2 (MQTT Pub/Sub)_: Kết nối ESP32 tới HiveMQ Public Broker. Publish dữ liệu theo Topic `farm/zone1/moisture`. Cài ứng dụng MQTT Dashboard trên điện thoại để Subscribe và hiển thị đồng hồ đo độ ẩm thời gian thực.
  - _Drill 3.3 (Telegram Bot API)_: Dùng thư viện `WiFiClientSecure` gửi bản tin HTTPS POST trực tiếp tới Telegram Bot API để nhắn tin về điện thoại khi có sự cố.
- **Boss Gate Level 3 (Điều kiện mở khóa Level 4)**:
  - Thiết kế trạm cảnh báo hoàn chỉnh: Khi độ ẩm cảm biến tụt xuống dưới ngưỡng nguy hiểm, ESP32 tự động gửi tin nhắn Telegram: _"Cảnh báo: Đất đang khô hạn (32%), hệ thống sẵn sàng tưới!"_. Khi người dùng gõ `/pump_on` từ khung chat Telegram, ESP32 nhận lệnh qua MQTT, kích Relay bật bơm và phản hồi lại: _"Đã bật máy bơm thành công!"_.

### Level 4: Chuẩn Công nghiệp RS485 Modbus & Sóng Diện rộng LoRa

- **Mục tiêu Năng lực**: Giao tiếp với cảm biến công nghiệp bọc thép chống nước qua khoảng cách xa hàng trăm mét; truyền dữ liệu vô tuyến xuyên tán cây không phụ thuộc Wi-Fi và mạng 4G.
- **Bài tập cô lập (Drills)**:
  - _Drill 4.1 (Modbus RTU Parsing)_: Nối chân RO, DI, DE, RE của module MAX485 vào ESP32. Gửi khung truyền Hex yêu cầu đọc dữ liệu (`01 03 00 00 00 01 84 0A`) tới cảm biến đất RS485; đọc chuỗi Byte phản hồi và tính toán kiểm tra mã lỗi CRC16.
  - _Drill 4.2 (LoRa P2P Packet)_: Kết nối 2 module LoRa SX1278 với 2 kit ESP32 qua bus SPI. Viết chương trình truyền nhận Struct nhị phân (gồm ID trạm, nhiệt độ, độ ẩm, điện áp pin); kiểm tra khoảng cách truyền nhận thực tế xuyên qua 2 bức tường nhà.
- **Boss Gate Level 4 (Điều kiện mở khóa Level 5)**:
  - Dựng cặp truyền thông ngoài trời: Node phát đọc cảm biến RS485 và đóng gói dữ liệu phát qua sóng LoRa; Node thu cách 300 mét nhận được gói tin, kiểm tra tính toàn vẹn (Checksum), giải mã chính xác thông số và in ra Serial mà không mất gói tin nào trong 20 lần truyền liên tiếp.

### Level 5: Tối ưu Năng lượng Deep Sleep & Capstone System

- **Mục tiêu Năng lực**: Thiết kế hệ thống chạy pin/solar tự trị, dòng tiêu thụ chế độ ngủ dưới $20\mu\text{A}$; hoàn thiện toàn bộ hệ thống phân tán hai trạm Master - Slave đạt chuẩn phỏng vấn kỹ thuật.
- **Bài tập cô lập (Drills)**:
  - _Drill 5.1 (Power Gating Cảm biến)_: Không cấp nguồn cho cảm biến và module RS485 liên tục; dùng 1 Transistor/MOSFET làm khóa nguồn, chỉ cấp điện cho cảm biến 200ms trước khi đo rồi ngắt nguồn ngay để tiết kiệm pin.
  - _Drill 5.2 (Deep Sleep Wakeup)_: Lập trình hàm `esp_deep_sleep_start()` đánh thức bằng Timer sau 15 phút. Dùng đồng hồ VOM thang đo $\text{mA}$ kiểm tra: Dòng tiêu thụ hạ từ 120mA xuống dưới 0.05mA trong suốt thời gian ngủ.
- **Boss Gate Level 5 (Tốt nghiệp Toàn diện Lộ trình)**:
  - Vượt qua toàn bộ các tiêu chuẩn kiểm thử của **Capstone Project** (Pha A - Bench Prototype) bên dưới.

---

## 3. Real-World Failure Modes

Khác với phòng thí nghiệm, môi trường trang trại ngoài cánh đồng có vô số tác nhân phá hủy phần cứng nếu không có kinh nghiệm phòng ngừa:

### 4 Bẫy Kinh điển Ruộng vườn (Field Gotchas & Anti-Patterns)

1. **Bẫy Ăn mòn Điện phân Cảm biến Đất (Electrolysis Soil Sensor Rot)**: Cảm biến que đồng hở bán 15.000đ đo sai lệch sau 1 tuần và chân đồng bị ăn mòn rỉ sét mục gãy sau 1 tháng cắm đất ẩm. Nguyên nhân do cấp điện áp DC liên tục kích hoạt phản ứng điện phân ion trong đất giàu khoáng chất, làm rã nát lớp đồng mạ. Khắc phục: Dùng cảm biến điện dung (Capacitive v1.2) bọc nhựa cách điện, hoặc đầu dò công nghiệp RS485 bọc thép không gỉ.
2. **Bẫy Cháy Dính Tiếp điểm Relay do Dòng Khởi động (Relay Contact Welding)**: Bơm nước chạy mãi không chịu ngắt dù đèn tín hiệu đã tắt. Nguyên nhân do tia lửa hồ quang điện sinh ra khi đóng ngắt cuộn dây động cơ làm hàn dính hai lá đồng tiếp điểm cơ khí của module Relay nhỏ. Khắc phục: Không đấu trực tiếp bơm lớn vào Relay board; dùng Relay kích cuộn hút của Khởi động từ (Contactor mini 220V 16A) để đóng điện.
3. **Bẫy Treo Bus I2C do Nhiễu Xung Hồ quang (EMI Bus Lockup)**: Màn hình OLED hoặc cảm biến I2C đột ngột ngừng cập nhật, chương trình bị đóng băng vô tận trong hàm đọc bus. Nguyên nhân do tia lửa điện phát ra từ tiếp điểm Relay tạo xung sóng hài truyền ngược qua dây dẫn làm kẹt đường tín hiệu SDA/SCL ở mức thấp. Khắc phục: Hàn mạch dập xung Snubber (Trở $100\Omega$ nối tiếp Tụ $100\text{nF}$ 400V) mắc song song tiếp điểm Relay; gắn thêm trở kéo lên $4.7\text{k}\Omega$ ngoài cho bus.
4. **Bẫy Kẹt Vòng lặp làm Chết Pin Ngoài Vườn (Infinite Loop Battery Drain)**: Trạm đo chạy pin mặt trời ngoài vườn chết nguồn sau 3 ngày. Nguyên nhân do ESP32 bị kẹt trong vòng lặp `while` chờ kết nối Wi-Fi hoặc chờ cảm biến trả lời, không chịu đi vào Deep Sleep, ngốn 150mA liên tục. Khắc phục: Bắt buộc kích hoạt phần cứng Watchdog Timer (WDT) tự reset chip sau 5 giây; cấu hình Timeout cứng cho mọi lệnh đọc bus ngoại vi.

### Ma trận Chẩn đoán Sự cố Thực tế (Troubleshooting Matrix)

| Sự cố thực tế quan sát                                        | Nguyên nhân gốc rễ (Root Cause)                                                                                                                          | Quy trình cô lập & Khắc phục chuẩn kỹ thuật                                                                                                                                                                                        |
| :------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Bật máy bơm là vi điều khiển bị Reset (Brownout liên tục)** | Dòng khởi động của motor bơm (Inrush Current) lớn gấp 3–5 lần bình thường, kéo sụt áp toàn bộ đường nguồn 5V xuống dưới ngưỡng tối thiểu 2.7V của ESP32. | Tách riêng hoàn toàn nguồn cấp cho vi điều khiển (dùng adapter riêng hoặc pin riêng). Hàn thêm tụ hóa $1000\mu\text{F}$ song song với tụ gốm $100\text{nF}$ ngay tại chân nguồn $V_{\text{CC}}$ của ESP32 để gánh sụt áp tức thời. |
| **Gửi lệnh Telegram nhưng thiết bị không phản hồi**           | Mất kết nối Wi-Fi hoặc mất phiên MQTT, chương trình bị kẹt trong hàm đọc mạng đồng bộ.                                                                   | Kiểm tra log Serial; cài đặt hàm Callback nhận tin nhắn ngầm; triển khai máy trạng thái tự động reconnect Wi-Fi/MQTT theo thuật toán Exponential Backoff.                                                                          |
| **Đọc cảm biến RS485 toàn trả về giá trị 0 hoặc 255**         | Đấu lộn ngược cặp dây vi sai A và B; hoặc không kéo chân kích phát DE/RE của module MAX485 lên mức cao khi gửi và mức thấp khi nhận.                     | Đảo lại hai dây A và B của đường RS485; kiểm tra code điều khiển chân GPIO nối với DE/RE của MAX485 (phải có `digitalWrite(DE_PIN, HIGH)` trước khi truyền và `LOW` trước khi nhận).                                               |
| **Trạm LoRa không nhận được gói tin ở cự ly xa**              | Thiếu anten hoặc dùng anten lò xo chất lượng kém; cấu hình tham số Spreading Factor quá thấp (SF7) không đủ độ nhạy thu trong môi trường nhiều vật cản.  | Gắn anten que chuẩn 433MHz có độ lợi cao; nâng cấu hình LoRa lên SF10 hoặc SF12 và giảm Bandwidth xuống 125kHz để tăng cự ly phát sóng xuyên tán cây.                                                                              |

---

## 4. Verification Checklist

Dự án tốt nghiệp được chia rạch ròi thành 2 giai đoạn:

### Pha A: Mô hình Bàn thí nghiệm (Bench Prototype - Trọng tâm Phỏng vấn Xin việc)

_Mục đích: Chứng minh 100% năng lực Firmware, mạng IoT và khả năng xử lý sự cố trước nhà tuyển dụng với chi phí dưới 800.000 VNĐ trên bàn làm việc._

- [ ] **Trạm Vườn (Slave Node)**:
  - 01 ESP32 chạy chế độ Deep Sleep chu kỳ 15 phút, cấp nguồn từ pin 18650.
  - Tích hợp 01 Transistor khóa nguồn (Power Gating) cho module RS485 và cảm biến.
  - Đọc thông số đất qua chuẩn Modbus RTU, đóng gói Struct nhị phân, phát sóng qua module LoRa SX1278 rồi ngủ sâu.
- [ ] **Trạm Nhà (Master Gateway)**:
  - 01 ESP32 cắm nguồn liên tục, nhận sóng LoRa từ Slave Node.
  - Giải mã và kiểm tra tính toàn vẹn gói tin (CRC).
  - Tự động duy trì kết nối Wi-Fi & MQTT Broker với cơ chế Auto-reconnect ngầm không dùng `delay()`.
  - Điều khiển 01 Bơm mini 12V và 01 Van điện từ 12V qua Module Relay có cách ly Optocoupler theo đúng logic an toàn: Mở van trước 1 giây $\to$ Bật bơm $\to$ Tắt bơm $\to$ Đóng van.
  - Tích hợp gửi báo động và nhận lệnh hai chiều qua Telegram Bot.

### Pha B: Kỹ thuật Thi công Thực địa (Field Deployment - Khi về Quê Làm Vườn)

_Mục đích: Cẩm nang hướng dẫn thi công đường nước và an toàn điện thực tế khi bước ra ngoài đồng đất._

1. **Cơ cấu Thủy lực Ống nước (Hydraulics Layout)**:
   - _Quy tắc cấp nước_: `Nguồn nước / Bồn chứa` $\to$ `Máy bơm` $\to$ `Bộ lọc đĩa 120 mesh` $\to$ `Ống góp PVC phi 27/34` $\to$ `Các van điện từ phân khoang` $\to$ `Dây tưới nhánh LDPE 16mm` $\to$ `Béc nhỏ giọt bù áp`.
   - _Bộ lọc đĩa là bắt buộc_: Van điện từ có lỗ kim nâng hạ màng ngăn siêu nhỏ; không có lọc đĩa thì rêu và cặn bồn sẽ làm kẹt van chỉ sau vài ngày, gây tràn nước hoặc không thể mở van.
2. **Kỹ thuật Phân khoang (Zoning Architecture)**:
   - Không mở đồng loạt tất cả các van cùng lúc làm tụt áp bơm; lập trình tưới tuần tự từng khu vực (Zone 1 tưới 15 phút $\to$ ngắt $\to$ Zone 2 tưới 15 phút).
   - _Logic bảo vệ chống nổ ống_: Luôn mở van của khoang tiếp theo trước 2 giây rồi mới đóng van của khoang trước; tuyệt đối không để xảy ra khoảnh khắc máy bơm đang chạy mà tất cả các van đều đóng kín.
3. **An toàn Điện Thực tế Ngoài trời**:
   - Sử dụng van điện từ loại $12\text{V DC}$ hoặc $24\text{V AC}$ thay vì van $220\text{V}$ để đảm bảo an toàn tính mạng khi tiếp xúc với môi trường bùn đất ẩm ướt.
   - Toàn bộ mạch điều khiển đặt trong hộp tủ điện chống nước chuẩn IP65 có gioăng cao su, ống dây điện đi qua ốc siết cáp (Cable Gland) phía đáy tủ để nước mưa không chảy ngược vào trong.

## 5. Primary Citations

1. **Espressif Systems**. (2023). _ESP32 Technical Reference Manual (Version 4.9) & ESP-IDF Programming Guide_. Espressif Systems Co., Ltd. (Tài liệu kiến trúc phần cứng lõi: RTC Memory, Power Management, ULP Coprocessor và Deep Sleep Modes).
2. **OASIS Standard**. (2019). _MQTT Version 5.0 Specification_. OASIS Standard. Edited by Andrew Banks, Ed Briggs, Ken Borgendale, and Rahul Gupta. (Tiêu chuẩn kỹ thuật chính thức về giao thức MQTT: cơ chế Pub/Sub, gói tin Keep-Alive, QoS levels và Retained Messages).
3. **Modbus Organization**. (2012). _Modbus Application Protocol Specification V1.1b3 & Modbus Serial Line Protocol and Implementation Guide V1.02_. Modbus-IDA. (Quy chuẩn truyền thông nối tiếp công nghiệp, cấu trúc bảng thanh ghi Holding Registers và giải thuật mã hóa CRC16).
4. **LoRa Alliance**. (2020). _RP002-1.0.2 LoRaWAN Regional Parameters & Physical Layer Definition_. LoRa Alliance, Inc. (Đặc tả vật lý Sub-GHz, kỹ thuật điều biến Chirp Spread Spectrum và Spreading Factor).
5. **Netafim USA**. (2022). _Subsurface Drip Irrigation (SDI) System Layout and Engineering Design Manual_. Netafim Irrigation, Inc. (Cơ sở kỹ thuật thủy lực nông nghiệp chính xác: quy chuẩn lọc đĩa đĩa 120 mesh, béc nhỏ giọt bù áp và nguyên lý phân khoang chống quá tải bơm).

---

## Related Notes

- [[Electronics_Roadmap]]
- [[Master_Roadmaps_Index]]
- [[Linux_Roadmap]]
- [[System_Design_Roadmap]]
- [[000_Methods_MOC]]
