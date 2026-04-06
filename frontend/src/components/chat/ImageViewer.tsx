import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  src: string;
  onClose: () => void;
};

export default function ImageViewer({ src, onClose }: Props) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // ESC + disable scroll
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  // 🎯 Zoom theo vị trí chuột
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    const rect = (e.target as HTMLImageElement).getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    let newScale = scale - e.deltaY * 0.001;
    newScale = Math.min(Math.max(1, newScale), 4);

    // giữ điểm zoom
    const scaleRatio = newScale / scale;

    setPosition((prev) => ({
      x: prev.x - (offsetX - rect.width / 2) * (scaleRatio - 1),
      y: prev.y - (offsetY - rect.height / 2) * (scaleRatio - 1),
    }));

    setScale(newScale);

    // reset nếu về 1x
    if (newScale === 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  // Drag
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;

    setPosition((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));

    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Double click zoom
  const handleDoubleClick = () => {
    if (scale > 1) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setScale(2);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <img
        src={src}
        alt=""
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        className="cursor-grab active:cursor-grabbing select-none"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          maxWidth: "90vw",
          maxHeight: "90vh",
          transition: isDragging ? "none" : "transform 0.2s ease",
        }}
      />

      {/* Close */}
      <button
        className="absolute top-4 right-4 text-white text-3xl"
        onClick={onClose}
      >
        ✕
      </button>
    </div>,
    document.body,
  );
}
