"use client";

import { create } from "zustand";
import { useProjectStore } from "./project-store";

interface EditorState {
  zoom: number;
  panX: number;
  panY: number;
  showGrid: boolean;
  showSnapGuides: boolean;
  snapToGrid: boolean;
  gridSize: number;
  activeTool: "select" | "text" | "image" | "shape" | "draw" | "crop" | "background" | "upload";
  history: Array<{ elements: unknown[] }>;
  historyIndex: number;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  toggleGrid: () => void;
  toggleSnapGuides: () => void;
  toggleSnapToGrid: () => void;
  setActiveTool: (tool: EditorState["activeTool"]) => void;
  pushHistory: (elements: unknown[]) => void;
  undo: () => void;
  redo: () => void;
}

function applyHistorySnapshot(index: number) {
  const state = useEditorStore.getState();
  if (index < 0 || index >= state.history.length) return;
  const snapshot = state.history[index];
  const project = useProjectStore.getState().currentProject;
  if (project) {
    useProjectStore.getState().setCurrentProject({
      ...project,
      elements: snapshot.elements as typeof project.elements,
    });
    useProjectStore.getState().clearSelection();
  }
}

export const useEditorStore = create<EditorState>((set) => ({
  zoom: 1,
  panX: 0,
  panY: 0,
  showGrid: false,
  showSnapGuides: true,
  snapToGrid: true,
  gridSize: 10,
  activeTool: "select",
  history: [],
  historyIndex: -1,
  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(5, zoom)) }),
  setPan: (panX, panY) => set({ panX, panY }),
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  toggleSnapGuides: () => set((s) => ({ showSnapGuides: !s.showSnapGuides })),
  toggleSnapToGrid: () => set((s) => ({ snapToGrid: !s.snapToGrid })),
  setActiveTool: (activeTool) => set({ activeTool }),
  pushHistory: (elements) =>
    set((state) => ({
      history: [...state.history.slice(0, state.historyIndex + 1), { elements }],
      historyIndex: state.historyIndex + 1,
    })),
  undo: () => {
    const prevIndex = useEditorStore.getState().historyIndex - 1;
    set({ historyIndex: Math.max(-1, prevIndex) });
    if (prevIndex >= 0) {
      applyHistorySnapshot(prevIndex);
    }
  },
  redo: () => {
    const nextIndex = useEditorStore.getState().historyIndex + 1;
    const maxIndex = useEditorStore.getState().history.length - 1;
    set({ historyIndex: Math.min(maxIndex, nextIndex) });
    if (nextIndex <= maxIndex) {
      applyHistorySnapshot(nextIndex);
    }
  },
}));
