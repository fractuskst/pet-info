import { API_BASE_URL, API_ROUTES } from "@/routes";
import handleResponse from "@/utils/handleResponse";

const API_URL = `${API_BASE_URL}${API_ROUTES.photos}`;

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
