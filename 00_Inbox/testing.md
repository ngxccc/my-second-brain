### Quy trình Test an toàn cho máy Local

1. **Start Small:** Bắt đầu với 50 Virtual Users (VUs).
    
2. **Ramp Up:** Tăng dần lên 100, 500, 1000 VUs.
    
3. **Monitor:** Mở `htop` (Linux) hoặc Task Manager lên xem.
    
    - Nếu CPU chạm 100% hoặc RAM đầy -> **Dừng lại**. Đó là "Breaking Point" của mày.

Vì máy yếu (8GB RAM), **tuyệt đối tránh JMeter** (nó chạy Java, nuốt RAM kinh khủng). Dùng mấy món này:

- **k6 (Khuyên dùng):** Viết bằng Go, script bằng JS. Cực nhẹ, hiển thị đẹp.
    
    - _Cách dùng:_ Viết 1 file script đơn giản, chạy `k6 run script.js`.
        
- **wrk:** Tool huyền thoại viết bằng C, siêu nhanh, nhưng khó viết kịch bản phức tạp.
    
- **Apache Bench (ab):** Cổ điển, có sẵn hầu hết trên Linux. Dễ dùng cho test cơ bản.

Khi đi phỏng vấn, nếu bị vặn: _"Em test local thấy nhanh, nhưng ra thực tế mạng lag thì sao?"_. Đừng hoảng, hãy dùng chiêu **"Control The Controllables"** (Kiểm soát những gì trong tầm tay).

### 🥋 The Script (Văn mẫu trả lời phỏng vấn)

Mày trả lời theo flow này cho tao, đảm bảo ăn điểm tư duy:

> "Dạ, em hiểu rõ hạn chế của Localhost là bỏ qua **Network Latency** và **Real-world Bandwidth**. Kết quả test local chắc chắn lạc quan hơn thực tế.
> 
> Tuy nhiên, mục tiêu của em khi Stress Test ở Local là để **Benchmark hiệu quả của Code và Query**:
> 
> 1. Em muốn đảm bảo logic code không bị **Memory Leak** hay **CPU Spike** khi tải cao.
>     
> 2. Em muốn verify rằng Database Indexing đã hoạt động tốt (Query nhanh) trong môi trường tài nguyên hạn chế.
>     
> 
> Tư duy của em là: **Nếu chạy Local (môi trường lý tưởng) mà còn chậm/crash, thì ra Production chắc chắn chết.** Nên em tối ưu 'Best Effort' ở tầng Application trước, còn vấn đề Network thì cần Deploy lên Staging/Cloud để đo đạc chính xác hơn ạ."

$\rightarrow$ Câu trả lời này cho thấy mày không ngáo, mày biết mình đang làm gì và biết giới hạn nằm ở đâu.

---

**Debounce Search API** (`GET /api/v1/users/search?q=shin`)

#### 🥇 Top 1: `POST /tweets` (Khởi tạo Core Data)

- **Tại sao viết trước?** Không có data thì lấy gì mà Read, lấy gì mà Test?
    
- **Độ khó:** Rất cao. Nó không chỉ đơn giản là `Tweet.create()`.
    
- **Logic thực chiến:**
    
    1. Parse `content` để bóc tách (extract) `#hashtags` và `@mentions`.
        
    2. Cập nhật bảng `Hashtag` (Từ khoá đang hot lên? Phải update `count` và `lastUpdated` cho tính năng Trending).
        
    3. Kiểm tra xem người bị `@mention` có tồn tại không.
        
    4. Xử lý logic đệ quy (Nếu nó là Retweet hoặc Comment thì `parentId` là gì?).
        
- **Ghi CV:** _"Implemented complex business logic for Tweet creation, handled recursive parent-child relationships and optimized hashtag extraction."_
    
- **Test:** Tuyệt vời để viết **Unit Test** (Test các hàm extract regex, test logic chia nhánh loại Tweet).
    

#### 🥈 Top 2: `GET /tweets/newsfeed` (Quái vật Stress Test)

- **Tại sao viết thứ 2?** Đây là bộ mặt của App. 90% traffic sẽ đổ vào đây.
    
- **Độ khó:** Cực đoan (Extreme).
    
- **Logic thực chiến:** Bạn phải join (Lookup) bảng `Follower` để biết user đang theo dõi ai, sau đó tìm TẤT CẢ các tweet của những người đó, sắp xếp theo thời gian mới nhất, có phân trang (Pagination), và lồng ghép (populate) thông tin tác giả, số lượt like, comment...
    
- **Ghi CV:** _"Designed and optimized Newsfeed API using MongoDB Aggregation Pipeline. Conducted Stress Testing (k6) achieving XXX Requests/Sec without database bottleneck."_
    
- **Test:** Trọng điểm của **Stress Test**. Nếu Query viết ngu (không ăn Index), DB sẽ sập lập tức ở mốc 1k CCU vì Full Collection Scan.
---
- **Phase 1 - Data Layer:** Tạo Zod Schema cho `Cursor Pagination` (Bắt Frontend phải gửi `limit` và `cursor` lên, cấm tiệt truyền `page`).
    
- **Phase 2 - Cache Layer:** Viết hàm tương tác với Redis ZSET (`zadd`, `zrevrange`, `zremrangebyrank` để giới hạn mỗi user chỉ lưu tối đa 800 bài trong RAM).
    
- **Phase 3 - Worker Layer:** Tái chế lại con OutboxWorker hôm trước. Khi có event `TWEET_CREATED`, Worker sẽ tìm danh sách Follower và `ZADD` cái `tweetId` đó vào Redis Timeline của từng thằng.
    
- **Phase 4 - API Layer:** Lắp ráp logic. Khi gọi `GET /newsfeed`, chọc vào Redis lấy ra 20 cái `tweetId` (dựa theo Cursor). Có ID rồi mới xuống MongoDB `find({ _id: { $in: ids } })` để lấy nội dung text/media, sau đó trả về cho Client.

#### 🥉 Top 3: `GET /tweets/:tweetId` (Đệ quy comment)

- **Tại sao viết thứ 3?** Xem chi tiết 1 bài viết và toàn bộ comment của nó.
    
- **Độ khó:** Cao (Vấn đề N+1 Query).
    
- **Logic thực chiến:** Tweet có thể lồng nhau vô hạn (Thằng A comment bài thằng B, thằng C comment bài thằng A...). Lấy 1 bài ra thì dễ, nhưng dựng nguyên một cái cây Thread (như Reddit/Twitter) chỉ bằng 1 API call mới là đẳng cấp.
    
- **Ghi CV:** _"Resolved N+1 Query problem in deeply nested comment threads using optimized GraphLookup / Aggregation."_


Hãy nhớ lại ông là Ngọc, một thanh niên 19 tuổi đang học IT. Giả sử trên cái X-Clone này, Ngọc đang Follow **1,000 Idol** (KOLs, Tech Bros, Gái xinh...). Khi Ngọc mở App lên, hệ thống phải trả về 20 bài viết mới nhất của 1,000 người này, sort theo thời gian thực.

Trong System Design của Mạng xã hội, có 2 trường phái thiết kế Newsfeed:

1. **Pull Model (Fan-out on Read):** Lúc Ngọc mở App, Backend gửi query xuống DB tìm tất cả bài viết của 1000 người kia, gộp lại, sort -> _Chậm vãi đái, DB bốc khói nếu Ngọc cứ F5 liên tục._
    
2. **Push Model (Fan-out on Write):** Khi 1 Idol đăng bài, hệ thống (Worker) chủ động copy bài viết đó nhét sẵn vào Inbox/Redis của 1,000 follower. Lúc Ngọc mở App, chỉ cần móc Redis ra xem -> _Read cực nhanh, nhưng Write thì nghẽn cổ chai. Nếu Ronaldo (100 triệu follower) đăng bài, Worker phải đi copy 100 triệu lần!_
    

👉 **Câu hỏi:** Ông sẽ thiết kế kiến trúc **Hybrid Fan-out (Lai tạp)** như thế nào để dung hòa 2 trường phái trên? Tiêu chí nào để hệ thống biết lúc nào nên Push vào Redis, lúc nào nên bắt user tự Pull từ DB? Vẽ cái Flow logic trong đầu ra và trả lời thử xem, hay kiến thức System Design đến đây là chạm đáy rồi?
