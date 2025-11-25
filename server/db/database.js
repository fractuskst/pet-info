import sqlite3 from "sqlite3";

const sql3 = sqlite3.verbose();

export const DB = new sql3.Database(process.env.DB_PATH, (err) => {
  if (err) {
    console.error("Failed to connect to DB:", err.message);
    return;
  }
  console.log("Connected to the DB");
});

DB.run("PRAGMA foreign_keys = ON");

export const initDB = () => {
  // todo user_id not null
  const sqlPets = `
    CREATE TABLE IF NOT EXISTS pets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      name TEXT NOT NULL,
      type TEXT NOT NULL, 
      mainPhoto TEXT,
      birthDate INTEGER,
      age TEXT,
      breed TEXT,
      favToys TEXT,
      description TEXT
    )
  `;

  const sqlPhotos = `
  CREATE TABLE IF NOT EXISTS pet_photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    petId INTEGER NOT NULL,
    url TEXT NOT NULL,
    FOREIGN KEY (petId) REFERENCES pets(id) ON DELETE CASCADE
  )
`;

  DB.run(sqlPets, (err) => {
    if (err) {
      console.error("Error creating pets table:", err.message);
    } else {
      console.log("Pets table ready!");
    }
  });

  DB.run(sqlPhotos, (err) => {
    if (err) {
      console.error("Error creating pet_photos table:", err.message);
    } else {
      console.log("Pet photos table ready!");
    }
  });
};
