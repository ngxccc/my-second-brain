---
tags: [type/concept, status/permanent]
date: 2026-05-23
description: "Bộ 5 nguyên lý vàng thiết kế hướng đối tượng giúp code modular, linh hoạt và dễ bảo trì."
---

# SOLID Principles

## TL;DR

- **Bản chất**: SOLID là 5 nguyên lý thiết kế hướng đối tượng nhắm vào rigidity, fragility, immobility và viscosity.
- **Mục đích**: Làm hệ thống chịu được thay đổi requirement liên tục mà không phải sửa dây chuyền.
- **Điểm mấu chốt**: Mỗi nguyên lý là một cách cắt dependency; áp dụng máy móc sinh abstraction thừa, còn bỏ qua thì quay lại đúng bốn căn bệnh ban đầu.

## Core Concept

- **Tại sao nó tồn tại?** Trị tận gốc 4 "căn bệnh ung thư" của phần mềm:
  - _Rigidity (Cứng nhắc):_ hệ thống quá khó thay đổi; một sửa đổi nhỏ kéo theo chuỗi phản ứng buộc phải sửa hàng tá class khác.
  - _Fragility (Dễ vỡ):_ sửa code ở một module làm các phần không liên quan lăn đùng ra oẳng một cách bí ẩn.
  - _Immobility (Bất động):_ không thể tái sử dụng module hiện có vì chúng dính chặt (tight-coupling) vào thành phần khác.
  - _Viscosity (Nhớt nháp):_ làm sai (đắp vá bừa bãi) luôn dễ hơn làm đúng (refactor tử tế).
- **Giải quyết bài toán gì?** Thiết lập ranh giới rõ ràng giữa các thành phần: liên kết cao (High Cohesion) trong nội bộ module và phụ thuộc lỏng lẻo (Loose Coupling) giữa các module. Code trở nên "pluggable" như lắp LEGO.
- **Nó có thay thế cái gì hay không?** Không thay thế Design Patterns mà là nền móng để các pattern dựa vào; nó tiễn tư duy "chạy được là ăn mừng" ra chuồng gà.
- **Áp dụng vào những dự án nào?**
  - _Bắt buộc CÓ:_ dự án có lifespan > 6 tháng, hệ thống core product, thư viện/SDK dùng chung, hoặc hệ thống muốn triển khai [[Clean_Architecture]] chuẩn chỉnh.
  - _Tuyệt đối KHÔNG:_ script chạy một lần (One-off scripting), MVP/Prototype cực nhỏ cần validate thị trường trong 2-3 ngày rồi vứt đi. Đừng lọt hố "Premature Abstraction".

### Bóc tách 5 nguyên lý

#### 1. S - Single Responsibility Principle

> "A class should have one, and only one, reason to change."

- **Bản chất:** một class/module chỉ nên chịu trách nhiệm cho duy nhất một nhóm tác nhân (Actor). Đừng tạo "God Class" ôm đồm vừa xử lý logic, vừa query DB, vừa gửi Mail và validate UI.

#### 2. O - Open/Closed Principle

> "Software entities should be open for extension, but closed for modification."

- **Bản chất:** thêm tính năng mới bằng cách viết code mới (kế thừa, implement interface, polymorphism) thay vì sửa code cũ đang chạy ổn định, nhờ đó triệt tiêu rủi ro làm hỏng thứ đang tốt.

#### 3. L - Liskov Substitution Principle

> "Subtypes must be substitutable for their base types."

- **Bản chất:** class con phải thực thi trọn vẹn hành vi của class cha mà không làm thay đổi tính đúng đắn của chương trình:

```typescript
// Phá vỡ LSP: class con ném NotImplementedException, hoặc client buộc phải kiểm tra kiểu con cụ thể
if (child instanceof ConcreteType) {
  /* client phải biết chi tiết -> LSP đã vỡ */
}
```

#### 4. I - Interface Segregation Principle

> "Clients should not be forced to depend on methods they do not use."

- **Bản chất:** thà nhiều interface nhỏ tập trung từng hành vi (role interface) còn hơn ép client phụ thuộc một "Mega Interface" chứa hàng chục method dư thừa.

#### 5. D - Dependency Inversion Principle

> "Depend upon abstractions, not concretions."

- **Bản chất:**
  1. Module cấp cao không được phụ thuộc trực tiếp module cấp thấp; cả hai phải phụ thuộc vào Abstraction (Interface).
  2. Abstraction không được phụ thuộc vào chi tiết; chi tiết phải phụ thuộc vào Abstraction.

## Trade-offs

- Tăng độ phức tạp cấu trúc ban đầu của hệ thống.
- Bùng nổ số lượng class, interface, file khiến dev mới vào dự án dễ chóng mặt khi trace code.
- Đòi hỏi sự kỷ luật và năng lực thiết kế hệ thống tốt từ đội ngũ phát triển.
- Hình dạng cụ thể của bộ nguyên lý này trong code: [[SOLID_Principles_Code_Example]].

## Related Notes

- Ví dụ code vi phạm và code chuẩn SOLID: [[SOLID_Principles_Code_Example]]
- DIP được cụ thể hóa thành interface: [[Interface_Driven_Design]]
- Cách phát hiện vi phạm SOLID sớm: [[Test_Driven_Design]]
- Kết quả khi áp dụng đủ 5 nguyên lý: [[Clean_Architecture]]
- Cách hiện thực DIP trong code: [[Dependency_Injection]]
