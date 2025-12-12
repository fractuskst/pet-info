import express from "express";
import * as petController from "@/controllers/pet.controller.js";
const router = express.Router();

router.get("/", petController.getPets);

router.get("/:id", petController.getPet);

router.post("/", petController.createPet);

router.patch("/:id", petController.updatePet);

router.delete("/:id", petController.deletePet);

export default router;
