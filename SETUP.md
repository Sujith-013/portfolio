# Setup

Local development instructions for this repo. Not a general template guide — assumes you're working on this specific codebase.

## Prerequisites

- Node.js 20.9+ (Next.js 16 minimum)
- Git
- npm or pnpm (both lockfiles currently exist in the repo — see `docs/ARCHITECTURE.md` for the note on picking one)

## Install and run

```bash
git clone git@github.com:Sujith-013/portfolio.git
cd portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.example` to `.env` and fill in what you need:

| Variable | Required for | Notes |
|---|---|---|
| `NEXT_PUBLIC_GTM` | Google Tag Manager analytics | Optional |
| `NEXT_PUBLIC_APP_URL` | Contact form / metadata | Should match the deployed URL |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Contact form (Telegram channel) | Currently required for the contact form to work at all — see `docs/ARCHITECTURE.md`, contact form is non-functional without these |
| `GMAIL_PASSKEY`, `EMAIL_ADDRESS` | Contact form (email channel) | Gmail App Password, not your account password — generate one under Google Account → Security → App Passwords |

## Docker

```bash
# dev
docker-compose up --build

# prod
docker build -t portfolio:prod -f Dockerfile.prod .
docker run -p 3000:3000 portfolio:prod
```

## Data files

Site content lives in `utils/data/*.js` — `personal-data.js`, `experience.js`, `educations.js`, `projects-data.js`, `skills.js`. See `docs/CONTENT-AUDIT.md` for what's currently accurate vs. what's still template leftover.
