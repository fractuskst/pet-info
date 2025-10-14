import express from "express";
import "dotenv/config";
import cors from "cors";

import { initDB } from "./db/database.js";
import petsRouter from "./routes/pets.js";
import photosRouter from "./routes/photos.js";

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.use("/pets", petsRouter);
app.use("/photos", photosRouter);

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
