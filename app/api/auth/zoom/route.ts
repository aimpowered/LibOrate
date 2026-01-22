import { getZoomAccessToken, getZoomUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const tokenResponse = await getZoomAccessToken(code!);
    const userProfile = await getZoomUser(
      tokenResponse.access_token,
      tokenResponse.api_url,
    );
    return NextResponse.json(userProfile);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
