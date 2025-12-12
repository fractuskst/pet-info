import express from "express";
import * as photoController from "@/controllers/photo.controller.js";
import petPhotosUpload from "@/middlewares/petPhotosUpload.middleware.js";

const router = express.Router();

router.get("/:id", photoController.getPhotos);

router.post("/:id", petPhotosUpload, photoController.addPhotos);

router.delete("/:id", photoController.deletePhoto);

export default router;
