import { API_ROUTES } from "@/routes";
import { del, get, postForm } from "./httpClient";

export const getPhotos = async (petId) => get(`${API_ROUTES.photos}/${petId}`);

export const uploadPhotos = async (petId, photoData) => postForm(`${API_ROUTES.photos}/${petId}`, photoData);

export const deletePhoto = async (id) => del(`${API_ROUTES.photos}/${id}`);
