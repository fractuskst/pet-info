import { API_ROUTES } from "@/routes";
import handleServerResponse from "@/utils/handleServerResponse";

export const getPhotos = async (petId) => {
  const res = await fetch(`${API_ROUTES.photos}/${petId}`);
  return handleServerResponse(res);
};

export const deletePhoto = async (petId, url) => {
  const res = await fetch(`${API_ROUTES.photos}/${petId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  return handleServerResponse(res);
};

export const uploadPhotos = async (petId, formData) => {
  const res = await fetch(`${API_ROUTES.photos}/${petId}`, {
    method: "POST",
    body: formData,
  });
  return handleServerResponse(res);
};
