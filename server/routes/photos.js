import express from "express";
import upload from "../middlewares/upload.js";
import { DB } from "../db/database.js";
import { MAX_PHOTOS_PER_PET } from "../../shared/constants.js";
import deleteFile from "../utils/deleteFile.js";

const router = express.Router();

router.get("/:id", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM pet_photos WHERE petId = ?";

  DB.all(sql, [id], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Не удалось загрузить фотографии питомца" });
    }
    return res.status(200).json(rows);
  });
});

router.post("/:id", upload.array("photos", MAX_PHOTOS_PER_PET), (req, res) => {
  const { id } = req.params;

  DB.get("SELECT COUNT(*) as count from pet_photos WHERE petId = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ message: "Ошибка при проверке количества фото" });
    }

    const currentCount = row.count;
    const freeSlots = MAX_PHOTOS_PER_PET - currentCount;

    if (freeSlots <= 0) {
      return res.status(400).json({ message: "Достигнут лимит фотографий" });
    }

    const filesToSave = req.files.slice(0, freeSlots);

    const sql = "INSERT INTO pet_photos (petId, url) VALUES (?, ?)";
    const stmt = DB.prepare(sql);
    const addedPhotos = [];

    let pending = filesToSave.length;

    filesToSave.forEach((file) => {
      const url = file.location;

      stmt.run([id, url], function () {
        if (err) {
          console.error("Ошибка вставки фото", err);
        } else {
          addedPhotos.push({ id: this.lastID, petId: id, url });
        }

        pending--;
        if (pending === 0) {
          stmt.finalize((err) => {
            if (err) {
              return res.status(500).json({ message: "Не удалось сохранить фото" });
            }
            return res.status(201).json(addedPhotos);
          });
        }
      });
    });
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const { url } = req.body;

  const { pathname } = new URL(url);
  const fileKey = pathname.slice(1);

  DB.run("DELETE FROM pet_photos WHERE petId = ? AND url = ?", [id, url], async (err) => {
    if (err) {
      return res.status(500).json({ message: "Не удалось удалить фото из БД" });
    }

    try {
      await deleteFile(fileKey);
    } catch (err) {
      return res.status(500).json({ message: "Не удалось удалить фото в S3 хранилище" });
    }

    return res.status(200).json({ message: "Фото успешно удалено" });
  });
});

export default router;
