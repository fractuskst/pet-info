const API_URL = "http://localhost:5000/pets";

async function handleResponse(res) {
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message);
  }
  return res.json();
}

export async function getPhotos(pet_id) {
  const res = await fetch(`${API_URL}/${pet_id}/photos`);
  return handleResponse(res);
}

export async function deletePhoto(pet_id, url) {
  const res = await fetch(`${API_URL}/${pet_id}/photos`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  return handleResponse(res);
}

export async function uploadPhotos(pet_id, formData) {
  const res = await fetch(`${API_URL}/${pet_id}/photos`, {
    method: "POST",
    body: formData,
  });
  return handleResponse(res);
}

export async function getPets() {
  const res = await fetch(API_URL);
  return handleResponse(res);
}

export async function getPet(pet_id) {
  const res = await fetch(`${API_URL}/${pet_id}`);
  return handleResponse(res);
}

export async function deletePet(pet_id) {
  const res = await fetch(`${API_URL}/${pet_id}`, { method: "DELETE" });
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

export async function updatePet(pet_id, petData) {
  const res = await fetch(`${API_URL}/${pet_id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(petData),
  });
  return handleResponse(res);
}
