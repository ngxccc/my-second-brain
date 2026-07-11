# Tại Sao Sử Dụng Scrypt Tích Hợp Sẵn Của Node.js Thay Vì Bcrypt / Argon2?

Tài liệu này giải thích các cân nhắc kỹ thuật, hiệu năng và bảo mật đằng sau quyết định sử dụng module native `crypto.scrypt` của Node.js làm thuật toán băm mật khẩu (Password Hashing) mặc định cho dự án, thay vì sử dụng các thư viện phổ biến khác như `bcrypt` hoặc `argon2`.

---

## 1. Bản Đồ So Sánh Các Thuật Toán Băm Mật Khẩu

| Tiêu chí                                 | Node.js Native `scrypt`                                            | NPM `bcrypt`                                                                                | NPM `argon2`                                                                                        |
| :--------------------------------------- | :----------------------------------------------------------------- | :------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------- |
| **Cài đặt & Cấu hình**                   | **Không cần cài đặt** (Tích hợp sẵn trong Node.js Core).           | Cần cài đặt gói npm. Cần trình biên dịch C++ (`node-gyp`).                                  | Cần cài đặt gói npm. Cần trình biên dịch C++ (`node-gyp`).                                          |
| **Độ tin cậy môi trường (Docker/CI-CD)** | **Tuyệt đối.** Chạy mượt mà trên mọi OS mà không sợ lỗi compile.   | **Kém.** Thường xuyên lỗi cài đặt trên Alpine Docker hoặc Windows do thiếu build-tools.     | **Kém.** Thường xuyên lỗi cài đặt trên Alpine Docker hoặc Windows do thiếu build-tools.             |
| **Kháng tấn công phần cứng (ASIC/GPU)**  | **Tốt.** Nhờ cơ chế Memory-hard (yêu cầu bộ nhớ lớn để tính toán). | **Trung bình.** Chỉ kháng tốt CPU, dễ bị bẻ khóa hàng loạt bằng GPU/ASIC do sử dụng ít RAM. | **Xuất sắc.** (Đạt giải PHC 2015), hỗ trợ cấu hình đa luồng và RAM nâng cao chống tấn công kênh kề. |
| **Dependencies Supply Chain**            | **Zero.** Giữ cây thư mục node_modules sạch sẽ và an toàn.         | Phụ thuộc vào gói bên thứ ba và các gói con của nó.                                         | Phụ thuộc vào gói bên thứ ba và các gói con của nó.                                                 |
| **Hiệu năng thực thi**                   | Rất cao (C++ native tối ưu hóa trực tiếp trong runtime).           | Tốt (nhưng tốn chi phí context-switch JS/C++ addon).                                        | Cực kỳ nhanh (sử dụng tối đa tập lệnh SIMD/SSE của CPU).                                            |

---

## 2. Các Lý Do Lựa Chọn Cốt Lõi (Core Rationale)

### Lý do 1: Loại bỏ hoàn toàn lỗi biên dịch C++ Addon (Zero Build-Time Failures)

Cả `bcrypt` và `argon2` bản chất là các thư viện được viết bằng ngôn ngữ C/C++ để tối ưu hóa hiệu năng, sau đó được liên kết với JavaScript thông qua **Node-API / node-gyp**.

- **Vấn đề:** Khi deploy lên các container Docker siêu nhẹ (ví dụ `node:alpine`) hoặc các máy chủ CI/CD, quá trình cài đặt npm thường xuyên bị đổ vỡ vì thiếu `python`, `make`, `g++`, hoặc `gcc`. Việc cài đặt thêm các gói build-essential này làm tăng kích thước Docker Image và kéo dài thời gian build.
- **Giải pháp:** Node.js native `crypto.scrypt` chạy trực tiếp mà không cần cài đặt hay biên dịch bất kỳ dòng mã nguồn C++ nào ngoài luồng, đảm bảo ứng dụng chạy tức thì trên mọi môi trường.

### Lý do 2: Đặc tính bảo mật cực cao của Scrypt (Memory-Hard Key Derivation)

Khác với `bcrypt` chỉ tốn tài nguyên tính toán (CPU-hard), `scrypt` được thiết kế đặc biệt để trở thành một thuật toán băm **kháng phần cứng chuyên dụng (ASIC/GPU resistant)**.

- Để tính toán được mã băm `scrypt`, máy tính buộc phải phân bổ một lượng bộ nhớ RAM xác định (Memory-Hard).
- Các máy đào ASIC hoặc card đồ họa GPU có hàng ngàn lõi xử lý song song nhưng lượng RAM trên mỗi lõi rất nhỏ. Do đó, việc tấn công dò mật khẩu (brute-force) bằng GPU/ASIC đối với `scrypt` là cực kỳ đắt đỏ và không khả thi so với `bcrypt`.
- Mặc dù `argon2` cũng sở hữu tính chất này và thậm chí tối ưu hơn, nhưng tính khả dụng native của `scrypt` trong Node.js mang lại ưu thế tuyệt đối về sự tiện lợi.

### Lý do 3: Tối ưu hóa chuỗi cung ứng bảo mật (Supply Chain Security)

- Mỗi gói thư viện được tải về từ npm là một lỗ hổng tiềm tàng (Supply Chain Attack).
- Sử dụng thư viện chuẩn của hệ điều hành/Node.js giúp giảm bớt số lượng dependency trong file `package.json`, giảm số lượng cảnh báo `npm audit` và đơn giản hóa việc bảo trì mã nguồn định kỳ của đội ngũ kỹ sư.

---

## 3. Bản Hướng Dẫn Hiện Thực Hóa (Implementation Example)

Dưới đây là cách triển khai Helper mã hóa mật khẩu sử dụng API bất đồng bộ chuẩn của Node.js:

```typescript
import { scrypt, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

// WHY: Định cấu hình tham số cho scrypt đảm bảo độ an toàn và hiệu năng
// N (Cost factor) = 16384 (2^14), r (Block size) = 8, p (Parallelization) = 1
const SCRYPT_PARAMS = {
  N: 16384,
  r: 8,
  p: 1,
  keylen: 64, // Độ dài khóa đầu ra (bytes)
};

/**
 * Mã hóa mật khẩu người dùng
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex"); // Sinh salt ngẫu nhiên 16 bytes
  const derivedKey = await scryptAsync(password, salt, SCRYPT_PARAMS.keylen, {
    N: SCRYPT_PARAMS.N,
    r: SCRYPT_PARAMS.r,
    p: SCRYPT_PARAMS.p,
  });

  // Format lưu trữ: salt:hash (Sử dụng dấu hai chấm ':' để phân tách an toàn và tường minh)
  return `${salt}:${(derivedKey as Buffer).toString("hex")}`;
}

/**
 * Xác minh mật khẩu người dùng
 */
export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  // WHY: Sử dụng giới hạn split = 2 để tránh rủi ro phân tách sai nếu dữ liệu đầu vào không hợp lệ
  const [salt, hash] = storedHash.split(":", 2);
  if (!salt || !hash) return false;
  const derivedKey = await scryptAsync(password, salt, SCRYPT_PARAMS.keylen, {
    N: SCRYPT_PARAMS.N,
    r: SCRYPT_PARAMS.r,
    p: SCRYPT_PARAMS.p,
  });

  const hashBuffer = Buffer.from(hash, "hex");

  // WHY: timingSafeEqual yêu cầu độ dài hai buffer bằng nhau, nếu không sẽ quăng TypeError gây sập app.
  if ((derivedKey as Buffer).length !== hashBuffer.length) {
    return false;
  }

  // WHY: Sử dụng timingSafeEqual để ngăn chặn tấn công dựa trên thời gian đo lường (Timing Attack)
  return timingSafeEqual(derivedKey as Buffer, hashBuffer);
}
```

## 4. Kết luận

Lựa chọn `scrypt` của Node.js mang lại sự cân bằng hoàn hảo giữa **Bảo mật** và **Pragmatism (Tính thực tế trong vận hành)**:

- Mật khẩu được bảo vệ bởi thuật toán băm kháng ASIC hiện đại.
- Quá trình Build Docker và cài đặt thư viện trở nên nhẹ nhàng, ổn định 100%.
- Ứng dụng sạch bóng các dependency bên thứ ba dành cho mật khẩu.
