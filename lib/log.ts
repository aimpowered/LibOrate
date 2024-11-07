import { getSession } from "next-auth/react";

interface NewLogActionRequest {
  userEmail: string;
  action: string;
  metadata?: object;
}

export function log(email: string, action: string, metadata?: object) {
  const req: NewLogActionRequest = {
    userEmail: email,
    action,
  };
  if (metadata) req.metadata = metadata;
  fetch("/api/log", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export async function logWithSession(action: string, metadata?: object) {
  const session = await getSession();

  let email = session?.user?.email;
  if (email == null) {
    email = "!!no logged in user session!!";
  }

  log(email, action, metadata);
}
