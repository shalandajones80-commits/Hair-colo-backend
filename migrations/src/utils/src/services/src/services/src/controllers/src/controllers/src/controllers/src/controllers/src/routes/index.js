// src/routes/index.js
import express from "express";
import { generateFormulaHandler, listFormulas } from "../controllers/formulas.js";
import { createClient, getClient } from "../controllers/clients.js";
import { uploadPhotoHandler, uploadMiddleware } from "../controllers/photos.js";
import { generateHaircutHandler } from "../controllers/haircuts.js";

const router = express.Router();

router.post("/formulas/generate", generateFormulaHandler);
router.get("/formulas", listFormulas);

router.post("/clients", createClient);
router.get("/clients/:id", getClient);

router.post("/photos/upload", uploadMiddleware, uploadPhotoHandler);

router.post("/haircuts/generate", generateHaircutHandler);

export default router;
