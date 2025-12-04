// src/services/openai.js
import fetch from "cross-fetch";
import dotenv from "dotenv";
import { parseJsonSafe } from "../utils/parseJsonSafe.js";
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) console.warn("OPENAI_API_KEY not set in .env");

export async function generateFormulaPromptPayload(inputs) {
  const system = `You are a professional salon colorist. Return ONLY JSON representing a safe, practical color formula.`;
  const user = `
Inputs:
brand: ${inputs.brand}
natural_level: ${inputs.naturalLevel}
target_level: ${inputs.targetLevel}
percent_gray: ${inputs.percentGray}
porosity: ${inputs.porosity}
previous_color: ${inputs.previousColor || "none"}
desired_tone: ${inputs.desiredTone || "neutral"}
time_since_last_service: ${inputs.time_since_last_service || "unknown"}

Rules:
1) Return only valid JSON.
2) Keys: base_shade, developer_strength, ratio, additives, application_steps (array), warnings (array), explanation_short.
3) Use brand shade names if known; otherwise use numeric/neutral descriptors.
4) If porosity is 'high', recommend bond-builder additive and a strand test.
`;

  return { system, user };
}

export async function callOpenAI(messages, model = "gpt-4o-mini", max_tokens = 700, temperature = 0.1) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens,
      temperature,
      n: 1,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${txt}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content ?? data.choices?.[0]?.text;
  return parseJsonSafe(text);
}

export async function generateFormula(inputs) {
  const prompts = await generateFormulaPromptPayload(inputs);
  const messages = [
    { role: "system", content: prompts.system },
    { role: "user", content: prompts.user },
  ];
  const result = await callOpenAI(messages);
  return result;
}
