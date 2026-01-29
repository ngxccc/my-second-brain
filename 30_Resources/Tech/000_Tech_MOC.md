---
tags: [type/moc, topic/technology, topic/software-engineering]
status: evergreen
created_at: Thursday, January 29th 2026, 5:48:38 pm +07:00
updated_at: Thursday, January 29th 2026, 7:06:47 pm +07:00
---

# 🛠️ Tech Knowledge MOC

## 💡 TL;DR
Bản đồ tổng hợp các kiến thức kỹ thuật, kiến trúc phần mềm, mẫu thiết kế (Design Patterns) và tư duy lập trình (Engineering Mindset) đã được tinh lọc để tái sử dụng cho các dự án.

---

## 🏗️ Software Architecture (Kiến trúc phần mềm)
Các mô hình tổ chức code và hệ thống Backend.

### Architectural Styles
* [[Modular_Monolith]]: Kiến trúc "lai" tối ưu, chia theo Domain nhưng deploy một khối. Lựa chọn số 1 cho đồ án/startup.
* [[Shared_Module_Dependency_Rule]]: Quy tắc sống còn để quản lý folder `Shared`, tránh vòng lặp phụ thuộc (Circular Dependency).

### Communication Patterns
* [[Public_Interface_Pattern]]: (Facade) Cách thiết kế cổng giao tiếp an toàn giữa các module, đảm bảo tính đóng gói (Encapsulation).

---

## 🎨 UX/UI & Product Engineering
Tâm lý học hành vi áp dụng vào thiết kế sản phẩm công nghệ.

* [[Cognitive_Strain_UX]]: (Desirable Difficulty) Kỹ thuật tạo độ khó chủ đích (ép gõ chính xác, giới hạn thời gian) để tăng hiệu quả ghi nhớ cho ứng dụng giáo dục.

---

## ⚡ Frontend Engineering (Coming Soon)
* *(Dành cho các note về React, Next.js, State Management...)*
* [[Feature_Based_Folder_Structure]] *(Gợi ý: Note này nên viết để quản lý code FE)*

## 💾 Database & Infrastructure (Coming Soon)
* *(Dành cho các note về MongoDB, SQL, Docker...)*

---

## 🔗 Related MOCs
* [[000_Concepts_MOC]] (Các khái niệm tư duy trừu tượng)
* [[Project_DoAn_MOC]] (Dự án thực tế đang áp dụng các tech này)