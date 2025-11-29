"use client";

import React, { useState } from "react";
import { MenuItem, Modal } from "@mui/material";
import "@/app/css/Affirmation.css";

interface EditConfirmMenuItemProps {
  initialText: string;
  onCardEdit: (updatedText: string) => void;
  onMenuClose: () => void;
}

export function EditConfirmMenuItem({
  initialText,
  onCardEdit,
  onMenuClose,
}: EditConfirmMenuItemProps) {
  const [text, setText] = useState(initialText);
  const [open, setOpen] = useState(false);

  const handleModalOpen = () => {
    setText(initialText);
    setOpen(true);
  };

  const handleModalClose = () => {
    setText(initialText);
    setOpen(false);
    onMenuClose();
  };

  const handleSave = () => {
    onCardEdit(text);
    setOpen(false);
  };

  return (
    <>
      <MenuItem onClick={handleModalOpen}>Edit</MenuItem>
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
            <button onClick={handleSave} className="carousel-slide-modal-btn">
              Save
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
