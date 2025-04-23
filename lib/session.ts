import { getServerSession } from "next-auth/next";

export interface SessionResponse {
  userEmail?: string;
  error?: string;
}

export async function loggedInUserEmail(): Promise<SessionResponse> {
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
