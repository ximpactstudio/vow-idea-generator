"use client";

import { useMemo, useState, useCallback } from "react";
import { IDEA_SPARKS } from "@/lib/constants";

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function pickTwoOrThree(arr: string[]): string[] {
  const n = 2 + Math.floor(Math.random() * 2); // 2 or 3
  const shuffled = shuffle(arr);
  return shuffled.slice(0, Math.min(n, arr.length));
}

export function IdeaSpark() {
  const [prompts, setPrompts] = useState<string[]>(() => pickTwoOrThree(IDEA_SPARKS));

  const reshuffle = useCallback(() => {
    setPrompts(pickTwoOrThree(IDEA_SPARKS));
  }, []);

  return (
    <div className="mt-14 pt-10 border-t border-black/8">
      <h2 className="text-lg font-semibold tracking-tight text-[#1a1a1a]">
        Struggling to come up with an idea?
      </h2>
      <p className="mt-2 text-sm text-[#1a1a1a]/65">
        Here are a few prompts to help generate new thinking.
      </p>
      <ul className="mt-5 space-y-3">
        {prompts.map((p, i) => (
          <li key={`${i}-${p}`} className="font-semibold text-[#1a1a1a]">
            {p}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={reshuffle}
        className="mt-5 text-sm font-medium text-[#1a1a1a]/70 underline hover:text-[#1a1a1a] hover:no-underline"
      >
        Show new prompts
      </button>
    </div>
  );
}
