import { NameTagContent } from "@/components/NameTagForm";

export interface UserModel {
  nameTag: NameTagContent;
  waveHands: string[];
}

export async function fetchUserFromDB(): Promise<UserModel> {
  const res = await fetch("/api/auth/users/userData", {
    method: "GET",
  });
  const json = await res.json();
  if (json.nameTag && json.waveHands) {
    return {
      nameTag: json.nameTag,
      waveHands: json.waveHands,
    };
  }
  throw new Error("No user data found in DB.");
}
