"use client";

import { create } from "zustand";
import type { Project, DesignElement } from "@/types";

interface ProjectState {
  currentProject: Project | null;
  projects: Project[];
  selectedElements: string[];
  isLoading: boolean;
  setCurrentProject: (project: Project | null) => void;
  setProjects: (projects: Project[]) => void;
  addElement: (element: DesignElement) => void;
  updateElement: (id: string, props: Partial<DesignElement>) => void;
  removeElement: (id: string) => void;
  setSelectedElements: (ids: string[]) => void;
  addToSelection: (id: string) => void;
  removeFromSelection: (id: string) => void;
  clearSelection: () => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  currentProject: null,
  projects: [],
  selectedElements: [],
  isLoading: false,
  setCurrentProject: (project) => set({ currentProject: project }),
  setProjects: (projects) => set({ projects }),
  addElement: (element) =>
    set((state) => ({
      currentProject: state.currentProject
        ? {
            ...state.currentProject,
            elements: [...state.currentProject.elements, element],
          }
        : null,
    })),
  updateElement: (id, props) =>
    set((state) => ({
      currentProject: state.currentProject
        ? {
            ...state.currentProject,
            elements: state.currentProject.elements.map((el) =>
              el.id === id ? { ...el, ...props } : el
            ),
          }
        : null,
    })),
  removeElement: (id) =>
    set((state) => ({
      currentProject: state.currentProject
        ? {
            ...state.currentProject,
            elements: state.currentProject.elements.filter(
              (el) => el.id !== id
            ),
          }
        : null,
      selectedElements: state.selectedElements.filter((eid) => eid !== id),
    })),
  setSelectedElements: (ids) => set({ selectedElements: ids }),
  addToSelection: (id) =>
    set((state) => ({
      selectedElements: [...state.selectedElements, id],
    })),
  removeFromSelection: (id) =>
    set((state) => ({
      selectedElements: state.selectedElements.filter((eid) => eid !== id),
    })),
  clearSelection: () => set({ selectedElements: [] }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () =>
    set({
      currentProject: null,
      selectedElements: [],
      isLoading: false,
    }),
}));
