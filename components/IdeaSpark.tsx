"use client";

import { useMemo } from "react";
import { IDEA_SPARKS } from "@/lib/constants";

export function IdeaSpark() {
  const prompt = useMemo(
    () => IDEA_SPARKS[Math.floor(Math.random() * IDEA_SPARKS.length)],
    []
  );

  return (
    <div className="mb-8 rounded-xl border border-vow-gold/30 bg-vow-gold/5 px-5 py-4">
      <p className="text-xs font-medium uppercase tracking-wider text-vow-gold-dark/80">
        Idea Spark
      </p>
      <p className="mt-1 text-vow-navy">{prompt}</p>
    </div>
  );
}
