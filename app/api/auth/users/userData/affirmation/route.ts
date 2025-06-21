import startDB from "@/lib/db";
import UserModel from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { loggedInUserEmail } from "@/lib/session";

type AddUserAffirmationResponse = NextResponse<
  { success: true } | { error: string }
>;

export const POST = async (
  req: NextRequest,
): Promise<AddUserAffirmationResponse> => {
  const body: object = await req.json();
  const { userEmail, error } = await loggedInUserEmail();
  if (error) return NextResponse.json({ error }, { status: 400 });

  await startDB();

  const user = await UserModel.findOne({ email: userEmail });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  user.affirmations.push(body);
  await user.save();

  return NextResponse.json({ success: true }, { status: 200 });
};

type DeleteUserAffirmationResponse = NextResponse<
  { success: true } | { error: string }
>;

export const DELETE = async (
  req: NextRequest,
): Promise<DeleteUserAffirmationResponse> => {
  const { id } = await req.json();
  const { userEmail, error } = await loggedInUserEmail();
  if (error) return NextResponse.json({ error }, { status: 400 });

  await startDB();

  const user = await UserModel.findOne({ email: userEmail });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const originalLength = user.affirmations.length;
  if (id < 0 || id >= originalLength)
    return NextResponse.json(
      { error: "Affirmation not found" },
      { status: 404 },
    );

  user.affirmations.splice(id, 1);
  if (user.affirmations.length === originalLength) {
    return NextResponse.json(
      { error: "Affirmation not found" },
      { status: 404 },
    );
  }

  await user.save();

  return NextResponse.json({ success: true }, { status: 200 });
};

type UpdateUserAffirmationResponse = NextResponse<
  { success: true } | { error: string }
>;

export const PUT = async (
  req: NextRequest,
): Promise<UpdateUserAffirmationResponse> => {
  const { id, text } = await req.json();
  if (typeof id !== "number" || typeof text !== "string") {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { userEmail, error } = await loggedInUserEmail();
  if (error) return NextResponse.json({ error }, { status: 400 });

  await startDB();

  const user = await UserModel.findOne({ email: userEmail });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const originalLength = user.affirmations.length;
  if (id < 0 || id >= originalLength)
    return NextResponse.json(
      { error: "Affirmation not found" },
      { status: 404 },
    );

  user.affirmations[id] = text;
  user.markModified("affirmations");
  await user.save();

  return NextResponse.json({ success: true }, { status: 200 });
};
