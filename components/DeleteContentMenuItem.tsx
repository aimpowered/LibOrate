import React, { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import "@/app/css/Affirmation.css";

interface DeleteContentMenuItemProps {
  id: number;
  onCardDeletion: (id: number) => void;
}

export function DeleteContentMenuItem({
  id,
  onCardDeletion,
}: DeleteContentMenuItemProps) {
  const [open, setOpen] = useState(false);
  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);
  const handleDelete = (id: number) => {
    onCardDeletion(id);
    setOpen(false);
  };

  return (
    <React.Fragment>
      <MenuItem onClick={handleModalOpen}>Delete</MenuItem>
      <Modal open={open} onClose={handleModalClose}>
        <div className="card-modal">
          <div className="card-modal-body">
            <p>Ready to delete the message?</p>
          </div>
          <button
            className="card-modal-button"
            onClick={() => handleDelete(id)}
          >
            Confirm
          </button>
          <button className="card-modal-button" onClick={handleModalClose}>
            Cancel
          </button>
        </div>
      </Modal>
    </React.Fragment>
  );
}
