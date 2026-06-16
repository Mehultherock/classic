"use client";

import { useState, useRef, useCallback } from "react";
import type { DesignElement, ImageProperties } from "@/types";
import { useProjectStore } from "@/store/project-store";

interface ImageElementProps {
  element: DesignElement;
  isSelected: boolean;
}

export default function ImageElement({
  element,
  isSelected,
}: ImageElementProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [hover, setHover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgProps = element.properties as unknown as ImageProperties;
  const updateElement = useProjectStore((s) => s.updateElement);

  const handleDoubleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        updateElement(element.id, {
          properties: { ...element.properties, src },
        });
        setLoaded(false);
        setError(false);
      };
      reader.readAsDataURL(file);
    },
    [element.id, element.properties, updateElement]
  );

  const filters = imgProps?.filters
    ? [
        `brightness(${(imgProps.filters.brightness ?? 100) / 100})`,
        `contrast(${(imgProps.filters.contrast ?? 100) / 100})`,
        `saturate(${(imgProps.filters.saturate ?? 100) / 100})`,
        `blur(${(imgProps.filters.blur ?? 0)}px)`,
        `hue-rotate(${(imgProps.filters.hueRotate ?? 0)}deg)`,
        `sepia(${(imgProps.filters.sepia ?? 0) / 100})`,
      ].join(" ")
    : undefined;

  const borderRadius = imgProps?.borderRadius ?? 0;
  const border = imgProps?.border
    ? `${imgProps.border.width}px solid ${imgProps.border.color}`
    : undefined;

  return (
    <div
      className={`w-full h-full overflow-hidden relative ${isSelected ? "cursor-default" : "cursor-pointer"}`}
      style={{
        borderRadius,
        border,
        opacity: element.opacity ?? 1,
      }}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 transition-opacity">
          <div className="text-center text-white">
            <svg className="w-8 h-8 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
            </svg>
            <span className="text-xs font-medium">Double-click to replace image</span>
          </div>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        onClick={(e) => { (e.target as HTMLInputElement).value = ""; }}
      />
      {!loaded && !error && (
        <div className="w-full h-full flex items-center justify-center bg-surface animate-pulse">
          <svg
            className="w-8 h-8 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
            />
          </svg>
        </div>
      )}
      {error && (
        <div className="w-full h-full flex items-center justify-center bg-surface">
          <div className="text-center text-muted-foreground">
            <svg
              className="w-8 h-8 mx-auto mb-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            <span className="text-xs">Failed to load</span>
          </div>
        </div>
      )}
      {imgProps?.src && (
        <img
          src={imgProps.src}
          alt={imgProps.alt || ""}
          className={`w-full h-full object-cover ${loaded ? "" : "hidden"}`}
          style={{
            filter: filters,
            objectPosition: imgProps.crop
              ? `${-imgProps.crop.x}px ${-imgProps.crop.y}px`
              : undefined,
          }}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          draggable={false}
        />
      )}
    </div>
  );
}
