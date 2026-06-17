# CRIS Golf Program

A static, mobile-first web app for the **Chiang Rai International School (CRIS) Golf Program** — presenting the program's three offerings (Junior, Intermediate, and beyond), schedules, and contact details to prospective families.

Built with [Next.js](https://nextjs.org) using static export (`output: "export"`) so the app deploys as plain static files.

## Tech stack

- **Next.js** (App Router, static export)
- **TypeScript**
- **Tailwind CSS**
- **Geist** font via `next/font`

## Getting started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Build

Produce the static export in `out/`:

```bash
npm run build
```

## Project structure

| Path          | Purpose                                                         |
| ------------- | -------------------------------------------------------------- |
| `app/`        | App Router routes and the shared app shell (`layout.tsx`)      |
| `components/` | Reusable UI, including the persistent layout chrome            |
| `config/`     | Single-source configuration (e.g. navigation)                  |
| `content/`    | Source-of-truth program content and the original source images |
| `types/`      | Shared TypeScript types                                        |

## Documentation

- `mvp_guideline.md` — the phased MVP build plan and acceptance criteria.
- `GUIDELINES.md` — code standards and conventions for this project.
- `content/programs.md` — the English source-of-truth for program content.
