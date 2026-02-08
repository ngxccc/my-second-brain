---
tags: [type/concept, topic/backend, pattern/architectural, history/classic]
status: evergreen
created_at: Sunday, February 8th 2026, 11:21:53 am +07:00
updated_at: Sunday, February 8th 2026, 11:43:47 am +07:00
aliases: [Model-View-Controller, Classical MVC]
---

# MVC Pattern

## 💡 TL;DR

Là mẫu thiết kế chia ứng dụng thành 3 thành phần chính: **Model** (Dữ liệu & Logic), **View** (Giao diện hiển thị), và **Controller** (Điều phối luồng đi). Đây là nền tảng của hầu hết các web framework (Express, Ruby on Rails, Django, Laravel).

---

## 🧠 Why use it?

_Trước khi có MVC, code PHP/JSP thường trộn lẫn câu lệnh SQL ngay trong thẻ HTML (Spaghetti Code)._

- **Problem:**
    
    - **Tight Coupling:** Sửa giao diện HTML làm hỏng logic tính toán database và ngược lại.
        
    - **Khó test:** Không thể test logic nghiệp vụ nếu nó nằm chết cứng trong UI.
        
    - **Khó chia việc:** Designer và Developer dẫm chân lên nhau trong cùng một file.
        
- **Solution:**
    
    - **Separation of Concerns:** Tách biệt rõ ràng việc hiển thị (View) và việc xử lý dữ liệu (Model).
        
    - **Controller đóng vai trò trung gian:** Model và View không bao giờ nói chuyện trực tiếp với nhau.
        
- **vs Alternative:**
    
    - **vs Layered Architecture:** Trong MVC cổ điển, Business Logic thường nằm trong Model. Trong Layered Architecture hiện đại, ta tách thêm tầng **Service** ra khỏi Model. Có thể nói: _Layered = MVC + Service Layer_.
        

---

## 🔍 Deep Dive

_Cơ chế "Tam giác tình yêu" của MVC._

1. **Model (Người nắm giữ dữ liệu):**
    
    - Đại diện cho cấu trúc dữ liệu và quy tắc nghiệp vụ (Business Rules).
        
    - _Nhiệm vụ:_ Tương tác với Database, validate dữ liệu, xử lý logic (trong MVC thuần).
        
    - _Ví dụ:_ Class `User`, `Tweet`.
        
2. **View (Người kể chuyện):**
    
    - Nơi hiển thị dữ liệu cho người dùng.
        
    - _Trong Traditional Web (SSR):_ Là các file HTML template (EJS, Pug, Handlebars).
        
    - _Trong REST API (JSON):_ Là bước `res.json(...)`. View lúc này chính là cấu trúc JSON trả về.
        
3. **Controller (Cảnh sát giao thông):**
    
    - Nhận request từ người dùng (Router).
        
    - Ra lệnh cho Model lấy/sửa dữ liệu.
        
    - Chọn View phù hợp để trả về.
        

---

## 💻 Code Snippet / Implementation

### Case 1: Traditional MVC (Server-Side Rendering)

_Dùng khi làm web mà Server trả về HTML (như PHP thuần, WordPress)._

```ts
// Controller
export const getUserProfile = async (req, res) => {
  const user = await UserModel.findById(req.params.id); // Gọi Model
  // Trả về View (file user-profile.ejs) kèm dữ liệu
  res.render('user-profile', { user }); 
};
```

### Case 2: Modern Backend MVC (REST API - Dự án của bạn)

_Dùng khi Server chỉ trả về JSON (View lúc này bị tiêu biến thành JSON format)._

```ts
// 1. Controller (src/controllers/users.controllers.ts)
export const getMeController = async (req: Request, res: Response) => {
  // Controller gọi Model (thông qua Service layer nếu có)
  const user = await databaseService.users.findOne({ _id: req.user_id });
  
  // VIEW: Chính là cái object JSON này
  return res.json({
    message: "Lấy thông tin thành công",
    result: user 
  });
};

// 2. Model (src/models/User.ts)
export class User {
  // Định nghĩa Schema và logic dữ liệu
  constructor(user) {
    this.email = user.email;
    this.password = user.password;
  }
}
```

---

## ⚠️ Edge Cases / Pitfalls

_Những hiểu lầm tai hại về MVC._

### 1. Fat Model vs Fat Controller

- **Vấn đề:** Logic nghiệp vụ (VD: Tính tổng tiền giỏ hàng) nên đặt ở đâu?
    
- **Trường phái "Fat Controller":** Nhét hết vào Controller -> Sai lầm. Controller chỉ nên điều phối.
    
- **Trường phái "Fat Model" (Đúng trong MVC cổ điển):** Nhét logic vào Model Class.
    
- **Hiện đại (Layered):** Đẻ thêm **Service Layer** để chứa logic. Model chỉ chứa dữ liệu.
    

### 2. View Logic (Logic trong View)

- ❌ **Don't:** Viết query database hoặc tính toán phức tạp trong file View (HTML/EJS).
    
    - `user.ejs`: `<% db.query('SELECT * ...') %>` -> **CẤM**.
        
- ✅ **Do:** View chỉ nên chứa logic hiển thị đơn giản (if/else, loop) dựa trên dữ liệu Controller đưa cho.
    

---

## 🚨 Troubleshooting

### 🔧 Câu hỏi: "Tại sao dự án API của tôi không thấy thư mục Views?"

- **Trả lời:** Vì bạn đang làm **Headless Architecture**.
    
- Vai trò của "View" đã được chuyển giao cho **Frontend (React/Vue)**.
    
- Backend của bạn chỉ dừng lại ở Controller trả về JSON. Lúc này, JSON chính là "Data Representation" (View).
    

### 🔧 Câu hỏi: "Model của tôi chỉ là Schema Mongoose, nó có phải là Model trong MVC không?"

- **Trả lời:** Có và Không.
    
- Trong Mongoose, Schema đóng vai trò là **Data Access Object (DAO)**.
    
- Nếu bạn viết method vào schema (`UserSchema.methods.verifyPassword`), lúc đó nó mới thực sự đóng vai trò là Model của MVC (chứa cả data và logic).

---

## 📄 Advanced Mechanics

### MVVM (Model-View-ViewModel)

Biến thể của MVC, phổ biến ở Frontend (Angular, Vue). ViewModel đóng vai trò "Binder" tự động cập nhật View khi Model thay đổi (2-way binding).

### ADR (Action-Domain-Responder)

Một bản nâng cấp của MVC dành riêng cho HTTP APIs.

- Controller -> **Action** (Mỗi file chỉ xử lý 1 request duy nhất).
    
- Model -> **Domain**.
    
- View -> **Responder** (Chuẩn hóa HTTP Response).
    

---

## 🔗 Connections

### Internal

- [[Layered_Architecture]] (Bản nâng cấp của MVC cho Backend phức tạp)
    
- [[Modular_Architecture]] (Cách tổ chức code khác biệt)
    
- [[REST_API_Design]] (Cách MVC thể hiện qua API)
    

### External

- [MVC by Martin Fowler](https://martinfowler.com/eaaDev/uiArchs.html)
    
- [The Model-View-Controller Design Pattern - GeeksforGeeks](https://www.geeksforgeeks.org/mvc-design-pattern/)