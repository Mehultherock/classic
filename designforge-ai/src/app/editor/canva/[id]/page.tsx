"use client";

import { Suspense, useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, AlertTriangle } from "lucide-react";
import { useProjectStore } from "@/store/project-store";
import { useEditorStore } from "@/store/editor-store";
import CanvaStage from "@/components/editor/canva/canva-stage";
import CanvaToolbar from "@/components/editor/canva/canva-toolbar";
import CanvaProperties from "@/components/editor/canva/canva-properties";
import CanvaTopbar from "@/components/editor/canva/canva-topbar";
import type { Project, DesignElement } from "@/types";

export default function CanvaEditorPageWrapper() {
  return (
    <Suspense fallback={
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Loading canva editor...</p>
      </div>
    }>
      <CanvaEditorPage />
    </Suspense>
  );
}

function CanvaEditorPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentProject = useProjectStore((s) => s.currentProject);
  const setCurrentProject = useProjectStore((s) => s.setCurrentProject);
  const setLoadingState = useProjectStore((s) => s.setLoading);
  const resetProject = useProjectStore((s) => s.reset);
  const clearSelection = useProjectStore((s) => s.clearSelection);

  const pushHistory = useEditorStore((s) => s.pushHistory);

  const imageParamRef = useRef(searchParams?.get("image") || "");
  const titleParamRef = useRef(searchParams?.get("title") || "Untitled Design");

  useEffect(() => {
    resetProject();
    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        if (params?.id && params.id !== "new") {
          const res = await fetch(`/api/projects/${params.id}`);
          if (!res.ok) {
            setError(res.status === 404 ? "Project not found" : "Failed to load project");
            return;
          }
          const data = await res.json();
          setCurrentProject(data);
          if (data.elements?.length > 0) pushHistory([...data.elements]);
        } else {
          const elements: DesignElement[] = [];
          const title = titleParamRef.current || "Untitled Design";

          if (imageParamRef.current) {
            elements.push({
              id: `el_img_${Date.now()}`,
              type: "image",
              x: 0, y: 0, width: 800, height: 600,
              rotation: 0, opacity: 1, zIndex: 0,
              locked: false, visible: true,
              properties: { src: imageParamRef.current, borderRadius: 0, filters: {} },
            });
            elements.push({
              id: `el_txt_${Date.now()}`,
              type: "text",
              x: 40, y: 60, width: 720, height: 60,
              rotation: 0, opacity: 1, zIndex: 1,
              locked: false, visible: true,
              properties: {
                content: title,
                fontFamily: "Inter", fontSize: 36, fontWeight: 700,
                color: "#ffffff", textAlign: "center",
                lineHeight: 1.2, letterSpacing: 0,
                textDecoration: "none", fontStyle: "normal", textTransform: "none",
                shadow: { offsetX: 2, offsetY: 2, blur: 8, color: "rgba(0,0,0,0.8)" },
              },
            });
            elements.push({
              id: `el_txt2_${Date.now()}`,
              type: "text",
              x: 100, y: 460, width: 600, height: 36,
              rotation: 0, opacity: 1, zIndex: 1,
              locked: false, visible: true,
              properties: {
                content: "Double-click text to edit",
                fontFamily: "Inter", fontSize: 16, fontWeight: 400,
                color: "#ffffff60", textAlign: "center",
                lineHeight: 1.5, letterSpacing: 0,
                textDecoration: "none", fontStyle: "normal", textTransform: "none",
              },
            });
          }

          setCurrentProject({
            id: `new_${Date.now()}`,
            user_id: "",
            title,
            type: "custom",
            width: 800, height: 600,
            elements,
            ai_generated: false,
            status: "draft",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error("Error loading project:", err);
        setError("Failed to load project. Please try again.");
      } finally {
        setLoading(false);
        setLoadingState(false);
      }
    };
    fetchProject();
    return () => { resetProject(); };
  }, [params?.id]);

  const handleSave = useCallback(
    async (project: Project) => {
      try {
        const res = await fetch("/api/projects", {
          method: project.id.startsWith("new_") ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(project),
        });
        if (!res.ok) throw new Error("Save failed");
        const saved = await res.json();
        if (project.id.startsWith("new_") && saved.id) {
          setCurrentProject(saved);
          router.replace(`/editor/canva/${saved.id}`, { scroll: false });
        }
      } catch (err) {
        console.error("Save error:", err);
        throw err;
      }
    },
    [router, setCurrentProject]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        if (e.shiftKey) useEditorStore.getState().redo();
        else useEditorStore.getState().undo();
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertTriangle className="w-12 h-12 text-error mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">{error}</h2>
          <p className="text-sm text-muted-foreground mb-6">Something went wrong while loading your project.</p>
          <div className="flex gap-3 justify-center">
            <button
              className="px-4 py-2 rounded-lg text-sm text-foreground bg-card border border-border hover:bg-surface-hover transition-all"
              onClick={() => router.push("/dashboard/projects")}
            >
              Back to Dashboard
            </button>
            <button
              className="px-4 py-2 rounded-lg text-sm text-white bg-primary hover:bg-primary-dark transition-all"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentProject) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen w-screen flex flex-col bg-background overflow-hidden"
    >
      <CanvaTopbar onSave={handleSave} />
      <div className="flex-1 flex overflow-hidden">
        <CanvaToolbar />
        <div className="flex-1 relative konva-container">
          <CanvaStage />
        </div>
        <CanvaProperties />
      </div>
    </motion.div>
  );
}
