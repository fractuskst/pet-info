import createPetPhotosUpload from "@/middlewares/createPetPhotosUpload.middleware.js";
import { AppError } from "@/utils/AppError.js";
import { NextFunction, Request, Response } from "express";

const petPhotosUpload = (req: Request, res: Response, next: NextFunction) => {
  const petId = req.params.id;
  if (!petId) {
    return next(new AppError("ID питомца обязателен при загрузке фото"));
  }

  const upload = createPetPhotosUpload(petId);
  upload(req, res, next);
};

export default petPhotosUpload;
