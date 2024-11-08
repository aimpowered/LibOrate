import { NameTagContent } from "@/components/NameTagForm";

export async function fetchNametagFromDB(): Promise<NameTagContent> {
  const res = await fetch("/api/auth/users/userData/nameTag", {
    method: "GET",
  });
  const json = await res.json();
  if (json.nameTag) {
    return json.nameTag;
  }
  throw new Error("No nametag stored in DB.");
}

export async function updateNameTagInDB(newNameTag: NameTagContent) {
  return fetch("/api/auth/users/userData/nameTag", {
    method: "POST",
    body: JSON.stringify(newNameTag),
  });
}
