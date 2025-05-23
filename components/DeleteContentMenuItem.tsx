import React, { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import "@/app/css/Affirmation.css";

interface DeleteContentMenuItemProps {
  onCardDeletion: () => void;
}

export function DeleteContentMenuItem({
  onCardDeletion,
}: DeleteContentMenuItemProps) {
  const [open, setOpen] = useState(false);
  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);
  const handleDelete = () => {
    onCardDeletion();
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
          <button className="card-modal-button" onClick={() => handleDelete()}>
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
