---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Ví dụ code đối chiếu một class vi phạm cả SRP lẫn DIP với phiên bản tách interface theo SOLID."
---

# SOLID: Ví dụ Code Vi phạm và Bản Chuẩn

## TL;DR

- **Bản chất**: Cùng một luồng xử lý đơn hàng được viết hai lần: bản `ViolationOrderProcessor` vi phạm SRP và DIP, bản `SolidOrderProcessor` tách thành ba interface.
- **Mục đích**: Thấy bằng code cái giá của tight-coupling: đổi database hay đổi nhà cung cấp email đều phải sửa class nghiệp vụ.
- **Điểm mấu chốt**: Khác biệt nằm ở constructor: bản chuẩn nhận interface qua tham số, bản vi phạm tự `new PostgresDatabase()` bên trong.

## Core Concept: Đối chiếu hai phiên bản

```typescript
// ==========================================
// BAD WAY: tightly coupled, violations everywhere
// ==========================================
class ViolationOrderProcessor {
  // Violates SRP: Handles validation, database saving, and email notifications in one class
  // Violates DIP: Directly depends on concrete class PostgresDatabase and GmailService
  public processOrder(order: any) {
    if (order.amount <= 0) throw new Error("Invalid order amount");

    const db = new PostgresDatabase(); // Coupled!
    db.saveOrder(order);

    const mailer = new GmailService(); // Coupled!
    mailer.sendEmail(order.userEmail, "Order Processed successfully!");
  }
}

// ==========================================
// GOOD WAY: Pure SOLID
// ==========================================

// --- SRP & ISP: Small, highly cohesive Interfaces ---
export interface IOrderValidator {
  validate(order: Order): void;
}

export interface IOrderRepository {
  save(order: Order): Promise<void>;
}

export interface INotificationService {
  notify(recipient: string, message: string): Promise<void>;
}

// --- LSP compliant subclasses ---
export class Order {
  constructor(
    public readonly id: string,
    public readonly amount: number,
    public readonly userEmail: string,
  ) {}
}

// --- Concrete Implementations (Details depending on Abstraction) ---
export class DomainOrderValidator implements IOrderValidator {
  public validate(order: Order): void {
    if (order.amount <= 0) {
      throw new Error("Order amount must be greater than zero.");
    }
  }
}

export class PostgresOrderRepository implements IOrderRepository {
  // WHY: Keeps database operations isolated from business flow.
  // Time Complexity: O(1) for insert query.
  public async save(order: Order): Promise<void> {
    console.log(`[Database] Saving order ${order.id} to Postgres...`);
  }
}

export class SESNotificationService implements INotificationService {
  public async notify(recipient: string, message: string): Promise<void> {
    console.log(`[SES Email] Sending to ${recipient}: ${message}`);
  }
}

// --- DIP: High-level module depends ONLY on interfaces ---
// --- OCP: We can swap DB or Notification system without changing this class ---
export class SolidOrderProcessor {
  constructor(
    private readonly validator: IOrderValidator,
    private readonly repository: IOrderRepository,
    private readonly notifier: INotificationService,
  ) {}

  // PERF: DB and Mail notifications are executed asynchronously to keep response times low
  public async process(order: Order): Promise<void> {
    this.validator.validate(order);

    await this.repository.save(order);

    // Non-blocking notification flow to avoid dragging API latency down
    this.notifier
      .notify(order.userEmail, `Your order ${order.id} has been processed!`)
      .catch((err) => console.error("Failed to send notification:", err));
  }
}
```

## Nguyên lý nào nằm ở dòng nào

- **SRP**: bản vi phạm gom validate + save + notify trong một method; bản chuẩn tách thành ba class một nhiệm vụ.
- **DIP/OCP**: `SolidOrderProcessor` nhận interface qua constructor, nên đổi Postgres sang Mongo hay Gmail sang SES là thay ở chỗ wiring, không sửa class.
- **LSP**: các implementation (`DomainOrderValidator`, `PostgresOrderRepository`) thực thi đủ hành vi của interface, không ném ngoại lệ "chưa hỗ trợ".
- **ISP**: ba interface nhỏ thay vì một interface khổng lồ gộp cả ba hành vi.
- **PERF**: notification được gọi bất đồng bộ và có `.catch`, tránh kéo latency API xuống.

## Related Notes

- Bốn căn bệnh phần mềm và điều kiện áp dụng: [[SOLID_Principles]]
- [[Dependency_Injection]]: Cơ chế đưa ba implementation vào `SolidOrderProcessor`.
- [[Clean_Architecture]]: Các interface này chính là Port ở tầng Use Case.
- [[Test_Driven_Design]]: Lợi ích thật của việc tách interface hiện ra khi viết test với fake implementation.
