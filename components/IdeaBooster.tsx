"use client";

import { useState } from "react";
import { NUDGES } from "@/lib/constants";

interface IdeaBoosterProps {
  idea: string;
  isShort: boolean;
  nudgeIndices: number[];
  onIdeaUpdate: (value: string) => void;
}

export function IdeaBooster({ idea, isShort, nudgeIndices, onIdeaUpdate }: IdeaBoosterProps) {
  const [improving, setImproving] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const handleImprove = async () => {
    if (!idea.trim()) return;
    setImproving(true);
    setSuggestion(null);
    try {
      const res = await fetch("/api/improve-clarity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: idea.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.refined) setSuggestion(data.refined);
    } catch {
      setSuggestion(null);
    } finally {
      setImproving(false);
    }
  };

  if (!idea.trim()) return null;

  const displayNudges = nudgeIndices.slice(0, 2).map((i) => NUDGES[i]);

  return (
    <div className="rounded-lg border border-black/8 bg-[#fafaf9] px-4 py-3">
      <p className="text-sm text-[#1a1a1a]/80">
        {isShort ? (
          <>Nice — clear starting point.</>
        ) : (
          <>
            Consider:{" "}
            {displayNudges.join(" • ")}
          </>
        )}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleImprove}
          disabled={improving}
          className="text-xs font-medium text-[#1a1a1a]/70 underline hover:no-underline hover:text-[#1a1a1a] disabled:opacity-50"
        >
          {improving ? "Thinking…" : "Improve clarity (optional)"}
        </button>
      </div>
      {suggestion && (
        <div className="mt-3 rounded-lg border border-black/8 bg-white p-3">
          <p className="text-xs font-medium uppercase tracking-wider text-[#1a1a1a]/60">Suggested refinement</p>
          <p className="mt-1.5 text-sm text-[#1a1a1a]">{suggestion}</p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => {
                onIdeaUpdate(suggestion);
                setSuggestion(null);
              }}
              className="rounded-full bg-[#1a1a1a] px-3 py-1.5 text-xs font-medium text-white hover:bg-black"
            >
              Use this
            </button>
            <button
              type="button"
              onClick={() => setSuggestion(null)}
              className="text-xs text-[#1a1a1a]/60 hover:text-[#1a1a1a]"
            >
              Keep mine
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
