import React, { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import { WriteAffirmationCardModal } from "@/components/WriteAffirmationCardModal";
import "@/app/css/Affirmation.css";

interface EditContentMenuItemProps {
  id: number;
  initialText: string;
  onCardEdit: (updatedText: string) => void;
}

export function EditContentMenuItem({
  id,
  initialText,
  onCardEdit,
}: EditContentMenuItemProps) {
  const [text, setText] = useState(initialText);
  const [open, setOpen] = useState(false);
  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);
  const handleEdit = (updatedText: string) => {
    setText(updatedText);
    onCardEdit(updatedText);
    setOpen(false);
  };

  return (
    <React.Fragment>
      <MenuItem onClick={handleModalOpen}>Edit</MenuItem>
      <WriteAffirmationCardModal
        open={open}
        onModalClose={handleModalClose}
        initialText={text}
        onCardSave={handleEdit}
      />
    </React.Fragment>
  );
}
