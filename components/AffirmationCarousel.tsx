import React, { useState, useRef } from "react";
import {
  AffirmationCardContent,
  AffirmationCard,
} from "@/components/AffirmationCard";
import { AddNewAffirmationCard } from "@/components/AddNewAffirmationCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import "@/app/css/Affirmation.css";

interface AffirmationCarouselProps {
  initialAffirmations: AffirmationCardContent[];
}

export function AffirmationCarousel({
  initialAffirmations,
}: AffirmationCarouselProps) {
  const [affirmationList, setAffirmationList] = useState(initialAffirmations);
  const carouselRef = useRef<HTMLDivElement>(null);
  let isResizing = false;

  const updateAffirmationCard = (id: number, updatedText: string) => {
    // TODO: log updated AffirmationList in DB
    const updatedAffirmationList = affirmationList.map((affirmation) => {
      if (affirmation.id == id) {
        return { id: id, text: updatedText };
      } else {
        return affirmation;
      }
    });
    setAffirmationList(updatedAffirmationList);
  };

  // TODO: propogate the change to root to delete card in DB
  const deleteAffirmationCard = (id: number) => {
    setAffirmationList(affirmationList.filter((a) => a.id != id));
  };

  // TODO: propogate the change to root to add new card to DB
  const addAffirmationCard = (cardText: string) => {
    let maxId = -1;
    affirmationList.forEach((card) => {
      if (card.id > maxId) {
        maxId = card.id;
      }
    });
    const newCard = { id: maxId + 1, text: cardText };
    setAffirmationList([...affirmationList, newCard]);
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
      <CarouselContent className="self-affirm-carousel" ref={carouselRef}>
        {affirmationList.map((affirmation) => (
          <CarouselItem key={affirmation.text}>
            <AffirmationCard
              initialContent={affirmation}
              onAffirmationCardUpdate={updateAffirmationCard}
              onAffirmationCardDeletion={deleteAffirmationCard}
            />
          </CarouselItem>
        ))}
        <CarouselItem key="add-new-card">
          <AddNewAffirmationCard onCardAdd={addAffirmationCard} />
        </CarouselItem>
      </CarouselContent>
      <div className="resize-handle" onMouseDown={handleMouseDown} />
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
