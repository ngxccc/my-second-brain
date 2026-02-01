- **Phase 1 (Backend Core):** Viết lại Backend bằng TS + Express/Fastify. Giữ nguyên Frontend cũ (chỉ sửa API url trong `script.js` nếu cần). Mục tiêu: Code backend sạch, có Type.
    
- **Phase 2 (Data Layer):** Thay JSON file bằng SQLite.
    
- **Phase 3 (Frontend Overhaul):** Viết Dashboard mới bằng React + Tailwind. Kết nối vào Backend mới.

KeyStream-Gemini-V2/
├── package.json              # Script để chạy cả 2 (concurrently)
├── shared/                   # 🔥 Nơi chứa Type dùng chung
│   └── types.ts              # interface Key, Stats...
├── backend/                  # (Code Server cũ chuyển vào đây)
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── config/           # config/index.js cũ
│   │   ├── modules/
│   │   │   ├── keys/         # keyService.js cũ (viết lại thành Class)
│   │   │   ├── gemini/       # geminiService.js cũ
│   │   │   └── stats/        # statsService.js cũ
│   │   ├── main.ts           # server.js cũ (Entry point)
│   │   └── app.ts            # Setup Express/Fastify
│   └── .env
└── frontend/                 # (Code Public cũ chuyển vào đây, viết lại bằng React)
    ├── package.json
    ├── vite.config.ts
    ├── src/
    │   ├── components/       # Các button, chart, card...
    │   │   └── ui/           # Shadcn UI components
    │   ├── pages/            # Dashboard chính
    │   ├── hooks/            # Logic gọi API (socket.io-client)
    │   ├── App.tsx           # index.html cũ (Layout chính)
    │   └── main.tsx          # Entry point React
    └── index.html

### Các tính năng cần bổ sung (Necessary Improvements)

- **Rate Limiting cục bộ:** Chặn IP spam request để bảo vệ Key Pool của bạn (tránh trường hợp 1 đứa spam 1000 req/s làm chết hết key).
    
- **API Key Management:** Cho phép tạo "Virtual Key" (sk-...) để cấp cho bạn bè dùng, thay vì mở toang cửa (`cors: *`).
    
- **Dashboard Auth:** Thêm login đơn giản cho trang admin (Dashboard) để không ai khác xem được key của bạn.

**Q: Khi refactor, làm sao đảm bảo logic cũ không bị hỏng?** A: Logic quan trọng nhất là thuật toán chọn Key (`getOptimalKey`) và quản lý trạng thái (`trackRequest`). **Lời khuyên:** Hãy viết Unit Test cho `KeyService` trước. Trong file JS cũ ông không test được, nhưng sang TS ông có thể dùng Jest để giả lập: "Nếu tôi có 3 key, 1 key đang cooldown, hàm phải trả về key nào?". Đảm bảo cái lõi này đúng thì Frontend vẽ vời kiểu gì cũng được.