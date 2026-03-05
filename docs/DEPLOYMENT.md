# VOW Idea Generator — Deployment Guide

Step-by-step instructions to deploy the app on **Vercel** and connect it to **Google Apps Script** so ideas are saved to a Google Sheet.

---

## Prerequisites

- A **Google account** (for Sheets and Apps Script)
- A **Vercel account** ([vercel.com](https://vercel.com))
- An **OpenAI API key** ([platform.openai.com](https://platform.openai.com/api-keys))
- The project code in a **Git repository** (GitHub, GitLab, or Bitbucket) — recommended for Vercel

---

## Part 1: Google Apps Script (Webhook for the Sheet)

### 1.1 Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet.
2. Name it (e.g. **VOW Idea Intake**).
3. You can leave it empty — the script will create the **Ideas** sheet and header row on first use.

### 1.2 Open Apps Script

1. In the spreadsheet, go to **Extensions → Apps Script**.
2. Replace any sample code in `Code.gs` with the contents of the project’s **`apps-script/Code.gs`** file.
3. Save the project (Ctrl/Cmd + S) and name it (e.g. **VOW Idea Webhook**).

### 1.3 Deploy as Web App

1. Click **Deploy → New deployment**.
2. Click the gear icon next to **Select type** and choose **Web app**.
3. Set:
   - **Description:** e.g. `VOW Idea Intake — Production`
   - **Execute as:** **Me** (your Google account)
   - **Who has access:** **Anyone** (so Vercel can POST without logging in)
4. Click **Deploy**.
5. If prompted, **Authorize access**:
   - Choose your Google account.
   - If you see “Google hasn’t verified this app,” click **Advanced → Go to [project name] (unsafe)** (this is your own script).
   - Click **Allow**.
6. Copy the **Web app URL**. It will look like:
   ```text
   https://script.google.com/macros/s/AKfycbz.../exec
   ```
7. Save this URL — you’ll add it to Vercel as `GOOGLE_APPS_SCRIPT_WEBHOOK_URL`.

### 1.4 (Optional) Test the Webhook

You can test that the script accepts POSTs:

```bash
curl -X POST "YOUR_WEB_APP_URL" \
  -H "Content-Type: application/json" \
  -d '{"Timestamp":"2025-03-05T12:00:00Z","Idea (raw)":"Test idea","Repeatability":"","Who for":"","Moment":"","Success":"","Links":"","Idea H1":"Test","Idea H2":"","Bullets":"Test","Type":"Model","Horizon":"H1","Component Area":"","Tags":"","Confidence":"low","Rationale":"","Source":"Web intake","Status":"New"}'
```

If it works, the response is `{"ok":true}` and a new row appears in the **Ideas** sheet.

---

## Part 2: Deploy on Vercel

### 2.1 Import the Project

1. Log in at [vercel.com](https://vercel.com).
2. Click **Add New… → Project**.
3. **Import** the Git repository that contains `vow-idea-generator` (or the repo root if the app is the whole repo).
4. If the app lives in a subfolder (e.g. `vow-idea-generator`), set **Root Directory** to that folder.
5. **Framework Preset** should be **Next.js** (auto-detected). Leave **Build Command** and **Output Directory** as default.
6. Do **not** deploy yet — add environment variables first.

### 2.2 Add Environment Variables

1. In the import screen, open **Environment Variables**.
2. Add:

   | Name                           | Value                    | Environments   |
   |--------------------------------|--------------------------|----------------|
   | `OPENAI_API_KEY`               | Your OpenAI API key      | Production, Preview |
   | `GOOGLE_APPS_SCRIPT_WEBHOOK_URL` | The Web app URL from 1.3 | Production, Preview |

3. For **Production** and **Preview**, either add the same values or use Vercel’s “Preview” to point at a test sheet URL if you prefer.
4. Click **Deploy** (or **Save** then **Deploy**).

### 2.3 Build and Go Live

1. Vercel will build and deploy. Wait for the build to finish.
2. Open the **Visit** link (e.g. `https://your-project.vercel.app`).
3. Submit a test idea. You should see the thank-you screen and a new row in your Google Sheet.

### 2.4 (Optional) Custom Domain

1. In the Vercel project, go to **Settings → Domains**.
2. Add your domain and follow the DNS instructions.
3. After DNS propagates, the app will be available on your domain.

---

## Checklist

- [ ] Google Sheet created
- [ ] Apps Script project created and `Code.gs` pasted
- [ ] Web app deployed with **Execute as: Me**, **Who has access: Anyone**
- [ ] Web app URL copied
- [ ] Vercel project imported from Git
- [ ] `OPENAI_API_KEY` and `GOOGLE_APPS_SCRIPT_WEBHOOK_URL` set in Vercel
- [ ] Build succeeded and test submission writes to the Sheet

---

## Troubleshooting

### Ideas don’t appear in the Sheet

- Confirm **Web app URL** in Vercel matches the Apps Script **Web app URL** (no trailing slash).
- In Apps Script, open **Executions** (left sidebar) and check for errors on recent runs.
- In Vercel, open **Logs** or **Functions** for the deployment and look for failed requests to the webhook (e.g. 4xx/5xx).

### “Failed to save to sheet” or 502

- Apps Script may have hit a quota or thrown an error. Check **Executions** and fix any script errors.
- Ensure **Who has access** is **Anyone** so unauthenticated POSTs are allowed.

### “Improve clarity” or classification doesn’t work

- Verify `OPENAI_API_KEY` in Vercel is correct and has access to the model used in the app (e.g. `gpt-4o-mini`).
- Check **Functions** logs for the `/api/improve-clarity` and `/api/submit` routes.

### Redeploying Apps Script after code changes

1. In Apps Script, edit `Code.gs` and save.
2. Go to **Deploy → Manage deployments**.
3. Open the pencil (Edit) on the existing Web app deployment.
4. Set **Version** to **New version** (and add a description if you like).
5. Click **Deploy**. The **Web app URL** stays the same; no need to update Vercel.

### Redeploying the Next.js app on Vercel

- Push to the connected Git branch; Vercel will auto-deploy.
- Or run a manual **Redeploy** from the Vercel dashboard.

---

## Security Reminders

- Never commit `.env` or `.env.local`; use Vercel’s Environment Variables for production.
- Keep the Apps Script Web app URL private (treat it like a secret). Anyone with the URL can POST rows to your sheet.
- Rate limiting (10 requests per minute per IP) is applied in the Next.js app to reduce abuse.
