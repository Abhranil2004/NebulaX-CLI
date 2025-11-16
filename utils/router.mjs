import { generateWebTool } from "../tools/generateWeb.mjs";
import { generateCodeTool } from "../tools/generateCode.mjs";
import { generateDocsTool } from "../tools/generateDocs.mjs";

export async function routeCommand(text, engine) {
  const lower = text.toLowerCase();

  if (lower.includes("build webpage") || lower.includes("create website")) {
    return generateWebTool(engine, text);
  }

  if (lower.includes("write code") || lower.includes("python code") || lower.includes("build api")) {
    return generateCodeTool(null, null, text, engine);
  }

  if (lower.includes("document") || lower.includes("readme")) {
    return generateDocsTool(engine, text);
  }

  return null;
}
