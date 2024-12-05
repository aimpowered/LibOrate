import React, { useState } from "react";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { WriteAffirmationCardModal } from "@/components/WriteAffirmationCardModal";
import "@/app/css/Affirmation.css";

interface AddNewAffirmationCardProps {
  onCardAdd: (text: string) => void;
}

export function AddNewAffirmationCard({
  onCardAdd,
}: AddNewAffirmationCardProps) {
  const [open, setOpen] = useState(false);
  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);
  const handleAdd = (text: string) => {
    onCardAdd(text);
    setOpen(false);
  };

  return (
    <Card className="self-affirm-card">
      <IconButton
        className="self-affirm-new-card-button"
        aria-label="Add new affirmation button"
        onClick={handleModalOpen}
      >
        <AddCircleOutlineOutlinedIcon />
      </IconButton>
      <WriteAffirmationCardModal
        open={open}
        onModalClose={handleModalClose}
        initialText={""}
        onCardSave={handleAdd}
      />
    </Card>
  );
}
