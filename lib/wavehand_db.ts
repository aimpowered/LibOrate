export async function addWaveHandToDB(newWaveHand: string) {
  const res = await fetch("/api/auth/users/userData/waveHand", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newWaveHand),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || "Failed to add wave hand");
  }
  return json;
}

/**
 * Remove a wave hand from the user's profile
 */
export async function deleteWaveHandFromDB(id: number) {
  const res = await fetch("/api/auth/users/userData/waveHand", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || "Failed to delete wave hand");
  }
  return json;
}
