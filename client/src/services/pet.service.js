import { API_ROUTES } from "@/routes";
import handleServerResponse from "@/utils/handleServerResponse";

export const getPets = async () => {
  const res = await fetch(API_ROUTES.pets);
  return handleServerResponse(res);
};

export const getPet = async (petId) => {
  const res = await fetch(`${API_ROUTES.pets}/${petId}`);
  return handleServerResponse(res);
};

export const deletePet = async (petId) => {
  const res = await fetch(`${API_ROUTES.pets}/${petId}`, { method: "DELETE" });
  return handleServerResponse(res);
};

export const createPet = async (petData) => {
  const res = await fetch(API_ROUTES.pets, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(petData),
  });
  return handleServerResponse(res);
};

export const updatePet = async (petId, petData) => {
  const res = await fetch(`${API_ROUTES.pets}/${petId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(petData),
  });
  return handleServerResponse(res);
};
