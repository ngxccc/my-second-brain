---
tags: [type/submission, status/active]
date: 2026-11-11
description: "Báo cáo hoàn chỉnh Chương 1 khởi tạo dự án và định hình bài toán cho đồ án thương mại điện tử nông sản sạch."
---

# Báo cáo Chương 1: Tổng quan và Khởi tạo Dự án

## TL;DR

- **Bản chất**: Tài liệu hoàn chỉnh Chương 1 phục vụ nghiệm thu Tuần 1 theo chuẩn học thuật của đồ án thương mại điện tử nông sản sạch.
- **Mục đích**: Cung cấp toàn bộ lý luận phễu vấn đề, ma trận MoSCoW, phân tích cạnh tranh và kế hoạch rủi ro kỹ thuật để nộp giảng viên.
- **Điểm mấu chốt**: Bảo vệ thành công tính cấp thiết của quản lý kho theo Batch và FEFO thông qua số liệu thực tế thị trường giai đoạn 2025-2026.

---

## Lời Cảm Ơn

Lời đầu tiên, em xin gửi lời cảm ơn chân thành và sâu sắc nhất đến Ban Giám hiệu Nhà trường cùng quý Thầy, Cô Khoa Công nghệ Thông tin đã tạo điều kiện học tập thuận lợi và truyền đạt cho em những nền tảng tri thức quý báu trong suốt thời gian qua.

Đặc biệt, em xin bày tỏ lòng biết ơn sâu sắc đến Thầy Nguyễn Đức Duy – Giảng viên phụ trách và hướng dẫn trực tiếp đồ án môn học. Với sự tận tâm, những định hướng chuyên môn sâu sắc và các tiêu chuẩn đánh giá nghiêm túc, Thầy đã giúp em định hình đúng bản chất bài toán nghiệp vụ nông sản tươi, rèn luyện tư duy kiến trúc hệ thống và nhận diện những cạm bẫy kỹ thuật trong thực tế.

Em cũng xin gửi lời cảm ơn chân thành đến gia đình và bạn bè đã luôn động viên, hỗ trợ và tạo mọi điều kiện tốt nhất cho em trong suốt quá trình hoàn thành đồ án này.

Dù đã dành nhiều nỗ lực và nghiêm túc đầu tư nghiên cứu, song do giới hạn về mặt thời gian và kinh nghiệm thực tiễn, đồ án chắc chắn không tránh khỏi những thiếu sót nhất định. Em rất mong nhận được những lời nhận xét, đánh giá và góp ý quý báu từ quý Thầy, Cô để đề tài được hoàn thiện hơn nữa.

Em xin chân thành cảm ơn!

---

## Lời Mở Đầu

Trong xu thế chuyển đổi số mạnh mẽ của nền kinh tế, việc ứng dụng công nghệ thông tin vào chuỗi giá trị nông nghiệp sạch đang trở thành một đòi hỏi cấp thiết nhằm thúc đẩy phát triển bền vững. Tại các đô thị lớn ở Việt Nam, nhu cầu tiêu dùng nông sản hữu cơ tăng trưởng ổn định, song thị trường lại đang đối mặt với cuộc khủng hoảng niềm tin nghiêm trọng do vấn nạn mập mờ nhãn mác và thiếu các công cụ truy xuất nguồn gốc số độc lập.

Mặt khác, các nền tảng thương mại điện tử đại trà hiện nay hầu như chưa giải quyết được bài toán đặc thù của nông sản tươi sống: thời gian lưu kho ngắn, tỷ lệ hao hụt cao và yêu cầu khắt khe về chuỗi cung ứng lạnh chặng cuối. Xuất phát từ bối cảnh đó, đề tài **"Xây dựng Nền tảng Thương mại Điện tử D2C Nông sản Sạch tích hợp Quản lý Lô hàng và Truy xuất Nguồn gốc Canh tác"** được nghiên cứu và phát triển nhằm mang lại giải pháp công nghệ toàn diện dành riêng cho một nông trại khép kín.

Đề tài tập trung giải quyết bài toán cốt lõi thông qua việc kết hợp bán hàng trực tiếp đến người tiêu dùng, minh bạch hóa nhật ký mùa vụ qua mã QR trên từng bao bì, và tối ưu hóa vận hành kho bãi bằng thuật toán xuất kho **FEFO (First-Expired, First-Out)** nhằm giảm thiểu tối đa tỷ lệ hư hao nông sản.

Xuất phát từ các yêu cầu thực tiễn trên, toàn bộ báo cáo đồ án được triển khai mạch lạc theo quy trình công nghệ phần mềm: từ khảo sát bối cảnh bài toán, thiết kế kiến trúc hệ thống, hiện thực hóa mã nguồn cho đến đánh giá nghiệm thu thực nghiệm.

---

## 1.1. Tính Cấp thiết của Đề tài

Trong bối cảnh kinh tế và xã hội giai đoạn hiện nay, nhận thức của người tiêu dùng tại các đô thị Việt Nam đối với an toàn sức khỏe đã xác lập một chuẩn mực tiêu dùng mới. Theo Báo cáo Khảo sát Người tiêu dùng Việt Nam của **PwC (Voice of the Consumer Survey 2025)**, thị trường ghi nhận sự chuyển dịch sâu sắc: người tiêu dùng ngày càng thắt chặt chi tiêu do những bất ổn kinh tế, nhưng lại trở nên khắt khe hơn bao giờ hết đối với chất lượng dinh dưỡng, độ an toàn và tính minh bạch nguồn gốc của thực phẩm hàng ngày **[1]**. Đồng thời, các khảo sát thị trường từ **Vietnam Report** chỉ ra rằng người tiêu dùng đô thị đã hình thành thói quen kiểm tra gắt gao nguồn gốc xuất xứ trước khi mua thực phẩm tươi sống, đưa việc truy xuất nguồn gốc số thành tiêu chuẩn bắt buộc **[2]**. Tuy nhiên, niềm tin thị trường vẫn bị tổn hại nghiêm trọng sau hàng loạt vụ việc gian lận tem mác, điển hình là vụ việc rau trôi nổi dán nhãn VietGAP giả tuồn vào các hệ thống siêu thị lớn (tháng 9/2022), đã khiến người tiêu dùng mất niềm tin vào các chứng nhận dán mác tĩnh và tạo nên sự hoài nghi đối với các sản phẩm nông sản sạch trôi nổi **[2]**.

Xét dưới góc độ chuỗi cung ứng, hạ tầng logistics nông nghiệp tại Việt Nam vẫn là một điểm nghẽn cấu trúc chưa được giải quyết triệt để. Theo các báo cáo chuyên ngành từ **Vietnam Logistics Review (VLR giai đoạn 2025–2026)** và Hiệp hội Doanh nghiệp Dịch vụ Logistics Việt Nam (VLA), chi phí logistics nông sản hiện chiếm tới **20% - 25%** tổng chi phí chuỗi giá trị, riêng ngành hàng rau quả tươi sống chiếm gần **30% giá thành sản phẩm**—cao gần gấp đôi so với các quốc gia lân cận như Thái Lan **[3]**. Hơn nữa, theo thống kê từ Bộ Nông nghiệp & Phát triển Nông thôn và Tổ chức Lương thực và Nông nghiệp Liên Hợp Quốc (FAO), hàng năm Việt Nam thất thoát khoảng **8.8 triệu tấn nông sản** (thiệt hại kinh tế ước tính gần **3.9 tỷ USD**, chiếm khoảng 12% GDP nông nghiệp), trong đó tỷ lệ hao hụt đối với rau củ quả tươi sống sau thu hoạch vẫn ở mức báo động từ **20% đến 30%** do sự thiếu hụt hạ tầng chuỗi lạnh (Cold Chain) đồng bộ và thời gian luân chuyển qua 3–4 tầng thương lái kéo dài thời gian lưu kho **[4]**.

Ở quy mô vi mô, các nông trại sản xuất hữu cơ độc lập (Single Farm) đối mặt với thách thức kép: vừa gặp khó khăn trong việc chứng minh quy trình canh tác minh bạch với khách hàng bằng các công cụ số độc lập, vừa chịu tổn thất lớn do phương thức quản lý kho tươi sống thô sơ. Nông sản tươi sống có chu kỳ vòng đời ngắn (24–72 giờ), việc quản lý tồn kho theo số lượng tổng đại trà khiến nông trại không kiểm soát được hạn sử dụng của từng đợt thu hoạch, dẫn đến tỷ lệ xuất hủy hàng dập nát, quá hạn trong kho nội bộ lên tới **15% - 20%**.

Nhằm giải quyết triệt để các thách thức trên, đề tài **"Xây dựng Website Thương mại điện tử Nông sản sạch dành riêng cho 1 Nông trại"** được triển khai theo mô hình D2C (Direct-to-Consumer) khép kín. Hệ thống tích hợp cơ chế minh bạch hóa 3 lớp qua mã QR truy xuất nguồn gốc Lô hàng, ứng dụng động cơ quản lý kho theo Lô (Batch Inventory) với thuật toán xuất kho **FEFO (First-Expired, First-Out)** nhằm giảm thiểu tỷ lệ hao hụt, và áp dụng mô hình giỏ hàng định kỳ (**Subscription**) giao theo tuyến đường cố định để tối ưu hóa chi phí vận chuyển chặng cuối, hiện thực hóa mục tiêu kết nối minh bạch từ nông trại đến bàn ăn.

---

## 1.2. Mục tiêu của Đề tài và Mục tiêu S.M.A.R.T

Mục tiêu tổng quát là xây dựng hoàn chỉnh nền tảng thương mại điện tử D2C khép kín cho một nông trại hữu cơ, tích hợp quy trình minh bạch hóa canh tác và động cơ quản lý tồn kho theo Lô xuất hàng theo nguyên tắc FEFO.

Hệ thống chỉ tiêu định lượng phục vụ nghiệm thu đề tài theo tiêu chuẩn S.M.A.R.T:

| Tiêu chí           | Nội dung cụ thể hóa cho đề tài                                                                                                                                                                       | Chỉ số đo lường nghiệm thu (Metrics)                                                                                                                                                                                                                                                           |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **S - Specific**   | Phát triển hệ sinh thái Web D2C gồm 2 phân hệ: Storefront (cho Khách hàng) và Dashboard (cho Farm Staff, Sales, Admin, SuperAdmin) với 6 roles phân quyền qua RBAC.                                  | Hoàn thiện đầy đủ 6 nhóm vai trò và các module chức năng theo đặc tả.                                                                                                                                                                                                                          |
| **M - Measurable** | Định lượng hóa hiệu năng và độ chính xác của các thuật toán lõi trong hệ thống.                                                                                                                      | - Thời gian phản hồi quét mã QR truy xuất: $\le 1.5$ giây.<br>- Tỷ lệ đơn hàng xuất kho tuân thủ nghiêm ngặt thuật toán FEFO: 100%.<br>- Tỷ lệ đơn hàng Subscription tự động sinh đúng lịch hàng tuần: 100%.<br>- Tỷ lệ giảm hao hụt xuất hủy nông sản trong kho: giảm từ 20% xuống $\le 5\%$. |
| **A - Achievable** | Phạm vi được tinh gọn và kiểm soát chặt chẽ để khả thi trong khung thời gian 3 tuần (21 ngày); loại bỏ Mobile App native và AI để tập trung hoàn thiện 100% nhóm Must-have và Should-have then chốt. | Hoàn thành 100% nhóm tính năng Must-have và các tính năng Should-have trọng tâm.                                                                                                                                                                                                               |
| **R - Relevant**   | Trực tiếp giải quyết bài toán cốt lõi của hàng tươi sống: tính minh bạch canh tác và quản lý hạn sử dụng ngắn hạn.                                                                                   | Khớp 100% với đề cương môn học và tiêu chí đánh giá nông sản sạch.                                                                                                                                                                                                                             |
| **T - Time-bound** | Phân bổ tiến độ thực hiện theo lộ trình 3 tuần (21 ngày), chia nhỏ theo từng nửa tuần (Sprint 3.5 ngày).                                                                                             | - Tuần 1: Khởi tạo, Đặc tả Use Case, thiết kế CSDL Drizzle & dựng khung Monorepo/Auth.<br>- Tuần 2: Backend NestJS Core (Lô hàng, QR, FEFO) & Tích hợp Third-party (PayOS, Maps, Media).<br>- Tuần 3: Frontend Next.js Storefront, Dashboard React.js, Kiểm thử E2E & Đóng gói Báo cáo.        |

---

## 1.3. Thiết lập Phạm vi Dự án (Ma trận MoSCoW)

Bảng phân loại phạm vi chức năng dùng làm cơ sở nghiệm thu và bảo vệ đồ án:

| Phân loại       | Tính năng cụ thể                                                                                                                                                                                     | Ràng buộc kỹ thuật & Ý nghĩa nghiệm thu                                                                                                             |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Must-have**   | - Giỏ hàng, Đặt hàng, Thanh toán COD/Cơ bản.<br>- Quản lý kho theo Lô.<br>- Tự động đề xuất xuất kho theo FEFO.<br>- Tạo và quét mã QR truy xuất nguồn gốc.<br>- Ghi nhận Xuất hủy / Hao hụt nội bộ. | Điều kiện tiên quyết để đạt điểm qua môn. Nếu không có Batch và FEFO, hệ thống sẽ bị đánh trượt vì trượt khỏi bản chất bài toán nông sản tươi sống. |
| **Should-have** | - Gói rau định kỳ tự sinh đơn.<br>- Tích điểm thành viên.<br>- Nhật ký canh tác dạng dòng thời gian.<br>- Quy trình gửi khiếu nại (upload ảnh/video).                                                | Điều kiện để đạt điểm Khá/Giỏi. Tối ưu hóa chuỗi cung ứng chặng cuối và nâng cao trải nghiệm khách hàng.                                            |
| **Could-have**  | - Tích hợp cổng thanh toán trực tuyến PayOS.<br>- Tính phí ship động theo km.<br>- Tự động cảnh báo xả hàng.                                                                                         | Điều kiện đạt điểm Xuất sắc. Gia tăng tính tự động hóa và độ hoàn thiện thực tế của doanh nghiệp.                                                   |
| **Won't-have**  | - Ứng dụng di động.<br>- Mô hình đa gian hàng.<br>- AI dự báo sản lượng mùa vụ.                                                                                                                      | Loại bỏ dứt khoát để tối ưu hóa nguồn lực trong khung thời gian 3 tuần, tập trung toàn lực vào bài toán Single Farm D2C.                            |

Việc nhóm quyết định đưa tính năng Quản lý tồn kho theo Lô và thuật toán xuất kho FEFO vào nhóm **Must-have** (thay vì Should-have như các đồ án TMĐT thông thường) xuất phát từ bản chất cơ bản của sản phẩm nông sản tươi sống có vòng đời ngắn (24–72 giờ). Nếu chỉ quản lý tồn kho theo số lượng tổng, hệ thống sẽ thoái hóa thành một website bán hàng công nghiệp đại trà, không giải quyết được bài toán thất thoát và xuất hủy hàng cận hạn. Ngược lại, nhóm chủ động đưa ứng dụng di động gốc (Mobile App) và AI dự báo sản lượng vào nhóm **Won't-have** nhằm tránh hiện tượng phân tán nguồn lực (Scope Creep), đảm bảo toàn bộ khung thời gian 3 tuần được dồn vào việc hoàn thiện chất lượng nghiệp vụ lõi trên nền tảng Web chuẩn Mobile-first.

---

## 1.4. Phân tích Đối thủ Cạnh tranh

Bảng đối chiếu chuyên biệt làm nổi bật giải pháp của đồ án so với các mô hình thương mại hiện có trên thị trường:

| Tiêu chí so sánh                    | Sàn TMĐT tổng hợp (Shopee, Lazada, TikTok Shop)                                                                  | Chuỗi siêu thị thực phẩm Online (Bách Hóa Xanh, WinMart)                                                                   | Giải pháp của Đồ án (Single Farm D2C Platform)                                                                                            |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Quản lý Hạn sử dụng & Kho hàng**  | Không hỗ trợ quản lý kho theo HSD ngắn hạn. Người mua phụ thuộc hoàn toàn vào hạn dùng người bán gửi ngẫu nhiên. | Có quản lý kho nhưng không hiển thị thông tin Lô cụ thể cho khách online; xuất kho phụ thuộc nhân viên nhặt hàng thủ công. | **Bắt buộc**: Quản lý nghiêm ngặt theo từng Lô thu hoạch (Batch) và ép buộc xuất kho theo thuật toán **FEFO** tự động.                    |
| **Minh bạch & Truy xuất nguồn gốc** | Phụ thuộc vào mô tả chữ và hình ảnh do người bán tự đăng tải; không có cơ chế đối soát độc lập.                  | Chỉ hiển thị thông tin nhà cung cấp chung chung trên nhãn dán tĩnh; không có dòng thời gian canh tác.                      | Quét mã QR trên từng bao bì dẫn đến **Hồ sơ Lô đất**: Xem dòng thời gian canh tác (ảnh/video), kỹ sư phụ trách, và kết quả test đất/nước. |
| **Mô hình Mua hàng Định kỳ**        | Chỉ hỗ trợ mua lẻ từng đơn ngắt quãng. Khách phải tự nhớ để đặt lại hàng tuần.                                   | Hiếm khi áp dụng gói định kỳ cho rau củ tươi do hạn chế trong gom tuyến vận chuyển.                                        | Hỗ trợ **Gói rau tháng**: Hệ thống tự động sinh đơn cố định vào Thứ 3, Thứ 6; tối ưu hóa chi phí giao nhận chặng cuối.                    |
| **Biểu phí Giao hàng & Thời gian**  | Phí ship cố định theo đơn vị vận chuyển sàn; thời gian giao từ 1 đến 3 ngày (rau ăn lá sẽ bị héo hỏng).          | Giao trong ngày nhưng phụ thuộc vào bán kính cửa hàng gần nhất; phí ship cố định theo khung giờ.                           | **Tính phí động theo km thực tế** từ nông trại; tích hợp luồng điều phối giao hỏa tốc trong ngày để bảo toàn độ tươi.                     |
| **Quy trình Xử lý Hàng dập nát**    | Quy trình trả hàng cồng kềnh: Phải gửi trả hàng vật lý qua bưu cục, không phù hợp cho đồ tươi sống.              | Khách phải mang rau hỏng ra cửa hàng hoặc gọi tổng đài khiếu nại thủ công.                                                 | Cho phép gửi khiếu nại kèm ảnh/video **trực tiếp trên đơn hàng trong vòng 2 giờ**; Sales duyệt bồi hoàn hoặc giao bù tức thì.             |

---

## 1.5. Kế hoạch Quản trị Rủi ro Kỹ thuật (Kế hoạch Dự phòng)

Nhận diện rủi ro kỹ thuật và phương án dự phòng kiến trúc phần mềm:

Trong quá trình vận hành, hệ thống tích hợp các dịch vụ bên thứ ba bao gồm: Cổng thanh toán trực tuyến (PayOS), tính khoảng cách địa lý (Google Maps Distance Matrix), và dịch vụ lưu trữ media (Cloudinary). Nhóm nhận diện các rủi ro kỹ thuật trọng yếu: sự cố gián đoạn kết nối Internet tại thời điểm nghiệm thu đồ án, sự thay đổi chính sách API, hoặc cạn kiệt hạn mức gọi miễn phí làm tê liệt luồng đặt hàng.

**Phương án dự phòng kiến trúc (Architectural Mitigation)**: Backend (NestJS) được thiết kế theo mẫu **Adapter Pattern kết hợp Strategy Pattern**. Toàn bộ dịch vụ bên ngoài được bọc qua các Interface trừu tượng và cung cấp song song hai bộ Driver:

1. `RealDriver`: Kết nối trực tiếp đến API PayOS và Google Maps khi môi trường có Internet và API key hợp lệ.
2. `MockDriver`: Sử dụng thuật toán **Haversine** (bổ sung hệ số khúc quanh đường bộ $\approx 1.3$) để tính khoảng cách nội suy từ tọa độ Nông trại và tính phí ship nội bộ; kết hợp trang giả lập cổng thanh toán cục bộ để xác nhận giao dịch tự động không phụ thuộc mạng.

Việc chuyển đổi giữa Driver thật và Driver dự phòng được điều khiển hoàn toàn qua biến môi trường (`.env`) mà không cần thay đổi bất kỳ dòng mã nguồn nghiệp vụ nào.

---

## Danh mục Tài liệu Tham khảo Chương 1

Các tài liệu và báo cáo chính thức được trích dẫn trong văn bản:

- **[1] PwC Vietnam** (2025), _Khảo sát Người tiêu dùng Việt Nam 2025: Thấu hiểu xu hướng tiêu dùng thời kỳ mới (Voice of the Consumer Survey 2025)_, Báo cáo Nghiên cứu Thị trường PwC Việt Nam, công bố ngày 10/10/2025. <https://www.pwc.com/vn/vn/publications/2025/voice-of-consumer-2025.pdf>.
- **[2] Vietnam Report & Báo Tuổi Trẻ** (2025-2026), _Sức mua tăng, cùng lúc người Việt ngày càng "soi" nguồn gốc thực phẩm_, Báo Tuổi Trẻ & Cổng thông tin Vietnam.vn (<https://www.vietnam.vn/suc-mua-tang-cung-luc-nguoi-viet-ngay-cang-soi-nguon-goc-thuc-pham>); kết hợp vụ việc điều tra báo chí: Báo Dân Việt (23/09/2022), _Người trồng rau VietGAP thật bị vạ lây vì hàng dỏm tuồn vào siêu thị_ (<https://danviet.vn/nguoi-trong-rau-vietgap-that-bi-va-lay-vi-hang-vietgap-dom-tuon-vao-sieu-thi-20220923152407785-d1045306.html>).
- **[3] Vietnam Logistics Review (VLR) & Hiệp hội Logistics Việt Nam (VLA)** (2025-2026), _Chuỗi lạnh nông sản Việt Nam: Bao giờ thoát cảnh "được mùa rớt giá"_, Tạp chí Diễn đàn Doanh nghiệp & VLR. <https://vlr.vn/chuoi-lanh-nong-san-viet-nam-bao-gio-thoat-canh-duoc-mua-rot-gia-26306.html>.
- **[4] Bộ Nông nghiệp & Phát triển Nông thôn (MARD) & Tổ chức FAO** (2025-2026), _Giảm thất thoát trong chuỗi cung ứng nông sản và Đẩy mạnh ứng dụng công nghệ bảo quản sau thu hoạch_, Báo Nhân Dân. <https://nhandan.vn/ocop/giam-that-thoat-trong-chuoi-cung-ung-nong-san-post999834.html>.

---

## Related Notes

- Bản đồ dự án: [[000_GreenRoots_Farm_MOC]]
- Phân tích mô hình kinh tế: [[Business_Model_and_Domain_Analysis]]
- Quyết định kiến trúc hệ thống: [[System_Scope_and_Decision_Records]]
- Xử lý trường hợp biên: [[Operations_and_Edge_Cases_RFC]]
- Mẫu thiết kế tích hợp bên thứ ba: [[Third_Party_API_Adapter_Pattern_Strategy]]
- Lộ trình khởi tạo dự án: [[Project_Initiation_and_Execution_Roadmap]]
