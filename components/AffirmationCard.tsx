"use client";

import React, { useState } from "react";
import { Card, CardActions, CardContent } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import { EditConfirmMenuItem } from "./EditContentMenuItem";
import { DeleteConfirmMenuItem } from "./DeleteContentMenuItem";
import "@/app/css/Affirmation.css";

interface AffirmationCardProps {
  initialContent: string;
  onAffirmationCardUpdate?: (newSlide: string) => void;
  onAffirmationCardDeletion?: () => void;
}

export function AffirmationCard({
  initialContent,
  onAffirmationCardUpdate,
  onAffirmationCardDeletion,
}: AffirmationCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card className="self-affirm-card">
      <CardContent className="self-affirm-text">{initialContent}</CardContent>

      <CardActions
        style={{
          position: "absolute",
          top: 0,
          right: 0,
        }}
      >
        <IconButton
          onClick={handleClick}
          aria-label="more actions"
          data-testid="affirmation-card-menu"
        >
          <MoreVertIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <EditConfirmMenuItem
            initialText={initialContent}
            onCardEdit={(newText) => {
              handleClose();
              onAffirmationCardUpdate?.(newText);
            }}
            onMenuClose={handleClose}
          />
          <DeleteConfirmMenuItem
            onCardDeletion={() => {
              handleClose();
              onAffirmationCardDeletion?.();
            }}
            onMenuClose={handleClose}
          />
        </Menu>
      </CardActions>
    </Card>
  );
}
