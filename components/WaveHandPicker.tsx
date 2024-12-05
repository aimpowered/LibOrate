import React from "react";
import { useState } from "react";
import { WaveHandButton } from "@/components/WaveHandButton";
import { HandWaveBadge } from "@/lib/draw_badge_api";

import "@/app/css/Wavehand.css";

const waveHandEmoji = "👋";

interface WaveHandPickerProps {
  initialHands: string[];
  updateHandWaveBadge: (badge: HandWaveBadge) => void;
}

export function WaveHandPicker({
  initialHands,
  updateHandWaveBadge,
}: WaveHandPickerProps) {
  const [selectedButtonId, setSelectedButtonId] = useState(-1);

  const appendEmoji = (text: string) => {
    return waveHandEmoji + " " + text;
  };

  const clickButton = (id: number, text: string) => {
    if (selectedButtonId == id) {
      setSelectedButtonId(-1); // unselect a button
      // hide HandWaveBadge
      updateHandWaveBadge({ visible: false });
    } else {
      setSelectedButtonId(id);
      // draw selected HandWaveBadge
      updateHandWaveBadge({
        visible: true,
        waveText: appendEmoji(text),
      });
    }
  };

  return (
    <div className="button-rows">
      {initialHands.map((text, index) => (
        <WaveHandButton
          key={text}
          selected={index == selectedButtonId}
          onClick={() => clickButton(index, text)}
          text={appendEmoji(text)}
        />
      ))}
    </div>
  );
}
