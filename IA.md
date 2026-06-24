# Cart•AI - Final Design and Landing Page Architecture

This document collects the aesthetic design strategy, interface decisions, and technical modular structure agreed upon for the **Cart•AI** frontend.

---

## 1. Visual Identity and Design System

### Strict Color Palette

To avoid visual inconsistencies and ensure a clean integration with the brand assets, the following color scheme is defined:

- **Main Background (`#f8f9fa`):** The exact cream-bone tone extracted from the original logo. It is used throughout the landing page to merge the edges of the logo natively without resorting to opacity patches or complex color mixing.
- **Primary Color (`#0a192f`):** Deep navy blue (extracted from the "Cart" text). Guarantees maximum legibility in long texts, main headings, and structural components.
- **Accent Color (`#e85d04`):** Vibrant orange (extracted from the wheels and the dot of the logo). Its use is strictly restricted to critical interaction elements and Call to Action (CTA) buttons, ensuring they stand out immediately against the soft background.

### Typography

- **Headings and Titles:** `Urbanist` (a clean, modern, geometric sans-serif font).
- **Body and Descriptions:** `Lato` (a humanist font optimized for web legibility).

---

## 2. Graphic Asset Integration

### Logo Management (SVG Strategy)

- **Format:** Mandatory use of the vector version with transparent background to prevent scaling issues on high-density displays (Retina/4K).
- **Build Pipeline (Vite + TS):** Integration via `vite-plugin-svgr`. It imports and manipulates the SVG directly as a React component.
- **Automatic Cleanup:** Configured **SVGO** in `vite.config.ts` using the `removeElements` rule to automatically intercept and remove the `<ContainsAiGeneratedContent>` tag injected by AI generation tools. This prevents compilation reference errors (`ReferenceError`) without requiring manual file-by-file cleaning.

---

## 3. Modular Architecture (Feature-Driven)

To avoid an unmaintainable code monolith, the app layout is split using the Feature-Driven Development (**FDD**) pattern:

```text
src/
├── components/             # Global, reusable UI (no business state)
│   ├── ui/                 # Atomic components (Button, Input, Badge)
│   └── layout/             # Layout structural wrappers (Navbar, Footer, MainLayout)
├── features/               # Domains isolated by business logic
│   ├── landing/            # Landing page module (HeroSection, FeatureCard)
│   └── catalog/            # Catalog and shopping cart module
├── routes/                 # Navigation routing centralizer
│   └── index.tsx
├── App.tsx                 # Global providers initialization
└── main.tsx                # DOM entry point
```

---

# Frontend Development Status Summary: Cart•AI

This section details the current progress, architectural decisions, and the development roadmap to provide context for subsequent AI agent iterations.

## 1. Completed Milestones (Steps 1 to 13)

* **State & Logic Persistence**: Implemented cart persistence with Zustand and `localStorage` in `cartStore.ts`. Business logic (stock limits, total price calculations) is fully centralized in the store and decoupled from React components.
* **Layouts and Routing**: Created `MainLayout.tsx` as a persistent layout wrapper. Configured dynamic routing using `react-router-dom` to switch between the Landing Page (`/`) and Catalog Page (`/catalog`).
* **Service Abstraction (Async Mocks)**: Created `productService.ts` and `analyticsService.ts` simulating network latency with Promises to enable seamless backend integration.
* **Dynamic Styling (White-labeling)**:
  - Cleaned up static variables in `index.css` by removing the `:root` block.
  - Implemented an internal default theme in [theme-fallback.json](file:///Users/rober/work/CartAI-WEB/src/config/theme-fallback.json).
  - Provided support for user-defined overrides in [theme-custom.json](file:///Users/rober/work/CartAI-WEB/public/theme-custom.json).
  - Programmed `themeService.ts` to check runtime protocol safety (preventing CORS failures on `file://` or serverless SSR environments), fetch overrides asynchronously relative to `window.location.origin`, merge both themes, and inject them before React mounts in `main.tsx`.
* **Semantic Refactoring**: Refactored translation structures to rename the default i18next `t` alias to `translate` for semantic clarity across all components.

---

## 2. Immediate Roadmap (Next Step)

### Unit Testing Setup (Vitest)
The immediate next step is to configure and integrate the unit testing environment:
1. Install and configure `vitest` and `jsdom` devDependencies.
2. Initialize global test helpers in `setup.ts` to extend Matchers with `@testing-library/jest-dom`.
3. Implement test suites for:
   - `cartStore.ts`: Validate item additions, removals, stock boundaries, and total calculation.
   - `themeService.ts`: Verify default fallback injection and the dynamic resolution of client overrides.

---

## 3. Upcoming Critical Phase: Backend Integration

> [!IMPORTANT]
> **Tomorrow we integrate Cart•AI with the live production backend.**
> Mock services will be replaced with real HTTP requests to the backend APIs.
>
> **Backend priorities:**
> - Connect the React client with the actual server for the user **Login** and **Registration** flow.
> - Replace `productService.ts` calls with real REST/GraphQL queries to retrieve live product lists.
> - Connect the SVG analytics chart and dashboard metrics in `HeroSection.tsx` with live data feeds from the server.
