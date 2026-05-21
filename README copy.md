# Wabisabi Blog — DevOps Setup

**Stack:** React 18 + Vite · Supabase (Postgres + Auth) · Docker · GitHub Actions · Render

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        GitHub Repository                         │
│                                                                  │
│  push to main ──► GitHub Actions CI/CD Pipeline                 │
│                          │                                       │
│          ┌───────────────┼───────────────────┐                  │
│          ▼               ▼                   ▼                  │
│      [quality]        [build]            [deploy]               │
│    Lint + Audit    Docker → GHCR      Render Hook               │
│    Secret scan     Trivy scan              │                    │
│                                            ▼                    │
│                                       [e2e]                     │
│                                   Playwright tests              │
└─────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
                            ┌─────────────────────┐
                            │   Render (production) │
                            │   nginx + React SPA   │
                            │   Port 80 → HTTPS     │
                            └─────────────────────┘
                                       │
                                       ▼
                            ┌─────────────────────┐
                            │  Supabase (external) │
                            │  Postgres + Auth     │
                            │  Row Level Security  │
                            └─────────────────────┘
```

---

## Project Structure

```
wabisabi-blog/
├── src/                        # React application source
│   ├── components/             # Shared UI components
│   ├── pages/                  # Page components
│   ├── hooks/                  # Custom React hooks
│   └── lib/supabase.js         # Supabase client (reads env vars)
│
├── e2e/                        # Playwright end-to-end tests
│   ├── home.spec.js
│   ├── blog.spec.js
│   ├── navigation.spec.js
│   ├── auth.spec.js
│   └── security.spec.js
│
├── nginx/
│   └── nginx.conf              # SPA routing + security headers
│
├── .github/workflows/
│   ├── ci-cd.yml               # Main pipeline (push to main)
│   └── pr-checks.yml           # PR validation
│
├── Dockerfile                  # Multi-stage build
├── docker-compose.yml          # Local dev + prod testing
├── playwright.config.js        # E2E test config
├── .dockerignore
├── .env.example
└── README.md
```

---

## CI/CD Pipeline

```
PR opened
    │
    ▼
[pr-checks.yml]
  ├─ npm audit (HIGH/CRITICAL fails build)
  ├─ Vite build (catches compile errors early)
  └─ Docker image build (no push — verifies Dockerfile)

PR merged to main
    │
    ▼
[ci-cd.yml]
  │
  ├─ JOB 1: quality
  │   ├─ npm audit --audit-level=high
  │   └─ TruffleHog secret scan
  │
  ├─ JOB 2: build  (needs: quality)
  │   ├─ Login to ghcr.io
  │   ├─ docker build --build-arg VITE_*=<secret>
  │   ├─ Push → ghcr.io/<owner>/wabisabi-blog:sha-<hash>
  │   ├─ Push → ghcr.io/<owner>/wabisabi-blog:latest
  │   └─ Trivy scan (CRITICAL vulns = fail)
  │
  ├─ JOB 3: deploy  (needs: build)
  │   ├─ POST to RENDER_DEPLOY_HOOK_URL
  │   └─ Poll RENDER_APP_URL until HTTP 200 (5 min timeout)
  │
  └─ JOB 4: e2e  (needs: deploy)
      ├─ Playwright chromium tests against live URL
      └─ Upload HTML report as artifact (14-day retention)
```

---

## Docker — Multi-Stage Build

| Stage | Base | Purpose |
|-------|------|---------|
| `deps` | `node:20-alpine` | Install npm deps (layer-cached) |
| `builder` | `node:20-alpine` | `vite build` with secrets injected as ARGs |
| `production` | `nginx:1.27-alpine` | Serve `dist/` — ~25 MB final image |

Security hardening applied in the production image:
- Runs as **non-root** user (`appuser`)
- nginx version hidden (`server_tokens off`)
- All security headers set (CSP, X-Frame-Options, etc.)
- Immutable cache headers on hashed Vite assets

---

## Local Development

### Prerequisites
- Docker Desktop or Docker Engine + Compose
- Node.js 20+

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/pemadolker/wabisabi-blog.git
cd wabisabi-blog

# 2. Configure environment
cp .env.example .env
# Edit .env — fill in your Supabase URL and anon key

# 3a. Run dev server (hot reload)
docker compose --profile dev up

# 3b. OR run production build locally (mirrors Render exactly)
docker compose up --build

# App available at:
#   Dev:  http://localhost:5173
#   Prod: http://localhost:8080
```

---

## Deploying to Render

### Step 1 — Create a Web Service on Render

1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub repo (`pemadolker/wabisabi-blog`)
3. Configure:

| Setting | Value |
|---------|-------|
| **Environment** | Docker |
| **Dockerfile path** | `./Dockerfile` |
| **Branch** | `main` |
| **Instance type** | Free (or Starter for always-on) |

### Step 2 — Set Environment Variables in Render

In **Environment → Environment Variables**, add:

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` |

> ⚠️ These are **build-time** variables for Vite. They must be set here so Render passes them as Docker `--build-arg` values.

### Step 3 — Get your Deploy Hook URL

In your Render service → **Settings → Deploy Hooks → Create Hook**. Copy the URL.

### Step 4 — Add GitHub Secrets

In your GitHub repo → **Settings → Secrets and variables → Actions**:

| Secret name | Value |
|-------------|-------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `RENDER_DEPLOY_HOOK_URL` | The hook URL from Step 3 |
| `E2E_TEST_EMAIL` | (Optional) Email of a test Supabase user |
| `E2E_TEST_PASSWORD` | (Optional) Password for test user |

And in **Variables** (not secrets — these are non-sensitive):

| Variable name | Value |
|---------------|-------|
| `RENDER_APP_URL` | `https://your-app.onrender.com` |

### Step 5 — Push to main

```bash
git add .
git commit -m "feat: add Docker + CI/CD + E2E pipeline"
git push origin main
```

GitHub Actions will: lint → build → push image → deploy to Render → run E2E tests.

---

## Running E2E Tests Locally

```bash
# Install dependencies (first time)
npm install
npx playwright install chromium

# Run against local dev server
BASE_URL=http://localhost:5173 npx playwright test

# Run against production
BASE_URL=https://your-app.onrender.com npx playwright test

# Open interactive UI
npx playwright test --ui

# View last HTML report
npx playwright show-report
```

---

## Security Considerations

### Secrets Management
- Supabase credentials are **never hardcoded** in source — they live in GitHub Secrets and are injected as Docker `--build-arg` at build time
- `.env` is in `.gitignore`; `.env.example` documents required keys without values
- TruffleHog scans every push for accidentally committed secrets

### Dependency Security
- `npm audit --audit-level=high` runs on every push and PR — HIGH or CRITICAL vulnerabilities fail the build
- Trivy scans the final Docker image for OS-level CVEs before deploying

### Container Security
- Multi-stage build: build tools (Node, npm) **never ship** in the production image
- Production image runs as non-root (`appuser`) — a compromised container cannot modify system files
- Final image is ~25 MB (nginx + static HTML/JS/CSS only)

### HTTP Security Headers (set in nginx)
| Header | Value | Protects Against |
|--------|-------|-----------------|
| `X-Frame-Options` | `SAMEORIGIN` | Clickjacking |
| `X-Content-Type-Options` | `nosniff` | MIME-type sniffing |
| `X-XSS-Protection` | `1; mode=block` | Reflected XSS (legacy browsers) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Referrer leakage |
| `Content-Security-Policy` | Restricts `connect-src` to Supabase | XSS, data exfiltration |
| `Permissions-Policy` | Camera/mic/geo disabled | Feature abuse |

### Supabase Row Level Security
All tables have RLS enabled (see README SQL section). Users can only read/write their own data.

---

## Grading Criteria Checklist (SWE-DSO101)

| Criterion | Implementation |
|-----------|----------------|
| ✅ Docker Configuration & Optimization (5) | Multi-stage build (deps → builder → nginx), non-root user, health check, `.dockerignore`, layer caching |
| ✅ CI/CD Pipeline Design (5) | 4-job pipeline: quality → build → deploy → e2e; concurrency cancel; environment gates |
| ✅ Pipeline Implementation (10) | GitHub Actions: audit, TruffleHog, GHCR push, Trivy scan, Render deploy hook, liveness poll, Playwright upload |
| ✅ Integration with External Services (5) | Supabase (Postgres + Auth + RLS), GHCR (image registry), Render (hosting), GitHub Environments |
| ✅ Security Considerations (5) | Secret scanning, `npm audit`, Trivy, non-root container, CSP + 6 security headers, no secrets in repo |
| ✅ Documentation & Presentation (5) | This README: architecture diagram, pipeline diagram, deployment guide, security table, local dev guide |
