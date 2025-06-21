import React, { useState, useRef } from "react";
import { AffirmationCard } from "@/components/AffirmationCard";
import { AddNewAffirmationCard } from "@/components/AddNewAffirmationCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import "@/app/css/Affirmation.css";

export interface AffirmationCarouselProps {
  initialAffirmations: string[];
  /**
   * Callback function to update the text of an affirmation card
   * @param id - The id of the affirmation card to be updated
   * @param updatedText - The new text for the affirmation card
   */
  onUpdate: (id: number, updatedText: string) => void;
  /**
   * Callback function to delete an affirmation card
   * @param id - The id of the affirmation card to be deleted
   */
  onDelete: (id: number) => void;
  /**
   * Callback function to add a new affirmation card
   * @param text - The text for the new affirmation card
   */
  onAdd: (text: string) => void;
}

export function AffirmationCarousel({
  initialAffirmations,
  onUpdate,
  onDelete,
  onAdd,
}: AffirmationCarouselProps) {
  const [affirmationList, setAffirmationList] = useState(initialAffirmations);
  const carouselRef = useRef<HTMLDivElement>(null);
  let isResizing = false;

  const updateAffirmationCard = (id: number, updatedText: string) => {
    if (id < 0 || id >= affirmationList.length) return;
    const updatedAffirmationList = [...affirmationList];
    updatedAffirmationList[id] = updatedText;
    setAffirmationList(updatedAffirmationList);
    onUpdate(id, updatedText);
  };

  const deleteAffirmationCard = (id: number) => {
    setAffirmationList((prev) => prev.filter((_, i) => i !== id));
    onDelete(id);
  };

  const addAffirmationCard = (cardText: string) => {
    setAffirmationList([...affirmationList, cardText]);
    onAdd(cardText);
  };

  function resizeCarousel(e: MouseEvent) {
    if (!isResizing || !carouselRef.current) return;
    document.body.style.cursor = "row-resize";
    let newHeight = e.clientY - carouselRef.current.getBoundingClientRect().top;
    newHeight = Math.max(80, Math.min(newHeight, 150));
    carouselRef.current.style.height = `${newHeight}px`;
  }

  function stopResizing() {
    isResizing = false;
    document.body.style.userSelect = "auto";
    document.body.style.cursor = "";
    document.removeEventListener("mousemove", resizeCarousel);
    document.removeEventListener("mouseup", stopResizing);
  }

  const handleMouseDown = () => {
    isResizing = true;
    document.body.style.userSelect = "none"; // Prevent text selection while dragging
    document.body.style.cursor = "row-resize";
    document.addEventListener("mousemove", resizeCarousel);
    document.addEventListener("mouseup", stopResizing);
  };

  return (
    <Carousel>
      <CarouselContent
        className="self-affirm-carousel"
        role="region"
        aria-label="Self Affirmation Carousel"
        ref={carouselRef}
      >
        {affirmationList.map((affirmation, index) => (
          <CarouselItem key={affirmation}>
            <AffirmationCard
              initialContent={affirmation}
              onAffirmationCardUpdate={(updatedText) =>
                updateAffirmationCard(index, updatedText)
              }
              onAffirmationCardDeletion={() => deleteAffirmationCard(index)}
            />
          </CarouselItem>
        ))}
        <CarouselItem key="add-new-card">
          <AddNewAffirmationCard onCardAdd={addAffirmationCard} />
        </CarouselItem>
      </CarouselContent>
      <div
        className="resize-handle"
        role="slider"
        aria-label="Resize Handle"
        onMouseDown={handleMouseDown}
      />
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
