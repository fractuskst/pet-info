import express from "express";
import { DB } from "../db/database.js";

const router = express.Router();

router.get("/pets", (req, res) => {
  const sql = "SELECT * FROM pets";

  DB.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching pets:", err.message);
      return res.status(500).json({ error: "Failed to fetch pets" });
    }
    res.json(rows);
  });
});

router.post("/pets", (req, res) => {
  const { name, type, owner, birthDate, breed, favToys, description } =
    req.body;

  if (!name || !type) {
    return res.status(400).json({ error: "Name and type are required" });
  }

  const sql = `
    INSERT INTO pets (name, type, owner, birthDate, breed, favToys, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [name, type, owner, birthDate, breed, favToys, description];

  DB.run(sql, params, function (err) {
    if (err) {
      console.error("Error adding pet:", err.message);
      return res.status(500).json({ error: "Failed to add pet" });
    }
    res
      .status(201)
      .json({ id: this.lastID, message: "Pet added successfully" });
  });
});

router.patch("/pets/:id", (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  const fields = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = Object.values(updates);

  const sql = `UPDATE pets SET ${fields} WHERE id = ?`;

  DB.run(sql, [...values, id], function (err) {
    if (err) {
      console.error("Error updating pet:", err.message);
      return res.status(500).json({ error: "Failed to update pet" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Pet not found" });
    }

    res.status(200).json({ message: "Pet updated successfully" });
  });
});

router.delete("/pets/:id", (req, res) => {
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
