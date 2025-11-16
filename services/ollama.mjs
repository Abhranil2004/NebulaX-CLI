// services/ollama.mjs

/**
 * Call a local Ollama model (offline).
 * Default model: phi3 (good on most machines).
 *
 * @param {string} prompt - Full prompt text
 * @param {string} model - Ollama model name (default "phi3")
 * @returns {Promise<string>}
 */
export async function callOllama(prompt, model = "phi3") {
  const url = "http://localhost:11434/api/generate";

  const body = {
    model,
    prompt,
    stream: false,
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Ollama error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return (data.response || "").trim();
}
