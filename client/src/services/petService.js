import { API_BASE_URL, API_ROUTES } from "@/routes";
import handleResponse from "@/utils/handleResponse";

const API_URL = `${API_BASE_URL}${API_ROUTES.pets}`;

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
