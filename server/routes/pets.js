import express from "express";
import { DB } from "../db/database.js";
import deleteFile from "../utils/deleteFile.js";

const router = express.Router();

router.get("/", (req, res) => {
  const sql = "SELECT * FROM pets";

  DB.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Не удалось загрузить питомцев" });
    }

    return res.status(200).json(rows);
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

    return res.status(200).json(row);
  });
});

router.post("/", (req, res) => {
  const { name, type, birthDate, age, breed, favToys, description } = req.body;

  if (!name?.trim() || !type?.trim()) {
    return res.status(400).json({ message: "Имя и вид питомца обязательны" });
  }

  const sql = `
    INSERT INTO pets ( name, type, birthDate, age, breed, favToys, description)
    VALUES ( ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [name, type, birthDate, age, breed, favToys, description];

  DB.run(sql, params, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Не удалось добавить питомца" });
    }

    DB.get("SELECT * FROM pets WHERE id = ?", [this.lastID], (err, row) => {
      if (err) {
        return res.status(500).json({ message: "Не удалось получить питомца" });
      }

      return res.status(201).json(row);
    });
  });
});

router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const allowed = ["name", "type", "mainPhoto", "birthDate", "age", "breed", "favToys", "description"];

  const keys = Object.keys(updates).filter((k) => allowed.includes(k));

  if (!keys.length) {
    return res.status(400).json({ message: "Нет валидных полей для обновления" });
  }

  const fields = keys.map((k) => `${k} = ?`).join(", ");
  const values = keys.map((k) => updates[k]);

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
      // todo - возвращать сообщение об успехе и обновленного питомца
      return res.status(200).json(row);
    });
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  DB.all("SELECT url FROM pet_photos WHERE petId = ?", [id], async (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Ошибка при получении фото" });
    }

    try {
      const deletions = rows.map((row) => {
        const { pathname } = new URL(row.url);
        const fileKey = pathname.slice(1);
        return deleteFile(fileKey);
      });

      await Promise.all(deletions);
    } catch (err) {
      return res.status(500).json({ message: "Ошибка при удалении файлов: " + err.message });
    }

    DB.run("DELETE FROM pets WHERE id = ?", [id], function (err) {
      if (err) {
        return res.status(500).json({ message: "Не удалось удалить питомца" });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: "Питомец не найден" });
      }

      return res.status(200).json({ message: "Питомец успешно удален!" });
    });
  });
});

export default router;
