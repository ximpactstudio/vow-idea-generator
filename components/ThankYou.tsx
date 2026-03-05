"use client";

import type { ClassificationSummary } from "@/lib/types";

interface ThankYouProps {
  summary: ClassificationSummary;
  onSubmitAnother: () => void;
}

export function ThankYou({ summary, onSubmitAnother }: ThankYouProps) {
  return (
    <main className="min-h-screen bg-vow-cream">
      <div className="mx-auto max-w-xl px-6 py-12 sm:py-16">
        <div className="rounded-2xl border border-vow-gold/30 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-vow-navy">
            Thank you — your idea is in the pipeline.
          </h2>
          <div className="mt-6 space-y-4 text-sm">
            <div>
              <span className="font-medium text-vow-charcoal/70">Idea H1</span>
              <p className="mt-0.5 text-vow-charcoal">{summary.idea_h1}</p>
            </div>
            {summary.idea_h2 && (
              <div>
                <span className="font-medium text-vow-charcoal/70">Idea H2</span>
                <p className="mt-0.5 text-vow-charcoal">{summary.idea_h2}</p>
              </div>
            )}
            {summary.bullets.length > 0 && (
              <div>
                <span className="font-medium text-vow-charcoal/70">Summary</span>
                <ul className="mt-0.5 list-inside list-disc space-y-0.5 text-vow-charcoal">
                  {summary.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="rounded-full bg-vow-gold/20 px-3 py-1 text-vow-navy">
                {summary.type}
              </span>
              <span className="rounded-full bg-vow-navy/10 px-3 py-1 text-vow-navy">
                {summary.horizon}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onSubmitAnother}
            className="mt-8 w-full rounded-lg bg-vow-gold px-4 py-3 font-medium text-vow-navy transition hover:bg-vow-gold-dark hover:text-white sm:w-auto sm:px-6"
          >
            Submit another idea
          </button>
        </div>
      </div>
    </main>
  );
}
