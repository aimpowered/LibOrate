import { NameTagContent } from "@/components/NameTagForm";
import startDB from "@/lib/db";
import UserModel from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET request to fetch the user's nametag
 */

type FetchUserNametagResponse = NextResponse<{
  success?: boolean;
  error?: string;
  nameTag?: NameTagContent;
}>;

export const GET = async (
  req: NextRequest,
): Promise<FetchUserNametagResponse> => {
  const userEmail = req.nextUrl.searchParams.get("userEmail");

  if (!userEmail) {
    return NextResponse.json(
      {
        success: false,
        error: "userEmail param not specified.",
      },
      { status: 400 },
    );
  }

  await startDB();

  const user = await UserModel.findOne({ email: userEmail });

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: "User does not exist.",
      },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      success: true,
      nameTag: user?.nameTag,
    },
    { status: 200 },
  );
};

/**
 * POST request to update the user's nametag
 */

interface UpdateUserNametagRequest {
  email: string;
  nameTag: NameTagContent;
}

type UpdateUserNametagResponse = NextResponse<{
  success?: boolean;
  error?: string;
}>;

export const POST = async (
  req: Request,
): Promise<UpdateUserNametagResponse> => {
  const body = (await req.json()) as UpdateUserNametagRequest;

  await startDB();

  await UserModel.updateOne({ email: body.email }, { nameTag: body.nameTag });

  return NextResponse.json({ success: true }, { status: 200 });
};
