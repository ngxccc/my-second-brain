---
tags: [type/moc, topic/project, topic/app-development]
status: active
created_at: Friday, January 30th 2026, 9:14:32 am +07:00
updated_at: Friday, January 30th 2026, 9:15:09 am +07:00
aliases: [English App Specs, Food Rescue Architecture]
---

# 📱 English Learning App MOC

## 💡 TL;DR
Tài liệu tổng hợp kiến trúc, nghiệp vụ và công nghệ cho dự án App học tiếng Anh (Capstone Project).
**Mục tiêu:** Xây dựng ứng dụng học từ vựng thông minh sử dụng thuật toán lặp lại ngắt quãng.

---

## 🧠 Pedagogy & Learning Science (Phương pháp sư phạm)
Core value của App - Tại sao User học trên app này lại giỏi hơn cách truyền thống?

* [[Spaced_Repetition_SM2]]: Thuật toán "trái tim" của App, tính toán điểm rơi của trí nhớ để nhắc ôn tập.
* [[Phonetic_Chunking]]: Phương pháp học từ vựng theo cụm âm (thay vì list tuyến tính), giúp nhớ lâu hơn.
* [[Cognitive_Strain_UX]]: (Desirable Difficulty) UX bắt user gõ chính xác để khắc sâu ký ức, chống học vẹt.
* [[Linguistic_False_Friends]]: Xử lý các từ đồng dạng dễ gây nhầm lẫn (Homographs).

---

## 🛠️ Technical Architecture (Kiến trúc kỹ thuật)

### Frontend & UX
* [[Next_Intl]]: Giải pháp Đa ngôn ngữ (i18n) chuẩn chỉ cho App Router.
* [[React_Flow_Visualization]]: Dùng để vẽ Mindmap các cụm từ vựng (Phonetic Clusters).
* [[Feature_Based_Folder_Structure]]: Cấu trúc thư mục để quản lý code FE không bị rối.

### Backend & Offline Logic
* [[Offline_Sync_Queue]]: Cơ chế "Lưu trước - Gửi sau" giúp user học được trên máy bay/mất mạng.
* [[Client_Side_Encryption]]: Bảo vệ dữ liệu nhạy cảm (Offline Queue) trong LocalStorage.

### System Design Rules
* [[Modular_Monolith]]: Kiến trúc tổng thể Backend.
* [[Public_Interface_Pattern]]: Cách các module (Auth, Learning, Payment) giao tiếp với nhau.
* [[Shared_Module_Dependency_Rule]]: Quy tắc tổ chức folder Shared để tránh Circular Dependency.

---

## 📅 Project Management
* [[01_Project_Roadmap]]: Kế hoạch tổng thể.
* [[Standard_Project_Timeline_SOP]]: Quy trình 16 tuần từ Design đến Deploy.

---

## 🔗 Related MOCs
* [[000_Tech_MOC]] (Kho kiến thức kỹ thuật dùng chung)