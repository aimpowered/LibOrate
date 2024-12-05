import { DrawImageCallback, ZoomApiWrapper } from "./zoomapi";

class FakeZoomApi implements ZoomApiWrapper {
  async setDrawImageCallback(cb: DrawImageCallback): Promise<void> {}
}
export type { ZoomApiWrapper };

export function createFromConfig() {
  return new FakeZoomApi();
}
