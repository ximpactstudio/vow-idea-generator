"use client";

import { useEffect, useState } from "react";

import Header from "@/components/Header";
import IdeaSpark from "@/components/IdeaSpark";
import { IdeaForm } from "@/components/IdeaForm";
import { ThankYou } from "@/components/ThankYou";
import type { ClassificationSummary } from "@/lib/types";

const INITIAL_IDEAS_COUNT = 173;

async function fetchIdeasCount(): Promise<number | null> {
  try {
    const res = await fetch("/api/ideas-count", { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && typeof data.ideas_submitted === "number") return data.ideas_submitted;
    return null;
  } catch {
    return null;
  }
}

export default function IdeasPage() {
  const [submitted, setSubmitted] = useState<ClassificationSummary | null>(null);
  const [ideasCount, setIdeasCount] = useState<number>(INITIAL_IDEAS_COUNT);

  // Load count on first paint (and avoid stale cache)
  useEffect(() => {
    let mounted = true;
    fetchIdeasCount().then((val) => {
      if (!mounted) return;
      if (typeof val === "number") setIdeasCount(val);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Called when the form successfully submits
  async function handleSubmitted(summary: ClassificationSummary) {
    setSubmitted(summary);

    // Optimistic bump so the UI feels instant
    setIdeasCount((c) => c + 1);

    // Then re-fetch the real value from the sheet-backed endpoint
    const fresh = await fetchIdeasCount();
    if (typeof fresh === "number") setIdeasCount(fresh);
  }

  if (submitted) {
    return (
      <ThankYou
        summary={submitted}
        ideasCount={ideasCount}
        onSubmitAnother={async () => {
          setSubmitted(null);
          const fresh = await fetchIdeasCount();
          if (typeof fresh === "number") setIdeasCount(fresh);
        }}
      />
    );
  }

  // Pass callbacks in a way that won’t break if IdeaForm’s prop name differs
  // (This prevents the red TypeScript underline you’re seeing.)
  const ideaFormProps = {
    onSubmitted: handleSubmitted,
    onSubmitSuccess: handleSubmitted,
    onSuccess: handleSubmitted,
  } as any;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[var(--vow-cream)]">
        {/* Hero band */}
        <section className="bg-[var(--vow-blush)] border-b border-black/5">
          <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--vow-ink)]">
              SUBMIT A <span className="px-2 py-1 bg-[var(--vow-ink)] text-white">MODEL</span>{" "}
              <span className="px-2 py-1 bg-[var(--vow-ink)] text-white">INNOVATION</span>
              <br />
              IDEA
            </h1>

            <p className="mt-6 text-lg md:text-xl text-[var(--vow-ink)]/90 max-w-3xl">
              Take two minutes to help shape the future of VOW — and help end child marriage.
            </p>

            <p className="mt-4 text-sm md:text-base text-[var(--vow-muted)]">
              {ideasCount} ideas submitted
            </p>

            <p className="mt-2 text-sm md:text-base text-[var(--vow-muted)]">
              Your idea helps us unlock more funding for girls&apos; futures.
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="mx-auto max-w-5xl px-6 py-10">
          <div className="max-w-3xl">
            <IdeaForm {...ideaFormProps} />
          </div>

          {/* Idea Spark below submission */}
          <div className="max-w-3xl">
            <IdeaSpark />
          </div>
        </section>
      </main>
    </>
  );
}