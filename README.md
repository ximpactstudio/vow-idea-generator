# VOW Idea Generator

Lightweight web app for the VOW for Girls team to submit Model Innovation ideas. Ideas are classified automatically and sent to a Google Sheet.

## Features

- **Simple intake**: One required field (Idea); everything else optional.
- **Idea Spark**: Rotating prompt on each load to inspire ideas.
- **Optional context**: Expandable section for repeatability, audience, moment, success, links.
- **Idea booster**: Short feedback and optional "Improve clarity" (AI-refined suggestion).
- **Auto-classification**: Type (Model/Component/Tactic/Test), Horizon (H1/H2/H3), component area, tags.
- **Google Sheet**: POST to Apps Script web app; row appended with all fields.
- **Security**: Honeypot, rate limit (10 requests/minute per IP), env-only secrets.

## Tech stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Zod** (validation)
- **OpenAI** (classification + improve clarity)

## Setup

### 1. Install and env

```bash
cd vow-idea-generator
npm install
cp .env.example .env.local
```

Edit `.env.local`:

- `OPENAI_API_KEY` — from OpenAI (used for classification and improve-clarity).
- `GOOGLE_APPS_SCRIPT_WEBHOOK_URL` — from your deployed Apps Script Web App (see below).

### 2. Google Apps Script

1. Create a new Google Sheet (or use an existing one).
2. **Extensions → Apps Script**. Delete any sample code and paste the contents of `apps-script/Code.gs`.
3. Save the project (e.g. "VOW Idea Intake").
4. **Deploy → New deployment → Web app**:
   - Description: e.g. "VOW Idea Webhook"
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**, authorize if prompted, then copy the **Web app URL**.
6. Put that URL in `.env.local` as `GOOGLE_APPS_SCRIPT_WEBHOOK_URL`.

The script uses two sheet tabs:

- **Idea Intake**: One row per submission. If missing, the script creates it with headers in row 1:  
  `Timestamp`, `Idea (raw)`, `Repeatability`, `Who for`, `Moment`, `Success`, `Links`, `Idea H1`, `Idea H2`, `Bullets`, `Type`, `Horizon`, `Component Area`, `Tags`, `Confidence`, `Rationale`, `Source`, `Status`  
  `Source` and `Status` are set to "Web intake" and "New" by the Next.js app.

- **Meta** (Ideas Submitted counter): The script creates this tab if missing. Cell **A1** holds the total number of ideas submitted (integer). Set the initial value to **172** (or any starting count). On each successful POST the script increments A1 and returns `{ ok: true, ideas_submitted: <newCount> }`. The Next.js app uses this for the "Ideas submitted" counter and also supports GET on the same Web App URL to read the current count for initial page load.

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Submit an idea; it will be classified and, if the webhook is set, appended to the sheet.

## Deployment

See **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** for step-by-step instructions:

- **Google Apps Script**: Create the sheet, add the script, deploy as Web app (Anyone), and copy the webhook URL.
- **Vercel**: Import the repo, set `OPENAI_API_KEY` and `GOOGLE_APPS_SCRIPT_WEBHOOK_URL`, then deploy.

Other hosts: run `npm run build` and `npm start`; set the same environment variables.

## Ideas submitted counter

The "Ideas submitted" value is stored in the Google Sheet **Meta** tab, cell **A1**. Set the initial value to **172** (or your starting count). The Apps Script increments it on each successful POST and returns the new count; the UI updates immediately after a successful submission. If the Meta sheet or A1 is missing, the script creates the sheet and initializes A1 to 172.

## Security

- **Secrets**: Only in env; never in client code.
- **Honeypot**: Hidden field `website_url`; if filled, request is treated as success but not stored (bot trap).
- **Rate limit**: 10 requests per minute per IP on `/api/submit`.

## Project layout

- `app/page.tsx` — main ideas page and thank-you state
- `app/api/submit/route.ts` — validate, classify, POST to Google
- `app/api/classify/route.ts` — classify only (if needed elsewhere)
- `app/api/improve-clarity/route.ts` — AI refinement suggestion
- `lib/classify.ts` — OpenAI-based classification logic
- `lib/rate-limit.ts` — in-memory rate limit
- `lib/types.ts` — shared types
- `components/` — IdeaSpark, IdeaForm, IdeaBooster, ThankYou
- `apps-script/Code.gs` — Google Apps Script to append rows to sheet
