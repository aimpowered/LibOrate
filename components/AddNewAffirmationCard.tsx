"use client";

import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import "@/app/css/Affirmation.css";
interface AddCardItemProps {
  onAddSlide: (text: string) => void;
}

export function AddCardItem({ onAddSlide }: AddCardItemProps) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const handleModalOpen = () => {
    setText("");
    setOpen(true);
  };

  const handleModalClose = () => {
    setText("");
    setOpen(false);
  };

  const handleAdd = () => {
    if (text.trim()) {
      // Close modal before adding to avoid conflict with embla re-initialization
      setOpen(false);
      setTimeout(() => {
        onAddSlide(text);
        setText("");
      }, 0);
    } else {
      setOpen(false);
    }
  };

  return (
    <>
      <div className="self-affirm-card add-slide">
        <button
          className="add-slide-button"
          onClick={handleModalOpen}
          aria-label="Add new affirmation"
        >
          +
        </button>
      </div>

      <Modal open={open} onClose={handleModalClose}>
        <div className="carousel-slide-modal">
          <div className="carousel-slide-modal-body">
            <textarea
              placeholder="Write your message"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="carousel-slide-modal-textarea"
            />
          </div>
          <div className="carousel-slide-modal-actions">
            <button
              onClick={handleModalClose}
              className="carousel-slide-modal-btn"
            >
              Cancel
            </button>
            <button onClick={handleAdd} className="carousel-slide-modal-btn">
              Save
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
