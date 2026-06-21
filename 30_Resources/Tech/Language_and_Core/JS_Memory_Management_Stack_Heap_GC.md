---
tags: [type/concept, topic/tech, engine/v8, language/javascript, system/memory]
aliases: [Stack vs Heap, Garbage Collection, Memory Management, Memory Leaks]
date: 2026-06-20
---

# JS Memory Management: Stack, Heap & Garbage Collection

## TL;DR

Quản lý bộ nhớ trong JavaScript được chia làm hai vùng chính: **Stack** (cho dữ liệu nguyên thủy tĩnh, có kích thước cố định và ngữ cảnh thực thi) và **Heap** (cho dữ liệu động, đối tượng phức tạp như Object, Array, và Closure). Heap được quản lý tự động bởi bộ dọn rác **Garbage Collector (GC)** của JavaScript Engine (ví dụ: Orinoco của V8 hoặc GC của JavaScriptCore). Hiểu rõ sự khác biệt giữa Stack/Heap và cơ chế dọn rác phân thế hệ (Generational GC) là nền tảng tối quan trọng để ngăn chặn lỗi rò rỉ bộ nhớ (Memory Leaks) trên backend (Node.js/Bun), đồng thời là cầu nối để tiếp cận nhanh các ngôn ngữ khác (Java/C# sử dụng GC tương tự, hoặc Rust/C++ quản lý bộ nhớ không cần GC).

> [!tip] Trực quan hóa Tương tác (Interactive Visualization)
> Bạn có thể mở trực tiếp tệp [[30_Resources/Tech/_Visuals/memory-visualizer.html|memory-visualizer.html]] trên trình duyệt để trải nghiệm công cụ trực quan hóa tương tác từng bước (Step-by-Step) cho bài học này.

---

## Core Concept

### 1. Phân tầng Bộ nhớ: Stack vs. Heap

Khi ứng dụng thực thi, bộ nhớ được phân chia dựa trên tính chất của dữ liệu:

- **Stack Memory (LIFO - Last In, First Out):**
  - **Đặc điểm:** Lưu trữ các kiểu dữ liệu nguyên thủy (Number, String, Boolean, null, undefined, Symbol, BigInt) và các biến tham chiếu (Reference Pointers) trỏ đến vùng nhớ Heap.
  - **Hành vi:** Gán trực tiếp giá trị vào ô nhớ. Khi một hàm được gọi, một _Execution Context_ (khung ngăn xếp - Stack Frame) được đẩy vào Stack. Khi hàm chạy xong, toàn bộ Stack Frame chứa các biến cục bộ đó lập tức được tự động giải phóng (LIFO) ở cấp độ phần cứng mà không tốn chi phí.
- **Heap Memory (Dynamic Allocation):**
  - **Đặc điểm:** Lưu trữ các cấu trúc dữ liệu không cố định kích thước, có thể phình to động trong quá trình chạy (Object, Array, Function, Closure).
  - **Hành vi:** Hệ thống cấp phát một vùng nhớ trống trên Heap và trả về một địa chỉ (con trỏ). Biến ở Stack sẽ lưu địa chỉ này. Do cấp phát động, bộ nhớ Heap không tự động giải phóng khi hàm kết thúc mà cần một cơ chế dọn rác (GC) quét qua để thu hồi.

### 2. Cơ chế Garbage Collection phân thế hệ (V8 Orinoco GC)

V8 Engine áp dụng **Giả thuyết thế hệ (Generational Hypothesis)**: _"Hầu hết các đối tượng đều chết trẻ"_. Do đó, bộ nhớ Heap của V8 được chia làm hai phân vùng chính:

#### A. Young Generation (New Space)

- **Kích thước:** Rất nhỏ (từ 1MB đến 64MB), chứa các đối tượng mới khởi tạo.
- **Thuật toán:** Dùng thuật toán **Scavenger** (Copying Collector) chia đôi New Space thành _From-Space_ và _To-Space_.
- **Cơ chế:** Khi chạy dọn rác Minor GC, V8 duyệt các đối tượng còn sống ở _From-Space_ và sao chép (copy) chúng liền mạch sang _To-Space_ (đồng thời dọn sạch _From-Space_). Nếu một đối tượng sống sót qua 2 chu kỳ Minor GC, nó sẽ được "thăng cấp" (promote) chuyển lên Old Space. Việc dịch chuyển bộ nhớ này giúp chống phân mảnh bộ nhớ (defragmentation) cực kỳ hiệu quả.

#### B. Old Generation (Old Space)

- **Kích thước:** Rất lớn, chứa các đối tượng có tuổi thọ cao (sống sót từ New Space) hoặc các đối tượng cực lớn được cấp phát thẳng vào đây.
- **Thuật toán:** Dùng thuật toán **Mark-Sweep-Compact** (Major GC).
  - **Marking (Đánh dấu):** GC duyệt đồ thị đối tượng từ các điểm gốc (Roots - như biến toàn cục, stack frames) để tìm tất cả các đối tượng còn có thể truy cập được (reachable).
  - **Sweeping (Quét):** Giải phóng bộ nhớ của toàn bộ đối tượng không thể truy cập (unreachable).
  - **Compacting (Nén):** Dịch chuyển các đối tượng còn sống nằm sát lại nhau để tạo ra các vùng nhớ trống liền mạch lớn, tối ưu hóa cho lần cấp phát sau.
- **Orinoco Optimization:** Để tránh hiện tượng dừng ứng dụng (Stop-the-World pauses), Major GC thực hiện đánh dấu gia tăng (**Incremental Marking**) xen kẽ với luồng chạy JS, kết hợp quét và nén song song trên các thread nền (**Concurrent/Parallel GC**).

---

## Practical Implementation

### Các mô hình gây Rò rỉ Bộ nhớ (Memory Leaks) trên Backend

Memory Leak xảy ra khi một biến không còn được sử dụng trong logic nghiệp vụ nhưng vẫn nằm trong đồ thị truy cập từ điểm gốc (GC Roots), khiến Garbage Collector không thể giải phóng nó khỏi Heap.

#### 1. Dangling Closures (Closure treo giữ tham chiếu thừa)

```typescript
// Memory Leak: Khai báo hàm lồng nhau giữ tham chiếu lớn
let leakedData: any = null;

function createLeak() {
  const originalData = leakedData;
  const largeObject = new Array(1000000).fill("❌ Leak"); // Chiếm nhiều bộ nhớ Heap

  // Closure 1: Giữ tham chiếu đến originalData
  const unused = function () {
    if (originalData) console.log("Hi");
  };

  // Closure 2: Ghi đè biến leakedData toàn cục
  leakedData = {
    longLivedMethod: function () {
      // Hàm này không dùng đến largeObject, nhưng vì nó dùng chung Lexical Environment
      // với unused(), nó vô tình giữ largeObject sống mãi trên Heap!
    },
  };
}
setInterval(createLeak, 100); // RAM phình to liên tục và crash server
```

- **Khắc phục:** Đảm bảo giải phóng thủ công các tham chiếu thừa bằng cách gán `null` khi không sử dụng nữa.

#### 2. Forgotten Timers (Quên hủy setInterval/setTimeout)

```typescript
// Memory Leak: SetInterval liên tục tham chiếu đến object đã hủy ở ngoài
function startJob(user: { id: string; name: string }) {
  setInterval(() => {
    // Ngay cả khi đối tượng 'user' đã bị xóa khỏi UI/đơn hàng,
    // callback này vẫn giữ tham chiếu đến 'user' sống mãi trong Event Loop.
    console.log(`Processing job for ${user.name}`);
  }, 5000);
}
```

- **Khắc phục:** Luôn lưu lại tham chiếu của timer (`const timerId = setInterval(...)`) và gọi `clearInterval(timerId)` khi dọn dẹp (clean up).

#### 3. Global Variables (Biến toàn cục ẩn danh)

- Gán thuộc tính trực tiếp vào `global` (Node.js) hoặc `globalThis` làm đối tượng đó sống vô hạn.

---

## Interview Prep (Câu hỏi phỏng vấn thực tế)

### Q1: Phân biệt Stack và Heap về mặt tốc độ, kích thước và cách giải phóng bộ nhớ?

- **Trả lời:**
  - **Stack:** Lưu trữ kiểu dữ liệu nguyên thủy và con trỏ tham chiếu. Kích thước nhỏ cố định. Tốc độ truy cập cực nhanh vì hoạt động theo LIFO ở cấp độ phần cứng CPU. Bộ nhớ được giải phóng ngay lập tức khi hàm kết thúc và Stack Frame bị hủy.
  - **Heap:** Lưu trữ các đối tượng phức tạp động. Kích thước lớn, linh hoạt. Tốc độ truy cập chậm hơn vì phải tìm kiếm theo địa chỉ tham chiếu từ Stack. Bộ nhớ được giải phóng không đồng bộ bởi Garbage Collector thông qua việc quét đồ thị đối tượng.

### Q2: Cơ chế Generational Garbage Collection trong V8 hoạt động như thế nào? Tại sao nó chia làm New Space và Old Space?

- **Trả lời:** Cơ chế này dựa trên giả thuyết phần lớn đối tượng chỉ sống trong thời gian ngắn.
  - **New Space** lưu các đối tượng mới, nhỏ. Dùng thuật toán sao chép **Scavenger** rất nhanh để chuyển các đối tượng còn sống qua lại giữa 2 vùng bán không gian (From-Space/To-Space), loại bỏ sự phân mảnh.
  - **Old Space** lưu các đối tượng sống lâu. Dùng thuật toán **Mark-Sweep-Compact** để đánh dấu, quét dọn và nén bộ nhớ. Việc chia tách này giúp V8 không phải duyệt toàn bộ Heap dung lượng lớn trong mọi chu kỳ dọn rác, giảm thiểu thời gian ngắt luồng (Stop-the-World pauses) cho ứng dụng.

### Q3: Kiến thức quản lý bộ nhớ của JS giúp ích gì khi bạn học Java, C# hoặc Rust?

- **Trả lời:**
  - **Với Java/C#:** Chúng cũng sử dụng cơ chế Generational GC (JVM GC chia thành Young/Tenured Gen, .NET CLR GC chia thành Gen 0/1/2). Hiểu rõ Heap/Stack và GC trong JS giúp tôi nắm bắt cấu trúc bộ nhớ và cách tối ưu hóa tránh Memory Leak trên Java/C# ngay lập tức.
  - **Với Rust/C++:** Các ngôn ngữ này loại bỏ hoàn toàn Garbage Collector để đạt hiệu năng tối đa (tránh hiện tượng dừng hệ thống Stop-the-World). Rust quản lý bộ nhớ thông qua cơ chế **Ownership** (Quyền sở hữu) và **Lifetime** tại thời điểm biên dịch (compile-time), tự động chèn mã giải phóng bộ nhớ ngay khi biến ra khỏi phạm vi (scope) tương tự như giải phóng Stack Frame. Hiểu rõ chi phí của GC trong JS giúp tôi hiểu rõ lý do tại sao Rust lại thiết kế hệ thống Ownership như vậy.

---

## Related Notes

- Bản đồ tri thức: [[000_Tech_MOC]]
- So sánh các Runtime JS: [[JS_Runtimes_Bun_vs_NodeJS]]
- Cơ chế biên dịch Monorepo: [[NextJS_Monorepo_Package_Transpilation]]
