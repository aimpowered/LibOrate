// Handle User SignIn and SignUp
import UserModel from "@/models/userModel";
import { NextResponse } from "next/server";

interface NewUserRequest {
  email: string;
  password: string;
}

interface NewUserResponse {
  id: string;
  email: string;
  role: string;
}

type NewResponse = NextResponse<{ user?: NewUserResponse; error?: string }>;

// Make a POST request to create a new user
export const POST = async (req: Request): Promise<NewResponse> => {
  console.log(`Calling POST with req: ${req}`);
  const body = (await req.json()) as NewUserRequest;

  const userModel = await UserModel();
  console.log(`users/route.ts trying to find one`)
  const oldUser = await userModel.findOne({ email: body.email });
  if (oldUser)
    return NextResponse.json({ error: "User already exists" }, { status: 422 });
  const user = await userModel.create({ ...body });

  return NextResponse.json({
    user: {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    },
  });
};
