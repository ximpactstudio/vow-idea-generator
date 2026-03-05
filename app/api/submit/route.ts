import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const webhook = process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL;

    const payload = {
      idea: body.idea || "",
      name: body.name || "",
      email: body.email || "",
      repeatability: body.repeatability || "",
      who_for: body.who_for || "",
      moment: body.moment || "",
      success: body.success || "",
      links: body.links || "",
      idea_h1: body.idea_h1 || "",
      idea_h2: body.idea_h2 || "",
      idea_h3: body.idea_h3 || "",
      bullets: body.bullets || "",
      type: body.type || "",
      horizon: body.horizon || "",
      component: body.component || "",
      area: body.area || "",
      tags: body.tags || "",
      confidence: body.confidence || "",
      rationale: body.rationale || "",
    };

    // Send to Google Sheets (non-blocking / resilient)
    if (webhook) {
      try {
        await fetch(webhook, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.error("Sheets webhook failed:", err);
      }
    }

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error("Submit API error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Submission failed",
      },
      { status: 500 }
    );
  }
}