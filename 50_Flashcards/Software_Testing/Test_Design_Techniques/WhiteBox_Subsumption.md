---
noteId: 1783427811388
---

Giải thích quan hệ bao hàm (Subsumption Relationship) giữa Decision Coverage và Statement Coverage theo chuẩn ISTQB?

---

**Decision Coverage bao hàm hoàn toàn Statement Coverage** (_Decision Coverage subsumes Statement Coverage_).

Về mặt toán học, nếu một bộ test case đạt **100% Decision Coverage**, nó chắc chắn bảo đảm đạt **100% Statement Coverage**.

Tuy nhiên, **chiều ngược lại KHÔNG đúng**: Đạt 100% Statement Coverage hoàn toàn có thể chỉ đạt 50% Decision Coverage (ví dụ: chỉ test nhánh `True` của câu lệnh `if` không có `else`).

---

Extra: Trong phân cấp kiểm thử cấu trúc: Path Coverage $\implies$ Decision Coverage $\implies$ Statement Coverage.
