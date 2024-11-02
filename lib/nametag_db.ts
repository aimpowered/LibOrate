import { NameTagContent } from "@/components/NameTagForm";
import { getSession } from "next-auth/react";

export async function fetchNametagFromDB(): Promise<
  NameTagContent | undefined
> {
  const session = await getSession();

  if (!session || !session.user) {
    console.error("User session is not defined.");
    return;
  }

  try {
    const res = await fetch(
      "/api/auth/users/userData/nameTag?userEmail=" + session.user.email,
      { method: "GET" },
    )
    const json = await res.json();
    if (json.success && json.nameTag) {
      return json.nameTag;
    }
    console.log("No nametag stored in DB.");
  } catch (e) {
      console.error(e);
  }
}

export async function updateNameTagInDB(newNameTag: NameTagContent) {
  const session = await getSession();

  if (!session || !session.user) {
    console.error("User session is not defined.");
    return;
  }

  return fetch("/api/auth/users/userData/nameTag", {
      method: "POST",
      body: JSON.stringify({
        email: session.user.email,
        nameTag: newNameTag,
      }),
  });
}
