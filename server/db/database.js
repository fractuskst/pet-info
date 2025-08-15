import sqlite3 from "sqlite3";

const sql3 = sqlite3.verbose();

export const DB = new sql3.Database("./db/database.db", (err) => {
  if (err) {
    console.error("Failed to connect to DB:", err.message);
    return;
  }
  console.log("Connected to the DB");
});

export const initDB = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS pets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      type TEXT,
      owner TEXT,
      birthDate INTEGER,
      age TEXT,
      breed TEXT,
      favToys TEXT,
      description TEXT
    )
  `;

  DB.run(sql, (err) => {
    if (err) {
      console.error("Error creating pets table:", err.message);
    } else {
      console.log("Pets table ready!");
    }
  });
};
