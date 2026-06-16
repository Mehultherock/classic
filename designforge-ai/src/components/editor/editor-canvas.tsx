"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useEditorStore } from "@/store/editor-store";
import { useProjectStore } from "@/store/project-store";
import { getSnapGuides, getResizeCursor } from "./editor-actions";
import TextElement from "./elements/text-element";
import ImageElement from "./elements/image-element";
import ShapeElement from "./elements/shape-element";
import type { DesignElement } from "@/types";

type ResizeHandle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

export default function EditorCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, elX: 0, elY: 0 });
  const [resizing, setResizing] = useState<string | null>(null);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle | null>(null);
  const [resizeStart, setResizeStart] = useState({
    x: 0, y: 0, elX: 0, elY: 0, elW: 0, elH: 0,
  });
  const [rotating, setRotating] = useState<string | null>(null);
  const [rotationStart, setRotationStart] = useState({ angle: 0, elRot: 0 });
  const [snapGuides, setSnapGuides] = useState<
    { orientation: "horizontal" | "vertical"; position: number }[]
  >([]);

  const zoom = useEditorStore((s) => s.zoom);
  const panX = useEditorStore((s) => s.panX);
  const panY = useEditorStore((s) => s.panY);
  const setPan = useEditorStore((s) => s.setPan);
  const setZoom = useEditorStore((s) => s.setZoom);
  const showGrid = useEditorStore((s) => s.showGrid);
  const gridSize = useEditorStore((s) => s.gridSize);
  const snapToGrid = useEditorStore((s) => s.snapToGrid);
  const activeTool = useEditorStore((s) => s.activeTool);

  const currentProject = useProjectStore((s) => s.currentProject);
  const selectedElements = useProjectStore((s) => s.selectedElements);
  const setSelectedElements = useProjectStore((s) => s.setSelectedElements);
  const addToSelection = useProjectStore((s) => s.addToSelection);
  const clearSelection = useProjectStore((s) => s.clearSelection);
  const updateElement = useProjectStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);

  const canvasWidth = currentProject?.width ?? 800;
  const canvasHeight = currentProject?.height ?? 600;

  const elements = useMemo(
    () =>
      [...(currentProject?.elements || [])].sort(
        (a, b) => a.zIndex - b.zIndex
      ),
    [currentProject?.elements]
  );

  const handleSpaceKey = useCallback((e: KeyboardEvent) => {
    if (e.code === "Space" && !e.repeat) {
      e.preventDefault();
      setIsPanning(true);
    }
  }, []);

  const handleSpaceKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code === "Space") {
      setIsPanning(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleSpaceKey);
    window.addEventListener("keyup", handleSpaceKeyUp);
    return () => {
      window.removeEventListener("keydown", handleSpaceKey);
      window.removeEventListener("keyup", handleSpaceKeyUp);
    };
  }, [handleSpaceKey, handleSpaceKeyUp]);

  const getCanvasCoords = useCallback(
    (clientX: number, clientY: number) => {
      if (!canvasRef.current) return { x: 0, y: 0 };
      const rect = canvasRef.current.getBoundingClientRect();
      return {
        x: (clientX - rect.left) / zoom,
        y: (clientY - rect.top) / zoom,
      };
    },
    [zoom]
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = -e.deltaY * 0.001;
        setZoom(zoom + delta);
      } else {
        setPan(panX - e.deltaX, panY - e.deltaY);
      }
    },
    [zoom, panX, panY, setZoom, setPan]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        setPanStart({ x: e.clientX - panX, y: e.clientY - panY });
        return;
      }
      const target = e.target as HTMLElement;
      const elementId = target.closest("[data-element-id]")?.getAttribute(
        "data-element-id"
      );

      if (elementId) {
        const el = elements.find((el) => el.id === elementId);
        if (el?.locked) return;

        if (e.shiftKey) {
          if (selectedElements.includes(elementId)) {
            const newSel = selectedElements.filter((id) => id !== elementId);
            setSelectedElements(newSel);
          } else {
            addToSelection(elementId);
          }
        } else if (!selectedElements.includes(elementId)) {
          setSelectedElements([elementId]);
        }
      } else {
        clearSelection();
      }
    },
    [
      isPanning,
      panX,
      panY,
      elements,
      selectedElements,
      setSelectedElements,
      addToSelection,
      clearSelection,
    ]
  );

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent, el: DesignElement) => {
      if (isPanning) return;
      if (el.locked) return;
      e.stopPropagation();
      const target = e.target as HTMLElement;

      const resizeHandle = target.getAttribute("data-resize-handle") as ResizeHandle | null;
      if (resizeHandle) {
        pushHistory([...(currentProject?.elements || [])]);
        setResizing(el.id);
        setResizeHandle(resizeHandle);
        setResizeStart({
          x: e.clientX,
          y: e.clientY,
          elX: el.x,
          elY: el.y,
          elW: el.width,
          elH: el.height,
        });
        return;
      }

      const rotateHandle = target.getAttribute("data-rotate-handle");
      if (rotateHandle) {
        pushHistory([...(currentProject?.elements || [])]);
        setRotating(el.id);
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const cx = (el.x + el.width / 2) * zoom + rect.left;
        const cy = (el.y + el.height / 2) * zoom + rect.top;
        const startAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
        setRotationStart({ angle: startAngle, elRot: el.rotation });
        return;
      }

      if (activeTool === "select" || !activeTool) {
        if (!selectedElements.includes(el.id)) {
          setSelectedElements([el.id]);
        }
        pushHistory([...(currentProject?.elements || [])]);
        setDragging(el.id);
        setDragStart({ x: e.clientX, y: e.clientY, elX: el.x, elY: el.y });
      }
    },
    [isPanning, activeTool, selectedElements, setSelectedElements, zoom, currentProject, pushHistory]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        setPan(e.clientX - panStart.x, e.clientY - panStart.y);
        return;
      }

      if (dragging) {
        const el = elements.find((el) => el.id === dragging);
        if (!el) return;
        const dx = (e.clientX - dragStart.x) / zoom;
        const dy = (e.clientY - dragStart.y) / zoom;

        if (snapToGrid) {
          const snappedX = Math.round((dragStart.elX + dx) / gridSize) * gridSize;
          const snappedY = Math.round((dragStart.elY + dy) / gridSize) * gridSize;
          updateElement(dragging, { x: snappedX, y: snappedY });
        } else {
          const { offsetX, offsetY, guides } = getSnapGuides(
            { ...el, x: dragStart.elX + dx, y: dragStart.elY + dy },
            elements.filter((e) => e.id !== dragging),
            canvasWidth,
            canvasHeight
          );
          if (guides.length > 0) {
            setSnapGuides(guides);
          } else {
            setSnapGuides([]);
          }
          updateElement(dragging, {
            x: dragStart.elX + dx + offsetX,
            y: dragStart.elY + dy + offsetY,
          });
        }
      }

      if (resizing && resizeHandle) {
        const el = elements.find((el) => el.id === resizing);
        if (!el) return;
        const dx = (e.clientX - resizeStart.x) / zoom;
        const dy = (e.clientY - resizeStart.y) / zoom;

        let newX = resizeStart.elX;
        let newY = resizeStart.elY;
        let newW = resizeStart.elW;
        let newH = resizeStart.elH;

        if (resizeHandle.includes("e")) newW = Math.max(10, resizeStart.elW + dx);
        if (resizeHandle.includes("w")) {
          newW = Math.max(10, resizeStart.elW - dx);
          newX = resizeStart.elX + (resizeStart.elW - newW);
        }
        if (resizeHandle.includes("s")) newH = Math.max(10, resizeStart.elH + dy);
        if (resizeHandle.includes("n")) {
          newH = Math.max(10, resizeStart.elH - dy);
          newY = resizeStart.elY + (resizeStart.elH - newH);
        }

        updateElement(resizing, { x: newX, y: newY, width: newW, height: newH });
      }

      if (rotating) {
        const el = elements.find((el) => el.id === rotating);
        if (!el || !canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const cx = (el.x + el.width / 2) * zoom + rect.left;
        const cy = (el.y + el.height / 2) * zoom + rect.top;
        const currentAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
        const deltaAngle = currentAngle - rotationStart.angle;
        updateElement(rotating, {
          rotation: (rotationStart.elRot + deltaAngle) % 360,
        });
      }
    },
    [
      isPanning, dragging, resizing, resizeHandle, rotating,
      elements, zoom, snapToGrid, gridSize, canvasWidth, canvasHeight,
      panStart, dragStart, resizeStart, rotationStart,
      updateElement, setPan,
    ]
  );

  const handleMouseUp = useCallback(() => {
    if (dragging || resizing) {
      pushHistory([...(currentProject?.elements || [])]);
    }
    setDragging(null);
    setResizing(null);
    setResizeHandle(null);
    setRotating(null);
    setSnapGuides([]);
  }, [dragging, resizing, currentProject, pushHistory]);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      const elementId = target.closest("[data-element-id]")?.getAttribute(
        "data-element-id"
      );
      if (!elementId && activeTool === "text") {
        const coords = getCanvasCoords(e.clientX, e.clientY);
        const newEl: DesignElement = {
          id: `el_${Date.now()}`,
          type: "text",
          x: coords.x,
          y: coords.y,
          width: 200,
          height: 50,
          rotation: 0,
          opacity: 1,
          zIndex: elements.length + 1,
          locked: false,
          visible: true,
          properties: {
            content: "Double-click to edit",
            fontFamily: "Inter",
            fontSize: 24,
            fontWeight: 400,
            color: "#ffffff",
            textAlign: "left",
            lineHeight: 1.5,
            letterSpacing: 0,
            textDecoration: "none",
            fontStyle: "normal",
            textTransform: "none",
          },
        };
        useProjectStore.getState().addElement(newEl);
        useEditorStore.getState().setActiveTool("select");
      } else if (!elementId && activeTool === "shape") {
        const coords = getCanvasCoords(e.clientX, e.clientY);
        const newEl: DesignElement = {
          id: `el_${Date.now()}`,
          type: "shape",
          x: coords.x,
          y: coords.y,
          width: 100,
          height: 100,
          rotation: 0,
          opacity: 1,
          zIndex: elements.length + 1,
          locked: false,
          visible: true,
          properties: {
            shapeType: "rectangle",
            fillColor: "#6366f1",
          },
        };
        useProjectStore.getState().addElement(newEl);
        useEditorStore.getState().setActiveTool("select");
      }
    },
    [activeTool, elements.length, getCanvasCoords]
  );

  const getElementRenderer = (el: DesignElement) => {
    const isSelected = selectedElements.includes(el.id);
    switch (el.type) {
      case "text":
        return (
          <TextElement
            element={el}
            isSelected={isSelected}
            onDoubleClick={() => {}}
          />
        );
      case "image":
        return <ImageElement element={el} isSelected={isSelected} />;
      case "shape":
        return <ShapeElement element={el} isSelected={isSelected} />;
      default:
        return null;
    }
  };

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        const newEl: DesignElement = {
          id: `el_${Date.now()}`,
          type: "image",
          x: 50,
          y: 50,
          width: 300,
          height: 200,
          rotation: 0,
          opacity: 1,
          zIndex: elements.length + 1,
          locked: false,
          visible: true,
          properties: { src, borderRadius: 0, filters: {} },
        };
        useProjectStore.getState().addElement(newEl);
        useEditorStore.getState().setActiveTool("select");
      };
      reader.readAsDataURL(file);
    },
    [elements.length]
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeTool === "image" && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [activeTool]);

  const selectedElement = elements.find((el) =>
    selectedElements.includes(el.id)
  );

  return (
    <div
      ref={containerRef}
      className="flex-1 relative overflow-hidden bg-background"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isPanning ? "grabbing" : undefined }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
        onClick={(e) => {
          (e.target as HTMLInputElement).value = "";
        }}
      />

        <motion.div
        ref={canvasRef}
        className="absolute"
        style={{
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          transformOrigin: "0 0",
        }}
        onClick={handleCanvasClick}
      >
        <div
          data-editor-canvas
          className="relative bg-white rounded-sm overflow-hidden"
          style={{
            width: canvasWidth,
            height: canvasHeight,
            boxShadow: "0 0 0 1px rgba(0,0,0,0.1), 0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          {showGrid && (
            <svg
              className="absolute inset-0 pointer-events-none z-50"
              width={canvasWidth}
              height={canvasHeight}
              style={{ opacity: 0.15 }}
            >
              <defs>
                <pattern
                  id="grid"
                  width={gridSize}
                  height={gridSize}
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
                    fill="none"
                    stroke="#888"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          )}

          {elements
            .filter((el) => el.visible)
            .map((el) => (
              <div
                key={el.id}
                data-element-id={el.id}
                className="absolute group"
                style={{
                  left: el.x,
                  top: el.y,
                  width: el.width,
                  height: el.height,
                  transform: `rotate(${el.rotation}deg)`,
                  zIndex: el.zIndex,
                  opacity: el.opacity ?? 1,
                }}
                onMouseDown={(e) => handleCanvasMouseDown(e, el)}
              >
                {getElementRenderer(el)}

                {selectedElements.includes(el.id) && !el.locked && (
                  <>
                    <div className="absolute inset-0 ring-2 ring-primary/80 pointer-events-none" />

                    <div
                      data-rotate-handle="true"
                      className="absolute -top-10 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center cursor-grab active:cursor-grabbing"
                    >
                      <div className="w-0.5 h-6 bg-primary/60 mx-auto" />
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </div>
                    </div>

                    {(["nw", "n", "ne", "e", "se", "s", "sw", "w"] as const).map(
                      (handle) => {
                        const posStyle: React.CSSProperties = {};
                        if (handle.includes("n")) posStyle.top = -4;
                        if (handle.includes("s")) posStyle.bottom = -4;
                        if (handle.includes("w")) posStyle.left = -4;
                        if (handle.includes("e")) posStyle.right = -4;
                        if (handle === "n" || handle === "s") {
                          posStyle.left = "50%";
                          posStyle.marginLeft = -4;
                        }
                        if (handle === "w" || handle === "e") {
                          posStyle.top = "50%";
                          posStyle.marginTop = -4;
                        }

                        return (
                          <div
                            key={handle}
                            data-resize-handle={handle}
                            className="absolute w-2.5 h-2.5 bg-primary border-2 border-white rounded-sm z-10"
                            style={{
                              ...posStyle,
                              cursor: getResizeCursor(handle),
                            }}
                          />
                        );
                      }
                    )}
                  </>
                )}
              </div>
            ))}

          {snapGuides.map((guide, i) => (
            <div
              key={`guide-${i}`}
              className="absolute pointer-events-none z-[9999]"
              style={{
                [guide.orientation === "vertical" ? "left" : "top"]: guide.position,
                [guide.orientation === "vertical" ? "top" : "left"]: 0,
                [guide.orientation === "vertical" ? "width" : "height"]: 1,
                [guide.orientation === "vertical" ? "height" : "width"]: guide.orientation === "vertical" ? canvasHeight : canvasWidth,
                background: "#6366f1",
                boxShadow: "0 0 4px rgba(99,102,241,0.5)",
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
