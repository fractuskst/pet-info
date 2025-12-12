import * as petService from "@/services/pet.service.js";
import { AppError } from "@/utils/AppError.js";
import { catchAsync } from "@/utils/catchAsync.js";

export const getPets = catchAsync(async (req, res) => {
  const pets = await petService.getPets();

  res.status(200).json(pets);
});

export const getPet = catchAsync(async (req, res) => {
  const id = Number(req.params.id);

  if (!id || Number.isNaN(id)) {
    throw new AppError("Некорректный ID питомца", 400);
  }

  const pet = await petService.getPet(id);

  res.status(200).json(pet);
});

export const createPet = catchAsync(async (req, res) => {
  if (!req.body || typeof req.body !== "object") {
    throw new AppError("Некорректные данные питомца", 400);
  }

  const pet = await petService.createPet(req.body);

  res.status(201).json(pet);
});

export const updatePet = catchAsync(async (req, res) => {
  const id = Number(req.params.id);

  if (!id || Number.isNaN(id)) {
    throw new AppError("Некорректный ID питомца", 400);
  }

  const pet = await petService.updatePet(id, req.body);

  res.status(200).json(pet);
});

export const deletePet = catchAsync(async (req, res) => {
  const id = Number(req.params.id);

  if (!id || Number.isNaN(id)) {
    throw new AppError("Некорректный ID питомца", 400);
  }

  await petService.deletePet(id);

  res.sendStatus(204);
});
