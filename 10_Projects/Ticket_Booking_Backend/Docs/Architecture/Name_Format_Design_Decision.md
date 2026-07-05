---
tags: [type/concept, topic/tech, status/permanent]
date: 2026-07-05
aliases:
  [
    Thiet ke ho ten nguoi dung,
    Name Format Design Decision,
    firstName vs lastName,
    fullName vs firstLastname,
  ]
---

# Thiết Kế Cấu Trúc Họ Tên Người Dùng (Name Format Design Decision)

## TL;DR

Quyết định kiến trúc: **Giữ nguyên duy nhất 1 trường `name` (hoặc `fullName`) đại diện cho toàn bộ họ tên người dùng trong Database và DTO.** Không tách ra thành `firstName` (Tên) và `lastName` (Họ) để đảm bảo tối ưu hóa trải nghiệm người dùng (UX) đăng ký nhanh gọn, tránh rắc rối phân tách tên đa văn hóa (đặc biệt là tên Việt Nam), và giảm thiểu tài nguyên nâng cấp CSDL (Database Schema Migration).

---

## Bảng So Sánh Chi Tiết (Trade-off Matrix)

| Tiêu chí                          | Phương án 1: Một trường duy nhất (`fullName` / `name`)                              | Phương án 2: Tách đôi (`firstName` + `lastName`)                              |
| :-------------------------------- | :---------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| **Trải nghiệm đăng ký (UX)**      | **Tốt nhất**: Chỉ cần 1 ô nhập duy nhất, điền họ tên tự nhiên.                      | **Kém hơn**: Buộc người dùng nhập 2 ô khác nhau, gây mất thời gian.           |
| **Tính đa văn hóa (i18n)**        | **Hoàn hảo**: Phù hợp cho mọi quốc gia (Việt Nam, Anh, Tây Ban Nha, Trung Quốc...). | **Rắc rối**: Người Việt thường bối rối không biết điền "Tên đệm" vào ô nào.   |
| **Database & Schema Migration**   | **Không đổi**: Kế thừa cột `name` sẵn có, không cần Migration CSDL.                 | **Phức tạp**: Cần chạy SQL Migration để xóa cột cũ, thêm 2 cột mới.           |
| **Độ phức tạp lập trình API**     | **Đơn giản**: Chỉ truyền nhận 1 thuộc tính `fullName`.                              | **Nhức đầu**: Phải ghép chuỗi `firstName + lastName` khi cần hiển thị đầy đủ. |
| **Cá nhân hóa (Personalization)** | **Trung bình**: Cần dùng hàm cắt chuỗi để lấy ra tên riêng (First Name).            | **Tốt nhất**: Có sẵn trường `firstName` để gửi mail tự động "Chào Nam,".      |

---

## Giải Pháp Giải Quyết Hạn Chế Của Phương Án 1

Hạn chế lớn nhất của việc lưu chung 1 trường là khi hệ thống gửi email tự động hoặc hiển thị thông báo chào mừng cá nhân hóa (ví dụ: muốn hiển thị "Chào Nam," thay vì "Chào Nguyễn Văn Nam,").

Chúng ta giải quyết triệt để vấn đề này bằng một **hàm Helper đơn giản** ở tầng ứng dụng (Application Level) khi cần thiết:

```typescript
/**
 * Trích xuất tên riêng (First Name) từ họ tên đầy đủ
 * @param fullName Họ tên đầy đủ (Ví dụ: "Nguyễn Văn Nam")
 * @returns Tên riêng cuối cùng (Ví dụ: "Nam")
 */
export function extractFirstName(fullName: string): string {
  const trimmed = fullName.trim();
  const parts = trimmed.split(/\s+/);
  return parts[parts.length - 1] ?? "";
}

// Sử dụng:
const displayName = extractFirstName(user.name); // "Nam"
```

Giải pháp này hoàn toàn đáp ứng được tính năng cá nhân hóa mà không làm phức tạp hóa cấu trúc CSDL PostgreSQL hay làm suy giảm UX đăng ký của khách hàng.

---

## Related Notes & MOC Backlinks

- Thư mục MOC: [[000_Ticket_Booking_MOC]]
- Đặc tả cấu trúc DTO đăng ký: [[register.dto]]
- Quy chuẩn lập trình Drizzle ORM: [[Drizzle_v1_RC4_Coding_Standards]]
