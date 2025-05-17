import { NameTagContent } from "@/components/NameTagForm";
import startDB from "@/lib/db";
import UserModel from "@/models/userModel";
import { NextResponse } from "next/server";
import { loggedInUserEmail } from "@/lib/session";

type FetchUserResponse = NextResponse<
  | {
      nameTag: NameTagContent;
      waveHands: string[];
    }
  | { error: string }
>;

export const GET = async (): Promise<FetchUserResponse> => {
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

  return NextResponse.json(
    { nameTag: user.nameTag, waveHands: user.waveHands },
    { status: 200 },
  );
};
