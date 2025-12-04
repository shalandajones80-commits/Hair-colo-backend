// src/utils/parseJsonSafe.js
export function parseJsonSafe(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1));
      } catch (e2) {
        return { raw: text };
      }
    }
    return { raw: text };
  }
}
