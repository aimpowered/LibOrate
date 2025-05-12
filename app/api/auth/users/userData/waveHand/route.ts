import startDB from "@/lib/db";
import UserModel from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { loggedInUserEmail } from "@/lib/session";

type AddUSerWaveHandResponse = NextResponse<
  { success: true } | { error: string }
>;

export const POST = async (
  req: NextRequest,
): Promise<AddUSerWaveHandResponse> => {
  const body: object = await req.json();
  const { userEmail, error } = await loggedInUserEmail();
  if (error) return NextResponse.json({ error }, { status: 400 });

  await startDB();

  const user = await UserModel.findOne({ email: userEmail });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  user.waveHands.push(body);
  await user.save();

  return NextResponse.json({ success: true }, { status: 200 });
};

type DeleteUserWaveHandResponse = NextResponse<
  { success: true } | { error: string }
>;

export const DELETE = async (
  req: NextRequest,
): Promise<DeleteUserWaveHandResponse> => {
  const { id } = await req.json();
  const { userEmail, error } = await loggedInUserEmail();
  if (error) return NextResponse.json({ error }, { status: 400 });

  await startDB();

  const user = await UserModel.findOne({ email: userEmail });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const originalLength = user.waveHands.length;
  if (id < 0 || id >= originalLength)
    return NextResponse.json({ error: "Wave hand not found" }, { status: 404 });

  user.waveHands = user.waveHands.filter(
    (hand: string, index: number) => index !== id,
  );
  if (user.waveHands.length === originalLength) {
    return NextResponse.json({ error: "Wave hand not found" }, { status: 404 });
  }

  await user.save();

  return NextResponse.json({ success: true }, { status: 200 });
};
