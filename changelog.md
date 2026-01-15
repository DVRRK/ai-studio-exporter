# Changelog - AI Studio Export (Obsidian Edition)

## [v1.2.0] - The Pearl Overhaul (God Mode)

**Architect:** Dana (Assistant to Bu Ajlan)
**Date:** 2026-01-15
**Status:** Performance & Aesthetics Optimized

### Premium UI Redesign 💎

- **Ultra-Dark Carbon Fiber Theme**: Implemented a custom micro-textured background system for a high-end, stealth look.
- **Glassmorphism Layers**: Added frosted-glass panels with 12px blur and subtle white/5 borders for depth and sophistication.
- **Glossy Gloss Components**:
  - Overhauled `Button` component with double-skews, shimmer animations, and internal gloss gradients.
  - Improved active/hover states with smooth scaling and glow effects.
- **Silver Wolf Typography**: Integrated Google Fonts (Inter) with heavy weights (900) for a bold, striking header.
- **Animated Status Bar**: Added reactive colors for loading (pulse), success (green glow), and error (red glass) states.

### Connection & Reliability Fixes ⚙️

- **Self-Contained Extraction Engine**: Completely refactored `content.ts` to be import-free. This ensures 100% compatibility with Chrome MV3's isolated world injection.
- **Smart Connection Monitoring**:
  - Implemented a "Receiving end does not exist" detector in the popup.
  - Added a "REFRESH NOW" button that triggers a script re-injection via page reload, eliminating "stuck" extension states.
- **Improved Injection Timing**: Updated `manifest.json` to use `document_start` and broader host permissions for faster activation.

### Build System & Infrastructure 🏗️

- **Project Restructuring**:
  - Created a `public/` directory to manage `manifest.json` and `icons`.
  - Automated asset copying during the Vite build process.
- **Tailwind/PostCSS Integration**:
  - Added missing `tailwind.config.js` and `postcss.config.js`.
  - Fixed the "pathetic UI" issue by ensuring styles are correctly bundled in the `dist` folder.
- **Code Hygiene**: Refined `index.css` to use standard CSS syntax for Tailwind directives, removing IDE linting errors while preserving full feature support.

### v1.1.0 - Security & Robustness Update (Legacy)

**Architect:** Kael (X-DYNAMIC Protocol)

- **Security:** Removed external CDN dependencies.
- **Stability:** Added `MutationObserver` to Content Script.
- **Heuristics:** Improved DOM traversal to prioritize ARIA roles.

### v1.0.0 - Initial Release (Legacy)

- **Feature:** Implemented `Manifest V3` architecture.
- **Feature:** Developed "Obsidian" UI theme.
- **Feature:** Export Engine supporting Markdown, PDF, JSON, and TXT.

---
*"Precision is not an act, it is a habit."*
