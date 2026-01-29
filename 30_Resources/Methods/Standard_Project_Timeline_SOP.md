---
tags: [type/method, topic/engineering-management, topic/productivity]
status: evergreen
created_at: Thursday, January 29th 2026, 9:06:47 pm +07:00
updated_at: Thursday, January 29th 2026, 9:27:39 pm +07:00
aliases: [Capstone Roadmap, Software Dev Lifecycle, Project SOP]
---

# Standard Project Timeline SOP (Quy trình làm đồ án chuẩn)

## 💡 TL;DR
Quy trình 16 tuần tiêu chuẩn để xây dựng phần mềm từ con số 0 đến khi bảo vệ/deploy, giúp cân bằng giữa việc code (Technical) và việc bán hàng (Documentation/Presentation).

---

## 🧠 Why use it? (Tại sao dùng?)
*(Lý do tồn tại của concept này. Nó giải quyết vấn đề gì mà cách cũ không làm được?)*
- **Problem:** Sinh viên/Dev thường mắc bệnh "cắm đầu vào code" ngay từ ngày 1 mà không có thiết kế, dẫn đến giữa đường phải đập đi xây lại (Refactor Hell) hoặc code xong nhưng không kịp làm slide/báo cáo.
- **Solution:** Chia dự án thành 4 giai đoạn rõ ràng: Design -> MVP -> Polish -> Defense.
- **vs Alternative:** So với Waterfall truyền thống (quá cứng nhắc) hay Agile sai cách (loạn xà ngầu), quy trình này lai tạo (Hybrid): Cứng ở giai đoạn đầu (DB Design) và Linh hoạt ở giai đoạn code (Sprints).

## 🔍 Deep Dive (Cơ chế hoạt động)
*(Phân tích 4 giai đoạn cốt tử)*

1. **Phase 1: The Blueprint (Khoan hãy Code):** Tập trung vào User Flow và Database. Sai DB là chết.
2. **Phase 2: The Core / MVP (Xương sống):** Chỉ làm chức năng chính (Happy Path). Xấu cũng được, nhưng logic phải đúng.
3. **Phase 3: The Polish (Đắp thịt):** Lúc này mới lo CSS đẹp, Animation, UX xịn.
4. **Phase 4: The Defense (Về đích):** Code xong mà không biết demo/báo cáo là điểm kém. Dành hẳn 1 tháng cuối cho việc này.

---

## 💻 Code Snippet / Implementation
*(Checklist hành động cho 16 tuần)*

### Phase 1: The Blueprint (Tuần 1-3)
- [ ] **Tuần 1: Requirement Analysis**
    - [ ] Viết User Flow (Vào đâu -> Bấm gì -> Ra gì).
    - [ ] Chốt danh sách tính năng (Must-have vs Nice-to-have).
- [ ] **Tuần 2: Database Modeling (QUAN TRỌNG NHẤT)**
    - [ ] Vẽ ERD (Entity Relationship Diagram).
    - [ ] Review quan hệ (1-1, 1-N, N-N).
- [ ] **Tuần 3: Tech Stack & Setup**
    - [ ] Init Repo, cài Linter, Prettier, Husky.
    - [ ] Setup cấu trúc thư mục ([[Feature_Based_Folder_Structure]]).

### Phase 2: The Core / MVP (Tuần 4-8)
- [ ] **Tuần 4-5: Auth & Gatekeeper**
    - [ ] Login/Register/Forgot Pass.
    - [ ] Role Guard (Admin vs User).
- [ ] **Tuần 6-8: Core Domain Features**
    - [ ] CRUD các Entity chính.
    - [ ] Kết nối FE-BE cơ bản.

### Phase 3: The Polish & Experience (Tuần 9-12)
- [ ] **Tuần 9: UI/UX Refinement**
    - [ ] Loading State (Skeleton), Error Toast.
    - [ ] Responsive Mobile.
- [ ] **Tuần 10: Advanced Features**
    - [ ] Real-time, Charts, AI (tính năng điểm cộng).
- [ ] **Tuần 11: Integration Testing**
    - [ ] Test luồng E2E (End-to-End).

### Phase 4: The Defense Prep (Tuần 13-16)
- [ ] **Tuần 13: Deployment**
    - [ ] Deploy Vercel/Railway/VPS.
    - [ ] Mua Domain (nếu cần).
- [ ] **Tuần 14: Documentation**
    - [ ] Viết báo cáo (Word/LaTeX).
    - [ ] Viết README.md Github ([[Project_Portfolio_Readme]]).
- [ ] **Tuần 15-16: Presentation**
    - [ ] Làm Slide.
    - [ ] Tập dượt Demo (Scripted Demo).

---

## ⚠️ Edge Cases / Pitfalls (Cạm bẫy)

_(Đừng bỏ qua phần này. Kinh nghiệm xương máu nằm ở đây)_

### Feature Creep

- ❌ **Don't (Feature Creep):** Thấy còn thời gian, cố nhồi thêm tính năng mới vào sát ngày thi.
    - *Hậu quả:* Bug phát sinh, phá hỏng cả hệ thống đang chạy ngon.
- ✅ **Do (Code Freeze):** Đóng băng code trước ngày bảo vệ 1 tuần. Chỉ fix bug, tuyệt đối không thêm feature.

### Demo Effect

- ❌ **Don't (Demo Ngẫu Hứng):** Lên hội đồng mới bắt đầu nghĩ xem nên bấm vào đâu.
    - *Hậu quả:* Dính "Demo Effect" (Lỗi màn hình xanh/Crash đúng lúc quan trọng).
- ✅ **Do (Scripted Demo):** Chuẩn bị kịch bản từng bước (Step 1: Login user A -> Step 2: Bấm nút B). Quay video dự phòng nếu Live Demo chết.

---

## Troubleshooting

*(Xử lý khủng hoảng khi trễ deadline)*

* **Vấn đề:** Đến tuần 8 vẫn chưa xong Phase 2 (MVP).
* **Giải pháp:** Cắt bỏ ngay lập tức các tính năng "Nice-to-have" (Ví dụ: Dark mode, Chat real-time, Quên mật khẩu qua email). Hardcode dữ liệu mẫu (Seed Data) thay vì làm giao diện Admin nhập liệu nếu không kịp.
* **Vấn đề:** Database thiết kế sai, giờ code không map được.
* **Giải pháp:** Dừng code ngay. Họp team fix lại DB Schema. Thà mất 2 ngày sửa DB còn hơn cố code tiếp trên nền móng sai.

---

## Advanced Mechanics

*(Dành cho team > 3 người)*

* **Git Flow:** Áp dụng chặt chẽ. `main` là production, `develop` là nơi merge code, `feat/x` là feature riêng.
* **CI/CD Pipeline:** Setup Github Actions để tự động chạy test và lint mỗi khi tạo Pull Request.
* **Mock API:** Frontend và Backend làm song song. BE chưa xong API thì FE tự mock data (dùng JSON server hoặc Mock Service Worker) để làm UI trước.

---

## 🔗 Connections (Mạng lưới)

### Internal (Trong não)

- [[Modular_Monolith]] (Kiến trúc code cho Phase 2)
- [[Feature_Based_Folder_Structure]] (Setup tuần 3)
- [[Project_Roadmap]] (Kế hoạch cụ thể cho từng dự án áp dụng SOP này)

### External (Nguồn tham khảo)
- [Atomic Design Methodology](https://atomicdesign.bradfrost.com/)
- [The Pragmatic Programmer (Sách gối đầu giường)](https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/)
