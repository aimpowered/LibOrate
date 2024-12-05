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

export interface ZoomApiWrapper {
  setDrawImageCallback(cb: DrawImageCallback): Promise<void>;
}

export function createFromConfig(options: ConfigOptions) {
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

  private async drawForeground({
    video: { width, height } = {},
  }: VideoMedia = {}) {
    if (this.drawImageCallback == null) return;
    if (width == null || height == null) return;
    const imageData = this.drawImageCallback({ width, height });
    return zoomSdk.setVirtualForeground({ imageData });
  }
}
