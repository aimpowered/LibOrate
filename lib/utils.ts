import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZoomApiWrapper } from "@/lib/zoomapi";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getZoomApi(): Promise<ZoomApiWrapper> {
  const zoomImport = process.env.NEXT_PUBLIC_MOCK_ZOOM_API
    ? import("@/lib/fakezoomapi")
    : import("@/lib/zoomapi");
  const zoomModule = await zoomImport;
  return zoomModule.zoomApi;
}
