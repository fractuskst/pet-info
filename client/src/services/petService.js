const API_URL = "http://localhost:5000/pets";

async function handleResponse(res) {
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message);
  }
  return res.json();
}

export async function getPets() {
  const res = await fetch(API_URL);
  return handleResponse(res);
}

export async function getPet(id) {
  const res = await fetch(`${API_URL}/${id}`);
  return handleResponse(res);
}

export async function deletePet(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  return handleResponse(res);
}

export async function createPet(petData) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(petData),
  });
  return handleResponse(res);
}

export async function updatePet(id, petData) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(petData),
  });
  return handleResponse(res);
}
