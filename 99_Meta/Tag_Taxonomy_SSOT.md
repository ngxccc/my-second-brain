---
tags: [type/meta, status/permanent]
status: permanent
date: 2026-10-03
description: "Tag Taxonomy SSOT tinh gọn: giới hạn tối đa 2 functional tags (1 type bắt buộc, 1 status tùy chọn)."
---

# Tag Taxonomy SSOT (Single Source of Truth)

## TL;DR

- **Sứ mệnh**: Nguồn sự thật duy nhất (SSOT) chuẩn hóa toàn bộ YAML frontmatter tags trong Second Brain theo triết lý tinh gọn (Lean Taxonomy).
- **Quy tắc tối đa 2 Tags**: Mỗi atomic note chỉ được phép chứa **tối đa 2 tags**:
  1. **Tag 1 (Bắt buộc)**: `type/*` xác định phân loại cấu trúc nhận thức (Cognitive Schema).
  2. **Tag 2 (Tùy chọn)**: `status/*` xác định trạng thái hoàn thiện của ghi chú.
- **Triệt tiêu Taxonomy Bloat**: Tuyệt đối không gắn các tag chủ đề (`topic/*`), phân tầng (`layer/*`), hay dự án (`project/*`). Danh mục và ngữ cảnh được giải quyết triệt để thông qua cấu trúc thư mục (PARA) và liên kết mạng lưới (Wikilinks `[[...]]`).
- **Kiểm soát chất lượng**: `bun 99_Meta/Scripts/validate_notes.mjs` tự động quét và chặn mọi ghi chú vượt quá 2 tags hoặc chứa tag ngoài danh sách SSOT này.

---

## 1. Type Tags (`type/*`) — Bắt buộc (Chính xác 1 tag)

Mỗi atomic note (ngoại trừ Daily Logs và Flashcards) bắt buộc chứa đúng 1 `type/*` tag:

- `type/concept`: Định nghĩa, lý thuyết, nguyên lý cơ chế, kiến trúc, mental models (`30_Resources/Concepts/`).
- `type/method`: SOP, quy trình thực thi, roadmap, framework hành động (`30_Resources/Methods/`).
- `type/pattern`: Design patterns, architectural patterns.
- `type/project`: Ghi chú dự án thực hiện (`10_Projects/`).
- `type/checklist`: Danh sách kiểm tra công việc, tiêu chuẩn kiểm thử.
- `type/guide`: Hướng dẫn cấu hình, cheatsheet, tài liệu kỹ thuật.
- `type/algorithm`: Giải thuật, bài toán LeetCode, cấu trúc dữ liệu.
- `type/audit`: Báo cáo đánh giá hiệu năng, bảo mật, benchmark.
- `type/strategy`: Chiến lược phát triển sự nghiệp, tài chính, đầu tư.
- `type/technique`: Kỹ thuật lập trình, kỹ thuật kiểm thử chuyên biệt.
- `type/submission`: Báo cáo học thuật, đề xuất dự án.
- `type/meta`: Tài liệu quản trị hệ thống, tiêu chuẩn vault (`99_Meta/`).

---

## 2. Status Tags (`status/*`) — Tùy chọn (Tối đa 1 tag)

Dùng để đánh dấu mức độ trưởng thành của tri thức:

- `status/permanent`: Ghi chú vĩnh cửu (Evergreen Note), đã được kiểm chứng và hoàn thiện.
- `status/active`: Ghi chú hoặc dự án đang trong quá trình thực thi, nghiên cứu.
- `status/todo`: Ghi chú nháp, đang chờ bổ sung nội dung (Placeholder).
- `status/archived`: Ghi chú lưu trữ, tài liệu lịch sử không còn cập nhật.

---

## 3. Quy chuẩn Ràng buộc (Validation Invariants)

1. **Tổng số lượng tags**: $\le 2$ tags trên mỗi ghi chú.
2. **Thành phần hợp lệ**:
   - Trường hợp 1 tag: `[type/<name>]`.
   - Trường hợp 2 tags: `[type/<name>, status/<name>]`.
3. **Cấm tuyệt đối**:
   - Cấm gắn các tag `topic/*` (ví dụ `topic/backend`, `topic/database`).
   - Cấm gắn các tag `layer/*` (ví dụ `layer/core-mechanics`, `layer/architecture`).
   - Cấm gắn các tag tự do, tag camelCase, hoặc tag chưa được khai báo tại file này.
