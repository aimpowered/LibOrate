import zoomSdk, {
  ConfigOptions,
  ConfigResponse,
  VideoMedia,
} from "@zoom/appssdk";

export interface VideoDimensions {
  width: number;
  height: number;
}

export interface DrawImageCallback {
  (v: VideoDimensions): ImageData;
}

export interface AuthorizeEvent {
  code: string;
}

export interface AuthorizeCallback {
  (event: AuthorizeEvent): void;
}

export interface AuthorizeOptions {
  codeChallenge: string;
  state: string;
}

export interface GeneralMessageResponse {
  message: string;
}

export interface ZoomApiWrapper {
  setDrawImageCallback(cb: DrawImageCallback): Promise<void>;
  authorize(data: AuthorizeOptions): Promise<GeneralMessageResponse>;
  setAuthorizeCallback(cb: AuthorizeCallback): Promise<void>;
}

function createFromConfig(options: ConfigOptions) {
  return new ZoomApiImpl(options);
}

class ZoomApiImpl implements ZoomApiWrapper {
  private configResponse: null | Promise<ConfigResponse> = null;
  private videoMedia: null | VideoMedia = null;
  private drawImageCallback: null | DrawImageCallback = null;
  constructor(private configOptions: ConfigOptions) {}

  initialize() {
    if (this.configResponse == null) {
      this.configResponse = zoomSdk.config(this.configOptions);
      zoomSdk.onMyMediaChange((event) => {
        if (event.media && "video" in event.media) {
          this.videoMedia = event.media ?? null;
          this.drawForeground(event.media);
        }
      });
    }
    return this.configResponse;
  }

  async setDrawImageCallback(cb: DrawImageCallback): Promise<void> {
    this.drawImageCallback = cb;
    const configResponse = await this.initialize();
    const media = this.videoMedia ?? configResponse.media;
    await this.drawForeground(media);
  }

  async authorize(options: AuthorizeOptions): Promise<GeneralMessageResponse> {
    await this.initialize();
    return zoomSdk.authorize(options);
  }

  async setAuthorizeCallback(cb: AuthorizeCallback): Promise<void> {
    await this.initialize();
    zoomSdk.onAuthorized((event) => {
      cb({ code: event.code });
    });
  }

  private async drawForeground(input?: VideoMedia) {
    const video = input?.video ?? {};
    const { width, height, state } = video;
    if (this.drawImageCallback == null) return;
    if (width == null || height == null) return;
    if (state !== undefined && !state) return;
    const imageData = this.drawImageCallback({ width, height });
    return zoomSdk.setVirtualForeground({ imageData });
  }
}

const zoomConfigOptions: ConfigOptions = {
  capabilities: [
    "setVirtualForeground",
    "onMyMediaChange",
    "authorize",
    "onAuthorized",
    "promptAuthorize",
  ],
  version: "0.16",
  timeout: 10000,
};

export const zoomApi = createFromConfig(zoomConfigOptions);
