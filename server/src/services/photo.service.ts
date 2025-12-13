import { IPetPhoto } from "@pet-info/shared/types.js";
import { DB } from "../db/database.js";
import { MAX_PHOTOS_PER_PET } from "@pet-info/shared/constants.js";
import * as s3Service from "@/services/s3.service.js";
import { AppError } from "@/utils/AppError.js";

export const getPhotos = async (petId: number) => {
  const sql = "SELECT * FROM pet_photos WHERE petId = ?";
  const photos = await DB.all<IPetPhoto[]>(sql, [petId]);
  return photos;
};

export const addPhotos = async (petId: number, photos: Express.MulterS3.File[]) => {
  const petExists = await DB.get("SELECT * FROM pets WHERE id = ?", [petId]);
  if (!petExists) {
    throw new AppError("Питомец не найден", 404);
  }

  const row = await DB.get("SELECT COUNT(*) as count FROM pet_photos WHERE petId = ?", [petId]);

  const currentCount = row?.count ?? 0;
  const freeSlots = MAX_PHOTOS_PER_PET - currentCount;

  if (freeSlots <= 0) {
    throw new AppError("Достигнут лимит фотографий для питомца", 400);
  }

  const photosToSave = photos.slice(0, freeSlots);

  const sql = "INSERT INTO pet_photos (petId, url) VALUES (?, ?)";

  const results = await Promise.all(
    photosToSave.map((photo) => {
      const url = photo.location;
      if (!url) {
        throw new AppError("Ошибка загрузки фото на S3", 500);
      }
      return DB.run(sql, [petId, url]);
    }),
  );

  if (results.some((r) => r.changes === 0)) {
    throw new AppError("Не все фото удалось сохранить", 500);
  }

  const addedPhotos = results.map((r, i) => ({
    id: r.lastID!,
    petId,
    url: photosToSave[i].location,
  }));

  return addedPhotos;
};

export const deletePhoto = async (id: number) => {
  const photo = await DB.get("SELECT url FROM pet_photos WHERE id = ?", [id]);

  if (!photo) {
    throw new AppError("Фото не найдено", 404);
  }

  const { pathname } = new URL(photo.url);
  const fileKey = pathname.slice(1);

  try {
    await s3Service.deletePhoto(fileKey);
  } catch (err) {
    console.warn(`[S3] Не удалось удалить файл: ${fileKey}`, err);
    throw new AppError("Ошибка удаления файла из S3", 500);
  }

  const sql = "DELETE FROM pet_photos WHERE id = ?";
  const result = await DB.run(sql, [id]);

  if (result.changes === 0) {
    throw new AppError("Фото не найдено", 404);
  }
};
