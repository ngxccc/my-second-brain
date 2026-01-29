---
tags: [type/plan, topic/project-management, project/english-app]
status: active
created_at: Thursday, January 29th 2026, 9:05:50 pm +07:00
updated_at: Thursday, January 29th 2026, 9:45:10 pm +07:00
aliases: [English App Sprints, Implementation Plan]
---

# Project Roadmap: English Learning App

## 💡 TL;DR
Kế hoạch triển khai chi tiết chia làm 4 Sprints (4 tuần) để biến ý tưởng App học tiếng Anh thành sản phẩm chạy được (MVP), tập trung vào các tính năng cốt lõi: Mindmap, Flashcard và Thuật toán SM-2.

---

## 🧠 Why use it?
*(Lý do tồn tại của concept này. Nó giải quyết vấn đề gì mà cách cũ không làm được?)*
- **Problem:** Nếu chỉ có "ý tưởng" mà không có task cụ thể, bạn sẽ rất dễ bị "lạc trôi" (làm cái này chưa xong đã nhảy sang cái kia) hoặc bị "ngợp" vì khối lượng công việc.
- **Solution:** Chia nhỏ dự án thành các đợt tấn công ngắn hạn (Sprints). Mỗi Sprint có mục tiêu rõ ràng (Goal) và định nghĩa hoàn thành (Definition of Done).
- **vs Alternative:** (So với To-do list truyền thống) Roadmap này có tính thời gian và sự phụ thuộc (Dependency) - phải xong Móng (Sprint 1) mới xây được Tường (Sprint 2).

## 🔍 Deep Dive
*(Chiến lược phân bổ nguồn lực cho 4 Sprint)*

1.  **Sprint 1 (The Foundation):** Xây dựng hạ tầng. Database, API cơ bản. Chưa cần UI đẹp.
2.  **Sprint 2 (The Visuals):** Tích hợp công nghệ khó nhất ([[React_Flow_Visualization]]) để hiển thị Mindmap.
3.  **Sprint 3 (The Interaction):** Cơ chế học tập. Flashcard, Input check, Logic đúng/sai.
4.  **Sprint 4 (The Brain):** Tích hợp trí tuệ. Thuật toán [[Spaced_Repetition_SM2]] để nhắc bài.

---

## 💻 Code Snippet / Implementation
*(Checklist hành động cụ thể - Copy vào Obsidian dùng plugin "Tasks" hoặc tick tay)*

### Sprint 1: The Foundation (Tuần 1)
- [ ] **Setup:** Init Next.js + Express/NestJS Repo. Config Linter/Prettier.
- [ ] **Database:** Setup MongoDB Atlas. Thiết kế Schema `User`, `Vocabulary`, `Lesson`.
- [ ] **API:**
    - [ ] `POST /auth/login` (Fake token cũng được).
    - [ ] `GET /vocab-groups` (Lấy danh sách bài học).
    - [ ] `POST /vocab` (Seed data mẫu).
- [ ] **UI:** Layout chung (Header, Sidebar) rỗng.

### Sprint 2: The Visuals (Tuần 2)
- [ ] **Tech:** Cài đặt React Flow.
- [ ] **Feature:**
    - [ ] Render Node từ dữ liệu JSON API.
    - [ ] Custom Node Component (Hiển thị từ vựng + Âm thanh).
    - [ ] Xử lý sự kiện: Click Node -> Phát loa.

### Sprint 3: The Interaction (Tuần 3)
- [ ] **Feature:** Màn hình học (Study Mode).
    - [ ] Component Flashcard (Flip animation).
    - [ ] Input field (Bắt buộc gõ đúng 100% mới qua màn).
- [ ] **Logic:**
    - [ ] So sánh string (Case insensitive).
    - [ ] Xử lý Feedback (Rung màn hình khi sai).

### Sprint 4: The Brain (Tuần 4)
- [ ] **Algorithm:** Implement hàm tính SM-2 (trong note [[Spaced_Repetition_SM2]]).
- [ ] **Database:** Thêm field `next_review_date`, `interval`, `ef` vào Collection `UserVocab`.
- [ ] **UI:** Dashboard hiển thị "Hôm nay cần ôn 10 từ".

---

## ⚠️ Edge Cases / Pitfalls

_(Đừng bỏ qua phần này. Kinh nghiệm xương máu nằm ở đây)_

### Scope Creep (Phình to tính năng)

- ❌ **Don't:** Đang làm Sprint 2 (Mindmap) tự nhiên muốn thêm tính năng "Chat với AI" cho ngầu.
    - *Hậu quả:* Sprint 2 không xong, Sprint 3 bị delay -> Bể dự án.
- ✅ **Do:** Ghi ý tưởng đó vào note `Backlog` (Kho ý tưởng) để làm sau (nếu còn thời gian ở Phase Polish).

### Integration Hell (Địa ngục tích hợp)

- ❌ **Don't:** Frontend và Backend làm việc độc lập hoàn toàn, đến cuối tuần mới ghép vào.
    - *Hậu quả:* Lỗi CORS, lỗi lệch tên biến API, sửa mất cả ngày.
- ✅ **Do:** Chốt contract API (Swagger/Postman) ngay từ đầu Sprint. Mock data ở FE để chạy thử trước.

---

## 🚨 Troubleshooting

*(Update khi gặp lỗi fix được hoặc chưa fix được cũng vứt vào luôn để biết)*

### 🔧 Bể Deadline Sprint

_(Hết tuần mà chưa xong task)_
* **Nguyên nhân:** Đánh giá thấp độ khó (Underestimation). Ví dụ: React Flow khó hơn tưởng tượng.
* **Fix:** Cắt bớt tính năng. Ví dụ: Thay vì Custom Node đẹp lung linh, dùng Default Node của thư viện trước. Ưu tiên "Chạy được" hơn "Đẹp".

### 🔧 Data Seed quá ít

_(App chạy nhưng nhìn trống rỗng)_
* **Nguyên nhân:** Lười nhập liệu vào DB.
* **Fix:** Viết một script `seed.ts` để loop và insert 100 từ vựng giả (Dummy Data) vào DB ngay lập tức. Đừng nhập tay từng cái.

---

## 📄 Advanced Mechanics

*(Những kiến thức sâu rộng hơn về phần này)*

### Definition of Done (DoD)
Một task chỉ được coi là "Xong" khi:
1.  Code chạy không lỗi logic.
2.  Đã commit và push lên Git.
3.  Không làm hỏng các tính năng cũ (Regression).

### Velocity Tracking
(Nếu rảnh) Ghi lại số task hoàn thành mỗi tuần để biết tốc độ làm việc của mình. Giúp ước lượng tốt hơn cho các dự án sau.

---

## 🔗 Connections

### Internal

- [[Standard_Project_Timeline_SOP]] (Quy trình tổng thể bao trùm Roadmap này)
- [[React_Flow_Visualization]] (Tech chính của Sprint 2)
- [[Spaced_Repetition_SM2]] (Tech chính của Sprint 4)

### External

- [Scrum Guide](https://scrumguides.org/)
- [Jira / Trello](https://trello.com/) (Dùng tool này để quản lý task cụ thể)
