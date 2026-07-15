# ADR: Lựa Chọn Phương Án Quản Lý Định Tuyến (Routing) - Route Constants vs NestJS RouterModule

- **Trạng thái**: Đã phê duyệt (Approved)
- **Tác giả**: Principal Engineer
- **Ngày**: 2026-07-15

---

## 1. Bối cảnh (Context)

Hệ thống cần cung cấp các đường dẫn xác thực (ví dụ: kích hoạt tài khoản qua email, reset mật khẩu) gửi đến người dùng. Đường dẫn này được cấu hình ở lớp HTTP (Controller) nhưng cần được đọc và sinh ra ở lớp xử lý nền tác vụ bất đồng bộ (Background Workers - BullMQ).

Chúng ta cần lựa chọn giữa:

- **Phương án A (Route Constants)**: Khai báo các đường dẫn dưới dạng hằng số TypeScript tĩnh (`as const`) và import vào Controller lẫn Mail Service.
- **Phương án B (NestJS RouterModule)**: Định nghĩa cấu hình tiền tố đường dẫn động thông qua Module của NestJS.

---

## 2. Phân tích bằng Tư duy Thành kiến Chứng thực (Verification-First/Confirmation Bias Thinking)

_Tư duy thành kiến chứng thực yêu cầu chúng ta tìm kiếm các bằng chứng kỹ thuật, kịch bản lỗi, và ràng buộc kiến trúc thực tế để chứng minh cho quyết định lựa chọn._

### Chứng thực 1: Khả năng hoạt động đa ngữ cảnh (Context Decoupling)

- **Kịch bản chứng thực**: `MailProcessor` chạy độc lập dưới dạng một BullMQ Worker lắng nghe Redis. Nó hoàn toàn nằm ngoài chu trình xử lý yêu cầu HTTP (HTTP Request Lifecycle) của NestJS.
- **Đối với RouterModule (Phương án B)**: Cấu hình phân cấp route được giải quyết động ở thời điểm khởi chạy HTTP Server của NestJS. Worker xử lý mail muốn biết `AuthController` được mount ở tiền tố nào sẽ phải tự truy vấn thủ công qua NestJS Application Tree bằng Reflection (rất nặng và dễ gây lỗi vòng lặp phụ thuộc - Circular Dependency).
- **Đối với Route Constants (Phương án A)**: Bản chất là TypeScript thuần. Mail Worker chỉ cần import hằng số route và sinh URL ngay lập tức mà không cần bất kỳ sự phụ thuộc nào vào NestJS HTTP Engine.
- **Bằng chứng**: Phương án A loại bỏ hoàn toàn sự phụ thuộc ngữ cảnh, giúp các Worker chạy ngầm hoạt động cực kỳ nhẹ nhàng và độc lập.

### Chứng thực 2: Kiểm tra lỗi ở thời điểm biên dịch (Compile-time Validation)

- **Kịch bản chứng thực**: Lập trình viên thay đổi đường dẫn kích hoạt từ `verify-email` thành `confirm`.
- **Đối với RouterModule (Phương án B)**: Việc map route là động ở Runtime. Nếu sửa sai trong file cấu hình module hoặc gõ nhầm chuỗi ký tự, TypeScript compiler (`bun run check-types`) sẽ **KHÔNG** phát hiện ra lỗi. Ứng dụng vẫn khởi chạy bình thường, chỉ khi người dùng click vào link email mới phát hiện lỗi 404 (Runtime Bug).
- **Đối với Route Constants (Phương án A)**: Sử dụng hằng số đóng băng (`as const`) để định nghĩa kiểu dữ liệu tĩnh. Nếu đổi tên constant hoặc giá trị của nó, TypeScript compiler sẽ lập tức báo lỗi đỏ lòm tại tất cả những nơi import hằng số đó mà chưa cập nhật (ở cả Controller và Mail Service).
- **Bằng chứng**: Phương án A ngăn chặn 100% lỗi gõ nhầm (typos) ngay trước khi code được đẩy lên môi trường Production nhờ công cụ kiểm tra kiểu tĩnh (Static Type Checking).

### Chứng thực 3: Khả năng chia sẻ tài nguyên với Frontend (Decoupled client sharing)

- **Kịch bản chứng thực**: Dự án phát triển thêm ứng dụng Frontend Next.js/React và cần gọi đúng API của Backend hoặc đồng bộ hóa các URL chuyển hướng.
- **Đối với RouterModule (Phương án B)**: Cấu hình định tuyến nằm sâu trong NestJS Module Decorators, hoàn toàn không thể export sang ứng dụng Frontend.
- **Đối với Route Constants (Phương án A)**: File hằng số route là TypeScript sạch, có thể dễ dàng xuất khẩu (export) sang một thư viện shared hoặc tạo SDK tự động cho phía Frontend sử dụng chung.
- **Bằng chứng**: Phương án A mở rộng khả năng đồng bộ hóa API toàn hệ thống.

---

## 3. Quyết định (Decision)

Chúng ta quyết định chọn **Phương án A: Sử dụng Route Constants chia theo từng Module (Feature-level Route Constants)**.

### Cách triển khai tiêu chuẩn:

1. Tạo file hằng số định vị route ngay trong Module: `src/modules/auth/auth.routes.ts`.
2. Sử dụng modifier `as const` để khóa chặt kiểu dữ liệu.
3. Import hằng số này vào `AuthController` và `MailService`.

```typescript
// src/modules/auth/auth.routes.ts
export const AUTH_ROUTES = {
  BASE: "auth",
  VERIFY_EMAIL: "verify-email",
} as const;
```

---

## 4. Hệ quả kiến trúc (Consequences)

- **Điểm tích cực**:
  - Đảm bảo tính an toàn kiểu dữ liệu cao nhất (Type Safety) từ compile-time.
  - Tách biệt logic nghiệp vụ định tuyến khỏi cấu hình framework.
  - Giảm thiểu tối đa lỗi 404 do gõ nhầm string (Magic Strings).
- **Điểm hạn chế**:
  - Phải viết thêm file hằng số cho mỗi module mới. Tuy nhiên, chi phí này rất nhỏ so với lợi ích bảo trì và vận hành mà nó mang lại.
