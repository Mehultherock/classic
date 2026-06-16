"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { DesignElement, TextProperties } from "@/types";
import { useProjectStore } from "@/store/project-store";

interface TextElementProps {
  element: DesignElement;
  isSelected: boolean;
  onDoubleClick?: () => void;
}

export default function TextElement({
  element,
  isSelected,
  onDoubleClick,
}: TextElementProps) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState("");
  const editableRef = useRef<HTMLDivElement>(null);
  const textProps = element.properties as unknown as TextProperties;
  const updateElement = useProjectStore((s) => s.updateElement);

  useEffect(() => {
    if (textProps?.fontFamily) {
      const link = document.createElement("link");
      link.href = `https://fonts.googleapis.com/css2?family=${textProps.fontFamily.replace(/\s+/g, "+")}:wght@300;400;500;600;700;800&display=swap`;
      link.rel = "stylesheet";
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [textProps?.fontFamily]);

  const handleDoubleClick = useCallback(() => {
    if (element.locked) return;
    setContent(textProps?.content || "");
    setEditing(true);
    onDoubleClick?.();
  }, [element.locked, textProps?.content, onDoubleClick]);

  useEffect(() => {
    if (editing && editableRef.current) {
      editableRef.current.focus();
      const range = document.createRange();
      range.selectNodeContents(editableRef.current);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [editing]);

  const handleInput = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
      const html = (e.target as HTMLDivElement).innerHTML;
      setContent(html);
      updateElement(element.id, {
        properties: { ...element.properties, content: html },
      });
    },
    [element.id, element.properties, updateElement]
  );

  const handleBlur = useCallback(() => {
    setEditing(false);
    if (content !== (textProps?.content || "")) {
      updateElement(element.id, {
        properties: { ...element.properties, content },
      });
    }
  }, [content, element.id, element.properties, textProps?.content, updateElement]);

  if (!textProps) {
    return (
      <div className="text-sm text-muted-foreground p-2">
        Text element
      </div>
    );
  }

  const shadowStyle = textProps.shadow
    ? `${textProps.shadow.offsetX}px ${textProps.shadow.offsetY}px ${textProps.shadow.blur}px ${textProps.shadow.color}`
    : undefined;

  const gradientStyle =
    textProps.gradient && textProps.gradient.colors.length > 0
      ? textProps.gradient.type === "linear"
        ? `linear-gradient(${textProps.gradient.angle ?? 0}deg, ${textProps.gradient.colors.join(", ")})`
        : `radial-gradient(circle, ${textProps.gradient.colors.join(", ")})`
      : undefined;

  if (editing) {
    return (
      <div
        ref={editableRef}
        contentEditable
        suppressContentEditableWarning
        className="outline-none ring-2 ring-primary w-full h-full p-2 overflow-hidden"
        style={{
          fontFamily: textProps.fontFamily || "Inter, sans-serif",
          fontSize: textProps.fontSize || 16,
          fontWeight: textProps.fontWeight || 400,
          color: textProps.color || "#ffffff",
          textAlign: textProps.textAlign || "left",
          lineHeight: textProps.lineHeight || 1.5,
          letterSpacing: textProps.letterSpacing || 0,
          textDecoration: textProps.textDecoration === "none" ? undefined : textProps.textDecoration,
          fontStyle: textProps.fontStyle === "normal" ? undefined : textProps.fontStyle,
          textTransform: textProps.textTransform === "none" ? undefined : textProps.textTransform,
          textShadow: shadowStyle,
          background: gradientStyle,
          WebkitBackgroundClip: gradientStyle ? "text" : undefined,
          WebkitTextFillColor: gradientStyle ? "transparent" : undefined,
        }}
        onBlur={handleBlur}
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <div
      className={`w-full h-full p-2 overflow-hidden ${isSelected ? "select-none" : ""}`}
      onDoubleClick={handleDoubleClick}
      style={{
        fontFamily: textProps.fontFamily || "Inter, sans-serif",
        fontSize: textProps.fontSize || 16,
        fontWeight: textProps.fontWeight || 400,
        color: textProps.color || "#ffffff",
        textAlign: textProps.textAlign || "left",
        lineHeight: textProps.lineHeight || 1.5,
        letterSpacing: textProps.letterSpacing || 0,
        textDecoration: textProps.textDecoration === "none" ? undefined : textProps.textDecoration,
        fontStyle: textProps.fontStyle === "normal" ? undefined : textProps.fontStyle,
        textTransform: textProps.textTransform === "none" ? undefined : textProps.textTransform,
        textShadow: shadowStyle,
        background: gradientStyle,
        WebkitBackgroundClip: gradientStyle ? "text" : undefined,
        WebkitTextFillColor: gradientStyle ? "transparent" : undefined,
        cursor: element.locked ? "default" : "grab",
      }}
    >
      {textProps.content || "Text"}
    </div>
  );
}
