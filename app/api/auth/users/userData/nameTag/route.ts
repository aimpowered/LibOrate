import { NameTagContent } from "@/components/NameTagForm";
import startDB from "@/lib/db";
import UserModel from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

/**
 * GET request to fetch the user's nametag
 */

type FetchUserNametagResponse = NextResponse<
  { nameTag: NameTagContent } | { error: string }
>;

export const GET = async (): Promise<FetchUserNametagResponse> => {
  const { userEmail, error } = await loggedInUserEmail();

  if (error) return NextResponse.json({ error }, { status: 400 });

  await startDB();

  const user = await UserModel.findOne({ email: userEmail });

  if (!user) {
    return NextResponse.json(
      { error: "User does not exist." },
      { status: 400 },
    );
  }

  return NextResponse.json({ nameTag: user.nameTag }, { status: 200 });
};

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

interface SessionResponse {
  userEmail?: string;
  error?: string;
}

async function loggedInUserEmail(): Promise<SessionResponse> {
  const session = await getServerSession();
  if (!session || !session.user) {
    return { error: "Session does not exist." };
  }
  const user = session.user;
  if (user.email == null) {
    return { error: "User has no email." };
  }
  return { userEmail: user.email };
}
