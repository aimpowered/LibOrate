import {
  DrawImageCallback,
  ZoomApiWrapper,
  AuthorizeCallback,
  AuthorizeOptions,
  GeneralMessageResponse,
} from "./zoomapi";

class FakeZoomApi implements ZoomApiWrapper {
  private authorizeCallback: AuthorizeCallback | null = null;

  async setDrawImageCallback(cb: DrawImageCallback): Promise<void> {}
  async authorize(data: AuthorizeOptions): Promise<GeneralMessageResponse> {
    return { message: "Success" };
  }
  async setAuthorizeCallback(cb: AuthorizeCallback): Promise<void> {
    this.authorizeCallback = cb;
  }

  async triggerAuthorizeCallback(event: { code: string }) {
    if (this.authorizeCallback) {
      await this.authorizeCallback(event);
    }
  }
}
export type { ZoomApiWrapper };

function createFromConfig() {
  return new FakeZoomApi();
}

export const zoomApi = createFromConfig();
