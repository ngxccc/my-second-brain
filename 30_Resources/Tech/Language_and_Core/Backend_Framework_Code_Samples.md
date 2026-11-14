---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Mã nguồn khai báo route và validation của NestJS, Express, Fastify và ElysiaJS để so sánh trực tiếp phong cách lập trình."
---

# Mẫu Code So Sánh Bốn Backend Framework

## TL;DR

- **Bản chất**: Cùng một endpoint `POST /users` được viết bằng bốn framework để lộ ra triết lý khác nhau: decorator + DI, middleware tối giản, schema-first, và type inference.
- **Mục đích**: Chọn framework dựa trên code thật mình sẽ viết hằng ngày, không chỉ dựa trên bảng benchmark.
- **Điểm mấu chốt**: Chỉ NestJS và Elysia cho type-safety ở mức gần như miễn phí; Express phải tự validate còn Fastify dựa vào JSON Schema.

## Core Concept: Cùng một route, bốn phong cách

### A. NestJS: Decorators & Class-Validator

```typescript
import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { IsString, IsEmail } from "class-validator";

class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}

@Controller("users")
export class UserController {
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return { status: "success", data: createUserDto };
  }
}
```

### B. Express: Tối giản, validation thủ công

```javascript
import express from "express";
const app = express();
app.use(express.json());

app.post("/users", (req, res, next) => {
  const { name, email } = req.body;
  if (!name || typeof name !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "Validation failed" });
  }
  res.json({ status: "success", data: { name, email } });
});
```

### C. Fastify: Schema-first

```typescript
import Fastify from "fastify";
const fastify = Fastify();

fastify.post(
  "/users",
  {
    schema: {
      body: {
        type: "object",
        required: ["name", "email"],
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
        },
      },
    },
  },
  async (request, reply) => {
    return { status: "success", data: request.body };
  },
);
```

### D. ElysiaJS: End-to-End Type Safety

```typescript
import { Elysia, t } from "elysia";

const app = new Elysia()
  .post(
    "/users",
    ({ body }) => {
      return { status: "success", data: body };
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String({ format: "email" }),
      }),
    },
  )
  .listen(3000);
```

## Đọc gì từ bốn đoạn code này

- **NestJS**: nhiều dòng nhất, nhưng validate và kiểu dữ liệu gắn vào class nên logic nghiệp vụ sạch; đổi lại phải học DI và Module.
- **Express**: ít dòng nhất nhưng validation nằm lẫn trong handler; type của `req.body` là `any` nếu không tự khai báo.
- **Fastify**: schema là nguồn sự thật cho cả validate và serialize, đổi lại cú pháp JSON Schema dài dòng.
- **ElysiaJS**: schema là type — `body` trong handler được suy ra trực tiếp, nên vừa ngắn vừa an toàn kiểu.

## Related Notes

- Ma trận so sánh và định hướng chọn framework: [[Backend_Frameworks_Comparison]]
- [[TS_Decorators]]: Cơ chế đứng sau `@Controller`, `@Post` của NestJS.
- [[JS_Runtimes_Bun_vs_NodeJS]]: Vì sao bản ElysiaJS chỉ tối ưu trên Bun.
- [[000_Tech_MOC]]
