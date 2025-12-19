import { IPet, IPetPhoto } from "@pet-info/shared/types.js";
import { DB } from "../db/database.js";
import { deletePhoto } from "@/services/photo.service.js";
import { AppError } from "@/utils/AppError.js";

export const getPets = async () => {
  const sql = "SELECT * FROM pets";
  const pets = await DB.all<IPet[]>(sql);

  return pets ?? [];
};

export const getPet = async (id: number) => {
  const sql = "SELECT * FROM pets WHERE id = ?";
  const pet = await DB.get<IPet>(sql, [id]);

  if (!pet) {
    throw new AppError("Питомец не найден", 404);
  }

  return pet;
};

export const createPet = async (data: IPet) => {
  const { name, type, birthDate, age, breed, favToys, description } = data;

  if (!name?.trim() || !type?.trim()) {
    throw new AppError("Имя и тип питомца обязательны");
  }

  const sql = `INSERT INTO pets (name, type, birthDate, age, breed, favToys, description) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  const result = await DB.run(sql, [name, type, birthDate, age, breed, favToys, description]);

  if (!result || !result.lastID) {
    throw new AppError("Не удалось создать питомца", 500);
  }

  const petId = result.lastID!;

  const pet = await getPet(petId);
  return pet;
};

export const updatePet = async (id: number, updates: Partial<IPet>) => {
  const allowedFields = ["name", "type", "mainPhoto", "birthDate", "age", "breed", "favToys", "description"];
  const keys = Object.keys(updates).filter((k) => allowedFields.includes(k));

  if (keys.length === 0) {
    throw new AppError("Нет валидных полей для обновления", 400);
  }

  if ("name" in updates && !updates.name?.trim()) {
    throw new AppError("Имя не может быть пустым", 400);
  }
  if ("type" in updates && !updates.type?.trim()) {
    throw new AppError("Тип не может быть пустым", 400);
  }

  const fields = keys.map((k) => `${k} = ?`).join(", ");
  const values = keys.map((k) => updates[k as keyof IPet] ?? null);

  const sql = `UPDATE pets SET ${fields} WHERE id = ?`;
  const result = await DB.run(sql, [...values, id]);

  if (result.changes === 0) {
    throw new AppError("Питомец не найден", 404);
  }

  const updatedPet = await getPet(id);
  return updatedPet;
};

export const deletePet = async (id: number) => {
  const photos = await DB.all<IPetPhoto[]>("SELECT id FROM pet_photos WHERE petId = ?", [id]);
  await Promise.all(
    photos.map((p: IPetPhoto) =>
      deletePhoto(p.id).catch(() => {
        throw new AppError("Возникла ошибка при удалении фотографии", 500);
      }),
    ),
  );

  const sql = "DELETE FROM pets WHERE id = ?";
  const result = await DB.run(sql, [id]);

  if (result.changes === 0) {
    throw new AppError("Питомец не найден", 404);
  }
};
