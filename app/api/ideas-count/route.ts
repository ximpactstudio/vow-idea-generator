import { NextResponse } from "next/server";

/**
 * GET /api/ideas-count
 * Fetches the current "Ideas submitted" count from the Apps Script Meta sheet
 * (doGet returns { ideas_submitted: number }). Used for initial page load.
 */
export async function GET() {
  const webhookUrl = process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ ideas_submitted: 172 });
  }
  try {
    const res = await fetch(webhookUrl, { method: "GET", cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    const count =
      typeof data.ideas_submitted === "number" ? data.ideas_submitted : 172;
    return NextResponse.json({ ideas_submitted: count });
  } catch {
    return NextResponse.json({ ideas_submitted: 172 });
  }
}
