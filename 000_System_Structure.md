---
tags:
  - meta/structure
  - guide
  - documentation
status: permanent
created_at: 2026-01-29
---

# 🗺️ My Second Brain Structure Guide

## 💡 TL;DR
Tài liệu quy định chức năng và quy tắc lưu trữ cho từng thư mục trong hệ thống Second Brain, dựa trên phương pháp **PARA Modified** (Inbox + Projects + Areas + Resources + Archives).

---

## 🏗️ Directory Breakdown (Chi tiết cấu trúc)

### 📥 00_Inbox (Hộp thư đến)
* **Mục đích:** Nơi "đổ rác" tạm thời. Bắt lấy ý tưởng nhanh, ghi chú thô, copy-paste từ web.
* **Quy tắc:**
    * Không cần định dạng đẹp.
    * **Phải dọn dẹp (Review):** Ít nhất 1 tuần/lần.
    * Sau khi xử lý, file phải được đổi tên chuẩn, gắn tag và di chuyển sang thư mục `10`, `20` hoặc `30`.

### 🚀 10_Projects (Dự án đang chạy)
* **Mục đích:** Chứa các dự án **có mục tiêu cụ thể** và **có thời hạn (Deadline)**.
* **Ví dụ:** `Food_Rescue_App`, `Do_An_Tot_Nghiep`, `Portfolio_Website`.
* **Quy tắc:**
    * Chứa tài liệu đặc thù của dự án đó (Requirement, Design, Plan).
    * Khi dự án hoàn thành -> Move toàn bộ folder sang `40_Archives`.

### 🌳 20_Areas (Lĩnh vực trách nhiệm)
* **Mục đích:** Các khía cạnh cần duy trì lâu dài, **không có deadline**.
* **Ví dụ:** `Finances` (Tài chính), `Health` (Sức khỏe), `University` (Hồ sơ trường lớp), `Coding_Skills`.
* **Quy tắc:**
    * Chứa các ghi chú mang tính theo dõi, nhật ký, log.
    * Ví dụ: File `Spending_Log_2026.md` nằm trong `Finances`.

### 📚 30_Resources (Kho kiến thức)
* **Mục đích:** "Thư viện" chứa kiến thức, concept, tài liệu tham khảo có thể dùng lại cho nhiều dự án khác nhau.
* **Ví dụ:**
    * `Concepts/`: `Modular_Monolith.md`, `Zettelkasten.md`.
    * `Tech/`: `React_Hooks_Cheatsheet.md`, `Docker_Setup.md`.
* **Quy tắc:**
    * Nơi chứa **Atomic Notes** (Ghi chú nguyên tử).
    * Viết dưới dạng Generic (không gắn liền với dự án cụ thể) để tái sử dụng.
    * Sử dụng nhiều Backlinks `[[Link]]` tại đây.

### 🗄️ 40_Archives (Lưu trữ lạnh)
* **Mục đích:** Kho lưu trữ những thứ đã hoàn thành hoặc không còn hoạt động.
* **Ví dụ:** `Project_Nam_Nhat`, `Ideas_Old_2024`.
* **Quy tắc:**
    * Không được xóa file, chỉ di chuyển vào đây.
    * Giúp Inbox và Projects luôn sạch sẽ, focus vào hiện tại.

### ⚙️ 99_Meta (Cấu hình hệ thống)
* **Mục đích:** Chứa các file cấu hình của Obsidian và tài nguyên hệ thống.
* **Nội dung:**
    * `Templates/`: Các file mẫu (Atomic Note Template, Project Template).
    * `Attachments/`: Ảnh, file PDF được paste vào note.
    * `Scripts/`: Dataview scripts, CSS custom.

---

## 🔄 Workflow (Quy trình xử lý)

1.  **Capture:** Ghi nhanh vào `00_Inbox`.
2.  **Process:** Cuối tuần, review `00_Inbox`.
    * Nếu là task dự án -> Move vào `10_Projects`.
    * Nếu là kiến thức mới -> Viết lại thành Atomic Note -> Move vào `30_Resources`.
    * Nếu là việc cá nhân -> Move vào `20_Areas`.
3.  **Archive:** Khi xong dự án `Food_Rescue_App` -> Move folder đó vào `40_Archives`.

---

## 🔗 Related Concepts
* [[Zettelkasten_Method]]
* [[PARA_Method]]