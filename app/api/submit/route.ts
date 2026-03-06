import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type SubmitBody = {
  idea?: string;
  repeatability?: string;
  name?: string;
  email?: string;
  moment?: string;
  success?: string;
  links?: string;
  horizon?: string;
  source?: string; // renamed from confidence
};

export async function POST(req: Request) {
  try {
    const webhookUrl = process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Missing GOOGLE_APPS_SCRIPT_WEBHOOK_URL (set it in Vercel Environment Variables).",
        },
        { status: 500 }
      );
    }

    const body = (await req.json()) as SubmitBody;

    const payload = {
      idea: body.idea ?? "",
      repeatability: body.repeatability ?? "",
      name: body.name ?? "",
      email: body.email ?? "",
      moment: body.moment ?? "",
      success: body.success ?? "",
      links: body.links ?? "",
      horizon: body.horizon ?? "",
      source: body.source ?? "",
    };

    // Best-effort call to Apps Script (do not break UX if it fails)
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
        cache: "no-store",
        body: JSON.stringify(payload),
      });

      // Read response (optional, but helpful for debugging)
      const text = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        data = { ok: res.ok, raw: text };
      }

      return NextResponse.json(
        { ok: true, sheets: data },
        { headers: { "Cache-Control": "no-store" } }
      );
    } catch (err) {
      console.error("Sheets webhook failed:", err);
      // Still return ok:true so the UI doesn't break
      return NextResponse.json(
        { ok: true, sheets: { ok: false, error: "Webhook request failed" } },
        { headers: { "Cache-Control": "no-store" } }
      );
    }
  } catch (error) {
    console.error("Submit API error:", error);
    return NextResponse.json(
      { ok: false, error: "Submission failed" },
      { status: 500 }
    );
  }
}