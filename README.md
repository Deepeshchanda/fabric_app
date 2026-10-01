# Blank App

Bare-bones Fabric-authenticated React + Vite app.
Sign-in, routing, and a placeholder home page — with no data layer to delete before you start your own project.

## Forking / cloning this repo

If you forked or cloned this repo onto a new machine, install dependencies before running anything else:

```bash
npm install
```

This pulls in the Rayfin CLI/SDK packages and all other dependencies declared in `package.json`.
Skipping this step is the most common cause of `rayfin: command not found` or `vite: command not found` errors.

## Getting started

```bash
# Deploy app to Fabric and start the local dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## Local-only development (no Fabric publish)

If you only want to build UI locally and avoid Fabric auth/publish, run:

```bash
npm run dev:local
```

For LAN/device testing:

```bash
npm run dev:local:host
```

In local-only mode, the app uses a frontend mock session (stored in localStorage)
and does not require `rayfin up`.

## Project structure

```text
├── rayfin/
│   └── rayfin.yml          # Fabric service configuration (auth + static hosting)
├── src/
│   ├── main.tsx            # Entry point + Rayfin client bootstrap
│   ├── App.tsx             # Routes and auth gate
│   ├── hooks/
│   │   └── AuthContext.tsx # React context wrapping the auth helpers
│   ├── components/
│   │   └── AuthPage.tsx    # Sign-in UI
│   ├── pages/
│   │   └── HomePage.tsx    # Post-auth landing page
│   └── services/
│       ├── IAuthService.ts        # Auth service contract + AuthUser type
│       ├── MockAuthService.ts     # Local-dev impl (email/password)
│       ├── RayfinAuthService.ts   # Production impl (Fabric brokered auth)
│       ├── rayfinClient.ts        # Typed Rayfin client singleton
│       └── bootstrap.ts           # Reads env, picks the right auth service
└── package.json
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Deploy app to Fabric and start local dev server |
| `npm run dev:local` | Start local Vite server only (no Fabric auth/publish) |
| `npm run dev:local:host` | Local-only dev server exposed on network |
| `npm run build` | Production build |
| `npm run build:fabric` | Build for Fabric deployment (entrypoint for `rayfin up staticapp deploy`) |
| `npm run lint` | Lint with ESLint |
| `npm run test` | Run unit tests with Vitest |
| `npm run rayfin:up` | Deploy app to Fabric (no local dev server) |

## Git commands

Common commands for committing and pushing your changes:

```bash
# Check which files have changed
git status

# Stage all changed files
git add .

# Commit staged files with a message
git commit -m "Your commit message"

# Push the commit to the main branch
git push origin main
```

Run `git status` before `git add` to confirm what you're about to stage, and before `git push`
to confirm your working tree is clean.
