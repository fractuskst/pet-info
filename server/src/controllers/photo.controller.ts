import * as photoService from "@/services/photo.service.js";
import { AppError } from "@/utils/AppError.js";
import { catchAsync } from "@/utils/catchAsync.js";

export const getPhotos = catchAsync(async (req, res) => {
  const petId = Number(req.params.id);

  if (!petId || Number.isNaN(petId)) {
    throw new AppError("Некорректный ID питомца", 400);
  }

  const photos = await photoService.getPhotos(petId);

  res.status(200).json(photos);
});

export const addPhotos = catchAsync(async (req, res) => {
  const petId = Number(req.params.id);

  if (!petId || Number.isNaN(petId)) {
    throw new AppError("Некорректный ID питомца", 400);
  }

  const photos = req.files as Express.MulterS3.File[];

  if (!photos || photos.length === 0) {
    throw new AppError("Не передано ни одного фото", 400);
  }

  const addedPhotos = await photoService.addPhotos(petId, photos);

  res.status(201).json(addedPhotos);
});

export const deletePhoto = catchAsync(async (req, res) => {
  const id = Number(req.params.id);

  if (!id || Number.isNaN(id)) {
    throw new AppError("Некорректный ID фотографии", 400);
  }

  await photoService.deletePhoto(id);

  res.sendStatus(204);
});
