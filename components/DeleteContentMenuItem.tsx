"use client";

import React, { useState } from "react";
import { MenuItem, Modal } from "@mui/material";
import "@/app/css/Affirmation.css";

interface DeleteConfirmMenuItemProps {
  onCardDeletion: () => void;
  onMenuClose: () => void;
}

export function DeleteConfirmMenuItem({
  onCardDeletion,
  onMenuClose,
}: DeleteConfirmMenuItemProps) {
  const [open, setOpen] = useState(false);

  const handleModalOpen = () => setOpen(true);

  const handleModalClose = () => {
    setOpen(false);
    onMenuClose();
  };

  const handleDelete = () => {
    onCardDeletion();
    setOpen(false);
  };

  return (
    <>
      <MenuItem onClick={handleModalOpen}>Delete</MenuItem>
      <Modal open={open} onClose={handleModalClose}>
        <div className="carousel-slide-modal">
          <div className="carousel-slide-modal-body">
            <p>Are you sure you want to delete this affirmation?</p>
          </div>
          <div className="carousel-slide-modal-actions">
            <button
              onClick={handleModalClose}
              className="carousel-slide-modal-btn"
            >
              Cancel
            </button>
            <button onClick={handleDelete} className="carousel-slide-modal-btn">
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
