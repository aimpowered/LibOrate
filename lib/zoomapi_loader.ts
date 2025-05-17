import { ZoomApiWrapper } from "@/lib/zoomapi";

export async function getZoomApi(): Promise<ZoomApiWrapper> {
  const zoomImport = process.env.NEXT_PUBLIC_MOCK_ZOOM_API
    ? import("@/lib/fakezoomapi")
    : import("@/lib/zoomapi");
  const zoomModule = await zoomImport;
  return zoomModule.zoomApi;
}
