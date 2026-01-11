import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Page from "../app/main/Mindfulness";
import videoList from "@/data/videos.json"; // Import video data

jest.mock("next/navigation", () => jest.requireActual("next-router-mock"));
jest.mock("../lib/zoomapi", () => jest.requireActual("../lib/fakezoomapi"));

beforeAll(() => {
  (window as any).YT = {
    Player: jest.fn().mockImplementation((container, options) => {
      const iframe = document.createElement("iframe");
      iframe.setAttribute(
        "aria-label",
        container.getAttribute("aria-label") || "",
      );
      iframe.src = `https://www.youtube.com/embed/${options.videoId}`;
      container.parentNode?.replaceChild(iframe, container);
      return {
        destroy: jest.fn(),
      };
    }),
    PlayerState: {
      PLAYING: 1,
      PAUSED: 2,
      ENDED: 0,
    },
  };
});

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
