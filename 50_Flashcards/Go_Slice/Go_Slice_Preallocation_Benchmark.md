---
noteId: 1786627528773
---

Tại sao kỹ thuật Pre-allocation `make([]T, 0, capacity)` lại giúp giảm số lần cấp phát RAM từ 38 lần xuống còn đúng 1 lần duy nhất (`1 allocs/op`) khi thêm 1.000.000 phần tử?

---

Khi không chỉ định `capacity`, mỗi khi mảng bị đầy, Go phải gọi `runtime.growslice` để xin Heap cấp phát một mảng mới lớn hơn và sao chép toàn bộ dữ liệu cũ sang (thực hiện lặp đi lặp lại 38 lần).

Khi chỉ định `capacity`, Go cấp phát sẵn một vùng nhớ liên tục vừa vặn cho 1.000.000 phần tử ngay từ lần đầu tiên.

---

Extra: Giảm số lần cấp phát xuống đúng 1 lần giúp tăng tốc độ thực thi hơn 5-6 lần và loại bỏ hoàn toàn áp lực dọn rác (GC pressure) do các mảng trung gian bị vứt bỏ.
