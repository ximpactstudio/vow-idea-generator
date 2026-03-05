import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";
import { classifyIdea } from "@/lib/classify";
import type { SheetRow } from "@/lib/types";

const bodySchema = z.object({
  idea: z.string().min(1).max(10000),
  name: z.string().max(500).optional(),
  email: z.string().max(500).optional(),
  repeatability: z.string().max(2000).optional(),
  whoFor: z.string().max(1000).optional(),
  moment: z.string().max(1000).optional(),
  success: z.string().max(1000).optional(),
  links: z.string().max(2000).optional(),
  honeypot: z.string().max(0).optional(), // must be empty
});

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous";
  const rate = checkRateLimit(ip);
  if (!rate.ok) {
    return NextResponse.json(
      { error: "Too many submissions. Try again later.", retryAfter: rate.retryAfter },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const parsed = bodySchema.parse(body);
    if (parsed.honeypot && parsed.honeypot.length > 0) {
      return NextResponse.json({ ok: true }); // silent success for bots
    }

    const classification = await classifyIdea(parsed.idea);

    const webhookUrl = process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL;
    if (webhookUrl) {
      const row: SheetRow = {
        Timestamp: new Date().toISOString(),
        Name: parsed.name ?? "",
        Email: parsed.email ?? "",
        "Idea (raw)": parsed.idea,
        Repeatability: parsed.repeatability ?? "",
        "Who for": parsed.whoFor ?? "",
        Moment: parsed.moment ?? "",
        Success: parsed.success ?? "",
        Links: parsed.links ?? "",
        "Idea H1": classification.idea_h1,
        "Idea H2": classification.idea_h2,
        Bullets: classification.bullets.join("\n"),
        Type: classification.type,
        Horizon: classification.horizon,
        "Component Area": classification.component_area,
        Tags: classification.tags.join(", "),
        Confidence: classification.confidence,
        Rationale: classification.rationale,
        Source: "Web intake",
        Status: "New",
      };

      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(row),
      });

      if (!res.ok) {
        console.error("Webhook error:", res.status, await res.text());
        return NextResponse.json(
          { error: "Failed to save to sheet" },
          { status: 502 }
        );
      }

      const webhookData = await res.json().catch(() => ({}));
      const ideasSubmitted =
        typeof webhookData.ideas_submitted === "number"
          ? webhookData.ideas_submitted
          : undefined;

      return NextResponse.json({
        ok: true,
        classification: {
          idea_h1: classification.idea_h1,
          idea_h2: classification.idea_h2,
          bullets: classification.bullets,
          type: classification.type,
          horizon: classification.horizon,
        },
        ...(ideasSubmitted !== undefined && { ideas_submitted: ideasSubmitted }),
      });
    }
    return NextResponse.json({
      ok: true,
      classification: {
        idea_h1: classification.idea_h1,
        idea_h2: classification.idea_h2,
        bullets: classification.bullets,
        type: classification.type,
        horizon: classification.horizon,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid submission", details: err.flatten() },
        { status: 400 }
      );
    }
    console.error(err);
    return NextResponse.json(
      { error: "Submission failed" },
      { status: 500 }
    );
  }
}
