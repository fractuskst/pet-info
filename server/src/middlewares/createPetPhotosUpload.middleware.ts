import multer from "multer";
import multerS3 from "multer-s3";
import s3 from "../config/s3.js";
import path from "path";
import { MAX_PHOTOS_PER_PET } from "@pet-info/shared/constants.js";
import { AppError } from "@/utils/AppError.js";

const createPetPhotosUpload = (petId: string) => {
  return multer({
    storage: multerS3({
      s3,
      bucket: process.env.BUCKET!,
      acl: "public-read",
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}-${petId}${ext}`;
        cb(null, filename);
      },
    }),
    limits: {
      fileSize: 5 * 1024 * 1024,
      files: MAX_PHOTOS_PER_PET,
    },
    fileFilter: (req, file, cb) => {
      const originalName = file.originalname.trim();
      const allowedMimes = ["image/jpeg", "image/png", "image/webp"];
      const allowedExts = /\.(jpe?g|png|webp)$/i;

      const isValidMime = allowedMimes.includes(file.mimetype);
      const isValidExt = allowedExts.test(originalName);

      if (isValidMime && isValidExt) {
        cb(null, true);
      } else {
        cb(new AppError("Неподдерживаемый формат изображения. Разрешены: JPG, PNG, WebP"));
      }
    },
  }).array("photos", MAX_PHOTOS_PER_PET);
};

export default createPetPhotosUpload;
