---
tags: [type/concept, status/permanent]
date: 2026-06-07
description: "Kỹ thuật bóc tách dữ liệu mảng và đối tượng trong ES6."
---

# JS Destructuring Assignment

## TL;DR

- **Bản chất**: Destructuring bóc dữ liệu vào biến riêng; array dựa trên vị trí index, object dựa trên tên key.
- **Mục đích**: Rút ngắn code truy xuất dữ liệu lồng nhau và đặt tên lại biến ngay tại chỗ.
- **Điểm mấu chốt**: Array destructuring phụ thuộc thứ tự nên đổi thứ tự phần tử là đổi nghĩa; object destructuring phụ thuộc tên key nên đổi tên field là vỡ.

## Array vs Object Destructuring

### 1. Array Destructuring

- **Quy tắc**: Bóc tách các phần tử của mảng theo đúng **thứ tự vị trí** (index).
- **Đặc điểm**: Tên biến khai báo có thể tự do đặt tên theo ý muốn.
- **Ví dụ**:

  ```javascript
  const coordinates = [10.5, 106.8];
  // Bóc tách theo vị trí index 0 và 1
  const [lat, lng] = coordinates;
  console.log(lat); // 10.5
  ```

### 2. Object Destructuring

- **Quy tắc**: Bóc tách thuộc tính của đối tượng theo đúng **tên thuộc tính (Key)**.
- **Đặc điểm**: Thứ tự khai báo các biến không quan trọng, nhưng tên biến phải khớp với tên key của đối tượng (hoặc dùng cú pháp alias `key: newName`).
- **Ví dụ**:

  ```javascript
  const user = { name: "ngxc", age: 25 };
  // Bóc tách theo key 'name' và 'age'
  const { age, name } = user;
  console.log(name); // "ngxc"
  ```

---

## Related Notes

- Tổng quan tri thức kỹ thuật: [[000_Tech_MOC]]
