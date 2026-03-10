import { run } from "@/lib/report";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }
  try {
    await run();
    return NextResponse.json({
      success: true,
      message: "Cron job executed successfully",
    });
  } catch (error) {
    console.error("Error running cron job:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Cron job failed to execute",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
