# AI Studio Exporter | Obsidian Edition 🐺💎

> **God Mode for your Conversations.** Export Google AI Studio chats to MD, PDF, JSON, or TXT with a state-of-the-art interface.

---

## 💎 The "Pearl" Overhaul (v1.2.0)

This isn't just a tool; it's a premium experience. Designed by **Dana** for **The BlackWolf**, this exporter features a cutting-edge **Ultra-Dark Carbon Fiber** aesthetic with **Glassmorphism** overlays, making it the most sophisticated exporter for Google AI Studio.

### ✨ Key Features

- **Premium Design System**: Glassmorphism UI with internal shimmer effects, bold typography (Inter), and high-gloss controls.
- **Smart Data Extraction**: A self-contained heuristic engine that identifies user/model messages even in dynamic, obfuscated DOMs.
- **Reasoning Toggle**: Choose whether to include the model's "Thinking" blocks in your exports—perfect for Obsidian knowledge bases.
- **Multi-Format Support**:
  - **Markdown (.md)**: Optimized for Obsidian with proper syntax highlighting.
  - **PDF (.pdf)**: High-quality, client-side generated documents.
  - **JSON (.json)**: Structured raw data for developers.
  - **Plain Text (.txt)**: Quick, no-nonsense text dumps.
- **Connection Stability**: Built-in smart monitors to detect and fix communication gaps with the browser via a dedicated Refresh helper.

---

## 📸 UI Preview

<div align="center">
  <img src="assets/screenshots/main_ui.png" alt="Main Exporter UI" width="600px" />
  <p><i>The Ultra-Dark Carbon Fiber & Glassmorphism Interface</i></p>
</div>

---

## 🚀 Installation & Setup

Since this is a developer-grade tool, you'll load it as an unpacked extension:

1. **Build the extension**:

   ```bash
   npm install
   npm run build
   ```

2. **Open Extensions**: Navigate to `chrome://extensions/` in Google Chrome.
3. **Enable Developer Mode**: Toggle the switch in the top-right corner.
4. **Load Unpacked**: Click "Load unpacked" and select the **`dist`** folder inside this project directory.
5. **Activate**: Open [Google AI Studio](https://aistudio.google.com/) and **refresh the page** (F5).

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Bundler**: Vite (Multi-entry for Popup & Content Scripts)
- **Styling**: Tailwind CSS + Pure CSS Refinements
- **Icons**: Lucide React
- **Export Engines**: jsPDF & DOM-to-Text Heuristics

---

## 📜 Changelog

Check out the [changelog.md](changelog.md) for the full history of the **Pearl Overhaul** and recent architecture improvements.

---

<div align="center">
  <p><i>"Precision is not an act, it is a habit."</i></p>
  <p><b>Crafted with devotion for Bu Ajlan. 🖤✨</b></p>
</div>
