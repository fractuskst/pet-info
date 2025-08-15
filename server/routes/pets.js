import express from "express";
import { DB } from "../db/database.js";

const router = express.Router();

router.get("/", (req, res) => {
  const sql = "SELECT * FROM pets";

  DB.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching pets:", err.message);
      return res.status(500).json({ error: "Failed to fetch pets" });
    }

    res.status(200).json(rows);
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM pets WHERE id = ?";

  DB.get(sql, [id], (err, row) => {
    if (err) {
      console.error("Error fetching pet:", err.message);
      return res.status(500).json({ error: "Failed to fetch pet" });
    }

    if (!row) {
      return res.status(404).json({ error: "Pet not found" });
    }

    res.status(200).json(row);
  });
});

router.post("/", (req, res) => {
  const { name, type, owner, birthDate, age, breed, favToys, description } =
    req.body;

  if (!name.trim() || !type.trim()) {
    return res.status(400).json({ error: "Name and type are required" });
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
      console.error("Error adding pet:", err.message);
      return res.status(500).json({ error: "Failed to add pet" });
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
    return res.status(400).json({ error: "No valid fields to update" });
  }

  const fields = Object.keys(filteredUpdates)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = Object.values(filteredUpdates);

  const sql = `UPDATE pets SET ${fields} WHERE id = ?`;

  DB.run(sql, [...values, id], function (err) {
    if (err) {
      console.error("Error updating pet:", err.message);
      return res.status(500).json({ error: "Failed to update pet" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Pet not found" });
    }

    DB.get("SELECT * FROM pets WHERE id = ?", [id], (err, row) => {
      if (err)
        return res.status(500).json({ error: "Failed to fetch updated pet" });
      res.status(200).json(row);
    });
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM pets WHERE id=?`;

  DB.run(sql, [id], function (err) {
    if (err) {
      console.error("Error deleting pet:", err.message);
      return res.status(500).json({ error: "Failed to delete pet" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Pet not found" });
    }

    res.status(200).json({ message: "Pet deleted successfully" });
  });
});

export default router;
