// Handle User SignIn and SignUp
import startDB from "@/lib/db";
import UserModel from "@/models/userModel";
import { NextResponse } from "next/server";

interface NewUserRequest extends Request {
  json(): Promise<object>;
}

interface NewUserResponse {
  id: string;
  email: string;
  role: string;
}

type NewResponse = NextResponse<{ user?: NewUserResponse; error?: string }>;

// Make a POST request to create a new user
export const POST = async (req: NewUserRequest): Promise<NewResponse> => {
  const body = await req.json();
  if (!("email" in body)) {
    throw new Error("Can't create user without email");
  }

  await startDB();

  const oldUser = await UserModel.findOne({ email: body.email });
  if (oldUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 422 });
  }
  const user = await UserModel.create({ ...body });

  return NextResponse.json({
    user: {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    },
  });
};
