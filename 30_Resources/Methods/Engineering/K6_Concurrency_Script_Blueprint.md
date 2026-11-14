---
tags: [type/method, status/permanent]
date: 2026-10-31
description: "Blueprint kịch bản k6 TypeScript cho test tranh chấp ghế: SharedArray fixture, IP giả lập, idempotency key và thresholds đếm chính xác."
---

# K6 Concurrency Script Blueprint

## TL;DR

- **Bản chất**: Kịch bản k6 cho test giành ghế: fixture qua `SharedArray`, token theo `vu.idInTest`, IP giả lập và `idempotency-key`, chốt bằng thresholds đếm.
- **Mục đích**: Có bản mẫu copy được thay vì tự dựng lại từng mảnh khi viết test tranh chấp mới.
- **Điểm mấu chốt**: `SharedArray` chỉ nạp fixture một lần trên Go heap — đây là điều kiện để chạy 500-2.000 VUs mà không nổ RAM.

## Context: When to use?

- **Dùng khi:** đã có SOP 5 bước và cần kịch bản chạy được cho một endpoint tranh chấp (đặt ghế, flash-sale, chuyển tiền).
- **Điều kiện tiên quyết:** file `fixtures/booking-fixtures.json` (users + token + ip) đã sinh sẵn, và server đã cấu hình `trust proxy` để đọc `X-Forwarded-For`.

## Core Concept: Blueprint kịch bản

```typescript
import { post } from "k6/http";
import { check } from "k6";
import { Counter } from "k6/metrics";
import { SharedArray } from "k6/data";
import { vu } from "k6/execution";
import { v7 as uuidv7 } from "uuid";

interface Fixture {
  targetUrl: string;
  showId: string;
  seatId: string;
  totalVus: number;
  users: Array<{ id: string; token: string; ip: string }>;
}

const fixtureData = new SharedArray<Fixture>("fixtures", () => {
  return [JSON.parse(open("./fixtures/booking-fixtures.json"))];
});
const fixture = fixtureData[0]!;

export const reserve201 = new Counter("reserve_success_201");
export const reserve409 = new Counter("reserve_conflict_409");
export const reserveErrors = new Counter("reserve_unexpected_errors");

export const options = {
  discardResponseBodies: true,
  scenarios: {
    burst_collision: {
      executor: "per-vu-iterations",
      vus: fixture.totalVus,
      iterations: 1,
      maxDuration: "10s",
      gracefulStop: "1s",
    },
  },
  thresholds: {
    reserve_success_201: ["count==1"],
    reserve_conflict_409: [`count==${fixture.totalVus - 1}`],
    reserve_unexpected_errors: [
      { threshold: "count==0", abortOnFail: true, delayAbortEval: "1s" },
    ],
  },
};

export default function (): void {
  const vuId = vu.idInTest;
  const user = fixture.users[(vuId - 1) % fixture.users.length]!;
  const url = `${fixture.targetUrl}/bookings/reserve`;

  const payload = JSON.stringify({
    showId: fixture.showId,
    seatIds: [fixture.seatId],
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
      "idempotency-key": uuidv7(),
      "X-Forwarded-For": user.ip,
    },
  };

  const res = post(url, payload, params);

  if (res.status === 201) reserve201.add(1);
  else if (res.status === 409) reserve409.add(1);
  else reserveErrors.add(1);

  check(res, {
    "status is valid": (r) => r.status === 201 || r.status === 409,
    "no 500 error": (r) => r.status !== 500,
  });
}
```

## Cách đọc blueprint

- **`SharedArray`**: fixture nạp một lần, chia sẻ read-only cho mọi VU; thay bằng đọc file trong `default()` sẽ nhân bản RAM theo số VU.
- **`vu.idInTest`**: nguồn phân chia user/IP duy nhất; `__VU` chỉ đúng khi chạy một instance.
- **`per-vu-iterations` với `iterations: 1`**: mọi VU bắn đúng một request tại $t=0$, tạo xung đột thật.
- **Thresholds đếm**: `count==1` cho 201 và `count==totalVus-1` cho 409 biến test tải thành test bất biến nghiệp vụ.
- **`abortOnFail`**: dừng ngay khi xuất hiện lỗi ngoài dự kiến, tránh đốt tải vô ích.

## Related Notes

- Quy trình 5 bước và đối soát database sau test: [[K6_High_Concurrency_Load_Testing_SOP]]
- Kiến trúc bộ nhớ và vòng đời k6: [[K6_Execution_Lifecycle_and_Memory_Architecture]]
- Mô hình kịch bản thực thi k6: [[K6_Scenario_Executors_and_Workload_Modeling]]
- Hệ thống đo lường và ngưỡng kiểm định k6: [[K6_Telemetry_Metrics_and_Threshold_Gates]]
