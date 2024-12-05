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

  return (
    <Modal open={open} onClose={onModalClose}>
      <div className="card-modal">
        <div className="card-modal-body">
          <textarea
            placeholder="Write your message"
            className="large-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>
        <button className="card-modal-button" onClick={() => onCardSave(text)}>
          Save
        </button>
        <button className="card-modal-button" onClick={onModalClose}>
          Cancel
        </button>
      </div>
    </Modal>
  );
}
