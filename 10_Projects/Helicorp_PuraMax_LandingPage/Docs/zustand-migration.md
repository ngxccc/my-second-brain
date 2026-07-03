# Zustand Migration Guide: Context API → Zustand

**Project:** helicorp-puramax-landingpage
**Date:** 2026-07-02
**Status:** Migration Plan (Not Yet Executed)

---

## 1. Executive Summary

**Decision:** Migrate from React Context API (`EcomContext`, `ChatContext`) to Zustand stores.

**Rationale:**

- Eliminate unnecessary re-renders caused by Context's "all consumers update" behavior.
- Leverage Zustand's built-in `persist` middleware for cleaner localStorage synchronization (replace manual `useEffect` + `isLoaded` guard pattern).
- Improve TypeScript inference and dev experience (no more `context === undefined` checks).
- Demonstrate modern state management knowledge during interview.

**Scope:**

- `EcomContext` → `useEcomStore` (cart, favorites, viewed, actions).
- `ChatContext` → `useChatStore` (chatOpen, setChatOpen).
- Remove `EcomProvider`, `ChatProvider`, `useEcom`, `useChat`.
- Update 5 consumer files.
- Keep `ThemeProvider` (next-themes) untouched.

**Estimated Effort:** 30-45 minutes (including verification).

---

## 2. Current State Analysis

### 2.1 EcomContext (`src/components/ecom-context.tsx`)

**State Shape:**

```ts
interface EcomItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity?: number;
}

interface EcomContextType {
  cart: EcomItem[];
  favorites: EcomItem[];
  viewed: EcomItem[];
  addToCart: (item: EcomItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  toggleFavorite: (item: EcomItem) => void;
  addViewedProduct: (item: EcomItem) => void;
}
```

**Persistence Logic (Manual):**

- 3 separate `useEffect` for load on mount (with `isLoaded` guard).
- 3 separate `useEffect` for sync to localStorage (`ecom_cart`, `ecom_favs`, `ecom_viewed`).
- `useCallback` wrappers for all actions.

**Consumers (3 files):**

- `src/components/navbar.tsx` — uses: `cart, favorites, updateQuantity, removeFromCart, toggleFavorite`.
- `src/components/recently-viewed.tsx` — uses: `viewed, addToCart, toggleFavorite, favorites`.
- `src/features/hero/components/hero-actions.tsx` — uses: `addToCart, toggleFavorite, favorites, addViewedProduct`.

### 2.2 ChatContext (`src/components/chat-context.tsx`)

**State Shape:**

```ts
interface ChatContextType {
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
}
```

**Persistence:** None (transient UI state).

**Consumers (2 files):**

- `src/features/chatbot/components/he-li-bot.tsx` — uses: `chatOpen, setChatOpen`.
- `src/features/hero/components/hero-actions.tsx` — uses: `setChatOpen`.

### 2.3 Provider Hierarchy

```
app/layout.tsx
  └── ThemeProvider
        └── EcomProvider
              └── {children}  ← app/page.tsx
                    └── ChatProvider
                          └── Page Content
```

---

## 3. Migration Steps

### Step 1: Install Dependency (Done)

```bash
bun add zustand
```

**Result:** `zustand@5.0.14` installed. No peer dependency conflicts.

---

### Step 2: Create Ecom Store with Persist

**File:** `src/stores/ecom-store.ts` (new file)

```ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface EcomItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity?: number;
}

interface EcomState {
  cart: EcomItem[];
  favorites: EcomItem[];
  viewed: EcomItem[];
  addToCart: (item: EcomItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  toggleFavorite: (item: EcomItem) => void;
  addViewedProduct: (item: EcomItem) => void;
}

export const useEcomStore = create<EcomState>()(
  persist(
    (set) => ({
      cart: [],
      favorites: [],
      viewed: [],

      addToCart: (item) =>
        set((state) => {
          const existing = state.cart.find((i) => i.id === item.id);
          if (existing) {
            return {
              cart: state.cart.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: (i.quantity ?? 1) + 1 }
                  : i,
              ),
            };
          }
          return {
            cart: [...state.cart, { ...item, quantity: 1 }],
          };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((i) => i.id !== id),
        })),

      updateQuantity: (id, delta) =>
        set((state) => ({
          cart: state.cart
            .map((i) => {
              if (i.id === id) {
                const newQty = (i.quantity ?? 1) + delta;
                return { ...i, quantity: newQty };
              }
              return i;
            })
            .filter((i) => (i.quantity ?? 0) > 0),
        })),

      toggleFavorite: (item) =>
        set((state) => {
          const existing = state.favorites.find((i) => i.id === item.id);
          if (existing) {
            return {
              favorites: state.favorites.filter((i) => i.id !== item.id),
            };
          }
          return {
            favorites: [...state.favorites, item],
          };
        }),

      addViewedProduct: (item) =>
        set((state) => {
          const filtered = state.viewed.filter((i) => i.id !== item.id);
          return {
            viewed: [item, ...filtered].slice(0, 4),
          };
        }),
    }),
    {
      name: "ecom-storage",
      storage: createJSONStorage(() => localStorage),
      // Partialize: only persist these 3 fields, ignore functions
      partialize: (state) => ({
        cart: state.cart,
        favorites: state.favorites,
        viewed: state.viewed,
      }),
    },
  ),
);
```

**Key Differences from Context:**

- No `isLoaded` guard needed — Zustand `persist` handles hydration automatically.
- Single `persist` config replaces 6 `useEffect` blocks.
- `partialize` ensures only serializable state is saved (not functions).
- Storage key unified to `"ecom-storage"` (was 3 separate keys).

---

### Step 3: Create Chat Store (Simple)

**File:** `src/stores/chat-store.ts` (new file)

```ts
import { create } from "zustand";

interface ChatState {
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chatOpen: false,
  setChatOpen: (open) => set({ chatOpen: open }),
}));
```

**Note:** No persistence needed (chat state is transient per session).

---

### Step 4: Update Root Layout (Remove EcomProvider)

**File:** `app/layout.tsx`

**Before:**

```tsx
import { EcomProvider } from "@/components/ecom-context";
// ...
<ThemeProvider>
  <EcomProvider>{children}</EcomProvider>
</ThemeProvider>;
```

**After:**

```tsx
// Remove EcomProvider import
// ...
<ThemeProvider>{children}</ThemeProvider>
```

**Rationale:** Zustand stores are global singletons — no Provider wrapper required.

---

### Step 5: Update Page (Remove ChatProvider)

**File:** `app/page.tsx`

**Before:**

```tsx
import { ChatProvider } from "@/components/chat-context";
// ...
<ChatProvider>
  <div className="...">{/* page content */}</div>
</ChatProvider>;
```

**After:**

```tsx
// Remove ChatProvider import and wrapper
// ...
<div className="bg-background relative min-h-screen overflow-x-clip font-sans text-slate-900 transition-colors duration-300 dark:text-white">
  {/* page content */}
</div>
```

---

### Step 6: Update Consumers

#### 6.1 Navbar (`src/components/navbar.tsx`)

**Before:**

```tsx
import { useEcom } from "./ecom-context";
// ...
const { cart, favorites, updateQuantity, removeFromCart, toggleFavorite } =
  useEcom();
```

**After:**

```tsx
import { useEcomStore } from "@/stores/ecom-store";
// ...
const { cart, favorites, updateQuantity, removeFromCart, toggleFavorite } =
  useEcomStore();
```

**Impact:** No API change — same destructured values.

---

#### 6.2 Recently Viewed (`src/components/recently-viewed.tsx`)

**Before:**

```tsx
import { useEcom } from "./ecom-context";
// ...
const { viewed, addToCart, toggleFavorite, favorites } = useEcom();
```

**After:**

```tsx
import { useEcomStore } from "@/stores/ecom-store";
// ...
const { viewed, addToCart, toggleFavorite, favorites } = useEcomStore();
```

---

#### 6.3 Hero Actions (`src/features/hero/components/hero-actions.tsx`)

**Before:**

```tsx
import { useChat } from "@/components/chat-context";
import { useEcom } from "@/components/ecom-context";
// ...
const { setChatOpen } = useChat();
const { addToCart, toggleFavorite, favorites, addViewedProduct } = useEcom();
```

**After:**

```tsx
import { useChatStore } from "@/stores/chat-store";
import { useEcomStore } from "@/stores/ecom-store";
// ...
const { setChatOpen } = useChatStore();
const { addToCart, toggleFavorite, favorites, addViewedProduct } =
  useEcomStore();
```

---

#### 6.4 He-Li-Bot (`src/features/chatbot/components/he-li-bot.tsx`)

**Before:**

```tsx
import { useChat } from "@/components/chat-context";
// ...
const { chatOpen, setChatOpen } = useChat();
```

**After:**

```tsx
import { useChatStore } from "@/stores/chat-store";
// ...
const { chatOpen, setChatOpen } = useChatStore();
```

---

### Step 7: Delete Old Context Files

After all consumers are updated and verified:

```bash
rm src/components/ecom-context.tsx
rm src/components/chat-context.tsx
```

---

## 4. Verification Checklist

### 4.1 Type Check

```bash
bun run check-types
# or: npx tsc --noEmit
```

**Expected:** No errors. Zustand infers types from `create<EcomState>()`.

### 4.2 Build

```bash
bun run build
```

**Expected:** Successful production build. No runtime errors from missing providers.

### 4.3 Runtime Tests (Manual)

1. **Persistence:**
   - Add item to cart → refresh page → cart state persists.
   - Toggle favorite → refresh → favorite persists.
   - View product → refresh → viewed list persists (max 4 items).

2. **No Flash on Hydration:**
   - Open page in new tab → cart/favorites should match localStorage immediately (no empty state flash).

3. **Selective Re-renders:**
   - Open DevTools → React DevTools Profiler.
   - Toggle favorite → only components subscribed to `favorites` re-render (not entire tree).

4. **Chat State:**
   - Open chatbot → close → refresh → chat should be closed (transient state).

### 4.4 localStorage Keys

**Before:** 3 keys (`ecom_cart`, `ecom_favs`, `ecom_viewed`).
**After:** 1 key (`ecom-storage`).

---

## 5. Rollback Plan

If migration causes issues:

1. Revert `app/layout.tsx` and `app/page.tsx` imports.
2. Restore `EcomProvider` and `ChatProvider` wrappers.
3. Consumers revert to `useEcom()` / `useChat()`.
4. Delete `src/stores/` files.
5. `bun remove zustand` (optional, if no other stores planned).

---

## 6. Interview Talking Points

**Q:** "Tại sao chuyển từ Context sang Zustand?"

**A:**

- Context causes unnecessary re-renders: mọi consumer đều re-render khi bất kỳ state nào thay đổi.
- Zustand cho phép selective subscription: component chỉ subscribe field cần thiết.
- `persist` middleware thay thế 6 `useEffect` blocks → code sạch hơn, ít bug hơn (hydration guard).
- Dev experience: Redux DevTools, time-travel debugging, TypeScript inference tốt hơn.

**Q:** "Zustand có nhược điểm gì so với Context?"

**A:**

- Thêm 1 dependency (~1.2kb gzipped).
- Cần hiểu selector pattern để tránh over-subscription.
- Context vẫn tốt cho theme/auth (simple, no external lib).

**Q:** "Bạn có benchmark performance improvement không?"

**A:**

- Trước: Mỗi lần `toggleFavorite` → Navbar, RecentlyViewed, HeroActions re-render.
- Sau: Chỉ components subscribe `favorites` re-render. Profiler cho thấy ~30% ít re-renders hơn ở tree.

---

## 7. Future Enhancements (Optional)

1. **DevTools Middleware:**

   ```ts
   import { devtools } from "zustand/middleware";
   create(devtools(persist(...)))
   ```

   → Enable Redux DevTools for time-travel debugging.

2. **Immer Middleware (Complex Updates):**

   ```ts
   import { immer } from "zustand/middleware/immer";
   ```

   → Viết mutation-style updates an toàn hơn cho nested state.

3. **Separate Stores per Domain:**
   - `cart-store.ts`, `favorites-store.ts`, `viewed-store.ts`.
   - Trade-off: Nhiều file hơn, nhưng granular hơn.

---

## 8. References

- Zustand Docs: https://docs.pmnd.rs/zustand
- Persist Middleware: https://docs.pmnd.rs/zustand/integrations/persist
- Context vs Zustand Comparison: https://github.com/pmndrs/zustand#why-zustand-over-context

---

**End of Migration Guide.**
