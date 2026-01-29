### 🎓 Giáo sư Tom (The Theorist) - Phân tích Chiến lược Dữ liệu

Chào em sinh viên, dự án này rất thú vị vì nó chạm đến bài toán kinh điển của Distributed Systems: **CAP Theorem**. Khi em chọn **Offline First** (Partition Tolerance) và **High Availability**, em buộc phải hy sinh **Consistency** tức thời (Eventual Consistency).

Chúng ta cần giải quyết 2 bài toán lý thuyết cốt lõi:

#### 1. The "Source of Truth" Dilemma (Nơi nào chứa chân lý?)

Trong mô hình Offline, Client (IndexedDB) là vua khi mất mạng, nhưng Server (PostgreSQL) mới là vua của toàn bộ hệ thống.

- **Chiến lược:** **Server-Side Authority**. Client chỉ là một "bản chiếu" (projection) tạm thời.
    
- **Cơ chế:** Khi Client sync dữ liệu lên, Server không chỉ nhắm mắt `INSERT`. Server phải `VALIDATE` logic (ví dụ: điểm số có hợp lý với thời gian làm bài không?) để chống cheat.
    

#### 2. Idempotency (Tính bất biến)

Mạng mẽo ở Việt Nam rất "lỏ". Một request `POST /submit-result` có thể được gửi 2 lần do lag.

- **Nguyên tắc:** Nếu Client gửi cùng 1 request 10 lần, Server chỉ được xử lý 1 lần duy nhất.
    
- **Giải pháp:** Mỗi record trong `mutation_queue` ở Client phải có một `UUID` (Unique ID) duy nhất sinh ra từ lúc offline. Server check ID này, nếu đã tồn tại -> Bỏ qua.
    

---

### 🔧 Kỹ sư Raizo (The Practitioner) - Thiết kế Hệ thống (System Design)

Okay bro, lý thuyết xong rồi. Giờ tay to vào việc. Vì bro chọn **PostgreSQL** (Good choice!), chúng ta sẽ dùng sức mạnh của **Schema Isolation** để giữ đúng tinh thần Modular Monolith.

#### 1. Database Schema Design (Physical View)

Chúng ta sẽ chia Database thành các **Schemas** riêng biệt (tương ứng với Modules) để tránh việc query chéo bừa bãi ("Spaghetti Query").

**Module: `content` (Read-heavy - Ít ghi, đọc nhiều)**

- Chứa dữ liệu bài học. Dùng JSONB cho cấu trúc linh hoạt.
    
- Table `lessons`:
    
    - `id`: UUID
        
    - `title`: String
        
    - `structure`: **JSONB** (Chứa toàn bộ flow bài học: Vocab -> Example -> Audio path). _Tại sao?_ Để khi Client fetch về, nó lấy đúng 1 cục JSON này lưu thẳng vào IndexedDB, không cần join bảng phức tạp.
        
    - `version`: Integer (Để check update cache).
        

**Module: `learning` (Write-heavy - Ghi liên tục)**

- Chứa lịch sử học tập, SRS (Spaced Repetition System).
    
- Table `progress_logs`:
    
    - `id`: UUID
        
    - `user_id`: UUID
        
    - `lesson_id`: UUID
        
    - `score`: Integer
        
    - `metadata`: JSONB (Lưu chi tiết lỗi sai để phân tích sau này).
        
    - `synced_at`: Timestamp (Thời điểm server nhận data).
        

#### 2. Sync Protocol Design (The Pipeline)

Đây là luồng đi của dữ liệu khi mạng có lại (Flush Queue). Flow này phải xử lý được trường hợp hàng nghìn user sync cùng lúc.

Code snippet

```
sequenceDiagram
    participant C as Client (IndexedDB)
    participant Q as Mutation Queue
    participant A as API (Next.js)
    participant D as Database

    Note over C: User online trở lại!
    C->>Q: Lấy list pending mutations
    Q-->>C: Trả về [Req_A, Req_B, Req_C]
    
    Loop Batch Processing (Gửi từng cụm)
        C->>A: POST /api/sync/batch (Payload: Array of Mutations)
        A->>A: Validate Token & UUID (Idempotency Check)
        
        alt Valid Data
            A->>D: Transaction: Insert Logs + Update Stats
            D-->>A: Success
            A-->>C: 200 OK (Ack: [Req_A_ID, ...])
            C->>Q: Xóa Req_A khỏi Queue
        else Invalid/Conflict
            A-->>C: 409 Conflict / 400 Bad Request
            C->>C: Move to "Dead Letter Queue" (Để user check sau)
        end
    end
```

#### 3. API Contract cho tính năng "Lazy Caching"

Để hỗ trợ cái vụ "User bấm bài nào tải bài đó", API phải thiết kế theo dạng **Bundle**.

**Endpoint:** `GET /api/v1/lessons/:id/bundle`

**Response Structure (JSON):**

JSON

```
{
  "lesson_id": "uuid-123",
  "version": 5,
  "data": {
    "steps": [
      {
        "type": "vocab",
        "content": "Message",
        "phonetic": "/ˈmes.ɪdʒ/",
        "audio_url": "/static/audio/message.mp3", // Client sẽ pre-fetch cái này
        "challenge": "type_exact"
      }
      // ... more steps
    ]
  },
  "resources": [
    // List các assets cần tải thêm để cache vào Service Worker hoặc IndexedDB
    "/static/images/context-1.jpg",
    "/static/audio/message.mp3"
  ]
}
```

---

### 💡 Lưu ý Edge Cases (Những cái hố tử thần)

1. **Race Condition:** User học trên điện thoại (Offline), rồi học trên Laptop (Online). Sau đó điện thoại có mạng và Sync đè lên dữ liệu mới hơn trên Server.
    
    - _Fix:_ Server luôn check `timestamp` của hành động học. Nếu timestamp cũ hơn data hiện có -> Reject hoặc Merge thông minh (chỉ cộng điểm, không reset progress).
        
2. **Versioning:** Giáo viên sửa bài học (v1 -> v2). User đang học dở v1 (Offline).
    
    - _Fix:_ Client gửi kèm `lesson_version`. Server phát hiện version lệch -> Báo Client: "Bài học đã update, vui lòng tải lại" (Force Refresh).
