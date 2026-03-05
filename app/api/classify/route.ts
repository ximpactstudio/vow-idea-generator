import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { classifyIdea } from "@/lib/classify";

const bodySchema = z.object({ idea: z.string().min(1).max(10000) });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idea } = bodySchema.parse(body);
    const result = await classifyIdea(idea);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid idea" }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json(
      { error: "Classification failed" },
      { status: 500 }
    );
  }
}
