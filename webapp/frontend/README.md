# Frontend — Veracity.ai

A React + TypeScript single-page app that visualizes veracity predictions from
the backend API. Built with Vite, Tailwind CSS, Recharts, and Framer Motion.

## Structure

```
frontend/
├── public/
│   ├── favicon.svg
│   └── Rahul_Mishra_453_P4_Final_Report.pdf   # linked from the footer
├── src/
│   ├── App.tsx                 # Layout + state orchestration
│   ├── components/
│   │   ├── Navbar.tsx          # Sticky header, theme toggle, GitHub link
│   │   ├── Hero.tsx
│   │   ├── Analyzer.tsx        # Statement input + metadata toggle
│   │   ├── ResultPanel.tsx     # Confidence gauge + probability chart
│   │   ├── MetricsStrip.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Footer.tsx          # Final Report (PDF) + Source code links
│   │   ├── Background.tsx
│   │   └── Reveal.tsx
│   ├── hooks/useTheme.ts       # Light/dark theme with persistence
│   ├── lib/
│   │   ├── api.ts              # Typed API client
│   │   ├── constants.ts        # Label palette, parties, examples
│   │   └── site.ts             # GITHUB_URL + REPORT_URL
│   └── types.ts
└── vite.config.ts
```

## Run locally

```bash
npm install
npm run dev          # http://localhost:5173
```

The dev server expects the backend at `http://127.0.0.1:8000`. Override with an
`.env.local` file:

```
VITE_API_URL=http://127.0.0.1:8000
```

## Configuration

- **Backend URL** — `VITE_API_URL` (build-time env variable).
- **GitHub + report links** — edit `src/lib/site.ts`.

## Build

```bash
npm run build        # outputs to dist/
npm run preview      # preview the production build
```

## Features

- Six-class veracity prediction with an animated confidence gauge
- Gradient probability bar chart (Recharts) with a custom readable tooltip
- Optional speaker-metadata fusion toggle
- Light/dark theme (persisted, respects OS preference)
- Fully responsive (mobile + desktop)
- Footer links to the final report PDF and the source repository
