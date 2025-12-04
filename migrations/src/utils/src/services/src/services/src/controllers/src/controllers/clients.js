// src/controllers/clients.js
import { supabaseAdmin } from "../db/supabaseClient.js";

export async function createClient(req, res, next) {
  try {
    const { userId, name, dob, notes } = req.body;
    const { data, error } = await supabaseAdmin
      .from("clients")
      .insert([{ user_id: userId, name, dob: dob || null, notes }])
      .select()
      .single();

    if (error) return res.status(500).json({ error });
    return res.status(201).json({ client: data });
  } catch (err) {
    next(err);
  }
}

export async function getClient(req, res, next) {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin.from("clients").select().eq("id", id).single();
    if (error) return res.status(404).json({ error: "Client not found" });
    return res.json({ client: data });
  } catch (err) {
    next(err);
  }
}
