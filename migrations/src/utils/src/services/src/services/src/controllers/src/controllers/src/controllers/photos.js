// src/controllers/photos.js
import multer from "multer";
import { uploadToCloudinary } from "../services/storage.js";
import { supabaseAdmin } from "../db/supabaseClient.js";

const upload = multer({ storage: multer.memoryStorage() });

export const uploadMiddleware = upload.single("photo");

export async function uploadPhotoHandler(req, res, next) {
  try {
    const file = req.file;
    const { clientId, type } = req.body;
    if (!file) return res.status(400).json({ error: "photo file required" });

    const url = await uploadToCloudinary(file.buffer, file.originalname);
    const { data, error } = await supabaseAdmin
      .from("photos")
      .insert([{ client_id: clientId, url, type }])
      .select()
      .single();

    if (error) return res.status(500).json({ error });

    return res.status(201).json({ photo: data });
  } catch (err) {
    next(err);
  }
}
