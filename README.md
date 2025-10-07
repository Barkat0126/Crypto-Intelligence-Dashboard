# Crypto Intelligence Dashboard

Professional, office-ready dashboard for real-time crypto market alerts and price movement insight. Built with React + TypeScript + Vite, with accessible, responsive UI and Canadian-friendly formatting (`en-CA` dates, currency).

## Live Demo & Repository

- Live hosted link: https://crypto-intelligence-dashboard.vercel.app/
- GitHub repository: https://github.com/Barkat0126/Crypto-Intelligence-Dashboard
- Commit strategy: meaningful, scoped messages (feat/ui, fix/data, chore/devops); small focused PRs.

## Overview

- Real-time style alerts (sample + stubs), filters by Chain/Event/Severity, and search
- Price chart with dump markers from Coingecko market data
- AI summarization hooks to enrich alert copy and context
- Canadian locale presentation for timestamps and currency

## Key Features

- Alerts feed with professional cards and severity accents
- Filters: Chain (ETH/SOL/BSC), Event (Whale Move/Dump), Severity, Search
- Responsive and accessible UI (keyboard support, ARIA states)
- Price chart with detected dump markers; select token via alerts
- Firebase Firestore integration points (init, load; ready to enable writes)

## Architecture

- `src/pages/Dashboard.tsx` — Main page with filters, list, chart, responsive layout
- `src/components/AlertCard.tsx` — Professional card with `en-CA` formatting
- `src/components/Filters.tsx` — Accessible chips and search input
- `src/components/PriceChart.tsx` — Line chart with dump annotations
- `src/services/firebase.ts` — Firestore init, load/save helpers (local fallback)
- `src/services/ingest.ts` — Coingecko price series, whale placeholders, dump detection
- `src/services/ai.ts` — Summarization stub and integration point
- `src/types.ts` — Shared types for strong contracts

## Technology Stack

- React 18 + TypeScript; Vite 5
- Inline component styles for predictable, brand-safe presentation
- Firebase App + Firestore SDK (optional via env)
- Axios for data fetching; Recharts for visualization

## Data Ingestion

- On-chain wallet movements:
  - Ethereum via Etherscan API
  - Solana via Solscan (or Helius) API
  - Binance Smart Chain via BSCScan API
- Price and volume data:
  - CoinGecko Markets API (implemented in `fetchPriceSeries`)
  - Binance API (optional)
  - Dex Screener (optional)

Implementation status:
- `src/services/ingest.ts`
  - `fetchPriceSeries(tokenId, days)` uses CoinGecko to build chart series
  - `detectDumpsFromSeries(series, token, chain)` flags sharp drops as alerts
  - `fetchWhaleMoves(chain)` currently returns placeholders — replace with real API calls
- Normalization and IDs
  - Normalize to `AlertEvent` and deduplicate by `id` (chain-token-timestamp-suffix)
  - Canadian locale formatting applied for timestamps and currency

Environment variables (add to `.env` as needed):
```
VITE_ETHERSCAN_API_KEY=...
VITE_BSCSCAN_API_KEY=...
VITE_SOLSCAN_API_KEY=...    # or VITE_HELIUS_API_KEY=...
VITE_BINANCE_API_KEY=...    # optional
```
Use rate limits and backoff when polling; cache normalized alerts in Firestore for consistency.

## Local Setup

Prerequisites:
- Node.js `>=18`
- npm `>=9`

Install and run:
```
npm install
npm run dev
```
Open `http://localhost:5173/` and interact with filters and alerts. Select an alert to focus the chart on its token.

## Environment Configuration

Create `.env` and provide Firebase credentials (optional for local preview):
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```
If these are not set, the app gracefully falls back to local sample data and skips Firestore.

## Build & Preview

```
npm run build
npm run preview
```

## Deployment

### Firebase Hosting
- Install CLI: `npm i -g firebase-tools`
- Login: `firebase login`
- Initialize: `firebase init hosting` (select existing project or create new)
- Build: `npm run build`
- Deploy: `firebase deploy`

### Vercel
- Install CLI: `npm i -g vercel`
- Link: `vercel` (framework: Vite)
- Environment: add Firebase vars in Project Settings → Environment Variables
- Deploy: `vercel --prod`

## Firebase Rules (starter)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isVerifiedUser() {
      return request.auth != null && request.auth.token.email_verified == true;
    }

    match /alerts/{id} {
      allow read: if true; // Restrict by role/org in production
      allow write: if isVerifiedUser();
    }
  }
}
```

## AI Usage

- `src/services/ai.ts` contains a summarization stub for local preview
- Replace with an LLM provider to generate concise, context-aware summaries; cache outputs in Firestore
- Summarization behaviour:
  - Large wallet movements: generate concise alerts like
    - "Wallet X moved US$12M USDT into Binance [ETH]"
  - Sudden price drops: provide short context like
    - "$PEPE fell 20% in 10 minutes due to whale sell-off"
- Keep summaries action-oriented, brand-safe, and limited to one sentence.

## Data Storage

- Store all normalized events in Firestore under `alerts` collection.
- Recommended schema (example fields):
  - `id: string` — unique ID (e.g., `${chain}-${token}-${timestamp}-${suffix}`)
  - `timestamp: number` — epoch ms
  - `chain: 'ETH' | 'SOL' | 'BSC'`
  - `tokenSymbol: string` and `tokenContract?: string`
  - `severity: 'High' | 'Medium' | 'Low'`
  - `alertType: 'Whale Move' | 'Dump'`
  - `amountUSD?: number`, `priceChangePercent?: number`
  - `wallets?: { address: string; label?: string }[]`
  - `exchanges?: { name: string }[]`
  - `summary?: string` — AI-generated one-liner
- Historical logs for trend analysis:
  - Keep all events (append-only); avoid destructive updates
  - Add composite indexes for common queries:
    - `(chain, alertType, timestamp desc)`
    - `(tokenSymbol, timestamp desc)`
    - `(severity, timestamp desc)`
- Implementation guidance:
  - Add a `saveAlert(event: AlertEvent)` helper in `src/services/firebase.ts`
  - Use `serverTimestamp()` when appropriate; deduplicate by `id` before writes
  - Batch writes when ingesting bursts; backoff on rate limits

## Design Decisions

- Professional inline styling for predictable presentation and easy brand alignment
- Canadian locale (`en-CA`) for timestamps and currency values
- Accessibility: keyboard interaction for chips, ARIA pressed states, readable contrast
- Key stability: unique IDs for whale stubs and event dedup to remove React key warnings

## Security & Privacy

- No secrets in repo; environment variables used for Firebase config
- Example rules favor verified accounts for writes; strengthen for production
- Avoids PII; wallet addresses treated as public identifiers

## Testing & Quality

- Dev server HMR for rapid UI validation
- Manual checks: filters, alert selection, chart rendering, locale formatting
- Linting can be enabled via ESLint (config scaffold included)

## Screenshots

Add images to `docs/screenshots/` and link:
- Desktop: `docs/screenshots/desktop.png`
- Mobile: `docs/screenshots/mobile.png`

## Demo Video

Record a 5–8 minute walkthrough covering features, architecture, filters/alerts interactions, chart, AI notes, rules, and deployment. Link it: `https://YOUR_VIDEO_LINK_HERE`.

## Roadmap

- Wire real ingestion (Etherscan/Solscan/BSCScan, Dex Screener/Coingecko) with rate limits
- Persist alerts to Firestore and add role-based reads
- Optional: “Boardroom mode” table view with sortable columns; dark theme toggle
- Add unit tests for dump detection and data normalization

---

This README is structured for submission readiness: architecture, decisions, AI usage, deployment, rules, and deliverables. Replace placeholders (live link, video, screenshots) before submitting.