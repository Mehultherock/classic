"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Stage, Layer, Rect, Text, Image as KonvaImage, Group, Transformer, Circle, Star, Line, Ellipse, Path } from "react-konva";
import type Konva from "konva";
import { useProjectStore } from "@/store/project-store";
import { useEditorStore } from "@/store/editor-store";
import type { DesignElement, TextProperties, ImageProperties, ShapeProperties } from "@/types";

function ShapeNode({ shape, element }: { shape: ShapeProperties; element: DesignElement }) {
  const props = {
    x: 0, y: 0,
    width: element.width, height: element.height,
    fill: shape.fillColor || "#6366f1",
    stroke: shape.strokeColor || undefined,
    strokeWidth: shape.strokeWidth || 0,
    cornerRadius: shape.borderRadius || 0,
  };
  switch (shape.shapeType) {
    case "circle": return <Ellipse {...props} radiusX={element.width / 2} radiusY={element.height / 2} />;
    case "triangle": return <Line {...props} points={[element.width / 2, 0, element.width, element.height, 0, element.height]} closed />;
    case "star": return <Star {...props} numPoints={5} innerRadius={element.width * 0.2} outerRadius={element.width * 0.5} />;
    case "heart": return <Path {...props} data={`M${element.width / 2},${element.height * 0.2} C${element.width * 0.8},-${element.height * 0.2} ${element.width * 1.1},${element.height * 0.3} ${element.width / 2},${element.height} C${-element.width * 0.1},${element.height * 0.3} ${element.width * 0.2},-${element.height * 0.2} ${element.width / 2},${element.height * 0.2}Z`} />;
    case "line": return <Line {...props} points={[0, element.height / 2, element.width, element.height / 2]} />;
    case "arrow": return <Line {...props} points={[0, element.height / 2, element.width * 0.85, element.height / 2, element.width * 0.75, element.height * 0.3, element.width * 0.75, element.height * 0.7]} closed />;
    default: return <Rect {...props} />;
  }
}

function ElementNode({
  element,
  isSelected,
  onSelect,
  onDragEnd,
  onTransformEnd,
  onDoubleClick,
  nodeId,
}: {
  element: DesignElement;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
  onTransformEnd: (x: number, y: number, width: number, height: number, rotation: number) => void;
  onDoubleClick: () => void;
  nodeId: string;
}) {
  const groupRef = useRef<Konva.Group>(null);
  const textProps = element.properties as TextProperties;
  const imgProps = element.properties as ImageProperties;
  const shapeProps = element.properties as ShapeProperties;
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (element.type === "image" && imgProps?.src) {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => setImage(img);
      img.onerror = () => setImage(null);
      img.src = imgProps.src;
    }
  }, [element.type, imgProps?.src]);

  const shadow = textProps?.shadow;
  const shadowConfig = shadow ? {
    shadowColor: shadow.color,
    shadowBlur: shadow.blur,
    shadowOffsetX: shadow.offsetX,
    shadowOffsetY: shadow.offsetY,
  } : {};

  return (
    <Group
      ref={groupRef}
      id={nodeId}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      rotation={element.rotation}
      opacity={element.opacity ?? 1}
      visible={element.visible}
      draggable={!element.locked}
      onClick={onSelect}
      onTap={onSelect}
      onDblClick={onDoubleClick}
      onDblTap={onDoubleClick}
      onDragEnd={(e) => onDragEnd(e.target.x(), e.target.y())}
      onTransformEnd={() => {
        const node = groupRef.current;
        if (!node) return;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        onTransformEnd(
          node.x(), node.y(),
          element.width * scaleX,
          element.height * scaleY,
          node.rotation()
        );
        node.scaleX(1);
        node.scaleY(1);
      }}
    >
      {element.type === "text" && textProps && (
        <Text
          width={element.width}
          height={element.height}
          text={textProps.content}
          fontFamily={textProps.fontFamily || "Inter, sans-serif"}
          fontSize={textProps.fontSize || 24}
          fontStyle={textProps.fontWeight === 700 ? "bold" : textProps.fontStyle === "italic" ? "italic" : "normal"}
          fill={textProps.color || "#000"}
          align={textProps.textAlign || "left"}
          lineHeight={textProps.lineHeight || 1.5}
          letterSpacing={textProps.letterSpacing || 0}
          textDecoration={textProps.textDecoration === "underline" ? "underline" : undefined}
          wrap="word"
          ellipsis
          {...shadowConfig}
        />
      )}
      {element.type === "image" && image && (
        <KonvaImage
          image={image}
          width={element.width}
          height={element.height}
          cornerRadius={imgProps?.borderRadius || 0}
          stroke={imgProps?.border?.color || undefined}
          strokeWidth={imgProps?.border?.width || 0}
        />
      )}
      {element.type === "shape" && shapeProps && (
        <ShapeNode shape={shapeProps} element={element} />
      )}
    </Group>
  );
}

export default function CanvaStage() {
  const stageRef = useRef<Konva.Stage>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 1200, height: 800 });
  const [textEditingId, setTextEditingId] = useState<string | null>(null);

  const currentProject = useProjectStore((s) => s.currentProject);
  const selectedElements = useProjectStore((s) => s.selectedElements);
  const setSelectedElements = useProjectStore((s) => s.setSelectedElements);
  const clearSelection = useProjectStore((s) => s.clearSelection);
  const updateElement = useProjectStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);

  const zoom = useEditorStore((s) => s.zoom);
  const panX = useEditorStore((s) => s.panX);
  const panY = useEditorStore((s) => s.panY);

  const canvasWidth = currentProject?.width ?? 800;
  const canvasHeight = currentProject?.height ?? 600;

  useEffect(() => {
    const resize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedElements([id]);
      pushHistory([...(currentProject?.elements || [])]);
    },
    [setSelectedElements, pushHistory, currentProject]
  );

  const handleDragEnd = useCallback(
    (id: string, x: number, y: number) => {
      updateElement(id, { x, y });
    },
    [updateElement]
  );

  const handleTransformEnd = useCallback(
    (id: string, x: number, y: number, width: number, height: number, rotation: number) => {
      updateElement(id, { x, y, width, height, rotation });
    },
    [updateElement]
  );

  const handleTextEdit = useCallback(
    (id: string, content: string) => {
      const el = currentProject?.elements.find((e) => e.id === id);
      if (el) {
        updateElement(id, {
          properties: { ...el.properties, content },
        });
      }
    },
    [currentProject, updateElement]
  );

  const sortedElements = [...(currentProject?.elements || [])].sort(
    (a, b) => a.zIndex - b.zIndex
  );

  const handleStageClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (e.target === e.target.getStage()) {
        clearSelection();
      }
    },
    [clearSelection]
  );

  const selectedId = selectedElements.length === 1 ? selectedElements[0] : null;
  const editingElement = textEditingId
    ? currentProject?.elements.find((e) => e.id === textEditingId)
    : null;

  const stagePosition = stageRef.current
    ? { x: stageRef.current.x() || 0, y: stageRef.current.y() || 0 }
    : { x: 0, y: 0 };

  const scale = zoom;
  const editingOverlayPos = editingElement
    ? {
        left: stagePosition.x + editingElement.x * scale + (containerRef.current?.offsetWidth || 0) / 2 - (canvasWidth * scale) / 2,
        top: stagePosition.y + editingElement.y * scale + (containerRef.current?.offsetHeight || 0) / 2 - (canvasHeight * scale) / 2,
      }
    : { left: 0, top: 0 };

  return (
    <div ref={containerRef} className="flex-1 relative overflow-hidden bg-[#1a1a2e]">
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
        }}
      >
        <Stage
          ref={stageRef}
          width={canvasWidth}
          height={canvasHeight}
          onClick={handleStageClick}
          onTap={handleStageClick}
          style={{
            background: "#ffffff",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.1), 0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          <Layer>
            {sortedElements.map((el) => (
              <ElementNode
                key={el.id}
                element={el}
                isSelected={selectedElements.includes(el.id)}
                onSelect={() => handleSelect(el.id)}
                onDragEnd={(x, y) => handleDragEnd(el.id, x, y)}
                onTransformEnd={(x, y, w, h, r) => handleTransformEnd(el.id, x, y, w, h, r)}
                onDoubleClick={() => {
                  if (el.type === "text") setTextEditingId(el.id);
                }}
                nodeId={`node-${el.id}`}
              />
            ))}
          </Layer>
          <Layer name="transformer-layer">
            <TransformerComponent stageRef={stageRef} selectedId={selectedId} />
          </Layer>
        </Stage>
      </div>

      {editingElement && editingElement.type === "text" && (
        <TextEditPopup
          element={editingElement}
          textProps={editingElement.properties as TextProperties}
          onSave={(content) => {
            handleTextEdit(editingElement.id, content);
            setTextEditingId(null);
          }}
          onClose={() => setTextEditingId(null)}
        />
      )}
    </div>
  );
}

function TransformerComponent({ stageRef, selectedId }: { stageRef: React.RefObject<Konva.Stage | null>; selectedId: string | null }) {
  const transformerRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (!transformerRef.current || !stageRef.current) return;
    if (selectedId) {
      const node = stageRef.current.findOne(`#node-${selectedId}`);
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    } else {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedId, stageRef]);

  return (
    <Transformer
      ref={transformerRef}
      keepRatio={false}
      enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
      borderStroke="#6366f1"
      borderStrokeWidth={2}
      anchorStroke="#6366f1"
      anchorFill="#fff"
      anchorSize={10}
      rotateEnabled={true}
      boundBoxFunc={(oldBox, newBox) => {
        if (newBox.width < 10 || newBox.height < 10) return oldBox;
        return newBox;
      }}
    />
  );
}

function TextEditPopup({
  element,
  textProps,
  onSave,
  onClose,
}: {
  element: DesignElement;
  textProps: TextProperties;
  onSave: (content: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [val, setVal] = useState(textProps.content);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
      ref.current.select();
    }
  }, []);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { onClose(); return; }
  };

  return (
    <textarea
      ref={ref}
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onBlur={() => { onSave(val); }}
      onKeyDown={handleKey}
      style={{
        position: "absolute",
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        zIndex: 9999,
        border: "2px solid #6366f1",
        outline: "none",
        resize: "both",
        padding: 8,
        fontFamily: textProps.fontFamily || "Inter, sans-serif",
        fontSize: textProps.fontSize || 24,
        fontWeight: textProps.fontWeight || 400,
        color: textProps.color || "#000",
        textAlign: textProps.textAlign || "left",
        lineHeight: textProps.lineHeight || 1.5,
        letterSpacing: textProps.letterSpacing || 0,
        background: "rgba(255,255,255,0.95)",
        borderRadius: 4,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    />
  );
}
