"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  UploadCloud,
  Crop,
  RotateCw,
  ZoomIn,
  ZoomOut,
  X,
  Check,
  Trash2,
  Maximize2,
} from "lucide-react";

export interface AspectPreset {
  id: string;
  label: string;
  ratio: number; // width / height
  targetWidth: number;
  targetHeight: number;
}

export const CROP_PRESETS: AspectPreset[] = [
  { id: "16-9", label: "16:9 Landscape (Hero / Card)", ratio: 16 / 9, targetWidth: 1200, targetHeight: 675 },
  { id: "4-3", label: "4:3 Standard (Before / After)", ratio: 4 / 3, targetWidth: 800, targetHeight: 600 },
  { id: "3-2", label: "3:2 Architectural", ratio: 3 / 2, targetWidth: 900, targetHeight: 600 },
  { id: "1-1", label: "1:1 Square (Detail)", ratio: 1 / 1, targetWidth: 600, targetHeight: 600 },
];

interface ImageUploadCropperProps {
  label: string;
  helperText?: string;
  value?: string;
  onChange: (dataUrl: string) => void;
  defaultPresetId?: string;
  required?: boolean;
}

export function ImageUploadCropper({
  label,
  helperText,
  value,
  onChange,
  defaultPresetId = "16-9",
  required = false,
}: ImageUploadCropperProps) {
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // When user selects a file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, JPEG, WEBP)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      setRawImageSrc(src);
      setIsCropperOpen(true);
    };
    reader.readAsDataURL(file);

    // Reset input so same file can be re-selected if desired
    e.target.value = "";
  };

  const handleOpenCropperForCurrent = () => {
    if (value) {
      setRawImageSrc(value);
      setIsCropperOpen(true);
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12.5, fontWeight: 600, color: "#334155" }}>
        {label} {required && <span style={{ color: "#dc2626" }}>*</span>}
      </label>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Preview Card or Upload Zone */}
      {/* Preview Card or Upload Zone */}
      {value ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            padding: "12px 14px",
            borderRadius: 8,
            border: "1px solid #cbd5e1",
            background: "#ffffff",
            width: "100%",
          }}
        >
          {/* Thumbnail preview & Info */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 160, flex: "1 1 auto" }}>
            <div
              style={{
                position: "relative",
                width: 90,
                height: 56,
                borderRadius: 6,
                overflow: "hidden",
                background: "#0f172a",
                flexShrink: 0,
                border: "1px solid #e2e8f0",
              }}
            >
              <Image
                src={value}
                alt="Uploaded project asset"
                fill
                sizes="90px"
                style={{ objectFit: "cover" }}
                unoptimized={value.startsWith("data:")}
              />
            </div>

            <div style={{ minWidth: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", display: "block", whiteSpace: "nowrap" }}>
                Image Ready
              </span>
              <span style={{ fontSize: 11.5, color: "#64748b", display: "block", whiteSpace: "nowrap" }}>
                Ready for portfolio
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <button
              type="button"
              onClick={handleOpenCropperForCurrent}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "6px 12px",
                borderRadius: 6,
                border: "1px solid #cbd5e1",
                background: "#f8fafc",
                fontSize: 12,
                fontWeight: 600,
                color: "#310e54",
                cursor: "pointer",
              }}
              title="Crop and resize this image"
            >
              <Crop size={14} />
              <span>Crop / Resize</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "6px 12px",
                borderRadius: 6,
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                fontSize: 12,
                fontWeight: 600,
                color: "#334155",
                cursor: "pointer",
              }}
            >
              <span>Replace</span>
            </button>

            <button
              type="button"
              onClick={handleRemove}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "6px 8px",
                borderRadius: 6,
                border: "1px solid #fecaca",
                background: "#fef2f2",
                color: "#dc2626",
                cursor: "pointer",
              }}
              title="Remove image"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ) : (
        /* Empty Upload Dropzone */
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            width: "100%",
            border: "2px dashed #cbd5e1",
            borderRadius: 8,
            padding: "24px 20px",
            textAlign: "center",
            background: "#f8fafc",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#310e54";
            e.currentTarget.style.background = "#f5f3ff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#cbd5e1";
            e.currentTarget.style.background = "#f8fafc";
          }}
        >
          <UploadCloud size={28} color="#310e54" style={{ margin: "0 auto 8px" }} />
          <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: "#0f172a" }}>
            Click to upload project photo
          </p>
          <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "#64748b" }}>
            PNG, JPG or WEBP &bull; Precision crop tool included
          </p>
        </div>
      )}

      {helperText && (
        <span style={{ fontSize: 11.5, color: "#64748b", margin: "2px 0 0" }}>{helperText}</span>
      )}

      {/* Cropper Modal */}
      {isCropperOpen && rawImageSrc && (
        <CropEditorModal
          imageSrc={rawImageSrc}
          defaultPresetId={defaultPresetId}
          onClose={() => setIsCropperOpen(false)}
          onConfirm={(croppedDataUrl) => {
            onChange(croppedDataUrl);
            setIsCropperOpen(false);
          }}
        />
      )}
    </div>
  );
}

interface CropEditorModalProps {
  imageSrc: string;
  defaultPresetId: string;
  onClose: () => void;
  onConfirm: (dataUrl: string) => void;
}

function CropEditorModal({
  imageSrc,
  defaultPresetId,
  onClose,
  onConfirm,
}: CropEditorModalProps) {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(defaultPresetId);
  const activePreset = CROP_PRESETS.find((p) => p.id === selectedPresetId) || CROP_PRESETS[0];

  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageElementRef = useRef<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Load image
  useEffect(() => {
    const img = document.createElement("img");
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      imageElementRef.current = img;
      setImageLoaded(true);
      setPan({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    };
  }, [imageSrc]);

  // Redraw preview canvas
  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageElementRef.current;
    if (!canvas || !img || !imageLoaded) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const viewWidth = canvas.width;
    const viewHeight = canvas.height;

    // Clear
    ctx.clearRect(0, 0, viewWidth, viewHeight);

    // Dark backdrop
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, viewWidth, viewHeight);

    // Save context
    ctx.save();

    // Center and transform
    ctx.translate(viewWidth / 2 + pan.x, viewHeight / 2 + pan.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Calculate base draw size keeping aspect
    const imgAspect = img.width / img.height;
    let drawW = viewWidth;
    let drawH = viewWidth / imgAspect;

    if (drawH < viewHeight) {
      drawH = viewHeight;
      drawW = viewHeight * imgAspect;
    }

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    // Draw crop frame overlay
    const cropW = viewWidth - 40;
    const cropH = cropW / activePreset.ratio;
    const cropX = (viewWidth - cropW) / 2;
    const cropY = (viewHeight - cropH) / 2;

    // Dark semi-transparent mask around crop window
    ctx.fillStyle = "rgba(15, 23, 42, 0.65)";

    // Top
    ctx.fillRect(0, 0, viewWidth, cropY);
    // Bottom
    ctx.fillRect(0, cropY + cropH, viewWidth, viewHeight - (cropY + cropH));
    // Left
    ctx.fillRect(0, cropY, cropX, cropH);
    // Right
    ctx.fillRect(cropX + cropW, cropY, viewWidth - (cropX + cropW), cropH);

    // Crop border
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.strokeRect(cropX, cropY, cropW, cropH);

    // Rule of thirds grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    // Vertical thirds
    ctx.moveTo(cropX + cropW / 3, cropY);
    ctx.lineTo(cropX + cropW / 3, cropY + cropH);
    ctx.moveTo(cropX + (cropW * 2) / 3, cropY);
    ctx.lineTo(cropX + (cropW * 2) / 3, cropY + cropH);
    // Horizontal thirds
    ctx.moveTo(cropX, cropY + cropH / 3);
    ctx.lineTo(cropX + cropW, cropY + cropH / 3);
    ctx.moveTo(cropX, cropY + (cropH * 2) / 3);
    ctx.lineTo(cropX + cropW, cropY + (cropH * 2) / 3);
    ctx.stroke();
  }, [pan, zoom, rotation, activePreset, imageLoaded]);

  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  // Pointer drag events for panning
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Generate final cropped image at target dimensions
  const handleApplyCrop = () => {
    const img = imageElementRef.current;
    const previewCanvas = canvasRef.current;
    if (!img || !previewCanvas) return;

    const outW = activePreset.targetWidth;
    const outH = activePreset.targetHeight;

    const offscreen = document.createElement("canvas");
    offscreen.width = outW;
    offscreen.height = outH;
    const oCtx = offscreen.getContext("2d");
    if (!oCtx) return;

    // Calculations mapping preview to high-res target output
    const viewWidth = previewCanvas.width;
    const cropW = viewWidth - 40;
    const scaleFactor = outW / cropW;

    oCtx.save();
    oCtx.translate(outW / 2 + pan.x * scaleFactor, outH / 2 + pan.y * scaleFactor);
    oCtx.rotate((rotation * Math.PI) / 180);
    oCtx.scale(zoom * scaleFactor, zoom * scaleFactor);

    const imgAspect = img.width / img.height;
    let drawW = viewWidth;
    let drawH = viewWidth / imgAspect;

    if (drawH < previewCanvas.height) {
      drawH = previewCanvas.height;
      drawW = previewCanvas.height * imgAspect;
    }

    oCtx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    oCtx.restore();

    // Export as high quality WebP/JPEG
    const resultUrl = offscreen.toDataURL("image/webp", 0.92);
    onConfirm(resultUrl);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: 12,
          width: "100%",
          maxWidth: "min(860px, 95vw)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Crop size={18} color="#310e54" />
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
              Crop &amp; Frame Project Image
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Aspect Ratio Presets */}
        <div style={{ padding: "12px 20px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>
            Select Target Display Format:
          </span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CROP_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setSelectedPresetId(preset.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: `1.5px solid ${selectedPresetId === preset.id ? "#310e54" : "#cbd5e1"}`,
                  background: selectedPresetId === preset.id ? "#ede9fe" : "#ffffff",
                  color: selectedPresetId === preset.id ? "#310e54" : "#334155",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <span>{preset.label}</span>
                <span
                  style={{
                    fontSize: 10.5,
                    padding: "2px 5px",
                    borderRadius: 4,
                    background: selectedPresetId === preset.id ? "#310e54" : "#f1f5f9",
                    color: selectedPresetId === preset.id ? "#ffffff" : "#64748b",
                  }}
                >
                  {preset.targetWidth}×{preset.targetHeight}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Canvas Viewport */}
        <div
          style={{
            position: "relative",
            background: "#090d16",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            userSelect: "none",
          }}
        >
          <canvas
            ref={canvasRef}
            width={740}
            height={420}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{
              cursor: isDragging ? "grabbing" : "grab",
              borderRadius: 6,
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
              maxWidth: "100%",
            }}
          />

          <div
            style={{
              position: "absolute",
              bottom: 24,
              left: 24,
              background: "rgba(15, 23, 42, 0.8)",
              color: "#ffffff",
              padding: "4px 10px",
              borderRadius: 6,
              fontSize: 11,
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Maximize2 size={12} />
            <span>Drag image to position inside crop frame</span>
          </div>
        </div>

        {/* Control Sliders (Zoom & Rotate) */}
        <div
          style={{
            padding: "14px 20px",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 14,
          }}
        >
          {/* Zoom Slider */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 220 }}>
            <ZoomOut size={16} color="#64748b" />
            <input
              type="range"
              min="0.8"
              max="2.5"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              style={{ flex: 1, cursor: "pointer" }}
            />
            <ZoomIn size={16} color="#64748b" />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#334155", minWidth: 45 }}>
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Rotate Button */}
          <button
            type="button"
            onClick={() => setRotation((prev) => (prev + 90) % 360)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              fontSize: 12,
              fontWeight: 600,
              color: "#334155",
              cursor: "pointer",
            }}
          >
            <RotateCw size={14} />
            <span>Rotate 90°</span>
          </button>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: "14px 20px",
            background: "#f8fafc",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApplyCrop}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 20px",
              borderRadius: 6,
              border: "1px solid #310e54",
              background: "#310e54",
              color: "#ffffff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Check size={16} />
            <span>Apply Crop &amp; Save ({activePreset.targetWidth}×{activePreset.targetHeight})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
