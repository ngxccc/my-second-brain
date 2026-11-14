---
tags: [type/concept, status/permanent]
date: 2026-04-29
description: "Quản lý tri thức bằng Atomic Notes và Links."
---

# Zettelkasten Method

## TL;DR

- **Bản chất**: Đập kiến thức thành atomic note một ý và nối chúng bằng backlink thành mạng lưới thay vì xếp vào thư mục cứng nhắc.
- **Mục đích**: Tạo ra tri thức mới từ các liên kết giữa note, thay vì chỉ lưu trữ lại thông tin đã đọc.
- **Điểm mấu chốt**: Giá trị nằm ở khâu viết lại bằng ngôn ngữ của mình và ở liên kết; copy nguyên văn rồi link vẫn chỉ là kho chứa, không phải bộ não thứ hai.

## Core Concept

- **Single Responsibility Principle (SRP):** Một note = Một ý tưởng. Nếu note có dấu hiệu dài ra và chứa nhiều ý tưởng phụ, bắt buộc phải đập vỡ nó ra (Refactor) thành nhiều note nhỏ hơn.
- **The Workflow (Quy trình 3 bước):** 1. _Fleeting Notes:_ Bắt nháp ý tưởng lướt qua não (chưa cần gọn gàng, nghĩ gì viết nấy). 2. _Literature Notes:_ Tóm tắt lại sách/tài liệu/tutorial bằng văn phong, ngôn ngữ "chợ búa" của chính mình (Tuyệt đối cấm bôi đen copy-paste). 3. _Permanent Notes:_ Kết tinh lại thành một Atomic Note chuẩn chỉnh, gắn tag và bắt buộc phải đi tìm "bà con họ hàng" để Link nó vào mạng lưới.
- **Network over Hierarchy:** Từ bỏ việc phân cấp thư mục lồng nhau. Mọi note đều bình đẳng và được định vị bằng hệ tọa độ của các `[[Links]]`.

## Cạm bẫy thường gặp

- **Ngải sưu tầm (Collector's Fallacy):** Cạm bẫy "chí mạng" nhất. Em dùng extension copy nguyên một bài báo 5000 chữ bỏ vào Obsidian, nhìn rất pờ-rồ, nhưng thực chất em chưa nạp được một byte kiến thức nào vào đầu. Note chỉ "sống" khi em tự tay xử lý (Process) và viết lại nó. Tránh biến Obsidian thành một cái Nghĩa địa số (Digital Graveyard).
- **Over-linking (Spam link):** Bạ từ khóa nào cũng bọc ngoặc vuông sẽ làm nhiễu đồ thị (Graph View). Chỉ tạo Link cho những khái niệm mang tính định danh hoặc có ý nghĩa kết nối (Semantic Linking).
- **Ví dụ so sánh (Graph vs Folder):**

'''text
Tư duy Folder (Chết dí một chỗ):
Projects/
└── NextJS_Clone/
└── Singleton_Pattern.md (Khi làm project khác cần dùng lại thì không biết đi mò ở đâu)

Tư duy Zettelkasten (Backlinks):
Tất cả Atomic Notes ném chung vào một rổ `30_Resources/`.
Khi file `Project_A.md` và `Project_B.md` cùng cần dùng đến kiến thức Singleton,
chúng chỉ việc gọi tên `[[Singleton_Pattern]]`. Kiến thức được tái sử dụng trong $O(1)$.
'''

---

**Related Notes:**

- Nơi lưu trữ bộ khung xương dẫn đường: [[Map_of_Content_MOC]]
- Cấu trúc quản lý thư mục High-level: [[PARA_Method]]
