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

  return (
    <div className="rounded-lg border border-vow-gold/20 bg-vow-gold/5 px-4 py-3">
      <p className="text-sm text-vow-navy/90">
        {isShort ? (
          <>Nice — clear starting point.</>
        ) : (
          <>
            Consider:{" "}
            {nudgeIndices.slice(0, 2).map((i) => NUDGES[i]).join(" • ")}
          </>
        )}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleImprove}
          disabled={improving}
          className="text-xs font-medium text-vow-gold-dark underline hover:no-underline disabled:opacity-50"
        >
          {improving ? "Thinking…" : "Improve clarity (optional)"}
        </button>
      </div>
      {suggestion && (
        <div className="mt-3 rounded border border-vow-gold/30 bg-white/80 p-3">
          <p className="text-xs font-medium text-vow-charcoal/70">Suggested refinement:</p>
          <p className="mt-1 text-sm text-vow-charcoal">{suggestion}</p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => {
                onIdeaUpdate(suggestion);
                setSuggestion(null);
              }}
              className="rounded bg-vow-gold/20 px-2 py-1 text-xs font-medium text-vow-navy hover:bg-vow-gold/30"
            >
              Use this
            </button>
            <button
              type="button"
              onClick={() => setSuggestion(null)}
              className="text-xs text-vow-charcoal/60 hover:text-vow-charcoal"
            >
              Keep mine
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
