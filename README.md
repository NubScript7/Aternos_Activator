
# Aternos Activator

A small messenger bot that can start an Aternos server by sending commands. It listens for messenger events, manages Aternos server actions via a headless browser, and stores/loads cookies and credentials from a Firebase realtime database.

## What this project contains

- TypeScript server code under `src/`
- A tiny frontend workspace (if present) under `frontend/` (optional workspace)
- Secret cookie files in `secret/cookie/`

## Prerequisites

- Node.js (recommend v18+)
- npm (or yarn)
- A Firebase project with Realtime Database enabled
- A Messenger page/app and a Facebook Page token

## Quick start

1. Install dependencies

```powershell
npm install
```

2. Create a `.env` file or populate `secret.env` in the project root with the environment variables listed below. Do NOT commit secrets.

3. Build and run

```powershell
npm run build
npm run start
```

Note: The `start` script runs the build then starts the compiled output (`node dist/index.cjs`) as defined in `package.json`.

## Important Environment Variables

- `FB_PAGE_TOKEN` — Facebook Page access token (used to send messages)
- `FB_APP_ID` — Facebook App ID
- `FB_PAGE_ID` — Facebook Page ID
- `FIREBASE_DATABASE_URL` — Firebase Realtime Database URL

## Secrets and cookie files

- Local cookie files are present under `secret/cookie/` . These are used by the Aternos automation service and should be treated as secrets.

# License

MIT
