import { API_BASE_URL, API_ROUTES } from "@/routes";
import handleResponse from "@/utils/handleResponse";

const API_URL = `${API_BASE_URL}${API_ROUTES.pets}`;

export async function getPets() {
  const res = await fetch(API_URL);
  return handleResponse(res);
}

export async function getPet(petId) {
  const res = await fetch(`${API_URL}/${petId}`);
  return handleResponse(res);
}

export async function deletePet(petId) {
  const res = await fetch(`${API_URL}/${petId}`, { method: "DELETE" });
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

export async function updatePet(petId, petData) {
  const res = await fetch(`${API_URL}/${petId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(petData),
  });
  return handleResponse(res);
}
