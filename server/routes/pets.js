import express from "express";
import fs from "fs";
import { DB } from "../db/database.js";

const router = express.Router();

router.get("/", (req, res) => {
  const sql = "SELECT * FROM pets";

  DB.all(sql, [], (err, rows) => {
    if (err) {
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
      return res.status(500).json({ message: "Не удалось загрузить питомца" });
    }

    if (!row) {
      return res.status(404).json({ message: "Питомец не найден" });
    }

    res.status(200).json(row);
  });
});

router.post("/", (req, res) => {
  const { userId, name, type, birthDate, age, breed, favToys, description } = req.body;

  if (!name?.trim() || !type?.trim()) {
    return res.status(400).json({ message: "Имя и вид питомца обязательны" });
  }

  const sql = `
    INSERT INTO pets (userId, name, type, birthDate, age, breed, favToys, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [userId, name, type, birthDate, age, breed, favToys, description];

  DB.run(sql, params, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Не удалось добавить питомца" });
    }

    DB.get("SELECT * FROM pets WHERE id = ?", [this.lastID], (err, row) => {
      if (err) {
        return res.status(500).json({ message: "Не удалось получить питомца" });
      }

      res.status(201).json(row);
    });
  });
});

router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const fields = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(", ");

  const values = Object.values(updates);

  const sql = `UPDATE pets SET ${fields} WHERE id = ?`;

  DB.run(sql, [...values, id], function (err) {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Не удалось обновить питомца" });
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

  DB.all("SELECT url FROM pet_photos WHERE petId = ?", [id], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Ошибка при получении фото" });
    }

    DB.run("DELETE FROM pets WHERE id = ?", [id], function (err) {
      if (err) {
        return res.status(500).json({ message: "Не удалось удалить питомца" });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: "Питомец не найден" });
      }
    });

    rows.forEach((row) => {
      const fileUrl = row.url;
      const filePath = fileUrl.replace(`${req.protocol}://${req.get("host")}`, ".");

      fs.unlink(filePath, (err) => {
        if (err) console.warn("Файл для удаления не найден:", filePath);
      });
    });

    res.status(200).json({ message: "Питомец и его фото удалены" });
  });
});

export default router;
