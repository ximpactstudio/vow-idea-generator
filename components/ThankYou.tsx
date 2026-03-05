"use client";

import type { ClassificationSummary } from "@/lib/types";
import Header from "@/components/Header";

interface ThankYouProps {
  summary: ClassificationSummary;
  ideasCount?: number;
  onSubmitAnother: () => void;
}

export function ThankYou({ summary, ideasCount, onSubmitAnother }: ThankYouProps) {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="bg-vow-blush">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="rounded-lg border border-vow-navy/10 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold uppercase tracking-tight text-vow-navy">
              Thank you — your idea is in the pipeline.
            </h2>
            <div className="mt-6 space-y-4 text-sm">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-vow-muted">Idea H1</span>
                <p className="mt-1 text-vow-navy">{summary.idea_h1}</p>
              </div>
              {summary.idea_h2 && (
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-vow-muted">Idea H2</span>
                  <p className="mt-1 text-vow-navy">{summary.idea_h2}</p>
                </div>
              )}
              {summary.bullets.length > 0 && (
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-vow-muted">Summary</span>
                  <ul className="mt-1 list-inside list-disc space-y-0.5 text-vow-navy">
                    {summary.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="rounded-full border border-vow-navy/15 bg-vow-blush/50 px-3 py-1 text-xs font-medium text-vow-navy">
                  {summary.type}
                </span>
                <span className="rounded-full border border-vow-navy/15 bg-vow-blush/50 px-3 py-1 text-xs font-medium text-vow-navy">
                  {summary.horizon}
                </span>
              </div>
            </div>
            {typeof ideasCount === "number" && (
              <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-vow-muted">
                Ideas submitted: <span className="font-bold text-vow-navy">{ideasCount}</span>
              </p>
            )}
            <button
              type="button"
              onClick={onSubmitAnother}
              className="mt-8 rounded-full bg-vow-coral px-8 py-3 font-bold uppercase tracking-wider text-white transition hover:opacity-90"
            >
              Submit another idea
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
