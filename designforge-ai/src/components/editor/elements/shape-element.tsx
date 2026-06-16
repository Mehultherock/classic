"use client";

import type { DesignElement, ShapeProperties } from "@/types";

interface ShapeElementProps {
  element: DesignElement;
  isSelected: boolean;
}

export default function ShapeElement({
  element,
  isSelected,
}: ShapeElementProps) {
  const shapeProps = element.properties as unknown as ShapeProperties;

  if (!shapeProps) {
    return (
      <div className="text-sm text-muted-foreground p-2">
        Shape element
      </div>
    );
  }

  const fillColor = shapeProps.fillColor || "#6366f1";
  const strokeColor = shapeProps.strokeColor;
  const strokeWidth = shapeProps.strokeWidth ?? 0;
  const borderRadius = shapeProps.borderRadius ?? 0;

  const commonStyle = {
    fill: fillColor,
    stroke: strokeColor || "none",
    strokeWidth: strokeWidth,
    width: "100%",
    height: "100%",
  };

  const renderShape = () => {
    switch (shapeProps.shapeType) {
      case "rectangle":
        return (
          <rect
            x={strokeWidth / 2}
            y={strokeWidth / 2}
            width={`calc(100% - ${strokeWidth}px)`}
            height={`calc(100% - ${strokeWidth}px)`}
            rx={borderRadius}
            ry={borderRadius}
            style={commonStyle}
          />
        );
      case "circle":
        return (
          <ellipse
            cx="50%"
            cy="50%"
            rx={`calc(50% - ${strokeWidth / 2}px)`}
            ry={`calc(50% - ${strokeWidth / 2}px)`}
            style={commonStyle}
          />
        );
      case "triangle":
        return (
          <polygon
            points={`50%,${strokeWidth} ${100 - strokeWidth},${100 - strokeWidth} ${strokeWidth},${100 - strokeWidth}`}
            style={commonStyle}
          />
        );
      case "star": {
        const cx = 50;
        const cy = 50;
        const outerR = 48;
        const innerR = 19;
        const points = [];
        for (let i = 0; i < 5; i++) {
          const outerAngle = (i * 72 - 90) * (Math.PI / 180);
          const innerAngle = ((i * 72 + 36) - 90) * (Math.PI / 180);
          points.push(
            `${cx + outerR * Math.cos(outerAngle)},${cy + outerR * Math.sin(outerAngle)}`
          );
          points.push(
            `${cx + innerR * Math.cos(innerAngle)},${cy + innerR * Math.sin(innerAngle)}`
          );
        }
        return (
          <polygon points={points.join(" ")} style={commonStyle} />
        );
      }
      case "heart": {
        const s = 50;
        return (
          <path
            d={`M${s},${s * 1.7} C${s * 0.4},${s * 1.1} ${s * 0.1},${s * 0.6} ${s * 0.35},${s * 0.3} C${s * 0.55},${s * 0.05} ${s * 0.85},${s * 0.1} ${s},${s * 0.4} C${s * 1.15},${s * 0.1} ${s * 1.45},${s * 0.05} ${s * 1.65},${s * 0.3} C${s * 1.9},${s * 0.6} ${s * 1.6},${s * 1.1} ${s},${s * 1.7}z`}
            style={commonStyle}
          />
        );
      }
      case "line":
        return (
          <line
            x1={strokeWidth / 2}
            y1="50%"
            x2={`calc(100% - ${strokeWidth / 2}px)`}
            y2="50%"
            stroke={strokeColor || fillColor}
            strokeWidth={strokeWidth || 2}
            strokeLinecap="round"
          />
        );
      case "arrow": {
        const arrowSize = Math.min(element.width, element.height) * 0.15;
        return (
          <g>
            <line
              x1={strokeWidth / 2}
              y1="50%"
              x2={`calc(100% - ${arrowSize + strokeWidth / 2}px)`}
              y2="50%"
              stroke={strokeColor || fillColor}
              strokeWidth={strokeWidth || 2}
              strokeLinecap="round"
            />
            <polygon
              points={`${100 - arrowSize - strokeWidth / 2},${50 - arrowSize * 0.6} ${100 - strokeWidth / 2},50 ${100 - arrowSize - strokeWidth / 2},${50 + arrowSize * 0.6}`}
              fill={strokeColor || fillColor}
            />
          </g>
        );
      }
      default:
        return (
          <rect
            x={0}
            y={0}
            width="100%"
            height="100%"
            rx={borderRadius}
            ry={borderRadius}
            style={commonStyle}
          />
        );
    }
  };

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 100 100`}
      preserveAspectRatio="none"
      className={isSelected ? "pointer-events-none" : ""}
      style={{ cursor: element.locked ? "default" : "grab" }}
    >
      {renderShape()}
    </svg>
  );
}
