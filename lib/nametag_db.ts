import { NameTagContent } from "@/components/NameTagForm";
import { getSession } from "next-auth/react";

export async function fetchNametagFromDB(): Promise<NameTagContent> {
  const user = await getUser();
  const res = await fetch(
    "/api/auth/users/userData/nameTag?userEmail=" + user.email,
    { method: "GET" },
  );
  const json = await res.json();
  if (json.success && json.nameTag) {
    return json.nameTag;
  }
  throw new Error("No nametag stored in DB.");
}

export async function updateNameTagInDB(newNameTag: NameTagContent) {
  const user = await getUser();
  return fetch("/api/auth/users/userData/nameTag", {
    method: "POST",
    body: JSON.stringify({
      email: user.email,
      nameTag: newNameTag,
    }),
  });
}

async function getUser() {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("User session is not defined.");
  }
  return session.user;
}
