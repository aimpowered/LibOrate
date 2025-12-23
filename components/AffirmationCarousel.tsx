"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";
import { AffirmationCard } from "@/components/AffirmationCard";
import { AddCardItem } from "@/components/AddNewAffirmationCard";
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
  const [slides, setSlides] = useState(initialAffirmations);
  const [fontSizes, setFontSizes] = useState<string[]>(
    initialAffirmations.map(() => "1rem"),
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const emblaOptions: EmblaOptionsType = {
    loop: false,
  };
  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions);
  let isResizing = false;
  const [canScrollPrev, setCanScrollPrev] = useState(true);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollNext(emblaApi?.canScrollNext());
    setCanScrollPrev(emblaApi?.canScrollPrev());
  }, [emblaApi]);

  useEffect(() => {
    console.log(
      "canScrollPrev:",
      canScrollPrev,
      "canScrollNext:",
      canScrollNext,
    );
  }, [canScrollNext, canScrollPrev]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Re-initialize carousel when slides change
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
    emblaApi.scrollTo(0, false);
    setCanScrollNext(emblaApi?.canScrollNext());
    setCanScrollPrev(emblaApi?.canScrollPrev());
  }, [slides, emblaApi]);

  const addNewSlide = (text: string) => {
    setSlides((prev) => [text, ...prev]);
    onAdd(text);
  };

  const deleteSlide = (index: number) => {
    if (index < 0 || index >= slides.length) return;
    setSlides((prev) => prev.filter((_, i) => i !== index));
    onDelete(index);
  };

  const editSlide = (index: number, text: string) => {
    if (index < 0 || index >= slides.length) return;
    const newSlides = [...slides];
    newSlides[index] = text;
    setSlides(newSlides);
    onUpdate(index, text);
  };

  function resizeCarousel(e: MouseEvent) {
    if (!isResizing || !containerRef.current) return;
    document.body.style.cursor = "row-resize";
    let newHeight =
      e.clientY - containerRef.current.getBoundingClientRect().top;
    newHeight = Math.max(120, Math.min(newHeight, window.innerHeight * 0.5));
    containerRef.current.style.height = `${newHeight}px`;
    computeAllFontSizes();
  }

  function stopResizing() {
    isResizing = false;
    document.body.style.userSelect = "auto";
    document.body.style.cursor = "";
    document.body.style.webkitUserSelect = "auto"; // Reset Safari
    // Reset Firefox - use setProperty to avoid type issues
    document.body.style.setProperty("-moz-user-select", "auto");
    document.removeEventListener("mousemove", resizeCarousel);
    document.removeEventListener("mouseup", stopResizing);
    document.removeEventListener("selectstart", preventDefault); // Remove selection prevention
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default text selection behavior
    isResizing = true;
    document.body.style.userSelect = "none"; // Prevent text selection while dragging
    document.body.style.cursor = "row-resize";
    // Also prevent selection on the document
    document.body.style.webkitUserSelect = "none"; // For Safari
    // For Firefox - use setProperty to avoid type issues
    document.body.style.setProperty("-moz-user-select", "none");
    document.addEventListener("mousemove", resizeCarousel);
    document.addEventListener("mouseup", stopResizing);
    document.addEventListener("selectstart", preventDefault); // Prevent selection start
  };

  const preventDefault = (e: Event) => {
    e.preventDefault();
  };

  const computeAllFontSizes = () => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    const newFontSizes = slides.map((text) => {
      const charCount = Math.max(text.length, 1);

      const availableHeight = containerHeight * 0.7;

      const availableWidth = containerWidth * 0.6;

      let minSize = 16;
      let maxSize = containerHeight * 0.6;
      let bestSize = minSize;
      while (maxSize - minSize > 1) {
        const midSize = (minSize + maxSize) / 2;
        const avgCharWidth = midSize * 0.6;
        const charsPerLine = Math.floor(availableWidth / avgCharWidth);
        const estimatedLines = Math.ceil(charCount / charsPerLine);
        const lineHeight = midSize * 1.5;
        const estimatedTextHeight = estimatedLines * lineHeight;

        if (estimatedTextHeight <= availableHeight) {
          bestSize = midSize;
          minSize = midSize;
        } else {
          maxSize = midSize;
        }
      }

      return `${bestSize}px`;
    });

    setFontSizes(newFontSizes);
  };
  useEffect(() => {
    computeAllFontSizes();
  }, [slides, containerRef]);

  return (
    <div
      className="self-affirm-carousel"
      ref={containerRef}
      data-testid="affirmation-carousel"
    >
      <div className="self-affirm-viewport" ref={emblaRef}>
        <CarouselContent
          slides={slides}
          onAddSlide={addNewSlide}
          onDeleteSlide={deleteSlide}
          onEditSlide={editSlide}
          fontSizes={fontSizes}
        />
      </div>

      <Button
        className={`carousel-button left ${!canScrollPrev ? "carousel-button-disabled" : ""}`}
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        data-testid="carousel-prev-button"
      >
        <ArrowLeft />
      </Button>
      <Button
        className={`carousel-button right ${!canScrollNext ? "carousel-button-disabled" : ""}`}
        onClick={scrollNext}
        disabled={!canScrollNext}
        data-testid="carousel-next-button"
      >
        <ArrowRight />
      </Button>
      <div
        className="resize-handle"
        onMouseDown={handleMouseDown}
        data-testid="resize-handle"
      ></div>
    </div>
  );
}

interface CarouselContentProps {
  slides: string[];
  fontSizes?: string[];
  onAddSlide: (text: string) => void;
  onDeleteSlide?: (index: number) => void;
  onEditSlide?: (index: number, text: string) => void;
}

function CarouselContent({
  slides,
  fontSizes,
  onAddSlide,
  onDeleteSlide,
  onEditSlide,
}: CarouselContentProps) {
  const handleEdit = (index: number, slide: string) => {
    if (index < 0 || index >= slides.length) return;
    onEditSlide?.(index, slide);
  };

  const handleDelete = (index: number) => {
    if (index < 0 || index >= slides.length) return;
    onDeleteSlide?.(index);
  };

  return (
    <div className="self-affirm-container">
      {slides.map((slide, index) => (
        <CarouselItem
          key={index}
          slide={slide}
          onEdit={(newSlide) => handleEdit(index, newSlide)}
          onDelete={() => handleDelete(index)}
          fontSize={fontSizes ? fontSizes[index] : undefined}
        />
      ))}
      <AddCardItem onAddSlide={onAddSlide} />
    </div>
  );
}

interface CarouselItemProps {
  slide: string;
  onEdit?: (newSlide: string) => void;
  onDelete?: () => void;
  fontSize?: string;
}

export function CarouselItem({
  slide,
  onEdit,
  onDelete,
  fontSize,
}: CarouselItemProps) {
  return (
    <AffirmationCard
      initialContent={slide}
      onAffirmationCardUpdate={onEdit}
      onAffirmationCardDeletion={onDelete}
      fontSize={fontSize}
    />
  );
}
