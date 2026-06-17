"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, AlertTriangle } from "lucide-react";
import { useProjectStore } from "@/store/project-store";
import { useEditorStore } from "@/store/editor-store";
import Canva2Stage from "@/components/editor/canva2/canva-stage";
import Canva2Toolbar from "@/components/editor/canva2/canva-toolbar";
import Canva2Properties from "@/components/editor/canva2/canva-properties";
import Canva2Topbar from "@/components/editor/canva2/canva-topbar";
import TemplateGallery from "@/components/editor/canva2/template-gallery";
import FieldPanel from "@/components/editor/canva2/field-panel";
import LayerPanel from "@/components/editor/canva2/layer-panel";
import AssetsPanel from "@/components/editor/canva2/assets-panel";
import { invitationTemplates, type InvitationTemplate } from "@/data/invitation-templates";
import type { Project, DesignElement } from "@/types";

export default function Canva2EditorPageWrapper() {
  return (
    <Suspense fallback={
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Loading editor...</p>
      </div>
    }>
      <Canva2EditorPage />
    </Suspense>
  );
}

function Canva2EditorPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"templates" | "fields" | "assets">("templates");
  const [rightTab, setRightTab] = useState<"properties" | "layers">("properties");
  const [selectedTemplate, setSelectedTemplate] = useState<InvitationTemplate | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  const currentProject = useProjectStore((s) => s.currentProject);
  const setCurrentProject = useProjectStore((s) => s.setCurrentProject);
  const setLoadingState = useProjectStore((s) => s.setLoading);
  const resetProject = useProjectStore((s) => s.reset);
  const clearSelection = useProjectStore((s) => s.clearSelection);
  const updateElement = useProjectStore((s) => s.updateElement);

  const pushHistory = useEditorStore((s) => s.pushHistory);

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
          const templateId = searchParams?.get("template") || "";
          const title = searchParams?.get("title") || "Untitled Invitation";
          let elements: DesignElement[] = [];
          let foundTemplate: InvitationTemplate | null = null;

          if (templateId) {
            foundTemplate = invitationTemplates.find((t) => t.id === templateId) || null;
          }
          if (!foundTemplate) {
            foundTemplate = invitationTemplates[0] || null;
          }

          if (foundTemplate) {
            setSelectedTemplate(foundTemplate);
            const fv: Record<string, string> = {};
            foundTemplate.fields.forEach((f) => { fv[f.id] = f.default; });
            setFieldValues(fv);

            elements = templateToElements(foundTemplate, fv);
          }

          const proj: Project = {
            id: `new_${Date.now()}`,
            user_id: "",
            title,
            type: "invitation",
            width: foundTemplate?.width || 800,
            height: foundTemplate?.height || 600,
            elements,
            ai_generated: false,
            status: "draft",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setCurrentProject(proj);
          if (elements.length > 0) pushHistory([...elements]);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  const handleTemplateSelect = useCallback((template: InvitationTemplate) => {
    setSelectedTemplate(template);
    const fv: Record<string, string> = {};
    template.fields.forEach((f) => { fv[f.id] = f.default; });
    setFieldValues(fv);

    const elements = templateToElements(template, fv);
    if (currentProject) {
      pushHistory([...(currentProject.elements || [])]);
      setCurrentProject({ ...currentProject, elements, width: template.width, height: template.height });
    } else {
      resetProject();
      setCurrentProject({
        id: `new_${Date.now()}`,
        user_id: "",
        title: template.name,
        type: "invitation",
        width: template.width,
        height: template.height,
        elements,
        ai_generated: false,
        status: "draft",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      pushHistory([...elements]);
    }
    clearSelection();
    setActiveTab("fields");
  }, [currentProject, pushHistory, setCurrentProject, resetProject, clearSelection]);

  const handleFieldChange = useCallback((fieldId: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [fieldId]: value }));
    if (!currentProject) return;
    const el = currentProject.elements.find(
      (e) => (e.properties as Record<string, unknown>)?.fieldId === fieldId
    );
    if (el) {
      pushHistory([...(currentProject.elements || [])]);
      updateElement(el.id, {
        properties: { ...el.properties, content: value },
      } as Partial<DesignElement>);
    }
  }, [currentProject, pushHistory, updateElement]);

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
            <button className="px-4 py-2 rounded-lg text-sm text-foreground bg-card border border-border hover:bg-surface-hover transition-all" onClick={() => router.push("/projects")}>Back to Projects</button>
            <button className="px-4 py-2 rounded-lg text-sm text-white bg-primary hover:bg-primary-dark transition-all" onClick={() => window.location.reload()}>Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentProject) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-screen w-screen flex flex-col bg-background overflow-hidden">
      <Canva2Topbar title={currentProject.title || "Invitation Editor"} />
      <div className="flex-1 flex overflow-hidden">
        <Canva2Toolbar />
        <div className="w-80 glass border-r border-border flex flex-col z-30">
          <div className="flex border-b border-border">
            <button className={`flex-1 h-9 text-xs font-medium flex items-center justify-center transition-all ${activeTab === "templates" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`} onClick={() => setActiveTab("templates")}>Templates</button>
            <button className={`flex-1 h-9 text-xs font-medium flex items-center justify-center transition-all ${activeTab === "fields" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`} onClick={() => setActiveTab("fields")}>Fields</button>
            <button className={`flex-1 h-9 text-xs font-medium flex items-center justify-center transition-all ${activeTab === "assets" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`} onClick={() => setActiveTab("assets")}>Assets</button>
          </div>
          <div className="flex-1 overflow-hidden">
            {activeTab === "templates" ? (
              <TemplateGallery onSelect={handleTemplateSelect} selectedId={selectedTemplate?.id || null} />
            ) : activeTab === "assets" ? (
              <AssetsPanel />
            ) : (
              <FieldPanel template={selectedTemplate} values={fieldValues} onChange={handleFieldChange} />
            )}
          </div>
        </div>
        <div className="flex-1 relative konva-container">
          <Canva2Stage />
        </div>
        <div className="w-72 glass border-l border-border flex flex-col z-30">
          <div className="flex border-b border-border">
            <button className={`flex-1 h-9 text-xs font-medium flex items-center justify-center transition-all ${rightTab === "properties" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`} onClick={() => setRightTab("properties")}>Properties</button>
            <button className={`flex-1 h-9 text-xs font-medium flex items-center justify-center transition-all ${rightTab === "layers" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`} onClick={() => setRightTab("layers")}>Layers</button>
          </div>
          <div className="flex-1 overflow-hidden">
            {rightTab === "properties" ? <Canva2Properties /> : <LayerPanel />}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function templateToElements(template: InvitationTemplate, fieldValues: Record<string, string>): DesignElement[] {
  const elements: DesignElement[] = [];
  let zIndex = 0;

  if (template.background.type === "color") {
    elements.push({
      id: `el_bg_${Date.now()}`, type: "shape",
      x: 0, y: 0, width: template.width, height: template.height,
      rotation: 0, opacity: 1, zIndex: zIndex++,
      locked: true, visible: true,
      properties: { shapeType: "rectangle", fillColor: template.background.value, strokeWidth: 0 },
    });
  }

  template.fields.forEach((field) => {
    elements.push({
      id: `el_${field.id}_${Date.now()}`, type: "text",
      x: field.x, y: field.y, width: field.width, height: field.height,
      rotation: 0, opacity: 1, zIndex: zIndex++,
      locked: false, visible: true,
      properties: {
        fieldId: field.id,
        content: fieldValues[field.id] ?? field.default,
        fontFamily: field.fontFamily || "Inter",
        fontSize: field.fontSize || 24,
        fontWeight: field.fontWeight || 400,
        color: field.color || "#ffffff",
        textAlign: field.textAlign || "left",
        lineHeight: field.lineHeight || 1.2,
        letterSpacing: 0,
        textDecoration: "none",
        fontStyle: "normal",
        textTransform: "none",
      },
    });
  });

  template.decorations?.forEach((dec, i) => {
    if (dec.type === "shape") {
      elements.push({
        id: `el_dec_shape_${i}_${Date.now()}`, type: "shape",
        x: dec.x, y: dec.y, width: dec.width || 100, height: dec.height || 100,
        rotation: dec.rotation || 0, opacity: dec.opacity ?? 1, zIndex: zIndex++,
        locked: true, visible: true,
        properties: {
          shapeType: dec.shapeType || "rectangle",
          fillColor: dec.fillColor || "#6366f1",
          strokeWidth: dec.strokeWidth || 0,
        },
      });
    } else if (dec.type === "image") {
      elements.push({
        id: `el_dec_img_${i}_${Date.now()}`, type: "image",
        x: dec.x, y: dec.y, width: dec.width || 200, height: dec.height || 200,
        rotation: dec.rotation || 0, opacity: dec.opacity ?? 1, zIndex: zIndex++,
        locked: true, visible: true,
        properties: { src: dec.src || "", borderRadius: 0, filters: {} },
      });
    }
  });

  return elements;
}
