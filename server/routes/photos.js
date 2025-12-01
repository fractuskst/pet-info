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
    res.status(200).json(rows);
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

    const filesToSave = req.files.slice(0, freeSlots);

    const sql = "INSERT INTO pet_photos (petId, url) VALUES (?, ?)";
    const stmt = DB.prepare(sql);

    const addedPhotos = [];

    filesToSave.forEach((file) => {
      const url = file.location;
      stmt.run(id, url, function () {
        addedPhotos.push({ id: this.lastID, petId: id, url });
      });
    });

    stmt.finalize((err) => {
      if (err) return res.status(500).json({ message: "Не удалось сохранить фото" });

      res.status(201).json(addedPhotos);
    });
  });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { url } = req.body;

  const { pathname } = new URL(url);
  const fileKey = pathname.slice(1);
  try {
    await deleteFile(fileKey);

    DB.run("DELETE FROM pet_photos WHERE petId = ? AND url = ?", [id, url], (err) => {
      if (err) {
        return res.status(500).json({ message: "Не удалось удалить фото" });
      }

      res.status(200).json({ message: "Фото успешно удалено" });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
