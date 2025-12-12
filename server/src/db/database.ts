import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

export let DB: Database;

export const connectDB = async () => {
  try {
    DB = await open({
      filename: process.env.DB_PATH!,
      driver: sqlite3.Database,
    });

    await DB.exec("PRAGMA foreign_keys = ON");
    console.log("Подключение к БД прошло успешно!");
  } catch (err) {
    console.log("При подключении к БД возникла ошибка ", err);
  }
};

export const initDB = async () => {
  if (!DB) throw new Error("DB не подключена");

  await DB.exec(`
    CREATE TABLE IF NOT EXISTS pets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL, 
      mainPhoto TEXT,
      birthDate INTEGER,
      age TEXT,
      breed TEXT,
      favToys TEXT,
      description TEXT
    )
  `);

  await DB.exec(`
  CREATE TABLE IF NOT EXISTS pet_photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    petId INTEGER NOT NULL,
    url TEXT NOT NULL,
    FOREIGN KEY (petId) REFERENCES pets(id) ON DELETE CASCADE
  )
`);

  console.log("Таблицы готовы!");
};
