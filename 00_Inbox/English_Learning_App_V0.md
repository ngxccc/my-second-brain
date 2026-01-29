### 📦 PROJECT SUMMARY: ENGLISH LEARNING APP (Hardcore Mode)

#### 1. Kiến trúc hệ thống (Architecture)

- **Backend:** Chốt kèo **Modular Monolith**.
    
    - Code chung 1 repo, deploy 1 cục cho gọn (phù hợp startup/đồ án).
        
    - Chia folder theo **Domain/Feature** (`modules/auth`, `modules/lesson`, `modules/payment`).
        
    - **Quy tắc vàng:** Áp dụng **Public Interface Pattern** (Facade) để giao tiếp giữa các module. Cấm `import` chéo ruột gan của nhau.
        
    - **Shared Module:** Chỉ chứa Utils/Helpers vô tri (Date, Logger), tuân thủ dòng chảy 1 chiều (Modules -> Shared, cấm ngược lại).
        
- **Frontend:** **Next.js (App Router)**.
    
- **Database:** MongoDB hoặc PostgreSQL (JSONB) để lưu cấu trúc bài học linh hoạt.
    

#### 2. Tính năng "Killer": Offline First & Sync

- **Cơ chế học Offline:**
    
    - Không tải toàn bộ data lúc đầu (nặng máy). Dùng chiến thuật **Lazy Caching / On-demand**.
        
    - User bấm bài nào -> Fetch API bài đó -> Lưu xuống **IndexedDB** (dùng thư viện `Dexie.js`) -> Học.
        
    - Lý do chọn IndexedDB: Lưu được Blob (Audio/Image), dung lượng lớn hơn LocalStorage, không chặn Main Thread.
        
- **Cơ chế đồng bộ (Offline Sync - Outbox Pattern):**
    
    - Khi user học xong mà mất mạng (Offline) -> Lưu request (kết quả học) vào một hàng đợi **`mutation_queue`** trong IndexedDB.
        
    - Khi có mạng lại (`window.addEventListener('online')`) -> Tự động **Flush Queue** (gửi lần lượt các request đó lên Server).
        
- **Bảo mật Client:**
    
    - Dữ liệu nhạy cảm trong Queue (như đổi pass, token) phải được **Client-side Encryption** (dùng AES/CryptoJS) trước khi lưu xuống IndexedDB để tránh bị soi mói.
        
    - Data truyền đi (Data in Transit) bắt buộc dùng **HTTPS**.
        

#### 3. UX & Phương pháp học (Psychology-driven)

- **Cognitive Strain (Desirable Difficulty):**
    
    - Không làm trắc nghiệm (Multiple Choice) dễ dãi.
        
    - Bắt user gõ chính xác 100% (Exact Match Input).
        
    - Áp dụng áp lực thời gian (Time Pressure) và phản hồi tức thì (Instant Feedback) để khắc sâu trí nhớ.
        
- **Phonetic Chunking:**
    
    - Học từ vựng theo "Chùm âm thanh" (Sound Cluster) thay vì list A-Z.
        
    - Ví dụ: Gốc `-age` (/ɪdʒ/) -> _Message, Village, Damage_.
        
    - Lưu ý bẫy **Linguistic False Friends** (Homographs - viết giống đọc khác, Stress Shift - thay đổi trọng âm Noun/Verb).
        

#### 4. Quản lý dữ liệu & Quốc tế hóa (i18n)

- **Thư viện:** Dùng **`next-intl`** (Support Server Components tốt, Type-safe).
    
- **Phân chia dữ liệu:**
    
    - **UI Text (Labels, Buttons):** Lưu trong file `.json` (`messages/en.json`, `messages/vi.json`) để dev quản lý.
        
    - **Content Data (Bài học, Từ vựng, Ví dụ):** Lưu trong **Database**.
        
    - Lý do: Content nhiều và nặng, cần quan hệ (Relations), và cần Admin CMS để giáo viên nhập liệu chứ không hardcode.
        

#### 5. Workflow & Tooling

- **Quản lý kiến thức (Second Brain):**
    
    - Dùng **Obsidian** với phương pháp **Zettelkasten** (Atomic Notes).
        
    - Cấu trúc thư mục: `Inbox`, `Projects`, `Areas`, `Resources` (chứa Tech notes, Concepts), `Archives`.
        
    - Dùng **Template V2.0** (có `updated_at`, `aliases`, `Why use it`, `Deep Dive`).
        
- **Sync Workflow:**
    
    - PC: Git CLI.
        
    - Android: Dùng **Termux** + Git + Vim (Hardcore workflow) để sync note về GitHub Private Repo.
        
    - Quy tắc Sync: "Pull trước khi Code, Push trước khi Ngủ" để tránh Conflict.
        

---

**Lời nhắn cho chat sau:** "Đây là toàn bộ context dự án. Tao là [Frontend Web Developer], đang build con app này theo hướng Modular Monolith + Offline First. Tiếp tục triển khai các phần tiếp theo dựa trên nền tảng này."