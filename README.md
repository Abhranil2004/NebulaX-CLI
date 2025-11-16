# NebulaX CLI 💫

**NebulaX CLI** is an AI-powered command-line assistant built by **Abhranil Dutta**, powered by the **Google Gemini API**.  
It runs directly in your terminal and helps you with coding, explanations, writing, brainstorming and more.

> NebulaX CLI was created by Abhranil Dutta.  
> The underlying AI model (Gemini) is provided by Google.

---

## ✨ Features

- 🧠 Chat with an AI assistant directly from your terminal  
- 🔐 Interactive **API Key Manager**:
  - Enter API key at runtime  
  - Save API key to `.env`  
  - Update saved key  
  - Delete saved key  
  - “Always ask every time” mode  
- 🎨 Beautiful ASCII banner with gradient text  
- 🔁 Conversation history within the session  
- 🧩 Built on top of **@google/genai** (Gemini API)

---
## 🖼 NebulaX Screenshots

### 🔹 CLI Interface
![NebulaX CLI](https://github.com/Abhranil2004/NebulaX-CLI/blob/general/screenshort/4.png)<br>
![NebulaX CLI](https://github.com/Abhranil2004/NebulaX-CLI/blob/general/screenshort/1.png)<br>
![NebulaX CLI](https://github.com/Abhranil2004/NebulaX-CLI/blob/general/screenshort/2.png)<br>
![NebulaX CLI](https://github.com/Abhranil2004/NebulaX-CLI/blob/general/screenshort/3.png)
---
## 🚀 Installation

### 1. Install globally from NPM

```bash
npm install -g nebulax-ai@latest
````

> Make sure you have **Node.js v18+** installed.

---

## 🧑‍💻 Usage

After global install, just run:

```bash
nebulax
```

You’ll see the **API Key Manager**:

```text
🔐 NebulaX API Key Manager – choose an option:

1️⃣  Enter API Key Now
2️⃣  Use Saved API Key            (only if one exists)
3️⃣  Update Saved API Key         (only if one exists)
4️⃣  Delete Saved API Key         (only if one exists)
5️⃣  Always Ask Every Time
```

Then NebulaX will ask:

```text
Do you want NebulaX to save this API key for future? (Y/n)
```

After that, you’ll get the chat prompt:

```text
Welcome to NebulaX CLI. Type your query.
Type 'exit' to quit.

You > 
```

Examples:

```text
You > explain operating system deadlock in simple terms
You > write a Node.js script to read a JSON file
You > help me write a professional email for internship
You > generate a study plan for 7 days for my exam
```

Exit anytime with:

```text
You > exit
```

# 🌐 **ONLINE MODE (Default)**

To use NebulaX with the Gemini API:

### 1. Create a Gemini API Key

Get it from:

👉 [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

### 2. Run NebulaX

NebulaX will automatically ask:

* Enter API Key
* Save / Use once / Update / Delete

After that, the online engine works instantly.

---

# 🟩 **OFFLINE MODE (NO INTERNET REQUIRED)**

NebulaX includes a full offline mode using **Ollama**, allowing complete usage without internet.

---

# 🔧 **Step-by-Step Offline Setup**

### ✅ Step 1 — Install Ollama

Download from:

👉 [https://ollama.com/download](https://ollama.com/download)

### ✅ Step 2 — Confirm installation

```bash
ollama --version
```

### ✅ Step 3 — Pull a Local Model

NebulaX uses **phi3** by default:

```bash
ollama pull phi3
```

You may choose other models:

```bash
ollama pull llama3
ollama pull mistral
```

### ✅ Step 4 — Run NebulaX in Offline Mode

```bash
nebulax
```

Select:

```
2️⃣  Offline (Local LLM via Ollama)
```

NebulaX now works fully offline.

---

# 🧠 **Offline Mode Supports:**

✔ Chat
✔ Explanations
✔ Notes
✔ General AI assistance
✔ No internet required
✔ Uses your local system resources (CPU/GPU)

---

# 🎯 **If User Wants Offline Only**

Tell them:

```
Install Ollama → Pull a model → Run NebulaX → Choose Offline Mode
```

---


## 🔑 API Key (Google Gemini)

NebulaX uses the **Google Gemini API** via `@google/genai`.

1. Go to **Google AI Studio** and create an API key
2. Use that key when NebulaX asks: `Enter your GOOGLE_API_KEY:`
3. If you choose to save it, NebulaX stores it in a local `.env` file as:

```env
GOOGLE_API_KEY=your_key_here
```

You can later:

* Use the saved key
* Update it
* Delete it
* Or choose “always ask” mode

---

## 🏗 Tech Stack

* **Language:** Node.js (ESM modules)
* **AI:** Google Gemini (via `@google/genai`)
* **CLI UX:** `chalk`, `inquirer`, `ora`
* **Banner:** `figlet` + `gradient-string`
* **Config:** `.env` for API key (optional)

Main files:

* `cli.mjs` → main CLI logic + API key manager + AI chat loop
* `utils/banner.mjs` → NebulaX ASCII banner
* `utils/spinner.mjs` → loading spinner for AI responses

---

## 🧩 Scripts

From local clone:

```bash
# Run NebulaX locally (without global install)
node cli.mjs

# Or, if you add this in package.json:
npm run start
```

For global dev testing:

```bash
npm link      # register as global CLI
nebulax       # run from anywhere
```

---

## 🧑‍🎨 Credits

**Author / Developer:** [Abhranil Dutta](https://abhranil-dutta.netlify.app/)

* Built NebulaX CLI
* Integrated Gemini API
* Designed the CLI experience and identity

**AI Model:**

* Powered by **Google Gemini** via `@google/genai`.

---

## 🛠 Roadmap / Ideas

* `nebulax notes <topic>` → exam-ready notes
* `nebulax code <task>` → coding helper
* `nebulax explain <topic>` → simple explanations for students
* Add command history export
* Add config command: `nebulax config`

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch: `feature/your-feature-name`
3. Commit your changes
4. Open a Pull Request

Bug reports and feature requests are welcome via **Issues**.
