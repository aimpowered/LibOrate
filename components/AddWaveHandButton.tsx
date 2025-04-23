import React, { useState, useRef, useEffect } from "react";
import "@/app/css/Wavehand.css";

type AddHandButtonProps = {
  onAdd: (text: string) => void;
};

export function AddHandButton({ onAdd }: AddHandButtonProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState("👋 ");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleAddClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = () => {
    if (newText.trim() !== "") {
      onAdd(newText.trim());
      setNewText("👋 ");
    }
    setIsEditing(false);
  };

  const handleBlur = () => {
    setIsEditing(false);
    setNewText("👋 ");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setNewText("👋 ");
    }
  };

  return isEditing ? (
    <input
      ref={inputRef}
      className="wave-hand-input wave-hand-button"
      value={newText}
      onChange={(e) => setNewText(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder="Enter text"
    />
  ) : (
    <button className="wave-hand-button" onClick={handleAddClick}>
      ➕ Add
    </button>
  );
}
