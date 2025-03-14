import { create } from "zustand";

interface Shape {
  id: string;
  type: "rect";
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  connections: string[];
}

interface StoreState {
  shapes: Shape[];
  addShape: (type: "rect", x: number, y: number) => void;
  updateShape: (id: string, updates: Partial<Shape>) => void;
  connectShapes: (id1: string, id2: string) => void;
  removeShape: (id: string) => void;
}

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
          width: type === "rect" ? 80 : undefined,
          height: type === "rect" ? 50 : undefined,
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
  removeShape: (id) => {
    set((state) => ({
      shapes: state.shapes.filter((shape) => shape.id !== id),
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
