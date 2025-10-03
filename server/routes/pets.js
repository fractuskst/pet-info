import express from "express";
import multer from "multer";
import fs from "fs";
import { DB } from "../db/database.js";

const MAX_PHOTOS_PER_PET = 10;

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

router.get("/:id/photos", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM pet_photos WHERE pet_id = ?";

  DB.all(sql, [id], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Не удалось загрузить фотографии питомца" });
    }
    res.status(200).json(rows);
  });
});

router.post("/:id/photos", upload.array("photos", MAX_PHOTOS_PER_PET), (req, res) => {
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

router.get("/", (req, res) => {
  const sql = "SELECT * FROM pets";

  DB.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Ошибка при получении списка питомцев:", err.message);
      return res.status(500).json({ message: "Не удалось загрузить питомцев" });
    }

    res.status(200).json(rows);
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM pets WHERE id = ?";

  DB.get(sql, [id], (err, row) => {
    if (err) {
      console.error("Ошибка при получении питомца:", err.message);
      return res.status(500).json({ message: "Не удалось загрузить питомца" });
    }

    if (!row) {
      return res.status(404).json({ message: "Питомец не найден" });
    }

    res.status(200).json(row);
  });
});

router.post("/", (req, res) => {
  const { user_id, name, type, birthDate, age, breed, favToys, description } = req.body;

  if (!name?.trim() || !type?.trim()) {
    return res.status(400).json({ message: "Имя и вид питомца обязательны" });
  }

  const sql = `
    INSERT INTO pets (user_id, name, type, birthDate, age, breed, favToys, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [user_id, name, type, birthDate, age, breed, favToys, description];

  DB.run(sql, params, function (err) {
    if (err) {
      console.error("Ошибка при добавлении питомца:", err.message);
      return res.status(500).json({ message: "Не удалось добавить питомца" });
    }

    const newPet = {
      id: this.lastID,
      user_id,
      name,
      type,
      birthDate,
      age,
      breed,
      favToys,
      description,
    };

    res.status(201).json(newPet);
  });
});

router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const allowedFields = ["name", "type", "birthDate", "age", "breed", "favToys", "description"];

  const filteredUpdates = Object.fromEntries(Object.entries(updates).filter(([key]) => allowedFields.includes(key)));

  if (Object.keys(filteredUpdates).length === 0) {
    return res.status(400).json({ message: "Нет полей для обновления" });
  }

  const fields = Object.keys(filteredUpdates)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = Object.values(filteredUpdates);

  const sql = `UPDATE pets SET ${fields} WHERE id = ?`;

  DB.run(sql, [...values, id], function (err) {
    if (err) {
      console.error("Ошибка при обновлении питомца:", err.message);
      return res.status(500).json({ message: "Не удалось обновить питомца" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: "Питомец не найден" });
    }

    DB.get("SELECT * FROM pets WHERE id = ?", [id], (err, row) => {
      if (err) {
        return res.status(500).json({ message: "Не удалось получить обновлённого питомца" });
      }
      res.status(200).json(row);
    });
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  DB.all("SELECT url FROM pet_photos WHERE pet_id = ?", [id], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Ошибка при получении фото" });
    }

    rows.forEach((row) => {
      const fileUrl = row.url;
      const filePath = fileUrl.replace(`${req.protocol}://${req.get("host")}`, ".");

      fs.unlink(filePath, (err) => {
        if (err) console.warn("Файл для удаления не найден:", filePath);
      });
    });
  });

  DB.run("DELETE FROM pets WHERE id = ?", [id], function (err) {
    if (err) {
      console.error("Ошибка при удалении питомца:", err.message);
      return res.status(500).json({ message: "Не удалось удалить питомца" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: "Питомец не найден" });
    }

    res.status(200).json({ message: "Питомец и его фото удалены" });
  });
});

export default router;
