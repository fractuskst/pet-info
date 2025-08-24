import express from "express";
import { DB } from "../db/database.js";

const router = express.Router();

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
  const { name, type, owner, birthDate, age, breed, favToys, description } =
    req.body;

  if (!name?.trim() || !type?.trim()) {
    return res.status(400).json({ message: "Имя и вид питомца обязательны" });
  }

  const sql = `
    INSERT INTO pets (name, type, owner, birthDate, age, breed, favToys, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    name,
    type,
    owner,
    birthDate,
    age,
    breed,
    favToys,
    description,
  ];

  DB.run(sql, params, function (err) {
    if (err) {
      console.error("Ошибка при добавлении питомца:", err.message);
      return res.status(500).json({ message: "Не удалось добавить питомца" });
    }

    const newPet = {
      id: this.lastID,
      name,
      type,
      owner,
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

  const allowedFields = [
    "name",
    "type",
    "owner",
    "birthDate",
    "age",
    "breed",
    "favToys",
    "description",
  ];

  const filteredUpdates = Object.fromEntries(
    Object.entries(updates).filter(([key]) => allowedFields.includes(key)),
  );

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
        return res
          .status(500)
          .json({ message: "Не удалось получить обновлённого питомца" });
      }
      res.status(200).json(row);
    });
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM pets WHERE id=?`;

  DB.run(sql, [id], function (err) {
    if (err) {
      console.error("Ошибка при удалении питомца:", err.message);
      return res.status(500).json({ message: "Не удалось удалить питомца" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: "Питомец не найден" });
    }

    res.status(200).json({ message: "Питомец успешно удалён" });
  });
});

export default router;
