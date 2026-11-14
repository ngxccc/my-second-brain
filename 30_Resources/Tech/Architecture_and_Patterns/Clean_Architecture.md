---
tags: [type/concept, status/permanent]
date: 2026-05-23
description: "Hệ tư tưởng phân tầng kiến trúc để cô lập và bảo vệ Core Business Logic khỏi sự phụ thuộc công nghệ."
---

# Clean Architecture

## TL;DR

- **Bản chất**: Clean Architecture tách lõi nghiệp vụ khỏi framework, database và thư viện bên thứ ba bằng luật phụ thuộc một chiều vào abstraction.
- **Mục đích**: Đổi công nghệ mà không phải viết lại business logic, và test được lõi mà không cần dựng database thật.
- **Điểm mấu chốt**: Giá trị thật là 5 tính độc lập (framework, UI, database, external agency, testable); mất một tính độc lập là mất lý do dùng kiến trúc này.

## Core Concept

- **Tại sao nó tồn tại?** Tránh thảm họa "dính chặt công nghệ" (Technology Lock-in). Khi business logic bị trộn lẫn với ORM (như Sequelize, Prisma) hoặc framework (như Express, NestJS), việc nâng cấp phiên bản, vá lỗi bảo mật, hay đổi database (từ SQL sang NoSQL) sẽ trở thành cơn ác mộng viết lại toàn bộ hệ thống từ đầu.
- **Giải quyết bài toán gì?** Đảm bảo 5 đặc tính độc lập cốt lõi:
  1. _Độc lập với Framework:_ Framework chỉ là công cụ vận chuyển, không được làm bá chủ cấu trúc thư mục của bạn.
  2. _Độc lập với UI:_ Web, Mobile, Console hay gRPC chỉ là các cổng giao tiếp. Đổi giao diện không được ảnh hưởng đến logic xử lý bên trong.
  3. _Độc lập với Database:_ Toàn bộ logic chạy bằng "In-Memory", database chỉ là kho chứa thứ cấp.
  4. _Độc lập với External Agency:_ Không quan tâm bên ngoài dùng SDK gì hay API bên thứ 3 nào.
  5. _Khả năng Unit Test tối thượng:_ Có thể viết test cho toàn bộ logic nghiệp vụ mà không cần bật database, không cần mở cổng port mạng, chạy cực nhanh trong 1 giây.
- **Nó có thay thế cái gì hay không?** Kế thừa và hợp nhất Onion Architecture, Hexagonal Architecture (Ports & Adapters) để quy chuẩn hóa. Nó khai tử kiến trúc 3 lớp (3-Tier: Presentation - Business - Data Access) kiểu cũ vốn lấy database làm trung tâm (DB Schema quyết định cấu trúc code).
- **Áp dụng vào những dự án nào?**
  - _Bắt buộc CÓ:_ Core product có độ phức tạp nghiệp vụ (domain logic) cao, dự án dài hạn (> 1 năm) dự kiến sẽ scale lớn, hoặc các sản phẩm có kế hoạch thay đổi hạ tầng kỹ thuật linh hoạt.
  - _Tuyệt đối KHÔNG:_ Các app CRUD đơn thuần, chỉ lấy data lên rồi hiển thị (an sinh xã hội cho data). Áp dụng Clean Architecture vào đây sẽ biến dự án thành đống "over-engineering" khổng lồ với hàng chục file Mapper, DTO, Adapter rác chạy lòng vòng vô nghĩa.

## Cơ chế hoạt động

### Quy tắc phụ thuộc

> "Source code dependencies must point only inward, toward higher-level policies."

Các vòng tròn đồng tâm đại diện cho các vùng khác nhau của phần mềm. Quy tắc sắt đá là: **Code ở vòng trong không được phép biết bất kỳ thông tin nào về code ở vòng ngoài.** Không được import class, function, hay database schema của vòng ngoài vào vòng trong.

### 4 Vòng tròn kinh điển

```mermaid
graph TD
    subgraph Frameworks & Drivers [Frameworks & Drivers: Web, DB, Devices, UI]
        subgraph Interface Adapters [Interface Adapters: Presenters, Controllers, Gateways]
            subgraph Use Cases [Use Cases: Application Business Rules]
                subgraph Entities [Entities: Enterprise Business Rules]
                end
            end
        end
    end
    style Entities fill:#ff9999,stroke:#333,stroke-width:2px
    style Use Cases fill:#ffcc99,stroke:#333,stroke-width:2px
    style Interface Adapters fill:#ffff99,stroke:#333,stroke-width:2px
    style Frameworks & Drivers fill:#99ccff,stroke:#333,stroke-width:2px
```

1. **Entities (Lòng đỏ):** Chứa các thực thể nghiệp vụ cốt lõi của doanh nghiệp (Enterprise-wide Business Rules). Nó là lớp sạch sẽ nhất, trần trụi nhất, không phụ thuộc vào bất cứ công cụ hay framework nào.
2. **Use Cases (Lòng trắng):** Chứa các kịch bản sử dụng cụ thể của ứng dụng (Application-specific Business Rules). Nó trực tiếp điều phối luồng dữ liệu đi qua các Entities để hoàn thành mục tiêu của người dùng.
3. **Interface Adapters (Vách ngăn):** Chuyển đổi dữ liệu từ cấu trúc tiện nhất cho Use Cases & Entities sang định dạng thuận tiện nhất cho Web/Database/UI. Đây là nơi ngự trị của Controllers, Presenters và định nghĩa Repositories (Interface/Ports).
4. **Frameworks & Drivers (Vỏ ngoài):** Lớp ngoài cùng bẩn nhất, chứa các công cụ cụ thể như PostgresDB, ExpressJS, Fastify, AWS SDK... Lớp này chỉ chứa code cấu hình, boilerplate và kết nối.

## Trade-offs

- Chi phí thiết lập ban đầu (Initial overhead) cực lớn.
- Đòi hỏi viết rất nhiều boilerplate code và ánh xạ dữ liệu (Data Mapping: Entity <-> DTO <-> DB Model) để giữ ranh giới sạch sẽ.
- Ranh giới kiến trúc rất mỏng manh, chỉ cần một dev lơ là import sai thư viện của vòng ngoài vào Entities là toàn bộ kiến trúc lập tức bị "thủng lưới".
- Ranh giới đó trông như thế nào trong code thật: [[Clean_Architecture_Layer_Code_Example]].

## Related Notes

- Ví dụ code bốn tầng của một lát cắt nghiệp vụ: [[Clean_Architecture_Layer_Code_Example]]
- Công cụ để đảo chiều phụ thuộc: [[Interface_Driven_Design]]
- Cách giữ Core không phụ thuộc framework: [[Test_Driven_Design]]
- Nguyên lý đứng sau việc chia tầng: [[SOLID_Principles]]
- Cơ chế nối Core với Adapter: [[Dependency_Injection]]
