---
tags:
  - type/method
  - topic/knowledge-management
  - topic/organization
  - topic/obsidian
status: evergreen
created_at: 2026-01-29
---

# Map of Content (MOC)

## 💡 TL;DR
Một loại ghi chú đặc biệt đóng vai trò như "Mục lục động" hoặc "Bản đồ chủ đề", giúp gom nhóm và tổ chức các ghi chú rời rạc ([[Atomic_Note]]) lại với nhau theo một ngữ cảnh cụ thể để dễ dàng truy xuất và ôn tập.

---

## 🔍 Deep Dive (Phân tích sâu)

### 1. The Problem (Vấn đề)
Khi bạn áp dụng [[Zettelkasten_Method]], số lượng ghi chú sẽ tăng lên hàng nghìn. Nếu chỉ dựa vào thanh tìm kiếm (Search) hoặc Graph View rối rắm, bạn sẽ rơi vào trạng thái "tê liệt vì hỗn loạn" (Chaos Paralysis). Bạn có kiến thức, nhưng không biết bắt đầu đọc từ đâu.

### 2. The Solution: MOC (Giải pháp)
MOC giống như một cái **Hub** (Trung tâm). Nó không chứa nội dung chi tiết, mà chứa các đường liên kết (Links) trỏ đến các nội dung chi tiết.
* **Bottom-up Organization:** Bạn không tạo MOC trước. Bạn viết nhiều note nhỏ trước (Modular Monolith, Public Interface...). Khi thấy chúng có liên quan, bạn mới tạo một MOC tên là `Software_Architecture_MOC` để gom chúng lại.

### 3. Types of MOC (Các loại MOC)
* **Topic MOC:** Gom theo chủ đề (VD: `OOP_MOC`, `React_MOC`).
* **Project MOC:** Gom tài liệu cho một dự án (VD: `DoAn_TotNghiep_MOC` chứa link tới Requirement, Database Design, Meeting Notes).

---

## 💻 Code / Example (Ví dụ thực tế)

Đây là ví dụ về nội dung của một file MOC thực tế trong Obsidian của bạn.

### File: `000_Software_Architecture_MOC.md`

```markdown
# 🏗️ Software Architecture MOC

## Core Patterns
Các mẫu thiết kế kiến trúc nền tảng cho Backend.
- [[Modular_Monolith]]: Kiến trúc lai tối ưu cho start-up.
- [[Microservices]]: Dùng khi cần scale lớn.

## Clean Code Principles
Quy tắc viết code sạch và dễ bảo trì.
- [[Public_Interface_Pattern]]: Cách giao tiếp giữa các module.
- [[Shared_Module_Dependency_Rule]]: Quy tắc dòng chảy dữ liệu 1 chiều.
- [[Dependency_Injection]]: Kỹ thuật tiêm sự phụ thuộc.

## Frontend Architecture
- [[Feature_Based_Folder_Structure]]: Cách tổ chức thư mục React/Next.js.
```

👉 *Lợi ích:* Khi cần ôn lại kiến thức Kiến trúc, bạn chỉ cần vào file này là thấy toàn bộ bức tranh tổng quan.

---

## ⚠️ Edge Cases / Pitfalls (Cạm bẫy)

* **Rigid Structure (Cứng nhắc):** Biến MOC thành Folder ảo.
    * *Lưu ý:* MOC rất linh hoạt. Một note `Modular_Monolith` có thể nằm trong cả `Architecture_MOC` lẫn `Backend_MOC`. Đừng tư duy cứng nhắc là "1 file chỉ được thuộc về 1 MOC".
* **Maintenance Debt (Nợ bảo trì):** Tạo MOC xong vứt đó, không update.
    * *Fix:* MOC phải là "Living Document". Khi viết thêm note mới về Architecture, hãy nhớ quay lại file MOC này và add link vào.

---

## 🔗 Related Keywords
* [[Zettelkasten_Method]] (Phương pháp tạo note gốc)
* [[Atomic_Note]] (Thành phần cấu tạo nên MOC)
* [[Graph_View]] (MOC chính là các "Hub" lớn trên biểu đồ Graph)