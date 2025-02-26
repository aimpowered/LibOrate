import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import Menu from "@mui/material/Menu";

import { EditContentMenuItem } from "@/components/EditContentMenuItem";
import { DeleteContentMenuItem } from "@/components/DeleteContentMenuItem";

import "@/app/css/Affirmation.css";

export interface AffirmationCardContent {
  id: number;
  text: string;
}

interface AffirmationCardProps {
  initialContent: AffirmationCardContent;
  onAffirmationCardUpdate: (id: number, updatedText: string) => void;
  onAffirmationCardDeletion: (id: number) => void;
}

export function AffirmationCard({
  initialContent,
  onAffirmationCardUpdate,
  onAffirmationCardDeletion,
}: AffirmationCardProps) {
  const [text, setText] = useState(initialContent.text);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const currentId = initialContent.id;
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Update card text and propogate upwards for DB save
  const updateCardContent = (updatedText: string) => {
    setText(updatedText);
    onAffirmationCardUpdate(currentId, updatedText);
  };

  return (
    <Card className="self-affirm-card">
      <CardActions
        disableSpacing
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          p: 0,
        }}
      >
        <IconButton
          aria-label="more actions"
          id="card-action-button"
          aria-controls={open ? "action-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="action-menu"
          MenuListProps={{
            "aria-labelledby": "card-action-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <EditContentMenuItem
            id={currentId}
            initialText={text}
            onCardEdit={updateCardContent}
          />
          <DeleteContentMenuItem
            id={currentId}
            onCardDeletion={onAffirmationCardDeletion}
          />
        </Menu>
      </CardActions>
      <CardContent className="self-affirm-text">{text}</CardContent>
    </Card>
  );
}
