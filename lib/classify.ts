import type { ClassificationResult, IdeaType, Horizon, Confidence } from "./types";

const CLASSIFICATION_SYSTEM = `You classify innovation ideas for VOW for Girls (ending child marriage through giving at life moments).

TYPE DEFINITIONS:
- Model: A repeatable way money flows to VOW — who gives, when they give, and why it happens again.
- Component: A critical part of the model that must work for the money to flow.
- Tactic: A specific action we run to test or activate one part of the model right now.
- Test: A deliberately designed experiment that uses a tactic to generate evidence.

HORIZON DEFINITIONS (not time-bound):
- H1 — Core Model: Wedding-based fundraising (conversion, guest engagement, tools, storytelling).
- H2 — Adjacent Rituals: Applying the model to other rituals (birthdays, anniversaries, memorials, coming-of-age, other ceremonies).
- H3 — New Non-Ritual Models: Funding outside rituals (identity-based giving, embedded finance, partnerships, always-on giving).

COMPONENT AREAS: Audience, Moment/Timing, Narrative/Messaging, Format/Tool, Channel/Distribution, Partner/Steward, Economics/LTV.

Respond with valid JSON only, no markdown or extra text.`;

export async function classifyIdea(idea: string): Promise<ClassificationResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return getFallbackClassification(idea);
  }

  try {
    const { OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: CLASSIFICATION_SYSTEM },
        {
          role: "user",
          content: `Classify this idea and return strict JSON:\n\n"${idea}"\n\nJSON shape: { "idea_h1": string, "idea_h2": string, "bullets": string[3], "type": "Model"|"Component"|"Tactic"|"Test", "horizon": "H1"|"H2"|"H3", "component_area": string, "tags": string[], "confidence": "low"|"medium"|"high", "rationale": string }`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("Empty classification response");

    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return normalizeClassification(parsed, idea);
  } catch (err) {
    console.error("Classification error:", err);
    return getFallbackClassification(idea);
  }
}

function normalizeClassification(
  raw: Record<string, unknown>,
  idea: string
): ClassificationResult {
  const bullets = Array.isArray(raw.bullets)
    ? (raw.bullets as string[]).slice(0, 3)
    : [idea.slice(0, 120) + (idea.length > 120 ? "…" : "")];

  const type = ["Model", "Component", "Tactic", "Test"].includes(
    String(raw.type)
  )
    ? (raw.type as IdeaType)
    : "Model";

  const horizon = ["H1", "H2", "H3"].includes(String(raw.horizon))
    ? (raw.horizon as Horizon)
    : "H1";

  const confidence = ["low", "medium", "high"].includes(String(raw.confidence))
    ? (raw.confidence as Confidence)
    : "medium";

  return {
    idea_h1: String(raw.idea_h1 ?? idea.slice(0, 80)),
    idea_h2: String(raw.idea_h2 ?? ""),
    bullets: bullets.map(String),
    type,
    horizon,
    component_area: String(raw.component_area ?? ""),
    tags: Array.isArray(raw.tags) ? (raw.tags as string[]) : [],
    confidence,
    rationale: String(raw.rationale ?? ""),
  };
}

function getFallbackClassification(idea: string): ClassificationResult {
  return {
    idea_h1: idea.slice(0, 80) + (idea.length > 80 ? "…" : ""),
    idea_h2: "",
    bullets: [idea.slice(0, 120) + (idea.length > 120 ? "…" : "")],
    type: "Model",
    horizon: "H1",
    component_area: "",
    tags: [],
    confidence: "low",
    rationale: "Classification unavailable; default values used.",
  };
}
