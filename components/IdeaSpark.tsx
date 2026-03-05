"use client";

import { useEffect, useMemo, useState } from "react";

const ALL_PROMPTS = [
  "Where does money already flow that could include VOW?",
  "Who else could be the giver besides the couple?",
  "What would make giving feel like part of the moment?",
  "What could make giving happen automatically?",
  "What partnership could unlock a new stream of giving?",
  "What’s one friction we could remove to increase giving?",
];

function pickPrompts(count: number) {
  const shuffled = [...ALL_PROMPTS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function IdeaSpark() {
  // Render a stable initial state to avoid hydration mismatch
  const initial = useMemo(() => ALL_PROMPTS.slice(0, 3), []);
  const [prompts, setPrompts] = useState<string[]>(initial);

  useEffect(() => {
    // After hydration, randomize safely on the client
    setPrompts(pickPrompts(3));
  }, []);

  return (
    <section className="mt-10">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-xl font-extrabold text-[var(--vow-ink)]">
          Struggling to come up with an idea?
        </h2>
        <p className="mt-2 text-[var(--vow-muted)]">
          Here are a few prompts to help generate new thinking.
        </p>

        <div className="mt-5 space-y-3">
          {prompts.slice(0, 3).map((p) => (
            <div
              key={p}
              className="text-lg font-bold text-[var(--vow-ink)]"
            >
              {p}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setPrompts(pickPrompts(3))}
          className="mt-4 text-sm font-semibold text-[var(--vow-coral)] hover:underline"
        >
          Show new prompts
        </button>
      </div>
    </section>
  );
}