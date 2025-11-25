import { API_BASE_URL, API_ROUTES } from "@/routes";
import handleResponse from "@/utils/handleResponse";

const API_URL = `${API_BASE_URL}${API_ROUTES.photos}`;

export async function getPhotos(petId) {
  const res = await fetch(`${API_URL}/${petId}`);
  return handleResponse(res);
}

export async function deletePhoto(petId, url) {
  const res = await fetch(`${API_URL}/${petId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  return handleResponse(res);
}

export async function uploadPhotos(petId, formData) {
  const res = await fetch(`${API_URL}/${petId}`, {
    method: "POST",
    body: formData,
  });
  return handleResponse(res);
}
