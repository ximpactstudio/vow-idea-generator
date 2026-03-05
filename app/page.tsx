"use client";

import { useState, useEffect } from "react";
import { IdeaSpark } from "@/components/IdeaSpark";
import { IdeaForm } from "@/components/IdeaForm";
import { ThankYou } from "@/components/ThankYou";
import type { ClassificationSummary } from "@/lib/types";

const INITIAL_IDEAS_COUNT = 172;

export default function IdeasPage() {
  const [submitted, setSubmitted] = useState<ClassificationSummary | null>(null);
  const [ideasCount, setIdeasCount] = useState<number>(INITIAL_IDEAS_COUNT);

  useEffect(() => {
    fetch("/api/ideas-count")
      .then((res) => res.ok && res.json())
      .then((data) => {
        if (data && typeof data.ideas_submitted === "number") {
          setIdeasCount(data.ideas_submitted);
        }
      })
      .catch(() => {});
  }, []);

  if (submitted) {
    return (
      <ThankYou
        summary={submitted}
        ideasCount={ideasCount}
        onSubmitAnother={() => setSubmitted(null)}
      />
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header: wordmark + micro-CTA */}
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

      {/* Hero band */}
      <section className="border-b border-black/5 bg-[#fafaf9] px-6 pb-12 pt-10 sm:pb-16 sm:pt-14">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-2xl font-semibold uppercase tracking-tight text-[#1a1a1a] sm:text-3xl">
            Submit a Model Innovation Idea
          </h1>
          <p className="mt-4 mx-auto max-w-lg text-base text-[#1a1a1a]/75 sm:text-lg leading-relaxed">
            Take two minutes to help shape the future of VOW — and help end child marriage.
          </p>
          <p className="mt-5 text-sm font-normal text-[#1a1a1a]/55">
            Your idea helps us unlock more funding for girls&apos; futures.
          </p>
        </div>
      </section>

      {/* Form section */}
      <section className="px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-xl">
          <IdeaForm
            onSuccess={(summary, newCount) => {
              setSubmitted(summary);
              if (typeof newCount === "number") setIdeasCount(newCount);
            }}
          />

          {/* Ideas submitted counter: below form/CTA */}
          <div className="mt-10 flex flex-col items-center gap-1 border-t border-black/8 pt-8">
            <span className="text-xs font-medium uppercase tracking-wider text-[#1a1a1a]/55">
              Ideas submitted
            </span>
            <span className="text-3xl font-bold tracking-tight text-[#1a1a1a] sm:text-4xl">
              {ideasCount}
            </span>
          </div>

          {/* Idea Spark: below counter */}
          <IdeaSpark />
        </div>
      </section>
    </main>
  );
}
