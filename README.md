# FreeScope
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-61DAFB)
![Backend](https://img.shields.io/badge/Backend-Next.js-black)
![Database](https://img.shields.io/badge/Database-SQLite%20%2B%20Prisma-336791)
![AI](https://img.shields.io/badge/AI-Ollama%20Local%20LLM-orange)
![Design](https://img.shields.io/badge/Design-Tailwind%20CSS-38B2AC)
![License](https://img.shields.io/badge/License-MIT-green)
Project-centric scope and feature estimation for freelancers. Evaluate feature requests against a project’s contract/scope using a local LLM (Ollama). No embeddings or vector stores — natural language reasoning only.

## Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Framer Motion (Warm Cream design system)
- **Backend:** Next.js App Router, API routes
- **Database:** SQLite + Prisma ORM
- **AI:** Ollama (local LLM) for scope comparison and estimation; strict JSON output

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env` and set:

   - `DATABASE_URL` — SQLite path (default `file:./dev.db`)
   - `OLLAMA_BASE_URL` — Ollama API (default `http://localhost:11434/v1`)
   - `OLLAMA_MODEL` — Model name (default `llama3.2`)

3. **Ollama**

   Install [Ollama](https://ollama.ai) and run a model, e.g.:

   ```bash
   ollama run llama3.2
   ```

   Keep the server running so the app can call it.

4. **Database**

   ```bash
   npx prisma migrate dev
   ```

5. **Run**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Usage

1. **Profile** — Set role, years of experience, hourly rate (EUR), and skills. Required for price calculation when features are out of scope or partial.
2. **Projects** — Create a project (name, optional description).
3. **Contract / scope** — On the project page, upload a PDF or paste contract/requirements text. This is the canonical scope for that project.
4. **Feature requests** — Add a feature request inside the project. The app:
   - Compares the feature to the project scope via the LLM
   - Classifies as **in scope**, **out of scope**, or **partially in scope**
   - If in scope: “Included in scope”, no price
   - If out of scope or partial: full task breakdown, hours, and price (using your profile rate)
5. **Result** — Scope reasoning, missing scope items, task breakdown, and (when applicable) total hours and price.

## Rules

- No feature estimation without a project.
- No price calculation without scope evaluation; scope evaluation always comes first.
- New feature request is disabled until the project has a scope document.

## Project structure

- `src/app/` — Pages and API routes (projects, contract upload, feature requests)
- `src/components/` — UI (nav, cards, buttons, inputs, badges)
- `src/lib/` — DB, contract text extraction (PDF/text), scope AI (Ollama)
- `prisma/` — Schema: Project, ContractDocument, FeatureRequest, FreelancerProfile

Single-user, no auth or payments.
