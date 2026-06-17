"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Stage, Layer, Rect, Text, Image as KonvaImage, Group, Transformer, Ellipse, Line, Star, Path } from "react-konva";
import type Konva from "konva";
import { useProjectStore } from "@/store/project-store";
import { useEditorStore } from "@/store/editor-store";
import type { DesignElement, TextProperties, ImageProperties, ShapeProperties } from "@/types";
import type { InvitationTemplate } from "@/data/invitation-templates";

export default function Canva2Stage({
  template,
  onFieldChange,
}: {
  template: InvitationTemplate | null;
  onFieldChange?: (fieldId: string, value: string) => void;
}) {
  const stageRef = useRef<Konva.Stage>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [textEditingId, setTextEditingId] = useState<string | null>(null);
  const currentProject = useProjectStore((s) => s.currentProject);
  const selectedElements = useProjectStore((s) => s.selectedElements);
  const setSelectedElements = useProjectStore((s) => s.setSelectedElements);
  const clearSelection = useProjectStore((s) => s.clearSelection);
  const updateElement = useProjectStore((s) => s.updateElement);
  const zoom = useEditorStore((s) => s.zoom);
  const panX = useEditorStore((s) => s.panX);
  const panY = useEditorStore((s) => s.panY);
  const [containerSize, setContainerSize] = useState({ w: 800, h: 600 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const e = entries[0];
      setContainerSize({ w: e.contentRect.width, h: e.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const canvasWidth = template?.width ?? currentProject?.width ?? 800;
  const canvasHeight = template?.height ?? currentProject?.height ?? 600;

  const elements = [...(currentProject?.elements || [])].sort((a, b) => a.zIndex - b.zIndex);

  const handleSelect = useCallback((id: string) => {
    setSelectedElements([id]);
  }, [setSelectedElements]);

  const handleDragEnd = useCallback((id: string, x: number, y: number) => {
    updateElement(id, { x, y });
  }, [updateElement]);

  const handleTransformEnd = useCallback((id: string, x: number, y: number, w: number, h: number, r: number) => {
    updateElement(id, { x, y, width: w, height: h, rotation: r });
  }, [updateElement]);

  const handleTextEdit = useCallback((id: string, content: string) => {
    const el = currentProject?.elements.find((e) => e.id === id);
    if (el) {
      updateElement(id, { properties: { ...el.properties, content } });
      const fieldId = el.properties?.fieldId as string;
      if (fieldId && onFieldChange) onFieldChange(fieldId, content);
    }
  }, [currentProject, updateElement, onFieldChange]);

  const selectedId = selectedElements.length === 1 ? selectedElements[0] : null;

  return (
    <div ref={containerRef} className="flex-1 relative overflow-hidden bg-[#1a1a2e]">
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ transform: `translate(${panX}px, ${panY}px) scale(${zoom})` }}
      >
        <Stage
          ref={stageRef}
          width={canvasWidth}
          height={canvasHeight}
          onClick={(e) => { if (e.target === e.target.getStage()) clearSelection(); }}
          style={{ background: "#ffffff", boxShadow: "0 0 0 1px rgba(0,0,0,0.1), 0 20px 60px rgba(0,0,0,0.3)" }}
        >
          <Layer>
            {elements.map((el) => (
              <ElementNode
                key={el.id}
                element={el}
                onSelect={() => handleSelect(el.id)}
                onDragEnd={(x, y) => handleDragEnd(el.id, x, y)}
                onTransformEnd={(x, y, w, h, r) => handleTransformEnd(el.id, x, y, w, h, r)}
                onDoubleClick={() => { if (el.type === "text") setTextEditingId(el.id); }}
              />
            ))}
          </Layer>
          <Layer name="transformer">
            <TransformerComponent stageRef={stageRef} selectedId={selectedId} />
          </Layer>
        </Stage>
      </div>

      {textEditingId && (() => {
        const el = currentProject?.elements.find((e) => e.id === textEditingId);
        if (!el || el.type !== "text") return null;
        const tp = el.properties as TextProperties;
        const stageLeft = (containerSize.w - canvasWidth * zoom) / 2 + panX;
        const stageTop = (containerSize.h - canvasHeight * zoom) / 2 + panY;
        return (
          <TextEditPopup
            element={el}
            textProps={tp}
            zoom={zoom}
            stageLeft={stageLeft}
            stageTop={stageTop}
            onSave={(content) => { handleTextEdit(el.id, content); setTextEditingId(null); }}
            onClose={() => setTextEditingId(null)}
          />
        );
      })()}
    </div>
  );
}

function ElementNode({ element, onSelect, onDragEnd, onTransformEnd, onDoubleClick }: {
  element: DesignElement;
  onSelect: () => void; onDragEnd: (x: number, y: number) => void;
  onTransformEnd: (x: number, y: number, w: number, h: number, r: number) => void;
  onDoubleClick: () => void;
}) {
  const groupRef = useRef<Konva.Group>(null);
  const textProps = element.properties as TextProperties;
  const imgProps = element.properties as ImageProperties;
  const shapeProps = element.properties as ShapeProperties;
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if ((element.type === "image" || element.type === "sticker") && imgProps?.src) {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => setImage(img);
      img.onerror = () => setImage(null);
      img.src = imgProps.src;
    }
  }, [element.type, imgProps?.src]);

  const shadow = textProps?.shadow;
  const shadowCfg = shadow ? { shadowColor: shadow.color, shadowBlur: shadow.blur, shadowOffsetX: shadow.offsetX, shadowOffsetY: shadow.offsetY } : {};

  return (
    <Group
      ref={groupRef}
      id={`node-${element.id}`}
      x={element.x} y={element.y}
      width={element.width} height={element.height}
      rotation={element.rotation} opacity={element.opacity ?? 1}
      visible={element.visible}
      draggable={!element.locked}
      onClick={onSelect} onTap={onSelect}
      onDblClick={(e) => { e.cancelBubble = true; onDoubleClick(); }} onDblTap={(e) => { e.cancelBubble = true; onDoubleClick(); }}
      onDragEnd={(e) => onDragEnd(e.target.x(), e.target.y())}
      onTransformEnd={() => {
        const n = groupRef.current;
        if (!n) return;
        onTransformEnd(n.x(), n.y(), element.width * n.scaleX(), element.height * n.scaleY(), n.rotation());
        n.scaleX(1); n.scaleY(1);
      }}
    >
      {element.type === "text" && textProps && (
        <Text
          width={element.width} height={element.height}
          text={textProps.content}
          fontFamily={textProps.fontFamily || "Inter"}
          fontSize={textProps.fontSize || 24}
          fontStyle={textProps.fontWeight === 700 ? "bold" : textProps.fontStyle === "italic" ? "italic" : "normal"}
          fill={textProps.color || "#000"}
          align={textProps.textAlign || "left"}
          lineHeight={textProps.lineHeight || 1.5}
          letterSpacing={textProps.letterSpacing || 0}
          wrap="word" ellipsis
          {...shadowCfg}
        />
      )}
      {(element.type === "image" || element.type === "sticker") && image && (
        <KonvaImage image={image} width={element.width} height={element.height} cornerRadius={imgProps?.borderRadius || 0} />
      )}
      {element.type === "shape" && shapeProps && (
        <ShapeNode shape={shapeProps} element={element} />
      )}
    </Group>
  );
}

function ShapeNode({ shape, element }: { shape: ShapeProperties; element: DesignElement }) {
  const p = { x: 0, y: 0, width: element.width, height: element.height, fill: shape.fillColor || "#6366f1", stroke: shape.strokeColor || undefined, strokeWidth: shape.strokeWidth || 0, cornerRadius: shape.borderRadius || 0 };
  switch (shape.shapeType) {
    case "circle": return <Ellipse {...p} radiusX={element.width / 2} radiusY={element.height / 2} />;
    case "triangle": return <Line {...p} points={[element.width / 2, 0, element.width, element.height, 0, element.height]} closed />;
    case "star": return <Star {...p} numPoints={5} innerRadius={element.width * 0.2} outerRadius={element.width * 0.5} />;
    case "heart": return <Path {...p} data={`M${element.width / 2},${element.height * 0.2}C${element.width * 0.8},-${element.height * 0.2} ${element.width * 1.1},${element.height * 0.3} ${element.width / 2},${element.height}C${-element.width * 0.1},${element.height * 0.3} ${element.width * 0.2},-${element.height * 0.2} ${element.width / 2},${element.height * 0.2}Z`} />;
    case "line": return <Line {...p} points={[0, element.height / 2, element.width, element.height / 2]} />;
    case "arrow": return <Line {...p} points={[0, element.height / 2, element.width * 0.85, element.height / 2, element.width * 0.75, element.height * 0.3, element.width * 0.75, element.height * 0.7]} closed />;
    default: return <Rect {...p} />;
  }
}

function TransformerComponent({ stageRef, selectedId }: { stageRef: React.RefObject<Konva.Stage | null>; selectedId: string | null }) {
  const trRef = useRef<Konva.Transformer>(null);
  useEffect(() => {
    if (!trRef.current || !stageRef.current) return;
    if (selectedId) {
      const node = stageRef.current.findOne(`#node-${selectedId}`);
      if (node) { trRef.current.nodes([node]); trRef.current.getLayer()?.batchDraw(); }
    } else { trRef.current.nodes([]); trRef.current.getLayer()?.batchDraw(); }
  }, [selectedId, stageRef]);
  return <Transformer ref={trRef} keepRatio={false} enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]} borderStroke="#6366f1" borderStrokeWidth={2} anchorStroke="#6366f1" anchorFill="#fff" anchorSize={10} rotateEnabled={true} boundBoxFunc={(o, n) => (n.width < 10 || n.height < 10 ? o : n)} />;
}

function TextEditPopup({ element, textProps, zoom, stageLeft, stageTop, onSave, onClose }: {
  element: DesignElement; textProps: TextProperties;
  zoom: number; stageLeft: number; stageTop: number;
  onSave: (c: string) => void; onClose: () => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [val, setVal] = useState(textProps.content);
  useEffect(() => { if (ref.current) { ref.current.focus(); ref.current.select(); } }, []);
  return (
    <textarea
      ref={ref}
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onBlur={() => { onSave(val); }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSave(val); onClose(); }
      }}
      style={{
        position: "absolute",
        left: stageLeft + element.x * zoom,
        top: stageTop + element.y * zoom,
        width: element.width * zoom,
        height: element.height * zoom,
        zIndex: 9999,
        border: "2px solid #6366f1",
        outline: "none",
        resize: "both",
        padding: 8,
        fontFamily: textProps.fontFamily || "Inter",
        fontSize: (textProps.fontSize || 24) * zoom,
        fontWeight: textProps.fontWeight || 400,
        color: textProps.color || "#000",
        textAlign: textProps.textAlign || "left",
        lineHeight: textProps.lineHeight || 1.5,
        background: "rgba(255,255,255,0.95)",
        borderRadius: 4,
        boxSizing: "border-box",
      }}
    />
  );
}
