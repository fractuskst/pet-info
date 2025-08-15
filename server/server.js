import express from "express";
import "dotenv/config";
import cors from "cors";
import path from "path";
import fs from "fs";

import { initDB } from "./db/database.js";
import petsRouter from "./routes/pets.js";

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/pets", petsRouter);

const startApp = async () => {
  try {
    initDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
};

startApp();
