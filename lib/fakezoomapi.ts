import {
  DrawImageCallback,
  ZoomApiWrapper,
  AuthorizeCallback,
  AuthorizeOptions,
  GeneralMessageResponse,
} from "./zoomapi";

class FakeZoomApi implements ZoomApiWrapper {
  async setDrawImageCallback(cb: DrawImageCallback): Promise<void> {}
  async authorize(data: AuthorizeOptions): Promise<GeneralMessageResponse> {
    return { message: "Success" };
  }
  async setAuthorizeCallback(cb: AuthorizeCallback): Promise<void> {
    cb({ code: "mocked_code" });
  }
}
export type { ZoomApiWrapper };

function createFakeZoomApi() {
  return new FakeZoomApi();
}

export const zoomApi: ZoomApiWrapper = createFakeZoomApi();
