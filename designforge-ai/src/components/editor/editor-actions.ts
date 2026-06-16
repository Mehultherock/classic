"use client";

import { debounce } from "@/lib/utils";
import type { Project, DesignElement } from "@/types";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const autoSaveHandler = async (project: Project, saveFn: (p: Project) => Promise<void>) => {
  try {
    await saveFn(project);
  } catch (error) {
    console.error("Auto-save failed:", error);
  }
};

export const autoSave = debounce<typeof autoSaveHandler>(autoSaveHandler, 2000);

export async function exportToPNG(
  element: HTMLElement,
  filename: string
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
  });
  const link = document.createElement("a");
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export async function exportToJPG(
  element: HTMLElement,
  filename: string,
  quality = 0.95
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });
  const link = document.createElement("a");
  link.download = `${filename}.jpg`;
  link.href = canvas.toDataURL("image/jpeg", quality);
  link.click();
}

export async function exportToPDF(
  element: HTMLElement,
  filename: string
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
  });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? "landscape" : "portrait",
    unit: "px",
    format: [canvas.width, canvas.height],
  });
  pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
  pdf.save(`${filename}.pdf`);
}

export async function generateThumbnail(
  element: HTMLElement,
  width = 400,
  height = 300
): Promise<string> {
  const canvas = await html2canvas(element, {
    scale: width / element.offsetWidth,
    useCORS: true,
    backgroundColor: null,
  });
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = width;
  tempCanvas.height = height;
  const ctx = tempCanvas.getContext("2d");
  if (ctx) {
    ctx.drawImage(canvas, 0, 0, width, height);
  }
  return tempCanvas.toDataURL("image/webp", 0.8);
}

export function getInverseScale(
  zoom: number,
  value: number
): number {
  return value / zoom;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function snapValue(
  value: number,
  snapSize: number,
  threshold: number
): { snapped: number; isSnapped: boolean } {
  const remainder = value % snapSize;
  if (Math.abs(remainder) < threshold) {
    return { snapped: value - remainder, isSnapped: true };
  }
  if (Math.abs(remainder - snapSize) < threshold) {
    return { snapped: value + (snapSize - remainder), isSnapped: true };
  }
  return { snapped: value, isSnapped: false };
}

export function getSnapGuides(
  draggingElement: DesignElement,
  allElements: DesignElement[],
  canvasWidth: number,
  canvasHeight: number,
  threshold = 5
): { guides: { orientation: "horizontal" | "vertical"; position: number }[]; offsetX: number; offsetY: number } {
  const guides: { orientation: "horizontal" | "vertical"; position: number }[] = [];
  let offsetX = 0;
  let offsetY = 0;

  const dragLeft = draggingElement.x;
  const dragRight = draggingElement.x + draggingElement.width;
  const dragCenterX = draggingElement.x + draggingElement.width / 2;
  const dragTop = draggingElement.y;
  const dragBottom = draggingElement.y + draggingElement.height;
  const dragCenterY = draggingElement.y + draggingElement.height / 2;

  const canvasCenterX = canvasWidth / 2;
  const canvasCenterY = canvasHeight / 2;

  if (Math.abs(dragLeft) < threshold) {
    offsetX = -dragLeft;
    guides.push({ orientation: "vertical", position: 0 });
  } else if (Math.abs(dragRight - canvasWidth) < threshold) {
    offsetX = canvasWidth - dragRight;
    guides.push({ orientation: "vertical", position: canvasWidth });
  } else if (Math.abs(dragCenterX - canvasCenterX) < threshold) {
    offsetX = canvasCenterX - dragCenterX;
    guides.push({ orientation: "vertical", position: canvasCenterX });
  }

  if (Math.abs(dragTop) < threshold) {
    offsetY = -dragTop;
    guides.push({ orientation: "horizontal", position: 0 });
  } else if (Math.abs(dragBottom - canvasHeight) < threshold) {
    offsetY = canvasHeight - dragBottom;
    guides.push({ orientation: "horizontal", position: canvasHeight });
  } else if (Math.abs(dragCenterY - canvasCenterY) < threshold) {
    offsetY = canvasCenterY - dragCenterY;
    guides.push({ orientation: "horizontal", position: canvasCenterY });
  }

  for (const el of allElements) {
    if (el.id === draggingElement.id) continue;

    const elLeft = el.x;
    const elRight = el.x + el.width;
    const elCenterX = el.x + el.width / 2;
    const elTop = el.y;
    const elBottom = el.y + el.height;
    const elCenterY = el.y + el.height / 2;

    if (Math.abs(dragLeft - elLeft) < threshold && offsetX === 0) {
      offsetX = elLeft - dragLeft;
      guides.push({ orientation: "vertical", position: elLeft });
    } else if (Math.abs(dragLeft - elRight) < threshold && offsetX === 0) {
      offsetX = elRight - dragLeft;
      guides.push({ orientation: "vertical", position: elRight });
    } else if (Math.abs(dragRight - elLeft) < threshold && offsetX === 0) {
      offsetX = elLeft - dragRight;
      guides.push({ orientation: "vertical", position: elLeft });
    } else if (Math.abs(dragRight - elRight) < threshold && offsetX === 0) {
      offsetX = elRight - dragRight;
      guides.push({ orientation: "vertical", position: elRight });
    } else if (Math.abs(dragCenterX - elCenterX) < threshold && offsetX === 0) {
      offsetX = elCenterX - dragCenterX;
      guides.push({ orientation: "vertical", position: elCenterX });
    }

    if (Math.abs(dragTop - elTop) < threshold && offsetY === 0) {
      offsetY = elTop - dragTop;
      guides.push({ orientation: "horizontal", position: elTop });
    } else if (Math.abs(dragTop - elBottom) < threshold && offsetY === 0) {
      offsetY = elBottom - dragTop;
      guides.push({ orientation: "horizontal", position: elBottom });
    } else if (Math.abs(dragBottom - elTop) < threshold && offsetY === 0) {
      offsetY = elTop - dragBottom;
      guides.push({ orientation: "horizontal", position: elTop });
    } else if (Math.abs(dragBottom - elBottom) < threshold && offsetY === 0) {
      offsetY = elBottom - dragBottom;
      guides.push({ orientation: "horizontal", position: elBottom });
    } else if (Math.abs(dragCenterY - elCenterY) < threshold && offsetY === 0) {
      offsetY = elCenterY - dragCenterY;
      guides.push({ orientation: "horizontal", position: elCenterY });
    }
  }

  return { guides, offsetX, offsetY };
}

export function getResizeCursor(
  corner: string
): string {
  switch (corner) {
    case "nw":
    case "se":
      return "nwse-resize";
    case "ne":
    case "sw":
      return "nesw-resize";
    case "n":
    case "s":
      return "ns-resize";
    case "e":
    case "w":
      return "ew-resize";
    default:
      return "default";
  }
}
