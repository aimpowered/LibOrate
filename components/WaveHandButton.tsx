import React from "react";

import "@/app/css/Wavehand.css";

interface HandButtonProps {
  selected: boolean;
  onClick: () => void;
  onDelete: () => void;
  text: string;
}
export function WaveHandButton({
  selected,
  onClick,
  onDelete,
  text,
}: HandButtonProps) {
  return (
    <button
      className={`wave-hand-button ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      {text}
      <span
        className="wave-hand-delete-button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        ✖
      </span>
    </button>
  );
}
