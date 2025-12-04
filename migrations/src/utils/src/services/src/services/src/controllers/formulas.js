// src/controllers/formulas.js
import { supabaseAdmin } from "../db/supabaseClient.js";
import { generateFormula } from "../services/openai.js";

export async function generateFormulaHandler(req, res, next) {
  try {
    const payload = req.body;
    const required = ["brand", "naturalLevel", "targetLevel", "percentGray", "porosity"];
    for (const r of required) if (!(r in payload)) return res.status(400).json({ error: `${r} required` });

    const openaiResult = await generateFormula(payload);

    const { data, error } = await supabaseAdmin
      .from("formulas")
      .insert({
        user_id: payload.userId || null,
        client_id: payload.clientId || null,
        brand: payload.brand,
        prompt: JSON.stringify(payload),
        result: openaiResult,
        generated_by: "gpt",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error", error);
    }

    return res.json({ success: true, result: openaiResult, saved: !!data });
  } catch (err) {
    next(err);
  }
}

export async function listFormulas(req, res, next) {
  try {
    const userId = req.query.userId;
    let q = supabaseAdmin.from("formulas").select().order("created_at", { ascending: false });
    if (userId) q = q.eq("user_id", userId);
    const { data, error } = await q;
    if (error) return res.status(500).json({ error });
    return res.json({ formulas: data });
  } catch (err) {
    next(err);
  }
}
