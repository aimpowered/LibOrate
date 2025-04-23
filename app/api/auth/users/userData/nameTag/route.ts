import startDB from "@/lib/db";
import UserModel from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { loggedInUserEmail } from "@/lib/session";

/**
 * POST request to update the user's nametag
 */
type UpdateUserNametagResponse = NextResponse<
  { success: true } | { error: string }
>;

export const POST = async (
  req: NextRequest,
): Promise<UpdateUserNametagResponse> => {
  const body: object = await req.json();
  const { userEmail, error } = await loggedInUserEmail();
  if (error) return NextResponse.json({ error }, { status: 400 });

  await startDB();

  await UserModel.updateOne({ email: userEmail }, { nameTag: body });

  return NextResponse.json({ success: true }, { status: 200 });
};
