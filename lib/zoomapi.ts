import zoomSdk, {
  ConfigOptions,
  ConfigResponse,
  VideoMedia,
  GetVideoSettingsResponse,
} from "@zoom/appssdk";

export interface VideoDimensions {
  width: number;
  height: number;
}

export interface DrawImageCallback {
  (v: VideoDimensions, mirror: boolean): ImageData;
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

export interface SendMessageToChatResult {
  channelId: string;
  messageId: string;
}

export interface SendMessageToChatResponse {
  result: SendMessageToChatResult[];
}

export interface ZoomApiWrapper {
  setDrawImageCallback(cb: DrawImageCallback): Promise<void>;
  authorize(data: AuthorizeOptions): Promise<GeneralMessageResponse>;
  setAuthorizeCallback(cb: AuthorizeCallback): Promise<void>;
  sendMessageToChat(message: string): Promise<SendMessageToChatResponse>;
}

function createFromConfig(options: ConfigOptions) {
  return new ZoomApiImpl(options);
}

class ZoomApiImpl implements ZoomApiWrapper {
  private configResponse: null | Promise<ConfigResponse> = null;
  private drawImageCallback: null | DrawImageCallback = null;
  constructor(private configOptions: ConfigOptions) {}

  initialize() {
    if (this.configResponse == null) {
      this.configResponse = zoomSdk.config(this.configOptions);
      zoomSdk.onMyMediaChange((event) => {
        if (event.media && "video" in event.media) {
          this.drawForeground(event.media);
        }
      });
    }
    return this.configResponse;
  }

  async setDrawImageCallback(cb: DrawImageCallback): Promise<void> {
    this.drawImageCallback = cb;
    const configResponse = await this.initialize();
    await this.drawForeground(configResponse.media);
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

  async sendMessageToChat(message: string): Promise<SendMessageToChatResponse> {
    await this.initialize();
    return zoomSdk.sendMessageToChat({ message });
  }

  private async drawForeground(input?: VideoMedia) {
    const video = input?.video ?? {};
    const { width, height, state } = video;

    if (this.drawImageCallback == null) return;
    if (width == null || height == null) return;
    if (state !== undefined && !state) return;
    const videoSettings: GetVideoSettingsResponse =
      await zoomSdk.getVideoSettings();
    const imageData = this.drawImageCallback(
      { width, height },
      videoSettings.mirrorMyVideo,
    );
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
    "sendMessageToChat",
    "getVideoSettings",
  ],
  version: "0.16",
  timeout: 10000,
};

export const zoomApi = createFromConfig(zoomConfigOptions);
