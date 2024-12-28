import startDB from "@/lib/db";
import LogActionModel from "@/models/logActionModel";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

interface NewLogActionRequest {
  userEmail?: string;
  action: string;
  metadata: JSON;
}

interface NewLogActionResponse {
  userEmail: string;
  action: string;
  timestamp: Date;
  metadata: JSON;
}

type NewResponse = NextResponse<{ log?: NewLogActionResponse; error?: string }>;

// Make a POST request to create a new log
export const POST = async (req: Request): Promise<NewResponse> => {
  const session = await getServerSession();
  const { action, ...rest } = (await req.json()) as NewLogActionRequest;
  const userEmail = session?.user?.email ?? rest.userEmail ?? "NO_EMAIL";

  await startDB();

  const log = await LogActionModel.create({ ...rest, userEmail, action });

  return NextResponse.json({
    log: {
      userEmail: log.userEmail,
      action: log.action,
      timestamp: log.timestamp,
      metadata: log.metadata,
    },
  });
};
