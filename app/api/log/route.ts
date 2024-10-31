import startDB from "@/lib/db";
import LogActionModel from "@/models/logActionModel";
import { NextResponse } from "next/server";

interface NewLogActionRequest {
  userEmail: string;
  action: string;
  timestamp: Date;
  metadata: JSON;
}

interface NewLogActionResponse {
  id: string;
  userEmail: string;
  action: string;
  timestamp: Date;
  metadata: JSON;
}

type NewResponse = NextResponse<{ log?: NewLogActionResponse; error?: string }>;

// Make a POST request to create a new log
export const POST = async (req: Request): Promise<NewResponse> => {
  const body = (await req.json()) as NewLogActionRequest;

  await startDB();

  const log = await LogActionModel.create({ ...body });

  return NextResponse.json({
    log: {
      id: log._id.toString(),
      userEmail: log.userEmail,
      action: log.action,
      timestamp: log.timestamp,
      metadata: log.metadata,
    },
  });
};
