import {
  DrawImageCallback,
  ZoomApiWrapper,
  AuthorizeCallback,
  AuthorizeOptions,
  GeneralMessageResponse,
} from "./zoomapi";

class FakeZoomApi implements ZoomApiWrapper {
  private authorizeCallback: AuthorizeCallback | null = null;
  constructor(private inCypress: boolean) {}

  async setDrawImageCallback(cb: DrawImageCallback): Promise<void> {}
  async authorize(data: AuthorizeOptions): Promise<GeneralMessageResponse> {
    return { message: "Success" };
  }
  async setAuthorizeCallback(cb: AuthorizeCallback): Promise<void> {
    this.authorizeCallback = cb;
    if (this.inCypress) {
      setTimeout(() => cb({ code: "mocked_code" }), 100);
    }
  }

  async triggerAuthorizeCallback(event: { code: string }) {
    if (this.authorizeCallback) {
      await this.authorizeCallback(event);
    }
  }
}
export type { ZoomApiWrapper };

function createFakeZoomApi(inCypress: boolean = false) {
  console.log("creating fake zoom api:", inCypress);
  return new FakeZoomApi(inCypress);
}

let zoomApi: ZoomApiWrapper;

if (typeof window !== "undefined" && window.Cypress) {
  zoomApi = createFakeZoomApi(true);
} else {
  zoomApi = createFakeZoomApi(false);
}

export { zoomApi };
