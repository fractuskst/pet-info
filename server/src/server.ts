import express, { NextFunction } from "express";
import "dotenv/config";
import cors from "cors";

import { connectDB, initDB } from "./db/database.js";
import petsRouter from "./routes/pet.routes.js";
import photosRouter from "./routes/photo.routes.js";
import globalErrorHandler from "@/middlewares/globalErrorHandler.middleware.js";
import { AppError } from "@/utils/AppError.js";

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/pets", petsRouter);
app.use("/api/photos", photosRouter);

app.use((req, res, next) => {
  next(new AppError("Маршрут не найден", 404));
});

app.use(globalErrorHandler);

const startApp = async () => {
  try {
    await connectDB();
    await initDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Не удалось запустить сервер: ", err);
  }
};

startApp();
