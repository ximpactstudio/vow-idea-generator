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
    <div className="rounded-lg border border-vow-navy/10 bg-vow-blush/30 px-4 py-3">
      <p className="text-sm text-vow-navy/90">
        {isShort ? (
          <>Nice — clear starting point.</>
        ) : (
          <>
            Consider:{" "}
            {displayNudges.join(" • ")}
          </>
        )}
      </p>
      <div className="mt-2">
        <button
          type="button"
          onClick={handleImprove}
          disabled={improving}
          className="text-xs font-medium text-vow-coral underline hover:no-underline disabled:opacity-50"
        >
          {improving ? "Thinking…" : "Improve clarity (optional)"}
        </button>
      </div>
      {suggestion && (
        <div className="mt-3 rounded-lg border border-vow-navy/10 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-vow-muted">Suggested refinement</p>
          <p className="mt-1.5 text-sm text-vow-navy">{suggestion}</p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => {
                onIdeaUpdate(suggestion);
                setSuggestion(null);
              }}
              className="rounded-full bg-vow-coral px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
            >
              Use this
            </button>
            <button
              type="button"
              onClick={() => setSuggestion(null)}
              className="text-xs text-vow-muted hover:text-vow-navy"
            >
              Keep mine
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
