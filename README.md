# Documentação do Projeto: Quadro Interativo

Este projeto permite desenhar formas interativas em um **quadro virtual**, podendo conectá-las entre si. As formas podem ser **movidas** e **modificadas** dinamicamente.

## 1. Estrutura do Projeto
O projeto está dividido em:
- **`store.ts`** → Gerencia o estado global com a biblioteca Zustand.
- **`CanvasBoard.tsx`** → Renderiza o quadro interativo e manipula os eventos de clique e arrasto.
- **`App.tsx`** → Componente principal que inclui o `CanvasBoard`.

---

## 2. Estado Global (`store.ts`)
O estado global é gerenciado com **Zustand**. Ele contém:

### **2.1 Interface Shape**
Define a estrutura das formas desenhadas:
```tsx
interface Shape {
  id: string;
  type: "rect" | "circle";
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  connections: string[];
}
```

### **2.2 Interface StoreState**
Define o formato do estado global:
```tsx
interface StoreState {
  shapes: Shape[];
  addShape: (type: "rect" | "circle", x: number, y: number) => void;
  updateShape: (id: string, updates: Partial<Shape>) => void;
  connectShapes: (id1: string, id2: string) => void;
}
```

### **2.3 Criação do Zustand Store**
A store possui funções para adicionar, atualizar e conectar formas.
```tsx
export const useStore = create<StoreState>((set) => ({
  shapes: [],

  addShape: (type, x, y) => {
    set((state) => ({
      shapes: [
        ...state.shapes,
        {
          id: crypto.randomUUID(),
          type,
          x,
          y,
          width: type === "rect" ? 100 : undefined,
          height: type === "rect" ? 50 : undefined,
          radius: type === "circle" ? 30 : undefined,
          connections: [],
        },
      ],
    }));
  },

  updateShape: (id, updates) => {
    set((state) => ({
      shapes: state.shapes.map((shape) =>
        shape.id === id ? { ...shape, ...updates } : shape
      ),
    }));
  },

  connectShapes: (id1, id2) => {
    set((state) => ({
      shapes: state.shapes.map((shape) =>
        shape.id === id1
          ? { ...shape, connections: [...shape.connections, id2] }
          : shape.id === id2
          ? { ...shape, connections: [...shape.connections, id1] }
          : shape
      ),
    }));
  },
}));
```

---

## 3. Componente do Quadro (`CanvasBoard.tsx`)
Este componente usa **react-konva** para desenhar formas e gerenciar interações.

### **3.1 Importações**
```tsx
import { Stage, Layer, Rect, Circle, Line } from "react-konva";
import { useStore } from "./store";
import { useState } from "react";
```

### **3.2 Estado Local**
```tsx
const { shapes, addShape, updateShape, connectShapes } = useStore();
const [connecting, setConnecting] = useState<string | null>(null);
```
- **`shapes`** → Lista de formas do estado global.
- **`addShape`** → Adiciona uma forma nova.
- **`updateShape`** → Atualiza posição de uma forma.
- **`connectShapes`** → Conecta duas formas.
- **`connecting`** → Estado temporário para definir conexões.

### **3.3 Adicionar Forma ao Clicar no Fundo**
```tsx
const handleStageClick = (e: any) => {
  if (e.target === e.target.getStage()) {
    addShape("rect", e.evt.layerX, e.evt.layerY);
  }
};
```
Quando o usuário **clica no fundo**, um **retângulo** é adicionado na posição clicada.

### **3.4 Movimentar Formas**
```tsx
const handleDragMove = (e: any, id: string) => {
  updateShape(id, { x: e.target.x(), y: e.target.y() });
};
```
Ao **arrastar uma forma**, sua posição no estado global é atualizada.

### **3.5 Conectar Formas**
```tsx
const handleShapeClick = (id: string) => {
  if (connecting) {
    connectShapes(connecting, id);
    setConnecting(null);
  } else {
    setConnecting(id);
  }
};
```
- **1º clique:** Seleciona a primeira forma.
- **2º clique:** Conecta com a segunda forma.

### **3.6 Renderização do Quadro**
```tsx
<Stage width={window.innerWidth} height={window.innerHeight} onClick={handleStageClick}>
  <Layer>
    {shapes.map((shape) =>
      shape.type === "rect" ? (
        <Rect
          key={shape.id}
          x={shape.x}
          y={shape.y}
          width={shape.width!}
          height={shape.height!}
          fill="blue"
          draggable
          onDragMove={(e) => handleDragMove(e, shape.id)}
          onClick={() => handleShapeClick(shape.id)}
        />
      ) : (
        <Circle
          key={shape.id}
          x={shape.x}
          y={shape.y}
          radius={shape.radius!}
          fill="red"
          draggable
          onDragMove={(e) => handleDragMove(e, shape.id)}
          onClick={() => handleShapeClick(shape.id)}
        />
      )
    )}

    {shapes.flatMap((shape) =>
      shape.connections.map((connId) => {
        const target = shapes.find((s) => s.id === connId);
        return (
          target && (
            <Line
              key={`${shape.id}-${connId}`}
              points={[shape.x + 50, shape.y + 50, target.x + 50, target.y + 50]}
              stroke="black"
              strokeWidth={2}
            />
          )
        );
      })
    )}
  </Layer>
</Stage>
```
- **Formas (`Rect`, `Circle`)** → Criam os objetos visuais.
- **Linhas (`Line`)** → Criam conexões entre as formas.
- **Movimentação (`draggable`)** → Permite arrastar as formas.

---

## 4. Conclusão
O projeto utiliza:
✅ **Zustand** para gerenciar o estado global.
✅ **react-konva** para desenhar no canvas.
✅ **Eventos interativos** para adicionar, mover e conectar formas.

Se precisar de ajustes ou novas funcionalidades, me avise! 🚀

