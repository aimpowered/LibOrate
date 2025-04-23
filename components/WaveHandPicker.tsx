import React from "react";
import { useState, useEffect } from "react";
import { WaveHandButton } from "@/components/WaveHandButton";
import { AddHandButton } from "@/components/AddWaveHandButton";
import { HandWaveBadge } from "@/lib/draw_badge_api";
import { RetryError } from "@/components/RetryError";

import "@/app/css/Wavehand.css";

interface WaveHandPickerProps {
  initialHands: string[];
  updateHandWaveBadge: (badge: HandWaveBadge) => void;
  hasError: boolean;
  onRetry: () => void;
  onAdd: (text: string) => void;
  onDelete: (text: string) => void;
}

export function WaveHandPicker({
  initialHands,
  updateHandWaveBadge,
  hasError,
  onRetry,
  onAdd,
  onDelete,
}: WaveHandPickerProps) {
  const [selectedButtonId, setSelectedButtonId] = useState(-1);
  const [hands, setHands] = useState(initialHands);

  useEffect(() => {
    setHands(initialHands);
  }, [initialHands]);

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
        waveText: text,
      });
    }
  };

  const addNewHand = (text: string) => {
    if (text && text.trim() !== "") {
      setHands([...hands, text.trim()]);
      onAdd(text.trim());
    }
  };

  const deleteHand = (text: string) => {
    setHands(hands.filter((hand) => hand !== text));
    onDelete(text);
  };

  return (
    <div className="button-rows">
      {hasError ? (
        <RetryError
          onRetry={onRetry}
          className="wavehand-fetch-error"
          buttonClassName="wavehand-retry-button"
        />
      ) : (
        <>
          {hands.map((text, index) => (
            <WaveHandButton
              key={text}
              selected={index == selectedButtonId}
              onClick={() => clickButton(index, text)}
              onDelete={deleteHand}
              text={text}
            />
          ))}
          <AddHandButton onAdd={addNewHand} />
        </>
      )}
    </div>
  );
}
