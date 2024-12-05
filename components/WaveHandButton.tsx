import React from "react";

import "@/app/css/Wavehand.css";

interface HandButtonProps {
  selected: boolean;
  onClick: () => void;
  text: string;
}
export function WaveHandButton({ selected, onClick, text }: HandButtonProps) {
  return (
    <button
      className={`wave-hand-button ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
