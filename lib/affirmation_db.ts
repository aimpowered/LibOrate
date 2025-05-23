export async function addAffirmationToDB(text: string) {
  const res = await fetch("/api/auth/users/userData/affirmation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(text),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || "Failed to add affirmation");
  }
  return json;
}

export async function deleteAffirmationFromDB(id: number) {
  const res = await fetch("/api/auth/users/userData/affirmation", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || "Failed to delete affirmation");
  }
  return json;
}

export async function updateAffirmationFromDB(id: number, text: string) {
  const res = await fetch("/api/auth/users/userData/affirmation", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, text }),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || "Failed to update affirmation");
  }
  return json;
}
