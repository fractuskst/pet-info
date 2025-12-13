import { API_ROUTES } from "@/routes";
import { del, get, patch, post } from "./httpClient";

export const getPets = async () => get(API_ROUTES.pets);

export const getPet = async (petId) => get(`${API_ROUTES.pets}/${petId}`);

export const createPet = async (petData) => post(API_ROUTES.pets, petData);

export const updatePet = async (petId, petData) => patch(`${API_ROUTES.pets}/${petId}`, petData);

export const deletePet = async (petId) => del(`${API_ROUTES.pets}/${petId}`);
