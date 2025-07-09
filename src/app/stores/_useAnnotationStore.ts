// import { create } from 'zustand';

// export type ShapeType = 'rectangle' | 'circle' | 'polygon';

// interface Shape {
//   id: string;
//   type: ShapeType;
//   color?: string
//   points?: number[];
//   startX: number
//   startY: number
//   width?: number;
//   height?: number;
//   radius?: number;
//   label?: string;
//   timestamp: string
// }

// interface AnnotationState {
//   shapes: Shape[];
//   selectedTool: ShapeType | 'select';
//   selectedId: string | null;
//   setTool: (tool: AnnotationState['selectedTool']) => void;
//   addShape: (shape: Shape) => void;
//   updateShape: (id: string, newProps: Partial<Shape>) => void;
//   selectShape: (id: string | null) => void;
//   deleteShape: (id: string) => void;
//   setShapes: (shapes: Shape[]) => void;
// }

// export const useAnnotationStore = create<AnnotationState>((set) => ({
//   shapes: [],
//   selectedTool: 'select',
//   selectedId: null,
//   setTool: (tool) => set({ selectedTool: tool }),
//   addShape: (shape) => set((state) => ({ shapes: [...state.shapes, shape] })),
//   updateShape: (id, newProps) =>
//     set((state) => ({
//       shapes: state.shapes.map((s) => (s.id === id ? { ...s, ...newProps } : s))
//     })),
//   selectShape: (id) => set({ selectedId: id }),
//   deleteShape: (id) =>
//     set((state) => ({ shapes: state.shapes.filter((s) => s.id !== id) })),
//   setShapes: (shapes) => set({ shapes })
// }));