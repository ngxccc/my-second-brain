---
tags:
  - type/concept
  - topic/linguistics
  - topic/pronunciation
  - topic/error-analysis
status: evergreen
created_at: 2026-01-29
---

# Linguistic False Friends (Homographs & Stress Shifts)

## 💡 TL;DR
Các từ tiếng Anh có vẻ ngoài (Spelling) giống hệt nhau hoặc cùng một nhóm âm, nhưng lại có cách phát âm và nghĩa hoàn toàn khác nhau tùy thuộc vào ngữ cảnh và loại từ (Noun/Verb), dễ gây ra "bẫy" cho phương pháp học theo nhóm.

---

## 🔍 Deep Dive (Phân tích sâu)

### 1. Homographs (Từ đồng dạng)
Là những từ viết y hệt nhau nhưng "runtime" (cách đọc/nghĩa) lại khác nhau.
* **Vấn đề:** Nếu áp dụng máy móc phương pháp [[Phonetic_Chunking]] (thấy mặt chữ đoán âm), bạn sẽ bị sai khi gặp những từ này.
* **Ví dụ:** Từ `Live` nếu gom vào nhóm âm `/ɪ/` (như *give*) sẽ đúng với động từ "Sống", nhưng sai với tính từ "Trực tiếp" (Live stream - đọc là `/aɪ/`).

### 2. Functional Shift (Sự dịch chuyển chức năng/trọng âm)
Quy luật thay đổi trọng âm (Word Stress) khi từ thay đổi chức năng ngữ pháp.
* **Noun/Adjective:** Thường nhấn âm tiết **1**.
* **Verb:** Thường nhấn âm tiết **2**.
* **Hậu quả:** Sai trọng âm có thể không làm mất nghĩa hoàn toàn (do Context cứu), nhưng làm giảm độ mượt (Fluency) và gây khó chịu cho người nghe (High Cognitive Load).

---

## 💻 Code / Example (Ví dụ thực tế)

### Bảng so sánh các cặp từ nguy hiểm (The Bug List)

| Word        | Type | IPA (Phiên âm)  | Meaning      | Note      |
| :---------- | :--- | :-------------- | :----------- | :-------- |
| **Project** | Noun | `/ˈprɑː.dʒekt/` | Dự án        | Nhấn âm 1 |
| **Project** | Verb | `/prəˈdʒekt/`   | Phóng/Chiếu  | Nhấn âm 2 |
| **Record**  | Noun | `/ˈrek.ɚd/`     | Hồ sơ/Kỷ lục | Nhấn âm 1 |
| **Record**  | Verb | `/rɪˈkɔːrd/`    | Ghi âm       | Nhấn âm 2 |
| **Content** | Noun | `/ˈkɑːn.tent/`  | Nội dung     | Nhấn âm 1 |
| **Content** | Adj  | `/kənˈtent/`    | Hài lòng     | Nhấn âm 2 |
| **Live**    | Verb | `/lɪv/`         | Sống         | Âm /ɪ/    |
| **Live**    | Adj  | `/laɪv/`        | Trực tiếp    | Âm /aɪ/   |

### Contextual Error Correction
```text
User nói: "I want to RE-cord (Noun stress) a video."
Máy (Não người nghe): 
1. Phát hiện lỗi cú pháp (Syntax Error): Sau "to" phải là Verb.
2. Auto-fix: Hiểu ý là "re-CORD" (Verb).
3. Warning: "Pronunciation poor".
```

---

## ⚠️ Edge Cases / Pitfalls (Cạm bẫy)

* **Fatal Error (Lỗi nghiêm trọng):** Khi cả 2 cách đọc đều hợp lý trong một ngữ cảnh.
    * VD: *"We focus on the content"* (Chúng tôi tập trung vào nội dung / Chúng tôi tập trung vào sự hài lòng).
    * -> Lúc này Context bó tay, dẫn đến hiểu lầm nghiệp vụ.
* **Ending Sounds (Âm cuối):** Quan trọng hơn cả trọng âm. Thiếu `s`, `ed` có thể làm sai thì (Tense) hoặc số lượng.
    * *Tip:* Thà đọc chậm mà đủ ending sounds còn hơn đọc lướt mà nuốt âm.

---

## 🔗 Related Keywords
* [[Phonetic_Chunking]] (Phương pháp dễ dính lỗi này nhất)
* [[IPA_Pronunciation]] (Bảng phiên âm quốc tế - Công cụ debug)
* [[Contextual_Clues]] (Manh mối ngữ cảnh)