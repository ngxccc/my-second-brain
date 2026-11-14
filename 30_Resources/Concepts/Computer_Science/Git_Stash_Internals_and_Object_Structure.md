---
tags: [type/concept, status/permanent]
date: 2026-09-22
description: "Cơ chế lưu trữ bên trong của Git Stash: tạo 2 (hoặc 3) commit đặc biệt liên kết với refs/stash thay vì lưu bộ nhớ tạm độc lập."
---

# Git Stash Internals and Object Structure

## TL;DR

- **Bản chất**: `git stash` không có vùng nhớ tạm riêng: nó tạo 2 (hoặc 3) commit bình thường trên DAG rồi gắn vào con trỏ `refs/stash`.
- **Mục đích**: Lưu trạng thái dở dang của cả Working Directory và Index để đưa thư mục làm việc về `HEAD` sạch mà không làm ô nhiễm nhánh làm việc.
- **Điểm mấu chốt**: Commit 1 giữ Index, Commit 2 giữ Working Directory với hai cha (`HEAD` và Commit 1); `-u` thêm Commit 3 cho file untracked; `stash@{n}` nằm trong `logs/refs/stash`.

---

## Core Concept

### 1. Cấu trúc 2 Commit mặc định của `git stash`

Khi bạn chạy `git stash push` (hoặc `git stash`):

```
       [Index / Staged Changes] (Commit W1)
             ^
             │ (Parent 2)
[HEAD] <─── [Working Dir Changes] (Commit W: refs/stash)
  ^
  │ (Parent 1)
```

1. **Commit `W1` (Staged Commit)**:
   - Đại diện cho các file bạn đã `git add` vào Staging Area.
   - Commit cha của `W1` là `HEAD`.
2. **Commit `W` (WIP Commit - Đỉnh Stash)**:
   - Đại diện cho các file đã sửa đổi trong Working Directory.
   - **Có 2 commit cha (Merge Commit ảo)**: Parent 1 là `HEAD`, Parent 2 là Commit `W1`.
   - Con trỏ `.git/refs/stash` được cập nhật trỏ thẳng vào commit `W` này.

---

### 2. Cấu trúc 3 Commit khi stash kèm Untracked Files (`git stash -u`)

Khi thêm cờ `-u` (`--include-untracked`):

```
       [Untracked Files] (Commit W2) ───┐ (Parent 3)
                                        │
       [Staged Changes]  (Commit W1) ───┼──> [Commit W (refs/stash)]
                                        │       │
[HEAD] <────────────────────────────────┘       └──> (Parent 1)
```

- Git tạo thêm Commit `W2` để lưu ảnh chụp các file chưa được track.
- Commit `W` lúc này trở thành commit có tới **3 Parent**.

---

### 3. Ngăn xếp Stash Stack (`stash@{0}`, `stash@{1}`) hoạt động như thế nào?

- Git không lưu một danh sách mảng (Array).
- Git ghi nhận lịch sử thay đổi của ref `refs/stash` vào file nhật ký **`logs/refs/stash`**.
- Mỗi lần bạn `git stash pop`, Git giải nén các tree object của commit stash áp ngược lại vào thư mục làm việc và cập nhật `refs/stash` lùi lại 1 bước trong `reflog`.

---

## Practical Implementation

### So sánh các lệnh Stash phổ biến

```bash
# 1. Stash toàn bộ thay đổi (bao gồm cả untracked files)
git stash -u -m "wip: shopping cart checkout"

# 2. Xem các commit thực sự được tạo bởi stash
git log --graph --oneline refs/stash -n 3

# 3. Áp dụng lại stash mà vẫn giữ nguyên trạng thái Staging ban đầu
git stash apply --index

# 4. Xóa stash đỉnh sau khi apply thành công
git stash drop stash@{0}
```

---

## Related Notes

- [[Git_DAG_and_Object_Storage_Model]]: Nền tảng cấu trúc Commit, Tree, Blob trong Git.
- [[Git_Four_Zones_and_Reset_Lifecycle]]: 4 vùng làm việc trong Git.
- [[000_Concepts_MOC]]: Danh mục các khái niệm khoa học máy tính.
