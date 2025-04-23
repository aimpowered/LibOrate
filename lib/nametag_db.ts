import { NameTagContent } from "@/components/NameTagForm";

export async function updateNameTagInDB(newNameTag: NameTagContent) {
  return fetch("/api/auth/users/userData/nameTag", {
    method: "POST",
    body: JSON.stringify(newNameTag),
  });
}
