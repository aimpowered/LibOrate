import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { WaveHandPicker } from "@/components/WaveHandPicker";
import "@testing-library/jest-dom";

describe("WaveHandPicker", () => {
  const mockUpdateHandWaveBadge = jest.fn();
  const mockOnRetry = jest.fn();
  const mockOnAdd = jest.fn();
  const mockOnDelete = jest.fn();

  const defaultProps = {
    initialHands: ["👋", "🖐️"],
    updateHandWaveBadge: mockUpdateHandWaveBadge,
    hasError: false,
    onRetry: mockOnRetry,
    onAdd: mockOnAdd,
    onDelete: mockOnDelete,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders initial hand buttons", () => {
    render(<WaveHandPicker {...defaultProps} />);
    expect(screen.getByText("👋")).toBeInTheDocument();
    expect(screen.getByText("🖐️")).toBeInTheDocument();
  });

  it("toggles selection and updates badge", () => {
    render(<WaveHandPicker {...defaultProps} />);
    const handButton = screen.getByText("👋");
    fireEvent.click(handButton);
    expect(mockUpdateHandWaveBadge).toHaveBeenCalledWith({
      visible: true,
      waveText: "👋",
    });

    fireEvent.click(handButton);
    expect(mockUpdateHandWaveBadge).toHaveBeenCalledWith({
      visible: false,
    });
  });

  it("calls onAdd when new hand is added", () => {
    render(<WaveHandPicker {...defaultProps} />);
    const addButton = screen.getByText("➕ Add");
    fireEvent.click(addButton);
    const input = screen.getByPlaceholderText("Enter text");
    fireEvent.change(input, { target: { value: "👋 NewHand" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(mockOnAdd).toHaveBeenCalledWith("👋 NewHand");
  });

  it("calls onDelete when a hand is deleted", () => {
    render(<WaveHandPicker {...defaultProps} />);
    const handButtons = screen.getAllByRole("button");
    expect(handButtons.length).toBeGreaterThan(0);

    const firstButton = handButtons[0];
    fireEvent.mouseOver(firstButton);

    const deleteBtn = within(firstButton).getByText("✖");
    expect(deleteBtn).not.toBeNull();

    fireEvent.click(deleteBtn!);
    expect(mockOnDelete).toHaveBeenCalledWith(0);
  });

  it("renders RetryError if hasError is true", () => {
    render(<WaveHandPicker {...defaultProps} hasError={true} />);

    expect(screen.getByText(/retry/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/retry/i));
    expect(mockOnRetry).toHaveBeenCalled();
  });
});
