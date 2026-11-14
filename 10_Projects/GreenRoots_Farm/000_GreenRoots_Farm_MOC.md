---
tags: [type/project, status/active]
date: 2026-11-11
description: "Bản đồ điều phối trung tâm dự án Website Thương mại điện tử Nông sản sạch theo mô hình Single Farm D2C."
---

# 000 GreenRoots Farm MOC

## TL;DR

- **Bản chất**: Bản đồ điều phối trung tâm lưu trữ các liên kết tài liệu kiến trúc, ranh giới phân quyền và lộ trình triển khai của hệ sinh thái nông sản.
- **Mục đích**: Định hướng phát triển hệ thống khép kín Farm-to-Table, triệt tiêu nguy cơ trượt bài toán sang sàn thương mại điện tử tổng hợp.
- **Điểm mấu chốt**: Ràng buộc sống còn nằm ở quản lý tồn kho theo Batch, thuật toán FEFO, và quy trình truy xuất nguồn gốc bằng QR Code.

---

## Bối cảnh Dự án và Phễu Vấn đề

Hệ thống được thiết kế giải quyết bài toán chuỗi cung ứng thực phẩm sạch theo mô hình phễu vấn đề:

- **Tầng vĩ mô**: Người tiêu dùng mất niềm tin vào nhãn mác thực phẩm sạch do tình trạng giả mạo nguồn gốc tràn lan.
- **Tầng trung gian**: Nông sản qua nhiều tầng thương lái làm đội chi phí và tăng thời gian lưu kho, dẫn đến suy giảm độ tươi ngon.
- **Tầng vi mô**: Nông trại đơn lẻ gặp khó khăn trong việc chứng minh quy trình canh tác minh bạch và chịu tỷ lệ xuất hủy cao do thiếu kiểm soát hạn sử dụng.
- **Giải pháp đề tài**: Nền tảng D2C khép kín cho một nông trại, tích hợp nhật ký canh tác số, quản lý kho theo Batch và xuất kho theo FEFO.

---

## Cấu trúc Thư mục và Tài liệu Kiến trúc

Tài liệu dự án được tổ chức theo chuẩn phân cấp kiến trúc phẳng (`Architecture/`, `Auth/`, `Database/`, `Submissions/`, `Workflows/`):

- Báo cáo hoàn chỉnh Chương 1 Tuần 1: [[Chapter_01_Project_Initiation_Report]]
- Đặc tả 5 Use Case cốt lõi & NFR Tuần 2: [[Week_02_Use_Case_Specs_and_NFR]]
- Hướng dẫn nhập liệu báo cáo cho Kim Anh: [[Kim_Anh_Word_Entry_Guide]]
- Đặc tả chi tiết 35 User Stories MoSCoW: [[MoSCoW_User_Stories_Specification]]
- Ánh xạ ca sử dụng Use Case: [[Use_Case_Specification_and_Diagram_Mapping]]
- Sơ đồ ERD và Từ điển Dữ liệu CSDL: [[Database_ERD_and_Data_Dictionary]]
- Đặc tả phân quyền 6 Roles RBAC: [[Role_Based_Access_Control_Specification]]
- Đặc tả quyết định kiến trúc: [[System_Scope_and_Decision_Records]]
- Hướng dẫn cấu trúc, Tech Stack & Setup: [[Architecture_TechStack_and_Setup_Guide]]
- Quy chuẩn Design Tokens & Typography: [[UI_Design_System_and_Tokens_Specification]]
- Đặc tả màn hình Storefront (`apps/storefront`): [[Storefront_Screen_Specs]]
- Đặc tả màn hình Backoffice (`apps/backoffice`): [[Backoffice_Screen_Specs]]
- Thiết kế kiến trúc gói định kỳ: [[Subscription_Architecture_and_Data_Design_ADR]]
- Chiến lược tích hợp Adapter Pattern: [[Third_Party_API_Adapter_Pattern_Strategy]]
- Phân tích mô hình kinh tế và bài toán: [[Business_Model_and_Domain_Analysis]]
- Đặc tả vận hành và trường hợp biên: [[Operations_and_Edge_Cases_RFC]]
- Lộ trình khởi tạo chuẩn doanh nghiệp: [[Project_Initiation_and_Execution_Roadmap]]
- Sổ tay thực thi thiết lập backend: [[Backend_Setup_Execution_Runbook]]

---

## Related Notes

- Báo cáo Tuần 1: [[Chapter_01_Project_Initiation_Report]]
- Đặc tả User Stories MoSCoW: [[MoSCoW_User_Stories_Specification]]
- Ánh xạ ca sử dụng Use Case: [[Use_Case_Specification_and_Diagram_Mapping]]
- Sơ đồ ERD và Dữ liệu CSDL: [[Database_ERD_and_Data_Dictionary]]
- Phân quyền 6 Roles RBAC: [[Role_Based_Access_Control_Specification]]
- Bản ghi quyết định hệ thống: [[System_Scope_and_Decision_Records]]
- Cấu trúc Monorepo & Tech Stack: [[Architecture_TechStack_and_Setup_Guide]]
- Quy chuẩn Design Tokens: [[UI_Design_System_and_Tokens_Specification]]
- Màn hình Storefront: [[Storefront_Screen_Specs]]
- Màn hình Backoffice: [[Backoffice_Screen_Specs]]
- Mẫu thiết kế tích hợp bên thứ ba: [[Third_Party_API_Adapter_Pattern_Strategy]]
- Phân tích mô hình kinh tế: [[Business_Model_and_Domain_Analysis]]
- Đặc tả vận hành và trường hợp biên: [[Operations_and_Edge_Cases_RFC]]
- Lộ trình khởi tạo dự án: [[Project_Initiation_and_Execution_Roadmap]]
- Cấu trúc hệ thống toàn cục: [[000_System_Structure]]
