# HELICORP Interview Questions - Complete Preparation Guide

**Project:** PETKIT Pura Max Landing Page
**Candidate:** TTS IT Phát triển Website - Vòng 2
**Date:** 2026-07-02
**Status:** Comprehensive Q&A Bank

---

## Table of Contents

1. [Project Requirements (PDF)](#1-project-requirements-pdf)
2. [Architecture & Project Structure](#2-architecture--project-structure)
3. [Technology Stack](#3-technology-stack)
4. [Performance & SEO](#4-performance--seo)
5. [Bonus Features (Điểm Cộng)](#5-bonus-features-điểm-cộng)
6. [State Management (Zustand Migration)](#6-state-management-zustand-migration)
7. [Implementation Details](#7-implementation-details)
8. [Deployment & Git Workflow](#8-deployment--git-workflow)
9. [Design Decisions & Trade-offs](#9-design-decisions--trade-offs)
10. [Future Enhancements](#10-future-enhancements)

---

## 1. Project Requirements (PDF)

### 1.1 Core Requirements

**Q: Đề bài yêu cầu những gì chính?**

**A:**

- Landing page cho sản phẩm công nghệ/thiết bị thông minh (PETKIT Pura Max - máy dọn rác mèo tự động).
- Bắt buộc: Hero Section, Tính năng nổi bật, Thông số kỹ thuật, Form đăng ký nhận tin.
- Responsive (Desktop + Mobile).
- Performance: Google PageSpeed Insights (Mobile) ≥ 85/100.
- SEO: Meta tags đầy đủ (Title, Description, Open Graph).
- Git + Deploy (Vercel/Netlify/Cloudflare Pages).

**Q: Điểm cộng (không bắt buộc) là gì?**

**A:**

- Webhook + User behavior tracking (click, scroll).
- Dark Mode.
- Scroll Animation, Skeleton Loading, Micro-interactions.
- Backend integration (đã có `/api/chat`, `/api/webhook`).
- Scrollytelling + Parallax.
- E-commerce mini (Recently Viewed, Wishlist, Cart).
- Chatbot (He-Li-Bot với AI integration).

**Q: Sản phẩm nộp gồm những gì?**

**A:**

- GitHub repo (public).
- Deployed landing page URL.
- Screenshot Google PageSpeed Insights.
- Minh chứng điểm cộng (nếu có).

---

## 2. Architecture & Project Structure

### 2.1 Next.js App Router

**Q: Tại sao chọn Next.js 16 App Router thay vì Pages Router?**

**A:**

- App Router là tương lai của Next.js (stable từ v13.4, default trong v14+).
- Server Components mặc định → giảm bundle size, cải thiện SEO.
- Streaming, Suspense, Parallel Routes, Intercepting Routes.
- Metadata API type-safe hơn (layout.tsx, page.tsx).
- File-system routing + nested layouts tự nhiên hơn.

**Q: Giải thích cấu trúc Feature-based trong project.**

**A:**

```text
src/
├── features/
│   ├── scrollytelling/     # GSAP scroll animations
│   ├── hero/               # Hero + DeviceMockup + Actions
│   ├── xsecure/            # Sensor grid interactive
│   ├── trial/              # Form đăng ký
│   ├── specs/              # Technical specs
│   └── chatbot/            # He-Li-Bot
├── components/
│   ├── ui/                 # Shadcn primitives
│   └── ecom-context.tsx    # (Đã migrate sang Zustand)
└── stores/                 # Zustand stores (sau migration)
```

**Ưu điểm:**

- Co-location: Logic + UI + types trong cùng folder.
- Scalability: Dễ xóa/bổ sung feature mà không ảnh hưởng toàn bộ app.
- Team collaboration: Mỗi dev ownership 1 feature.

**Nhược điểm:** Overhead cho project nhỏ (< 10 components).

**Q: State management: Tại sao ban đầu dùng Context API, sau migrate sang Zustand?**

**A:**

- **Context ban đầu:** Đơn giản, không cần dependency, phù hợp MVP.
- **Vấn đề:** Context re-render cascade — mọi consumer re-render khi bất kỳ state nào thay đổi.
- **Zustand:** Selective subscription → chỉ component subscribe field cụ thể re-render.
- **Persist middleware:** Thay thế 6 `useEffect` blocks + `isLoaded` guard.

---

## 3. Technology Stack

### 3.1 Next.js 16 + React 19

**Q: Next.js 16 mang lại những tính năng mới nào so với v14/v15?**

**A:**

- Turbopack stable (build 2.3s trong project này).
- React 19 concurrent features (use, useFormStatus, useOptimistic).
- Improved caching: `use cache` directive, `cacheComponents`.
- Better error handling trong App Router.

**Q: React 19 có gì khác biệt so với React 18 trong project này?**

**A:**

- `use` hook cho reading resources (Promises, Context).
- Actions: Server Actions tích hợp tốt hơn.
- `<Suspense>` improvements.
- Project này dùng React 19.2.7 nhưng chưa exploit nhiều features mới (chủ yếu dùng hooks cơ bản).

### 3.2 Tailwind CSS v4

**Q: Tailwind CSS v4 có thay đổi gì so với v3?**

**A:**

- **@theme directive:** Thay thế `tailwind.config.js` cho custom theme.
- CSS-first: Config trong CSS thay vì JS.
- Performance: Faster build, smaller output.
- Container queries native support.
- Project này dùng PostCSS plugin (`@tailwindcss/postcss`).

**Q: Tại sao không dùng CSS Modules hoặc Styled Components?**

**A:**

- Tailwind utility-first → consistency cao, ít context switching.
- JIT compiler → chỉ ship CSS classes thực sự dùng.
- Responsive variants (`md:`, `lg:`) tích hợp sẵn.
- Dark mode: `dark:` variant + `next-themes`.

### 3.3 GSAP (GreenSock Animation Platform)

**Q: Tại sao chọn GSAP thay vì Framer Motion?**

**A:**

- **Performance:** GSAP dùng requestAnimationFrame + optimized tween engine → ít jank hơn trên mobile.
- **ScrollTrigger:** Plugin mạnh nhất cho scroll-linked animations (Scrollytelling).
- **Timeline control:** Dễ sync multiple animations, scrub, pin.
- **Browser compatibility:** 15+ năm, test kỹ trên IE11+ (dù project này chỉ target modern browsers).
- **Trade-off:** Bundle size lớn hơn Framer Motion (~50kb vs ~30kb), cần tree-shake kỹ.

**Q: Scrollytelling implementation dùng GSAP như thế nào?**

**A:**

- `ScrollTrigger` plugin để trigger animations dựa trên scroll position.
- Timeline scrub: Animation progress = scroll progress.
- Pin elements, parallax layers.
- Performance: `will-change` CSS, `force3D: true`, batch updates.

### 3.4 Shadcn/UI + Radix Primitives

**Q: Shadcn/UI là UI library hay utility?**

**A:**

- **Không phải library:** Copy-paste components (không phải `npm install`).
- **Radix UI primitives:** Unstyled, accessible (ARIA, keyboard nav).
- **Tailwind styling:** Developer owns styles hoàn toàn.
- **Trade-off vs MUI/AntD:** Ít magic, ít bundle bloat, nhưng phải maintain components.

**Q: Tại sao không build components từ đầu?**

**A:**

- Time constraint: 7 ngày deadline.
- Accessibility: Radix đã handle ARIA, focus management, screen readers.
- Consistency: Button, Input, Popover, Card đã chuẩn hóa.

### 3.5 next-themes

**Q: next-themes hoạt động như thế nào với SSR?**

**A:**

- Inject script inline trong `<head>` để set theme trước khi React hydrate.
- Tránh "flash of incorrect theme" (FOIT).
- `suppressHydrationWarning` trên `<html>`.
- `useTheme()` hook exposes `theme`, `setTheme`, `resolvedTheme`.

**Q: Dark mode strategy: class hay data-theme attribute?**

**A:**

- Dùng `class` strategy (Tailwind default).
- `html.dark` class toggle.
- CSS variables scoped dưới `.dark` selector.

---

## 4. Performance & SEO

### 4.1 Google PageSpeed Insights ≥ 85

**Q: Bạn đã làm gì để đạt PageSpeed 85+ Mobile?**

**A:**

1. **Image optimization:**
   - Next.js `<Image>` component với `quality`, `sizes`, `priority`.
   - WebP format, responsive breakpoints.
   - Lazy loading (native `loading="lazy"`).

2. **Code splitting:**
   - Dynamic imports cho sections (`XSecureSection`, `SpecsSection`).
   - `next/dynamic` với `loading` skeleton.

3. **Font optimization:**
   - `next/font/google` với `display: "swap"`, `preload: true`.
   - Variable fonts (Plus Jakarta Sans, Geist).

4. **Bundle optimization:**
   - `optimizePackageImports` trong `next.config.ts`.
   - Tree-shake GSAP (chỉ import `gsap` + `ScrollTrigger`).

5. **CSS optimization:**
   - Tailwind JIT → purge unused classes.
   - Critical CSS inline, non-critical deferred.

**Q: Core Web Vitals được xử lý như thế nào?**

**A:**

- **LCP (Largest Contentful Paint):** Hero image optimized, preload font, critical CSS.
- **INP (Interaction to Next Paint, thay FID):** Debounce scroll handlers, passive listeners.
- **CLS (Cumulative Layout Shift):** Fixed aspect ratios cho images, skeleton placeholders.

### 4.2 SEO Technical

**Q: Metadata được config như thế nào?**

**A:**

- Static metadata trong `app/layout.tsx`:

  ```ts
  export const metadata: Metadata = {
    title: "HELICORP - PETKIT Pura Max",
    description: "...",
    openGraph: { ... },
  };
  ```

- Dynamic metadata cho pages khác nhau (nếu cần).

**Q: Open Graph tags có đầy đủ không?**

**A:**

- Title, Description, Image, URL, Type.
- Twitter Card tags.
- Verify bằng: Facebook Sharing Debugger, Twitter Card Validator.

---

## 5. Bonus Features (Điểm Cộng)

### 5.1 Webhook + User Behavior Tracking

**Q: User tracking implementation như thế nào?**

**A:**

- `UserTracker` component: Track scroll depth, time on page, clicks.
- `ActivityTracker`: Debounced scroll handler, IntersectionObserver cho section visibility.
- Payload gửi qua `POST /api/webhook`:

  ```json
  {
    "event": "scroll" | "click" | "view",
    "element": "#tong-quan",
    "depth": 0.75,
    "timestamp": "..."
  }
  ```

**Q: Webhook endpoint xử lý request như thế nào?**

**A:**

- Validation: Zod schema (nếu implement).
- Rate limiting: Upstash Ratelimit (nếu cần).
- Error handling: Try-catch, return 200 để không block client.
- Logging: Console + (optional) external service.

### 5.2 Dark Mode

**Q: Dark mode implementation chi tiết.**

**A:**

- `next-themes` Provider wrap root.
- Inline script trong `<head>` để prevent FOIT.
- CSS variables:

  ```css
  :root {
    --bg: white;
    --text: black;
  }
  .dark {
    --bg: #0a0a0a;
    --text: white;
  }
  ```

- Toggle button trong Navbar.

### 5.3 Scrollytelling + Parallax

**Q: GSAP ScrollTrigger implementation.**

**A:**

- `ScrollTrigger.create()` cho từng section.
- `scrub: true` → animation progress = scroll progress.
- `pin: true` → element sticky trong viewport.
- Parallax: Multiple layers với `yPercent` khác nhau.

**Q: Performance considerations cho scroll animations?**

**A:**

- `will-change: transform` CSS.
- `force3D: true` GSAP option.
- Debounce/throttle scroll handlers.
- `once: true` cho animations chỉ chạy 1 lần.

### 5.4 E-commerce Mini

**Q: Recently Viewed logic.**

**A:**

- Store: `viewed: EcomItem[]` (max 4 items).
- `addViewedProduct`: Filter duplicates, unshift, slice(0, 4).
- Persistence: Zustand `persist` middleware → `localStorage`.
- UI: Horizontal scrollable cards, "Add to Cart", "Toggle Favorite".

**Q: Cart operations (add, remove, update quantity).**

**A:**

- `addToCart`: Check existing → increment quantity hoặc push new item.
- `removeFromCart`: Filter by ID.
- `updateQuantity`: Map + filter (remove if qty ≤ 0).
- Persistence: Auto-sync qua Zustand persist.

### 5.5 Chatbot (He-Li-Bot)

**Q: Chatbot architecture.**

**A:**

- Frontend: `HeLiBot` component (Popover + MessageScroller).
- Backend: `POST /api/chat` route handler.
- AI Integration: OpenAI GPT-4 / Gemini API (tùy config).
- State: `useChatStore` (Zustand) → `chatOpen`, `messages`.

**Q: Prompt engineering cho chatbot.**

**A:**

- System prompt: "Bạn là HeLiBot, chuyên gia về PETKIT Pura Max. Trả lời ngắn gọn, hữu ích."
- Context: Product specs, pricing, warranty info.
- Few-shot examples: User hỏi giá → Bot trả lời "7990000 VND".
- Guardrails: Reject off-topic questions.

**Q: Error handling & Rate limiting.**

**A:**

- API key missing: Return 500 với message "Chatbot tạm thời không khả dụng".
- Rate limit (429): Retry với exponential backoff.
- Network error: Fallback message "Vui lòng thử lại sau".

---

## 6. State Management (Zustand Migration)

### 6.1 Context API → Zustand

**Q: Tại sao migrate từ Context sang Zustand?**

**A:**

- **Re-render problem:** Context Provider re-render → mọi consumer re-render (dù không subscribe field đó).
- **Example:** `toggleFavorite` → Navbar, RecentlyViewed, HeroActions đều re-render.
- **Zustand solution:** Selective subscription:

  ```ts
  const favorites = useEcomStore((state) => state.favorites);
  ```

  → Chỉ components subscribe `favorites` re-render.

**Q: Zustand persist middleware hoạt động như thế nào?**

**A:**

- Wrap store creator: `create(persist(config, { name, storage }))`.
- Auto-hydrate từ localStorage khi app mount.
- `partialize`: Chỉ persist serializable fields (bỏ functions).
- Storage key: `"ecom-storage"` (thay 3 keys cũ).

**Q: Immer middleware có nên thêm không?**

**A:**

- **Không nên** cho project này.
- Immer cho phép mutation-style updates:

  ```ts
  addToCart: (item) => set((state) => {
    const existing = state.cart.find(...);
    if (existing) existing.quantity++;
    else state.cart.push({ ...item, quantity: 1 });
  });
  ```

- **Trade-off:** +3-4kb bundle size, overkill cho state phẳng.
- **Khi nào cần:** Nested objects 3+ levels, batch mutations phức tạp.

### 6.2 Comparison

| Tiêu chí    | Context API      | Zustand          |
| ----------- | ---------------- | ---------------- |
| Re-renders  | Tất cả consumers | Selective        |
| Persistence | 6 useEffect      | 1 middleware     |
| Bundle      | 0                | ~1.2kb           |
| DevTools    | Không            | Redux DevTools   |
| TypeScript  | Tốt              | Xuất sắc (infer) |

---

## 7. Implementation Details

### 7.1 Component Patterns

**Q: "use client" directive được dùng ở đâu?**

**A:**

- Tất cả components có hooks (`useState`, `useEffect`, `useChatStore`).
- Server Components: `layout.tsx`, static sections (nếu không có interactivity).
- Trade-off: Server Components giảm bundle, nhưng không thể dùng hooks.

**Q: Dynamic imports được dùng như thế nào?**

**A:**

```ts
const XSecureSection = dynamic(() => import(...), {
  loading: () => <Skeleton />,
});
```

- Lazy load heavy sections (GSAP, interactive grids).
- Improve initial bundle size.

### 7.2 TypeScript Patterns

**Q: Type safety cho EcomItem.**

**A:**

```ts
export interface EcomItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity?: number; // Optional
}
```

- Zustand infers store type từ `create<EcomState>()`.
- No `any` types trong store.

---

## 8. Deployment & Git Workflow

### 8.1 Deploy

**Q: Deploy lên nền tảng nào?**

**A:**

- Vercel (recommended cho Next.js): Zero-config, Edge Functions, Preview deployments.
- Alternative: Netlify, Cloudflare Pages.

**Q: CI/CD pipeline.**

**A:**

- Git push → Vercel auto-deploy.
- Preview URLs cho mỗi PR.
- Production deploy sau merge main.

### 8.2 Git

**Q: Branching strategy.**

**A:**

- `main`: Production.
- `feature/*`: Feature branches.
- `fix/*`: Bug fixes.
- Commit message: Conventional Commits (`feat:`, `fix:`, `refactor:`).

---

## 9. Design Decisions & Trade-offs

### 9.1 Why Not X?

**Q: Tại sao không dùng Redux Toolkit?**

**A:**

- Redux quá nặng cho landing page (boilerplate, middleware).
- Zustand: 10x ít code, cùng performance.

**Q: Tại sao không dùng React Query / SWR?**

**A:**

- Không có server state phức tạp (chỉ local state + 2 API routes).
- React Query cho data fetching, caching, mutations — overkill.

**Q: Tại sao không implement backend đầy đủ?**

**A:**

- Đề bài: Landing page (frontend focus).
- API routes (`/api/chat`, `/api/webhook`) là demo integration.
- Full backend: Cần database, auth, admin dashboard — scope quá lớn.

### 9.2 Trade-offs

**Q: Trade-off giữa animation richness và performance.**

**A:**

- GSAP mang lại scroll animations đẹp, nhưng bundle size + runtime cost.
- Giải pháp: Code-split GSAP, lazy load sections, `will-change` optimization.

**Q: Trade-off giữa features và PageSpeed score.**

**A:**

- Thêm chatbot, tracking, e-commerce → tăng JS bundle.
- Giải pháp: Dynamic imports, tree-shaking, defer non-critical scripts.

---

## 10. Future Enhancements

### 10.1 Nếu có thêm thời gian

**Q: Bạn sẽ implement thêm tính năng nào?**

**A:**

1. **A/B Testing:** Hero CTA variants, track conversion.
2. **Analytics Dashboard:** Admin view tracking events.
3. **Internationalization:** i18n (VI/EN).
4. **PWA:** Service worker, offline support.
5. **Real backend:** PostgreSQL + Prisma, user accounts.
6. **Chatbot improvements:** RAG (Retrieval-Augmented Generation), conversation memory.
7. **E-commerce full:** Checkout flow, payment integration (Stripe).

### 10.2 Scalability

**Q: Landing page này có scale thành full e-commerce không?**

**A:**

- **Có thể:** State management (Zustand) đã tách biệt, API routes ready.
- **Điểm nghẽn:**
  - No database (localStorage limit ~5-10MB).
  - No auth (user sessions).
  - No payment gateway.
  - No inventory management.
- **Migration path:** Next.js API Routes → tRPC/GraphQL → Database.

---

## Appendix: Quick Reference

### Key Files

| File                                            | Purpose                                 |
| ----------------------------------------------- | --------------------------------------- |
| `app/layout.tsx`                                | Root layout, metadata, ThemeProvider    |
| `app/page.tsx`                                  | Page composition, ChatProvider (đã xóa) |
| `src/stores/ecom-store.ts`                      | Cart, favorites, viewed + persist       |
| `src/stores/chat-store.ts`                      | Chat open/close state                   |
| `src/features/chatbot/components/he-li-bot.tsx` | Chatbot UI + AI integration             |
| `src/components/activity-tracker.tsx`           | User behavior tracking                  |

### Commands

```bash
bun dev              # Development server
bun run build        # Production build
bun run check-types  # TypeScript check
bun run lint         # ESLint + fix
```

### Verification Checklist (Before Interview)

- [ ] Run `bun run build` → no errors.
- [ ] Lighthouse Mobile ≥ 85.
- [ ] Open Graph tags verified (Facebook Debugger).
- [ ] Dark mode toggle works, no FOIT.
- [ ] Cart/favorites persist after refresh.
- [ ] Chatbot responds (mock hoặc real API).
- [ ] Scrollytelling smooth trên mobile.
- [ ] Git history clean (conventional commits).

---

**End of Interview Questions Bank.**
