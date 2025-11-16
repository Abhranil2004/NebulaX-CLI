#!/usr/bin/env node

import "dotenv/config";
import chalk from "chalk";
import inquirer from "inquirer";
import fs from "fs";
import { showBanner } from "./utils/banner.mjs";
import { createSpinner } from "./utils/spinner.mjs";
import { callGemini } from "./services/gemini.mjs";
import { callOllama } from "./services/ollama.mjs";

const ENV_PATH = "./.env";
let MODE = "online"; // "online" | "offline"

// =======================================================
// API KEY UTILITIES (used only in ONLINE mode)
// =======================================================
function readSavedKey() {
  if (!fs.existsSync(ENV_PATH)) return null;
  const content = fs.readFileSync(ENV_PATH, "utf8");
  const match = content.match(/GOOGLE_API_KEY=(.*)/);
  return match ? match[1].trim() : null;
}

function saveKey(key) {
  fs.writeFileSync(ENV_PATH, `GOOGLE_API_KEY=${key.trim()}`);
}

function deleteKey() {
  if (fs.existsSync(ENV_PATH)) fs.unlinkSync(ENV_PATH);
}

async function apiKeyMenu() {
  const savedKey = readSavedKey();

  const choices = ["1️⃣  Enter API Key Now"];

  if (savedKey) {
    choices.push("2️⃣  Use Saved API Key");
    choices.push("3️⃣  Update Saved API Key");
    choices.push("4️⃣  Delete Saved API Key");
  }

  const { choice } = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: chalk.cyan("🔐 NebulaX API Key Manager – choose an option:"),
      choices,
    },
  ]);

  if (choice.startsWith("1")) {
    const { key } = await inquirer.prompt([
      { type: "input", name: "key", message: chalk.green("Enter your GOOGLE_API_KEY:") },
    ]);
    return key.trim();
  }

  if (choice.startsWith("2")) {
    return savedKey;
  }

  if (choice.startsWith("3")) {
    const { newKey } = await inquirer.prompt([
      { type: "input", name: "newKey", message: chalk.yellow("Enter new GOOGLE_API_KEY:") },
    ]);
    saveKey(newKey);
    console.log(chalk.green("\n✔ Saved API Key updated.\n"));
    return newKey.trim();
  }

  if (choice.startsWith("4")) {
    deleteKey();
    console.log(chalk.red("\n🗑️ Saved API Key deleted.\n"));
    const { key } = await inquirer.prompt([
      { type: "input", name: "key", message: chalk.green("Enter new GOOGLE_API_KEY:") },
    ]);
    return key.trim();
  }
}

// =======================================================
// MODE SELECTION
// =======================================================
async function chooseMode() {
  const { mode } = await inquirer.prompt([
    {
      type: "list",
      name: "mode",
      message: chalk.cyan("🌐 Choose NebulaX Mode:"),
      choices: [
        "1️⃣  Online (Gemini API)",
        "2️⃣  Offline (Local LLM via Ollama)",
      ],
    },
  ]);

  if (mode.startsWith("1")) MODE = "online";
  else MODE = "offline";
}

// =======================================================
// SYSTEM / IDENTITY PROMPT
// =======================================================
const SYSTEM = `
You are NebulaX, an advanced AI-powered command-line application.

IDENTITY RULES:
1. NebulaX CLI was created, designed, and developed by **Abhranil Dutta**.
2. NebulaX CLI is NOT a Google product.
3. The AI model underneath (Gemini, when in online mode) is created by Google, but the CLI tool is created by **Abhranil Dutta**.
4. When someone asks "Who created you?" interpret "you" as NebulaX CLI unless they explicitly refer to "Gemini" or "LLM".
5. Never say: "I was created by Google."
6. Always answer clearly:
   “NebulaX CLI was created by Abhranil Dutta, and I run on AI models such as Google Gemini (online) or local models (offline).”
`;

// Chat history (used for both modes)
const history = [];

// =======================================================
// HELPERS: BUILD CONTENTS / PROMPTS
// =======================================================
function buildGeminiContents(userText) {
  const contents = [];

  for (const m of history) {
    contents.push({
      role: m.role,
      parts: [{ text: m.text }],
    });
  }

  contents.push({
    role: "user",
    parts: [{ text: userText }],
  });

  return contents;
}

function buildOllamaPrompt(userText) {
  let conversation = "";

  for (const m of history) {
    const tag = m.role === "user" ? "User" : "NebulaX";
    conversation += `${tag}: ${m.text}\n`;
  }

  return `
${SYSTEM}

Conversation so far:
${conversation}

User: ${userText}
NebulaX:`;
}

// =======================================================
// MAIN QUERY FUNCTION (HYBRID)
// =======================================================
async function queryAI(prompt) {
  const spinner = createSpinner(
    MODE === "online" ? "NebulaX (online) is thinking..." : "NebulaX (offline) is thinking..."
  );
  spinner.start();

  try {
    if (MODE === "online") {
      const injectedPrompt = `
User question: ${prompt}

IDENTITY OVERRIDE:
NebulaX CLI was built by **Abhranil Dutta**.
Do NOT say you were created by Google.
You may mention that you use the Gemini model by Google when in online mode.
      `;

      const contents = buildGeminiContents(injectedPrompt);
      const reply = await callGemini(contents, SYSTEM);
      spinner.stop();
      return reply || chalk.red("No response from Gemini.");
    } else {
      const ollamaPrompt = buildOllamaPrompt(prompt);
      const reply = await callOllama(ollamaPrompt, "phi3");
      spinner.stop();
      return reply || chalk.red("No response from local model.");
    }
  } catch (err) {
    spinner.stop();
    return chalk.red("Error: " + (err.message || err));
  }
}

// =======================================================
// ENTRYPOINT
// =======================================================
async function startCLI() {
  console.clear();
  showBanner();

  await chooseMode();

  if (MODE === "online") {
    const key = await apiKeyMenu();
    if (!key) {
      console.log(chalk.red("❌ No API key provided. Exiting."));
      process.exit(1);
    }
    process.env.GOOGLE_API_KEY = key;

    const { saveChoice } = await inquirer.prompt([
      {
        type: "confirm",
        name: "saveChoice",
        message: "Do you want NebulaX to save this API key for future?",
        default: true,
      },
    ]);

    if (saveChoice) {
      saveKey(key);
      console.log(chalk.green("\n✔ API Key saved.\n"));
    } else {
      console.log(chalk.yellow("\n⚠ Using this key only for this session.\n"));
    }
  } else {
    console.log(
      chalk.green(
        "\n✔ Offline mode enabled. Make sure Ollama is running and the 'phi3' model is pulled.\n"
      )
    );
  }

  console.log(
    chalk.gray(
      `Mode: ${MODE === "online" ? "Online (Gemini)" : "Offline (Ollama - phi3)"}\nType 'exit' to quit.\n`
    )
  );

  while (true) {
    const { message } = await inquirer.prompt([
      { type: "input", name: "message", message: chalk.cyan("You >") },
    ]);

    const text = message.trim();
    if (!text) continue;

    if (["exit", "quit", "bye"].includes(text.toLowerCase())) {
      console.log(chalk.yellow("\n👋 Goodbye from NebulaX.\n"));
      process.exit(0);
    }

    history.push({ role: "user", text });

    const reply = await queryAI(text);

    history.push({ role: "model", text: reply });

    console.log(chalk.magenta("\nNebulaX >"));
    console.log(reply + "\n");
  }
}

startCLI();
