import React from "react";
import { render, act } from "@testing-library/react";
import App from "../app/main/page";

jest.mock("../components/AffirmationCarousel", () => ({
  AffirmationCarousel: () => <div>AffirmationCarousel</div>,
}));
jest.mock("../components/WaveHandPicker", () => ({
  WaveHandPicker: () => <div>WaveHandPicker</div>,
}));
jest.mock("../components/NameTagForm", () => ({
  NameTagForm: () => <div>NameTagForm</div>,
}));
jest.mock("../app/main/Mindfulness", () => () => <div>Mindfulness</div>);
jest.mock(
  "../app/main/Tabs",
  () =>
    ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
);
jest.mock("@mui/material/Divider", () => () => <hr />);
jest.mock("../lib/user_db", () => ({
  fetchUserFromDB: jest.fn().mockResolvedValue({
    nameTag: {
      visible: true,
      preferredName: "Test User",
      pronouns: "they/them",
      disclosure: "Test disclosure",
    },
    waveHands: ["👋", "👏"],
  }),
}));

// Mock ResizeObserver since JSDOM doesn't implement it
class ResizeObserverMock {
  callback: ResizeObserverCallback;
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock;

test("scrollable-content margin-top equals header height", async () => {
  Object.defineProperty(HTMLElement.prototype, "clientHeight", {
    configurable: true,
    get() {
      return 150;
    },
  });

  let container: HTMLElement;

  await act(async () => {
    const renderResult = render(<App />);
    container = renderResult.container;
  });

  const header = container.querySelector(".header") as HTMLDivElement;
  const scrollable = container.querySelector(
    ".scrollable-content",
  ) as HTMLDivElement;
  expect(header).toBeTruthy();
  expect(scrollable).toBeTruthy();

  expect(scrollable.style.marginTop).toBe("150px");
});
