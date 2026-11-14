---
tags: [type/guide, status/permanent]
date: 2026-10-31
description: "Ví dụ áp dụng phân hoạch tương đương vào form đặt vé sự kiện, từ nhận diện miền dữ liệu đến bộ test case tối ưu."
---

# Thiết kế Test Case theo Phân hoạch Tương đương: Form Đặt vé

## TL;DR

- **Bản chất**: Một form 3 trường đi qua đủ 4 bước phân hoạch: 12 phân vùng (5 hợp lệ, 7 không hợp lệ), 12 giá trị đại diện, 10 test case cuối cùng.
- **Mục đích**: Xem quy trình của [[Equivalence_Partitioning]] chạy trên một form thật để bắt chước cách làm cho form khác.
- **Điểm mấu chốt**: 5 phân vùng hợp lệ gộp vào 3 positive test case, còn 7 phân vùng không hợp lệ phải tách thành 7 test case riêng để tránh Masking Effect.

## Context: When to use?

- **Dùng khi:** cần thiết kế test case cho form hoặc API có nhiều trường với ràng buộc kiểu dữ liệu, khoảng giá trị, hoặc danh sách giá trị cho phép.
- **Ví dụ này chọn form đặt vé** vì nó đủ cả ba dạng ràng buộc: khoảng số nguyên, tập giá trị rời rạc, và khoảng bị chặn hai đầu.

## Step-by-Step

### Bài toán: form đặt vé nhạc hội trực tuyến

- `ticketQuantity`: số nguyên từ **1 đến 10** vé.
- `ticketType`: một trong `"STANDARD"` (100), `"VIP"` (200), `"STUDENT"` (100, giảm 20%); giá trị khác bị từ chối.
- `attendeeAge`: số nguyên từ **15 đến 65** tuổi.
- Kết quả trả về: `APPROVED` kèm tổng tiền `= quantity × đơn giá × (1 − mức giảm)`, hoặc `REJECTED` kèm thông báo lỗi.

### Bước 1: Nhận diện miền dữ liệu

- `ticketQuantity`: miền số nguyên có khoảng hạn mức (Range condition).
- `ticketType`: tập giá trị chuỗi rời rạc (Discrete value set).
- `attendeeAge`: miền số nguyên có khoảng hạn mức (Range condition).

### Bước 2: Lập bảng phân vùng

| Trường           | Phân vùng | Loại         | Điều kiện / phạm vi                       |
| :--------------- | :-------- | :----------- | :---------------------------------------- |
| `ticketQuantity` | VP1       | Hợp lệ       | $1 \le Q \le 10$                          |
|                  | IP1       | Không hợp lệ | $Q < 1$                                   |
|                  | IP2       | Không hợp lệ | $Q > 10$                                  |
|                  | IP3       | Không hợp lệ | Sai kiểu dữ liệu (số thực, chuỗi, rỗng)   |
| `ticketType`     | VP2       | Hợp lệ       | `"STANDARD"`                              |
|                  | VP3       | Hợp lệ       | `"VIP"`                                   |
|                  | VP4       | Hợp lệ       | `"STUDENT"`                               |
|                  | IP4       | Không hợp lệ | Chuỗi ngoài danh sách (`"ECONOMY"`, `""`) |
| `attendeeAge`    | VP5       | Hợp lệ       | $15 \le Age \le 65$                       |
|                  | IP5       | Không hợp lệ | $Age < 15$                                |
|                  | IP6       | Không hợp lệ | $Age > 65$                                |
|                  | IP7       | Không hợp lệ | Sai kiểu dữ liệu (số thực, chuỗi)         |

### Bước 3: Chọn giá trị đại diện

- `ticketQuantity`: VP1 = `5`, IP1 = `0`, IP2 = `15`, IP3 = `2.5`.
- `ticketType`: VP2 = `"STANDARD"`, VP3 = `"VIP"`, VP4 = `"STUDENT"`, IP4 = `"ECONOMY"`.
- `attendeeAge`: VP5 = `28`, IP5 = `10`, IP6 = `70`, IP7 = `"twenty"`.

### Bước 4: Sinh test case từ phân vùng

- **Gộp phân vùng hợp lệ:** nhiều phân vùng hợp lệ của các trường khác nhau nằm chung một test case.
- **Tách phân vùng không hợp lệ:** mỗi test case chỉ chứa duy nhất một phân vùng không hợp lệ, các trường còn lại giữ ở giá trị đại diện hợp lệ.

Mọi test case dùng chung precondition (form đã tải xong, người dùng đã đăng nhập) và các bước: nhập ba giá trị dưới đây rồi nhấn "Đặt vé".

| ID   | `ticketQuantity` | `ticketType`       | `attendeeAge`    | Kết quả mong đợi                                      |
| :--- | :--------------- | :----------------- | :--------------- | :---------------------------------------------------- |
| TC01 | `5` (VP1)        | `"STANDARD"` (VP2) | `28` (VP5)       | `APPROVED`, tổng tiền `500`                           |
| TC02 | `5` (VP1)        | `"VIP"` (VP3)      | `28` (VP5)       | `APPROVED`, tổng tiền `1000`                          |
| TC03 | `5` (VP1)        | `"STUDENT"` (VP4)  | `28` (VP5)       | `APPROVED`, tổng tiền `400`                           |
| TC04 | `0` (IP1)        | `"STANDARD"` (VP2) | `28` (VP5)       | `REJECTED`: số lượng vé phải là số nguyên từ 1 đến 10 |
| TC05 | `15` (IP2)       | `"STANDARD"` (VP2) | `28` (VP5)       | `REJECTED`: số lượng vé phải là số nguyên từ 1 đến 10 |
| TC06 | `2.5` (IP3)      | `"STANDARD"` (VP2) | `28` (VP5)       | `REJECTED`: số lượng vé phải là số nguyên từ 1 đến 10 |
| TC07 | `5` (VP1)        | `"ECONOMY"` (IP4)  | `28` (VP5)       | `REJECTED`: loại vé không hợp lệ                      |
| TC08 | `5` (VP1)        | `"STANDARD"` (VP2) | `10` (IP5)       | `REJECTED`: độ tuổi tham dự phải từ 15 đến 65         |
| TC09 | `5` (VP1)        | `"STANDARD"` (VP2) | `70` (IP6)       | `REJECTED`: độ tuổi tham dự phải từ 15 đến 65         |
| TC10 | `5` (VP1)        | `"STANDARD"` (VP2) | `"twenty"` (IP7) | `REJECTED`: độ tuổi tham dự phải từ 15 đến 65         |

## Related Notes

- Cơ chế, phân loại phân vùng và bốn quy tắc thiết kế: [[Equivalence_Partitioning]]
- Kỹ thuật bổ trợ bắt lỗi tại biên: Phân tích Giá trị Biên (Boundary Value Analysis).
- Tổng quan các kỹ thuật kiểm thử hộp đen: [[Black_Box_Testing_Techniques]]
- Cấu trúc và phương pháp thiết kế một test case: [[Test_Case]]
