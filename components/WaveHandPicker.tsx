import React from "react";
import { useState, useEffect } from "react";
import { WaveHandButton } from "@/components/WaveHandButton";
import { AddHandButton } from "@/components/AddWaveHandButton";
import { HandWaveBadge } from "@/lib/draw_badge_api";
import { RetryError } from "@/components/RetryError";

import "@/app/css/Wavehand.css";

interface WaveHandPickerProps {
  /**
   * The initial list of hand wave strings to display.
   */
  initialHands: string[];
  /**
   * Callback to update the hand wave badge.
   * @param badge - The new hand wave badge data.
   */
  updateHandWaveBadge: (badge: HandWaveBadge) => void;
  /**
   * Indicates whether there's an error state.
   * If there is an error, display the retry
   * component and call the onRetry callback when clicked.
   */
  hasError: boolean;
  onRetry: () => void;
  /**
   * Function to call when a new hand wave is added.
   * @param text - The text of the hand wave to add.
   */
  onAdd: (text: string) => void;
  /**
   * Function to call when a hand wave is deleted.
   * @param text - The text of the hand wave to delete.
   */
  onDelete: (id: number) => void;
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

  const deleteHand = (id: number) => {
    setHands((prev) => prev.filter((_, i) => i !== id));
    onDelete(id);
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
              onDelete={() => deleteHand(index)}
              text={text}
            />
          ))}
          <AddHandButton onAdd={addNewHand} />
        </>
      )}
    </div>
  );
}
