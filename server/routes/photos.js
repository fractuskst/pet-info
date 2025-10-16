import express from "express";
import multer from "multer";
import fs from "fs";
import { DB } from "../db/database.js";
import { MAX_PHOTOS_PER_PET } from "../../shared/constants.js";

const router = express.Router();

const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname), //todo owner_name/owner_id + pet_name + photo_number
});

const upload = multer({ storage });

router.get("/:id", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM pet_photos WHERE pet_id = ?";

  DB.all(sql, [id], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Не удалось загрузить фотографии питомца" });
    }
    res.status(200).json(rows);
  });
});

router.post("/:id", upload.array("photos", MAX_PHOTOS_PER_PET), (req, res) => {
  const { id } = req.params;

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "Файлы не загружены" });
  }

  DB.get("SELECT COUNT(*) as count from pet_photos WHERE pet_id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ message: "Ошибка при проверке количества фото" });
    }

    const currentCount = row.count;
    const freeSlots = MAX_PHOTOS_PER_PET - currentCount;

    if (freeSlots <= 0) {
      req.files.forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) console.error("Не удалось удалить лишний файл:", file.filename);
        });
      });
      return res.status(400).json({ message: "У этого питомца уже 10 фото" });
    }

    const filesToSave = req.files.slice(0, freeSlots);
    const ignoredFiles = req.files.slice(freeSlots);

    ignoredFiles.forEach((file) => {
      fs.unlink(file.path, (err) => {
        if (err) console.error("Не удалось удалить лишний файл:", file.filename);
      });
    });

    const urls = filesToSave.map((file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`);

    const sql = "INSERT INTO pet_photos (pet_id, url) VALUES (?, ?)";
    const stmt = DB.prepare(sql);

    const addedPhotos = [];

    urls.forEach((url) => {
      stmt.run(id, url, function () {
        addedPhotos.push({ id: this.lastID, pet_id: id, url });
      });
    });

    stmt.finalize((err) => {
      if (err) return res.status(500).json({ message: "Не удалось сохранить фото" });

      res.status(201).json(addedPhotos);
    });
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const { url } = req.body;

  const filePath = url.replace(`${req.protocol}://${req.get("host")}`, ".");

  DB.run("DELETE FROM pet_photos WHERE pet_id = ? AND url = ?", [id, url], (err) => {
    if (err) {
      return res.status(500).json({ message: "Не удалось удалить фото" });
    }

    fs.unlink(filePath, (err) => {
      if (err) console.warn("Файл для удаления не найден:", filePath);
    });

    res.status(200).json({ message: "Фото успешно удалено" });
  });
});

export default router;
