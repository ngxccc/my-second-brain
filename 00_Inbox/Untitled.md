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

Ok bro, đã nhận lệnh. Dưới đây là **22 từ** được tuyển chọn kỹ lưỡng cho dân Dev, chia làm 2 bộ như ông yêu cầu.

Toàn bộ đều là những từ ông sẽ gặp hàng ngày khi đọc Docs, fix bug hoặc họp Daily. Copy nguyên đống này paste nối tiếp vào file `Vocab_Homographs.md` là đẹp đội hình.

---

### 📦 Dataset 1: Stress Shift (Tiếp theo)

_Quy tắc cũ: **Noun** nhấn âm 1, **Verb** nhấn âm 2._


---

### 📦 Dataset 2: Sound Shift (Tiếp theo)

_Quy tắc: **Noun** = /s/ (nhẹ), **Verb** = /z/ (rung). Chữ viết y hệt nhau._

|**Word**|**Type**|**IPA**|**Meaning**|**Context / Example**|**Oxford**|
|---|---|---|---|---|---|
