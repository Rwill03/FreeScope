# FreeScope

![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-61DAFB)
![Backend](https://img.shields.io/badge/Backend-Next.js-black)
![Database](https://img.shields.io/badge/Database-SQLite%20%2B%20Prisma-336791)
![AI](https://img.shields.io/badge/AI-Ollama%20Local%20LLM-orange)
![Design](https://img.shields.io/badge/Design-Tailwind%20CSS-38B2AC)
![License](https://img.shields.io/badge/License-MIT-green)

## What is FreeScope?

FreeScope is an intelligent scope management and feature estimation tool designed specifically for freelancers. It automatically evaluates whether new feature requests from clients align with the original project scope, saving you hours of manual analysis and protecting you from unpaid work.

### The Problem It Solves

Scope creep is a silent profit killer for freelancers. When clients request features that weren't in the original contract, you face a choice:
- **Do it for free** — Lose margin and time
- **Charge extra** — Risk client conflict and disputes over what was "included"
- **Argue with clients** — Waste time on non-technical discussions

**FreeScope eliminates this dilemma** by using AI to objectively compare each feature request against your project contract, generating clear estimates for out-of-scope work.

### The Solution

FreeScope uses a local language model (Ollama) running on your machine to:
1. Analyze your project's original scope/contract
2. Evaluate each new feature request objectively
3. Classify work as **in scope** (included), **out of scope** (extra cost), or **partially in scope**
4. Generate detailed task breakdowns and pricing for additional work
5. Create documentation trails for client discussions

**Why local LLM?** No cloud APIs, no data sharing, no vendor lock-in, and it works offline.

### Economic Impact

- **Time saved:** 15-30 minutes per feature request → hours per project
- **Better estimates:** AI-powered analysis reduces estimation errors
- **Scope protection:** Clear documentation prevents unpaid work
- **Client confidence:** Professional, objective scope evaluations
- **Single user:** Lightweight, no licensing costs for team management

---

## Technical Architecture

### Technology Stack

### Technology Stack

- **Frontend:** React + TypeScript — Modern, type-safe UI with real-time updates
- **Backend:** Next.js App Router — Full-stack framework with API routes and server components
- **Database:** SQLite + Prisma ORM — Lightweight, self-contained data storage with type safety
- **AI:** Ollama + Local LLM — Runs entirely on your machine; no cloud dependencies or API costs
- **Design:** Tailwind CSS + Framer Motion — Beautiful, responsive interface with smooth animations

### Why This Stack?

- **Privacy first:** All data stays on your machine (local Ollama + SQLite)
- **Zero infrastructure:** No servers, no managed services, no monthly fees
- **Offline capable:** Works without internet after initial setup
- **Easy deployment:** Single binary for LLM (Ollama), single SQLite database
- **Fast & responsive:** React + TypeScript for snappy UX; Next.js for optimized rendering

## UI Components & Widgets

Built with reusable, accessible React components:

- **Navigation** (`nav.tsx`) — Clean header with project context and user menu
- **Tag Input** (`tag-input.tsx`) — Multi-select input for skills and feature tags with autocomplete
- **Badge** (`badge.tsx`) — Status indicators showing scope classification (in scope, out of scope, partial)
- **Button** (`button.tsx`) — Primary, secondary, and destructive action buttons with hover states
- **Card** (`card.tsx`) — Container layouts for projects, feature requests, and results
- **Input** (`input.tsx`) — Text fields with validation for names, descriptions, URLs, rates
- **Label** (`label.tsx`) — Accessible form labels with proper `htmlFor` association
- **Select** (`select.tsx`) — Dropdowns for role, experience level, and category selection
- **Textarea** (`textarea.tsx`) — Multi-line input for contract text and feature descriptions

All components use Tailwind CSS for consistent styling and Framer Motion for smooth animations.

---

## Getting Started

### Prerequisites

- Node.js 18+ (for running the app)
- [Ollama](https://ollama.ai) installed on your machine (for AI evaluation)
- A modern web browser

### Installation & Setup

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

## Usage Workflow

### For Non-Technical Users

Think of FreeScope as your "Scope Coach":

1. **Set Your Profile** — Tell us about yourself: your role, experience level, and hourly rate. This helps calculate fair pricing for out-of-scope work.
   
2. **Create a Project** — Name and describe the project (e.g., "E-commerce Platform Redesign").

3. **Upload the Scope** — Paste or upload your project contract/requirements. This becomes your "golden truth" for what's included.

4. **Submit Feature Requests** — As clients ask for new features, you add them to the project.

5. **Get Instant Answers** — FreeScope instantly tells you:
   - ✅ **In Scope?** (No charge, already agreed upon)
   - ⚠️ **Partially in Scope?** (Some work included, some extra)
   - ❌ **Out of Scope?** (New work with detailed hours & price)

6. **Share Results with Clients** — Use the AI-generated reasoning and estimates in client emails to clearly explain scope and pricing.

### For Technical Users

### For Technical Users

**Architecture Overview:**

```
User Input (Feature Request)
         ↓
    [Next.js API Route]
         ↓
    [Contract Extractor] — Extracts text from PDF/plain text scope docs
         ↓
    [Ollama LLM] — Comparative reasoning between scope & request
         ↓
    [Structured JSON Response] — Scope classification + task breakdown
         ↓
    [Prisma ORM] — Store results in SQLite
         ↓
    [React UI] — Display results with reasoning & pricing
```

**Key Technical Details:**

1. **Scope Analysis** — The LLM performs direct comparison between original scope and new feature request using natural language reasoning. No embeddings, no vector searches—pure semantic understanding.

2. **Contract Extraction** — Supports both PDF and plain text uploads. Extracts text automatically for analysis.

3. **Deterministic Output** — LLM responses are structured as strict JSON to ensure reliable parsing and downstream processing.

4. **Stateless Evaluation** — Each feature request is evaluated independently against the scope, preventing cascade errors.

5. **Price Calculation** — Based on your profile (hourly rate + estimated hours), generates line-item pricing for out-of-scope work.

---

1. **Profile Setup** — Set role, years of experience, hourly rate (EUR), and skills. Used for price calculation when features are out of scope or partial.
   
2. **Create Projects** — Create a project with name and optional description.

3. **Define Scope** — Upload PDF contract or paste text describing the project scope. This is the canonical reference for "what's included."

4. **Evaluate Features** — Add feature requests to the project. FreeScope:
   - Compares the feature request to the stored scope via LLM
   - Returns scope classification: **in scope**, **out of scope**, or **partially in scope**
   - For in-scope features: "Included, no additional cost"
   - For out-of-scope/partial: Full task breakdown, hour estimates, and total price

5. **Review Results** — See scope reasoning, missing scope items, detailed task breakdown, and (when applicable) pricing

---

## Core Principles

### For Freelancers

1. **Protect Your Margin** — Every out-of-scope request has a clear, data-backed price
2. **Save Time** — No more manual scope analysis; get answers in seconds
3. **Professional Communication** — AI-generated reasoning gives you confident client explanations
4. **Accurate Estimates** — Detailed task breakdowns prevent surprises during execution

### For Developers

1. **No Vendor Lock-in** — Run entirely locally; export your data anytime
2. **Privacy by Design** — All processing happens on your machine
3. **Extensible Architecture** — Swap Ollama models, modify prompts, customize output
4. **Single Responsibility** — Scope evaluation only; integrate with your existing tools via API

---

## Project Structure & Technical Details

### Folder Organization

```
src/
├── app/                          # Next.js 13+ App Router
│   ├── api/                      # API routes (REST endpoints)
│   │   ├── estimate/            # Feature estimation endpoints
│   │   ├── estimates/           # Retrieve past estimates
│   │   ├── profile/             # Freelancer profile management
│   │   └── projects/            # Project CRUD operations
│   ├── project/                 # Project pages
│   │   ├── [id]/                # Individual project view
│   │   ├── [id]/feature/        # Feature request detail pages
│   │   └── new/                 # Create new project
│   ├── estimate/                # Estimate result pages
│   ├── profile/                 # Profile editing
│   ├── layout.tsx               # Root layout with navigation
│   ├── page.tsx                 # Home page / dashboard
│   └── globals.css              # Global styles
│
├── components/                   # Reusable React components
│   ├── nav.tsx                  # Navigation bar
│   ├── tag-input.tsx            # Custom tag input
│   └── ui/                      # Base UI components
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       └── textarea.tsx
│
├── lib/                         # Business logic & utilities
│   ├── db.ts                    # Prisma client + database queries
│   ├── scope-ai.ts              # Ollama LLM integration & prompts
│   ├── contract-extract.ts      # PDF/text extraction logic
│   └── utils.ts                 # Helper functions
│
└── types/                       # TypeScript type definitions
    └── index.ts                 # Shared types (Project, Feature, etc.)

prisma/
├── schema.prisma                # Database schema definition
├── migrations/                  # Database migration history
├── dev.db                       # SQLite development database
└── migration_lock.toml          # Prisma lock file
```

### Key Modules

**`lib/scope-ai.ts`** — AI Engine
- Prompt engineering for scope comparison
- Ollama API integration
- JSON response parsing and validation
- Task breakdown generation

**`lib/contract-extract.ts`** — Document Processing
- PDF text extraction
- Plain text normalization
- Chunking for large documents

**`lib/db.ts`** — Database Layer
- Prisma ORM queries
- Relationship management (Project → Features → Estimates)
- Caching strategies

**Data Model**

```
FreelancerProfile
├── id
├── role (e.g., "Full-stack developer")
├── yearsExperience
├── hourlyRateEur
└── skills[]

Project
├── id
├── name
├── description
├── freelancerId
├── createdAt
└── ContractDocument (1-to-1)
    ├── id
    ├── fileName
    ├── extractedText
    └── uploadedAt

FeatureRequest
├── id
├── projectId
├── title
├── description
├── createdAt
└── ScopeEstimate (1-to-1)
    ├── id
    ├── classification (IN_SCOPE | OUT_OF_SCOPE | PARTIAL)
    ├── reasoning (LLM explanation)
    ├── taskBreakdown[]
    ├── estimatedHours
    ├── estimatedPrice
    └── generatedAt
```

---
