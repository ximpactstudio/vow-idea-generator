import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";

const bodySchema = z.object({ idea: z.string().min(1).max(5000) });

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Improve clarity not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { idea } = bodySchema.parse(body);
    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You help refine short innovation ideas for VOW for Girls (ending child marriage through giving). Return only the refined idea text, 1-3 sentences. Keep the same intent; add clarity on who gives, when, or what makes it repeatable if missing.",
        },
        {
          role: "user",
          content: `Refine this idea for clarity. Return only the refined text, no preamble:\n\n"${idea}"`,
        },
      ],
      temperature: 0.4,
      max_tokens: 200,
    });

    const refined = completion.choices[0]?.message?.content?.trim() ?? idea;
    return NextResponse.json({ refined });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid idea" }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json(
      { error: "Could not improve clarity" },
      { status: 500 }
    );
  }
}
