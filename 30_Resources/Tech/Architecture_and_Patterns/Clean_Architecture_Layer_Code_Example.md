---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Ví dụ code TypeScript bốn tầng của Clean Architecture: Entity, Use Case với Port, Controller và Repository adapter SQL."
---

# Clean Architecture: Ví dụ Code Bốn Tầng

## TL;DR

- **Bản chất**: Một lát cắt nghiệp vụ rút tiền chạy xuyên 4 tầng: Entity giữ invariant, Use Case điều phối qua Port, Controller map DTO, Repository là adapter SQL.
- **Mục đích**: Thấy ranh giới phụ thuộc bằng code thật: `WithdrawUseCase` chỉ biết interface `IAccountRepository`, không biết Postgres tồn tại.
- **Điểm mấu chốt**: `BankAccount.withdraw()` không có một dòng framework nào, còn `PostgresAccountRepository` phải map DB model sang Domain Entity — hai chỗ dễ vỡ luật phụ thuộc nhất.

## Core Concept: Bốn tầng trong một lát cắt rút tiền

```typescript
// ==========================================
// TẦNG 1: ENTITIES (Enterprise Business Rules)
// ==========================================
export class BankAccount {
  constructor(
    public readonly id: string,
    private balance: number,
    public readonly ownerEmail: string,
  ) {}

  // Pure business rule - invariant validation, NO framework code, NO database knowledge
  public withdraw(amount: number): void {
    if (amount <= 0) throw new Error("Withdrawal amount must be positive");
    if (amount > this.balance) throw new Error("Insufficient funds");

    this.balance -= amount;
  }

  public getBalance(): number {
    return this.balance;
  }
}

// ==========================================
// TẦNG 2: USE CASES (Application Business Rules)
// ==========================================
// DTOs for data boundary crossing
export interface WithdrawRequest {
  accountId: string;
  amount: number;
}

// Port (Interface) that must be implemented by Outer layers (DIP)
export interface IAccountRepository {
  findById(id: string): Promise<BankAccount | null>;
  update(account: BankAccount): Promise<void>;
}

export class WithdrawUseCase {
  // Inject repository interface, NOT concrete implementation
  constructor(private readonly accountRepo: IAccountRepository) {}

  public async execute(request: WithdrawRequest): Promise<number> {
    const account = await this.accountRepo.findById(request.accountId);
    if (!account) {
      throw new Error("Account not found");
    }

    // Domain entity handles pure business logic
    account.withdraw(request.amount);

    // Save changes back to infrastructure through the port
    await this.accountRepo.update(account);

    return account.getBalance();
  }
}

// ==========================================
// TẦNG 3: INTERFACE ADAPTERS (Controllers, Presenters)
// ==========================================
export class AccountController {
  constructor(private readonly withdrawUseCase: WithdrawUseCase) {}

  // Maps HTTP Request to Use Case Input DTO and coordinates flow
  public async handleWithdraw(
    req: { body: { accountId: string; amount: number } },
    res: any,
  ): Promise<void> {
    try {
      const { accountId, amount } = req.body;
      const newBalance = await this.withdrawUseCase.execute({
        accountId,
        amount,
      });

      // Presenter role - returns clean JSON format
      res.status(200).json({ success: true, balance: newBalance });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}

// ==========================================
// TẦNG 4: FRAMEWORKS & DRIVERS (Infrastructure, DB, Web Express)
// ==========================================
// SQL Implementation of the Repository Port
export class PostgresAccountRepository implements IAccountRepository {
  // WHY: Keeps database details encapsulated. High level rules don't know Prisma/SQL exists.
  public async findById(id: string): Promise<BankAccount | null> {
    console.log(`[SQL Query] SELECT * FROM accounts WHERE id = '${id}'`);
    // Simulating DB hit and mapping Database model to Domain Entity
    return new BankAccount(id, 1000, "user@domain.com");
  }

  public async update(account: BankAccount): Promise<void> {
    console.log(
      `[SQL Query] UPDATE accounts SET balance = ${account.getBalance()} WHERE id = '${account.id}'`,
    );
  }
}
```

## Ranh giới nào dễ vỡ nhất

- **Entity**: chỉ chứa invariant nghiệp vụ thuần; thêm một import ORM hoặc decorator framework vào đây là mất luôn tính độc lập với Database.
- **Use Case**: nhận interface (Port) qua constructor, không tự `new` implementation; đổi từ Postgres sang Mongo chỉ đổi chỗ wiring.
- **Controller**: chỉ map request sang DTO và định dạng response; nếu Controller gọi thẳng DB thì Use Case bị vô hiệu hóa.
- **Repository adapter**: chịu trách nhiệm map DB model sang Domain Entity; để lộ row thô của database ra tầng trong là rò rỉ schema vào nghiệp vụ.

## Related Notes

- Nguyên lý, 4 vòng tròn và điều kiện áp dụng: [[Clean_Architecture]]
- [[Dependency_Injection]]: Cơ chế đưa implementation vào Port mà không để tầng trong biết tầng ngoài.
- [[Repository_Pattern_vs_Fat_Service]]: Vì sao Repository là Port chứ không phải lớp truy vấn tuỳ tiện.
- [[Test_Driven_Design]]: Lợi ích testable của ranh giới này chỉ hiện ra khi viết test trước.
