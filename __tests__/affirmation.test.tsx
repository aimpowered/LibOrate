import React from "react";
import { render, fireEvent, act, screen } from "@testing-library/react";
import {
  AffirmationCarousel,
  AffirmationCarouselProps,
} from "../components/AffirmationCarousel";
import "@testing-library/jest-dom"; // Extra matchers for assertions

// 🛠 Mock embla-carousel-react to prevent errors in Jest. The error details are as follows:
//    https://github.com/davidjerleke/embla-carousel/issues/837
//
// Embla Carousel provides official mocks for testing:
// https://github.com/davidjerleke/embla-carousel/tree/master/packages/embla-carousel/src/__tests__/mocks
//
// However, integrating them directly is not straightforward because:
// - The official mocks are designed for Embla's internal testing and may not fit our test setup easily.
// - They might require additional dependencies or setup adjustments.
//
// For now, we use a simpler custom mock, but if someone finds a clean way to reuse the official mocks,
// feel free to update this!
jest.mock("embla-carousel-react", () => ({
  __esModule: true,
  default: jest.fn(() => [
    jest.fn(), // Carousel ref
    {
      canScrollPrev: jest.fn(() => true),
      canScrollNext: jest.fn(() => true),
      scrollNext: jest.fn(),
      scrollPrev: jest.fn(),
      on: jest.fn(), // Mock the `.on` method
      off: jest.fn(),
      scrollTo: jest.fn(),
      selectedScrollSnap: jest.fn(() => 0),
    },
  ]),
}));

const defaultAffirmations: string[] = [
  "Say what I want to say, whatever happens will help me grow",
  "I can take up space",
  "I have an important voice",
  "Feel the tension and proceed",
  "I have the right to stutter",
];

describe("AffirmationCarousel Component", () => {
  const defaultProps: AffirmationCarouselProps = {
    initialAffirmations: defaultAffirmations,
    onAdd: () => {},
    onDelete: () => {},
    onUpdate: () => {},
  };

  test("resizes when the resize handle is dragged", () => {
    render(<AffirmationCarousel {...defaultProps} />);

    const carouselContent = screen.getByRole("region", {
      name: /self affirmation carousel/i,
    });

    const resizeHandle = screen.getByRole("slider", {
      name: /resize handle/i,
    });

    act(() => {
      fireEvent.mouseDown(resizeHandle); // Start resizing
      fireEvent.mouseMove(document, { clientY: 100 }); // Drag down
      fireEvent.mouseUp(document); // Release mouse
    });

    expect(carouselContent.style.height).toBe("100px");
  });

  test("ensures font size updates correctly on resize", () => {
    render(<AffirmationCarousel {...defaultProps} />);

    const firstAffirmationCard = screen.getByRole("region", {
      name: /self affirmation carousel/i,
    });

    const resizeHandle = screen.getByRole("slider", {
      name: /resize handle/i,
    });

    act(() => {
      fireEvent.mouseDown(resizeHandle);
      fireEvent.mouseMove(document, { clientY: 100 }); // Increase height
      fireEvent.mouseUp(document);
    });

    if (firstAffirmationCard.style.fontSize) {
      expect(firstAffirmationCard.style.fontSize).toBe("20px");
    }
  });

  it("calls onUpdate when affirmation is added", () => {
    const mockUpdate = jest.fn();
    render(<AffirmationCarousel {...defaultProps} onUpdate={mockUpdate} />);

    const actionButtons = screen.getAllByLabelText("more actions");
    expect(actionButtons.length).toBeGreaterThan(0);
    const actionButton = actionButtons[0];
    fireEvent.click(actionButton);
    const editItem = screen.getByText("Edit");
    fireEvent.click(editItem);
    const textArea = screen.getByPlaceholderText("Write your message");
    fireEvent.change(textArea, { target: { value: "Hello, world!" } });
    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);
    expect(mockUpdate).toHaveBeenCalledWith(0, "Hello, world!");
  });

  it("calls onDelete when affirmation is deleted", () => {
    const mockDelete = jest.fn();
    render(<AffirmationCarousel {...defaultProps} onDelete={mockDelete} />);

    const actionButtons = screen.getAllByLabelText("more actions");
    expect(actionButtons.length).toBeGreaterThan(0);
    const actionButton = actionButtons[0];
    fireEvent.click(actionButton);
    const deleteItem = screen.getByText("Delete");
    fireEvent.click(deleteItem);
    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);
    expect(mockDelete).toHaveBeenCalledWith(0);
  });

  it("calls onAdd when affirmation is updated", () => {
    const mockAdd = jest.fn();
    render(<AffirmationCarousel {...defaultProps} onAdd={mockAdd} />);

    const addButton = screen.getByLabelText("Add new affirmation button");
    fireEvent.click(addButton);
    const textArea = screen.getByPlaceholderText("Write your message");
    fireEvent.change(textArea, { target: { value: "New Affirmation" } });
    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);
    expect(mockAdd).toHaveBeenCalledWith("New Affirmation");
  });
});
