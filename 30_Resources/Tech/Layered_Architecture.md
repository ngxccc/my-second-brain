---
tags: [type/concept, topic/backend, pattern/architectural, framework/express]
status: evergreen
created_at: Sunday, February 8th 2026, 11:20:05 am +07:00
updated_at: Sunday, February 8th 2026, 11:52:40 am +07:00
aliases: [N-Tier Architecture, Monolithic Architecture, MVC (Backend variation)]
---

# Layered Architecture

## 💡 TL;DR

Là cách tổ chức code bằng cách **chia cắt ứng dụng theo chiều ngang** dựa trên vai trò kỹ thuật (Technical Concerns): Controller (Giao tiếp), Service (Xử lý), Model (Dữ liệu). Đây là kiến trúc mặc định dễ tiếp cận nhất cho người mới bắt đầu.

---

## 🧠 Why use it?

_Tại sao 90% các tutorial trên mạng đều dạy cái này đầu tiên?_

- **Problem:**
    
    - Code dồn hết vào `server.ts` hoặc `route handler` khiến file dài cả ngàn dòng, không thể bảo trì.
        
    - Logic xử lý dữ liệu trộn lẫn với logic validate request.
        
- **Solution:**
    
    - **Separation of Concerns (SoC):** Mỗi tầng chỉ làm đúng nhiệm vụ của mình. Controller chỉ lo HTTP, Service chỉ lo Business Logic.
        
    - **Easy Navigation (Small scale):** Muốn sửa API? Vào `controllers`. Muốn sửa DB schema? Vào `models`. Rất trực quan khi dự án còn nhỏ.
        
- **vs Alternative:**
    
    - **vs Modular Architecture:** Layered dễ setup hơn lúc đầu, nhưng khi project phình to (50+ features), nó biến thành "Spaghetti Code" vì logic của 1 feature bị xé lẻ ra nhiều nơi.
        

---

## 🔍 Deep Dive

_Nguyên lý hoạt động: Dòng chảy dữ liệu một chiều (Unidirectional Data Flow)._

1. **Presentation Layer (Controller/Route):**
    
    - Cửa ngõ đón nhận request từ Client.
        
    - Nhiệm vụ: Validate Input (Body/Query), gọi Service, và trả về Response (JSON/Status Code).
        
    - **Tuyệt đối không:** Viết logic nghiệp vụ hay gọi DB ở đây.
        
2. **Business Logic Layer (Service):**
    
    - "Bộ não" của ứng dụng.
        
    - Nhiệm vụ: Tính toán, xử lý if/else nghiệp vụ, gọi 3rd party API, gọi Data Access Layer.
        
    - Đây là nơi chứa code quan trọng nhất.
        
3. **Data Access Layer (Model/Repository):**
    
    - Nơi duy nhất được phép chạm vào Database.
        
    - Nhiệm vụ: CRUD (Create, Read, Update, Delete).
        

---

## 💻 Code Snippet / Implementation

_Luồng đi chuẩn của một request trong Layered Architecture._

```ts
// 1. Controller (src/controllers/user.controller.ts)
// Chỉ lo việc giao tiếp HTTP
export const registerController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // Gọi xuống tầng dưới
  const user = await usersService.register({ email, password });
  return res.json({ message: "Success", data: user });
};

// 2. Service (src/services/user.services.ts)
// Chỉ lo logic nghiệp vụ (Hash pass, sign token)
class UsersService {
  async register({ email, password }: RegisterReqBody) {
    const existingUser = await User.findOne({ email }); // Gọi tầng Model
    if (existingUser) throw new Error("Email exists");
    
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({ email, password: hashedPassword });
    
    return newUser;
  }
}

// 3. Model (src/models/User.ts)
// Chỉ định nghĩa cấu trúc dữ liệu
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});
export const User = mongoose.model("User", UserSchema);
```

---

## ⚠️ Edge Cases / Pitfalls

_Những cái bẫy chết người khi làm Layered Architecture._

### 1. Fat Controller (Controller béo phì)

- ❌ **Don't:** Viết logic check điều kiện, tính toán tiền nong ngay trong Controller.
    
- ✅ **Do:** Controller phải "gầy" (Skinny). Nó chỉ nên có 3 dòng: Lấy input -> Gọi Service -> Trả output.
    

### 2. Skipping Layers (Nhảy cóc)

- ❌ **Don't:** Controller gọi thẳng `User.find()` (bỏ qua Service).
    
- ✅ **Do:** Luôn tuân thủ trật tự: Controller -> Service -> Model. Kể cả logic đơn giản nhất cũng phải đi qua Service để đảm bảo tính nhất quán (Consistency).
    

### 3. Anemic Domain Model (Model thiếu máu)

- ❌ **Don't:** Model chỉ chứa getter/setter mà không có logic.
    
- ✅ **Do:** (Nâng cao) Di chuyển bớt logic từ Service xuống Model method nếu logic đó gắn chặt với dữ liệu (VD: `user.checkPassword()`).
    

---

## 🚨 Troubleshooting

### 🔧 Lỗi "God Service"

- **Triệu chứng:** File `users.services.ts` dài 3000 dòng, chứa đủ thứ logic từ auth, upload ảnh, đến gửi mail.
    
- **Nguyên nhân:** Do gom nhóm theo file type, tất cả logic liên quan user nhét hết vào 1 file.
    
- **Cách fix:** Refactor tách nhỏ Service (`UserAuthService`, `UserProfileService`) hoặc chuyển sang **Modular Architecture**.
    

### 🔧 Lỗi Circular Dependency giữa các Service

- **Triệu chứng:** `UserService` gọi `PostService`, `PostService` gọi lại `UserService` -> App crash.
    
- **Cách fix:**
    
    1. Dùng Dependency Injection.
        
    2. Tạo một Service thứ 3 (Orchestrator) đứng giữa gọi 2 thằng kia.
        
    3. Thiết kế lại database/logic để giảm phụ thuộc.
        

---

## 📄 Advanced Mechanics

### Data Transfer Object (DTO)

Để các tầng giao tiếp an toàn, không nên truyền nguyên cục `req` vào Service. Hãy dùng DTO (hoặc Interface).

```ts
// Controller chuyển đổi req.body thành DTO sạch sẽ trước khi đưa xuống Service
const registerDto: RegisterDto = {
  email: req.body.email,
  password: req.body.password,
  // lọc bỏ các field rác
};
await service.register(registerDto);
```

---

## 🔗 Connections

### Internal

- [[Modular_Monolith_Architecture]] (Giải pháp thay thế khi project lớn)
    
- [[MVC_Pattern]] (Cha đẻ của tư duy này)
    
- [[Repository_Pattern]] (Cách nâng cao hơn của Data Access Layer)

### External

- [Multitier architecture - Wikipedia](https://en.wikipedia.org/wiki/Multitier_architecture)
    
- [Layered Architecture Pattern - O'Reilly](https://www.oreilly.com/library/view/software-architecture-patterns/9781491971437/ch01.html)