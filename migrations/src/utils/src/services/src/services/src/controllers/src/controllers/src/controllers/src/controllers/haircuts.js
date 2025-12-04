// src/controllers/haircuts.js
import { supabaseAdmin } from "../db/supabaseClient.js";
import { callOpenAI } from "../services/openai.js";
import { parseJsonSafe } from "../utils/parseJsonSafe.js";

export async function generateHaircutHandler(req, res, next) {
  try {
    const { userId, clientId, style, faceShape, texture, lengthCurrent, preferences } = req.body;
    const system = "You are a senior stylist returning JSON only for haircut instructions.";
    const user = `
style: ${style}
faceShape: ${faceShape}
texture: ${texture}
lengthCurrent: ${lengthCurrent}
preferences: ${preferences || "none"}

Return JSON keys: title, summary, tools_needed (array), steps (array of {step_number, description, visuals_hint}), time_estimate_minutes, maintenance_tips.
`;

    const openaiResponse = await callOpenAI([{ role: "system", content: system }, { role: "user", content: user }]);
    const result = parseJsonSafe(JSON.stringify(openaiResponse));

    const { data, error } = await supabaseAdmin
      .from("haircut_guides")
      .insert([{ user_id: userId || null, client_id: clientId || null, style, face_shape: faceShape, steps: result }])
      .select()
      .single();

    if (error) console.error("Save haircut error", error);

    return res.json({ success: true, result, saved: !!data });
  } catch (err) {
    next(err);
  }
}
