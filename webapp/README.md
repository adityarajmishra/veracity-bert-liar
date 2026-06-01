# Veracity.ai — Misinformation Detection (Monorepo)

A full-stack application for fine-grained veracity classification of political
statements, built on a fine-tuned BERT model and the LIAR benchmark.

- **Backend** — FastAPI inference service (`backend/`)
- **Frontend** — React + TypeScript SPA (`frontend/`)

## Quick start (one command)

From this `webapp/` directory:

```bash
npm run install:all     # installs root, frontend, and backend dependencies
npm run dev             # runs backend (:8000) AND frontend (:5173) together
```

Then open <http://localhost:5173>. The status pill in the header turns green
once the backend model has loaded.

> The backend loads trained weights from the project `models/` directory. If
> they are not present, run the notebook (`../notebook`) to generate them.

## Scripts

| Script | Action |
| --- | --- |
| `npm run install:all` | Install all dependencies (root + frontend + backend) |
| `npm run dev` | Run backend and frontend concurrently |
| `npm run dev:backend` | Backend only (uvicorn, port 8000) |
| `npm run dev:frontend` | Frontend only (Vite, port 5173) |
| `npm run build` | Production build of the frontend |
| `npm run test:backend` | Run backend pytest suite |

## Layout

```
webapp/
├── package.json        # monorepo scripts (uses concurrently)
├── backend/            # FastAPI service  → see backend/README.md
└── frontend/           # React SPA        → see frontend/README.md
```

## Deployment

The frontend deploys to Vercel and the backend to Render. See
`../DEPLOYMENT_PLAN.md` for step-by-step instructions.
