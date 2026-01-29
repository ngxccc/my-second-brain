---
tags: [type/library, topic/frontend, topic/visualization, lang/typescript]
status: seeding
created_at: Thursday, January 29th 2026, 9:07:04 pm +07:00
updated_at: Thursday, January 29th 2026, 9:36:22 pm +07:00
aliases: [ReactFlow, Node Graph UI, XYFlow]
---

# React Flow Visualization

## 💡 TL;DR
Thư viện React mạnh mẽ nhất để xây dựng các giao diện dạng Node-based (như Mindmap, Workflow, Diagram) với khả năng tương tác cao (Drag, Zoom, Pan) mà không cần động vào Canvas/SVG thuần.

---

## 🧠 Why use it?
*(Lý do tồn tại của concept này. Nó giải quyết vấn đề gì mà cách cũ không làm được?)*
- **Problem:** Tự code tính năng Zoom/Pan và Drag-drop các node trên thẻ `<canvas>` hoặc `<svg>` là cực hình toán học (Matrix transformation). Rất khó để gắn sự kiện click vào từng node.
- **Solution:** React Flow cung cấp sẵn một "sân chơi" (Viewport) đã xử lý hết logic toán học. Bạn chỉ cần khai báo mảng `nodes` và `edges` là xong.
- **vs Alternative:**
    - vs **D3.js:** D3 mạnh về chart dữ liệu nhưng learning curve quá dốc và khó tích hợp với React Component.
    - vs **Mermaid.js:** Mermaid chỉ để *render* (hiển thị) diagram từ text, không hỗ trợ tương tác kéo thả mạnh như React Flow.

## 🔍 Deep Dive
*(Cấu trúc cốt lõi của React Flow)*

1.  **Nodes (Đỉnh):** Là các React Component. Mỗi node cần một object chứa `{ id, position: {x, y}, data: { label... } }`.
2.  **Edges (Cạnh):** Đường nối giữa các node. Định nghĩa bởi `{ id, source, target }`.
3.  **Handles (Điểm neo):** Các chấm tròn trên node để nối dây.
4.  **Viewport:** Khung nhìn camera, quản lý `x, y, zoom`.

---

## 💻 Code Snippet / Implementation
*(Setup cơ bản một Mindmap với Custom Node)*

```tsx
import React, { useCallback } from 'react';
import ReactFlow, { 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  Connection
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Root Concept' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: 'Child Node' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export default function MindMapFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Xử lý khi user tự nối dây
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    // ⚠️ QUAN TRỌNG: Parent Container phải có height cụ thể
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView // Tự động zoom vừa màn hình lúc đầu
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
```

---

## ⚠️ Edge Cases / Pitfalls

_(Đừng bỏ qua phần này. Kinh nghiệm xương máu nằm ở đây)_

### Container Height

- ❌ **Don't:** Nhét `ReactFlow` vào một `div` không set `height` (hoặc `height: auto`).
    - *Hậu quả:* Map sẽ biến mất hoàn toàn (Height = 0px) dù code đúng hết.
- ✅ **Do:** Luôn đảm bảo container cha có `height` cố định (px) hoặc `100%` (nếu cha của cha cũng có height).

### Custom Node Performance

- ❌ **Don't:** Define component `CustomNode` ngay bên trong component cha `MindMapFlow`.
    - *Hậu quả:* Mỗi lần state thay đổi, React sẽ unmount/remount toàn bộ node -> Mất vị trí, lag lòi mắt.
- ✅ **Do:** Define `CustomNode` ở file riêng hoặc bên ngoài component cha, và bọc nó bằng `React.memo`.

---

## 🚨 Troubleshooting

*(Update khi gặp lỗi fix được hoặc chưa fix được cũng vứt vào luôn để biết)*

### 🔧 ResizeObserver loop limit exceeded

_(Lỗi đỏ lòm trong Console)_
* **Nguyên nhân:** React Flow sử dụng `ResizeObserver` để đo kích thước node. Đôi khi nó conflict với browser extension hoặc layout shift.
* **Fix:** Thêm đoạn code này vào `_app.tsx` hoặc `index.tsx` để suppress lỗi (nó vô hại):
  ```js
  const resizeObserverLoopErr = 'ResizeObserver loop limit exceeded';
  window.addEventListener('error', (e) => {
    if (e.message === resizeObserverLoopErr) {
      e.stopImmediatePropagation();
    }
  });
  ```

### 🔧 Node không nhận click event

_(Bấm vào node mà không thấy gì)_
* **Nguyên nhân:** Có thể do thuộc tính `nodesDraggable={false}` hoặc bị layer khác đè lên (`z-index`).
* **Fix:** Kiểm tra CSS `z-index` hoặc check xem có set `pointer-events: none` nhầm chỗ nào không.

---

## 📄 Advanced Mechanics

*(Những kiến thức sâu rộng hơn về phần này)*

### Auto Layout (Tự động sắp xếp)
React Flow **không** tự sắp xếp node (bạn phải cung cấp `x, y`). Để làm Mindmap tự động bung ra đẹp mắt, cần kết hợp với thuật toán layout:
* **Dagre:** Tốt cho cây phân cấp (Hierarchical) đơn giản (Top-down, Left-right).
* **Elkjs:** Tốt cho graph phức tạp hơn, xử lý port/handle thông minh hơn.
* **Quy trình:** Data -> Dagre tính toán x,y -> Update vào State Nodes -> React Flow render.

### Sub-flows (Lồng nhau)
React Flow hỗ trợ lồng node con vào node cha (Parent/Child). Khi kéo node cha, node con đi theo.
* *Cách dùng:* Set `parentNode: 'id_cha'` trong object node con và dùng `extent: 'parent'` để giam nó trong phạm vi cha.

---

## 🔗 Connections

### Internal

- [[Standard_Project_Timeline_SOP]] (Dùng trong Sprint 2)
- [[Feature_Based_Folder_Structure]] (Nơi đặt component Flow)

### External

- [React Flow Docs](https://reactflow.dev/docs/introduction/)
- [Dagre Layout Example](https://reactflow.dev/examples/layout/dagre)
