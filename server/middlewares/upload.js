import multer from "multer";
import multerS3 from "multer-s3";
import s3 from "../config/s3.js";
import path from "path";

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.BUCKET,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const petId = req.params.id;
      const ext = path.extname(file.originalname);
      const filename = `${Date.now()}-${petId}${ext}`;
      cb(null, filename);
    },
  }),
});

export default upload;
