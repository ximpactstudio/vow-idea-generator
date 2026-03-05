"use client";

import type { ClassificationSummary } from "@/lib/types";

interface ThankYouProps {
  summary: ClassificationSummary;
  ideasCount?: number;
  onSubmitAnother: () => void;
}

export function ThankYou({ summary, ideasCount, onSubmitAnother }: ThankYouProps) {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-black/5 bg-[#fafaf9]">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <span className="text-sm font-semibold tracking-tight text-[#1a1a1a]">
            VOW for Girls
          </span>
          <span className="text-xs font-medium uppercase tracking-widest text-[#1a1a1a]/70">
            Take the VOW
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-xl px-6 py-12 sm:py-16">
        <div className="rounded-lg border border-black/8 bg-[#fafaf9] p-8">
          <h2 className="text-xl font-semibold tracking-tight text-[#1a1a1a]">
            Thank you — your idea is in the pipeline.
          </h2>
          <div className="mt-6 space-y-4 text-sm">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/70">Idea H1</span>
              <p className="mt-1 text-[#1a1a1a]">{summary.idea_h1}</p>
            </div>
            {summary.idea_h2 && (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/70">Idea H2</span>
                <p className="mt-1 text-[#1a1a1a]">{summary.idea_h2}</p>
              </div>
            )}
            {summary.bullets.length > 0 && (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/70">Summary</span>
                <ul className="mt-1 list-inside list-disc space-y-0.5 text-[#1a1a1a]">
                  {summary.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-[#1a1a1a]">
                {summary.type}
              </span>
              <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-[#1a1a1a]">
                {summary.horizon}
              </span>
            </div>
          </div>
          {typeof ideasCount === "number" && (
            <p className="mt-6 text-xs font-medium uppercase tracking-wider text-[#1a1a1a]/55">
              Ideas submitted: <span className="font-bold text-[#1a1a1a]">{ideasCount}</span>
            </p>
          )}
          <button
            type="button"
            onClick={onSubmitAnother}
            className="mt-8 rounded-full bg-[#1a1a1a] px-6 py-3 font-semibold text-white transition hover:bg-black sm:px-10"
          >
            Submit another idea
          </button>
        </div>
      </div>
    </main>
  );
}
