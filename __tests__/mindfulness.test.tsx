import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Page from "../app/main/Mindfulness";
import videoList from "@/data/videos.json"; // Import video data

jest.mock("next/navigation", () => jest.requireActual("next-router-mock"));
jest.mock("../lib/zoomapi", () => jest.requireActual("../lib/fakezoomapi"));

describe("Page", () => {
  it("renders a heading and available meditation videos", () => {
    render(<Page />);

    videoList.map((video, index) => {
      expect(screen.getByLabelText(video.alt)).toBeInTheDocument();
    });
  });

  it("renders three correct videos", () => {
    render(<Page />);

    videoList.map((video, index) => {
      expect(screen.getByLabelText(video.alt)).toHaveAttribute(
        "src",
        expect.stringContaining(video.youtubeId),
      );
    });
  });
});
