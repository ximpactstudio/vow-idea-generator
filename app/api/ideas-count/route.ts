import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const webhookUrl = process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      { ideas_submitted: null, error: "Missing GOOGLE_APPS_SCRIPT_WEBHOOK_URL" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }

  // If your Apps Script supports doGet(), this should return JSON
  const res = await fetch(webhookUrl, {
    method: "GET",
    cache: "no-store",
  });

  const data = await res.json();

  return NextResponse.json(data, {
    headers: {
      // Extra aggressive no-cache headers (helps with CDNs/proxies)
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}