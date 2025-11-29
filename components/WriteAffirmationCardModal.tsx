import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import "@/app/css/Affirmation.css";

interface WriteAffirmationCardModalProps {
  open: boolean;
  onModalClose: () => void;
  initialText: string;
  onCardSave: (text: string) => void;
}

export function WriteAffirmationCardModal({
  open,
  onModalClose,
  initialText,
  onCardSave,
}: WriteAffirmationCardModalProps) {
  const [text, setText] = useState(initialText);

  const handleModalClose = () => {
    setText(initialText);
    onModalClose();
  };

  const handleSave = (text: string) => {
    onCardSave(text);
    setText(initialText);
  };

  return (
    <Modal open={open} onClose={handleModalClose}>
      <div className="card-modal">
        <div className="card-modal-body">
          <textarea
            placeholder="Write your message"
            className="large-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>
        <button className="card-modal-button" onClick={() => handleSave(text)}>
          Save
        </button>
        <button className="card-modal-button" onClick={handleModalClose}>
          Cancel
        </button>
      </div>
    </Modal>
  );
}
