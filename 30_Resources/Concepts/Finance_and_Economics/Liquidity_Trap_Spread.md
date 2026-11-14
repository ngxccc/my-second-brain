---
tags: [type/concept, status/permanent]
date: 2026-01-30
description: "Rủi ro thanh khoản khi thị trường hoảng loạn."
---

# Liquidity Trap & Bid-Ask Spread

## TL;DR

- **Bản chất**: Trong hoảng loạn, chênh lệch bid-ask nới rộng cực đại vì market maker hạ giá mua để tự bảo vệ dòng tiền mặt.
- **Mục đích**: Phân biệt lỗ trên giấy với lỗ thực hiện, và hiểu vì sao bán tháo làm mất giá trị nhanh hơn chỉ số thị trường.
- **Điểm mấu chốt**: Giá trị thật của tài sản là giá bid, không phải giá ask hiển thị; tài sản càng kém thanh khoản thì khoảng cách này càng lớn khi cần bán gấp.

## Core Concept

- **Lãi trên giấy (Paper Profit) vs. Lỗ thực hiện (Realized PnL):** Giá trị tài sản không nằm ở con số hiển thị trên bảng điện (Ask), mà nằm ở mức giá nhà cái chấp nhận mua lại từ bạn (Bid).
- **Cơ chế tự vệ của Market Maker:** Khi có làn sóng bán tháo (Panic Selling), nhà cái/tiệm vàng đối mặt với rủi ro cạn kiệt tiền mặt. Họ phòng thủ bằng cách giữ nguyên giá Bán ra để neo tâm lý, nhưng đánh sập giá Mua vào. Trọng số chênh lệch (Spread) bị kéo giãn từ 1-2% lên 5-10%.
- **Sự bốc hơi thanh khoản:** Khủng hoảng không làm tài sản bốc hơi, khủng hoảng làm "người mua" bốc hơi. Spread cao chính là phí phạt rủi ro nếu bạn muốn có tiền mặt ngay lập tức.

## Tử huyệt thị trường và rule of thumb

- **Tử huyệt Vàng vật chất (SJC):** Spread vàng miếng tại VN cực cao và chịu ảnh hưởng bởi chính sách (quota nhập khẩu). Khi có biến, các tiệm vàng dễ dàng nới Spread lên 5 triệu/lượng hoặc ngừng thu mua. Tài sản trú ẩn (Safe Haven) biến thành tài sản giam vốn.
- **Rule of Thumb (Chống kẹt hàng):** - Khi Spread > 5%, tuyệt đối cấm bán tháo (trừ khi cần tiền cứu mạng). Việc bán lúc này là gánh rủi ro thay cho nhà cái.
  - Phải chấp nhận hold dài hạn (Bag holding). Chờ đợi thị trường qua cơn hoảng loạn, Spread co hẹp lại về mức bình thường (1-2 triệu) rồi mới tiến hành cắt lỗ hoặc chốt lời.

---

**Related Notes:**

- Công cụ tính toán điểm rơi vốn: [[Dollar_Cost_Averaging]]
- Nghịch lý của tài sản an toàn: [[Safe_Haven_Asset]]
