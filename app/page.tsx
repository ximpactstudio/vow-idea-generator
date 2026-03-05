"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import IdeaSpark from "@/components/IdeaSpark";
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
      <Header />

      {/* Blush hero band: full width */}
      <section className="bg-vow-blush">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
          {/* Left-aligned hero copy */}
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold uppercase leading-tight tracking-tight text-vow-navy sm:text-4xl md:text-[2.75rem]">
              Submit a{" "}
              <span className="bg-vow-navy px-1.5 py-0.5 text-white">Model</span>{" "}
              <span className="bg-vow-navy px-1.5 py-0.5 text-white">Innovation</span>{" "}
              Idea
            </h1>
            <p className="mt-5 text-base text-vow-navy/90 sm:text-lg leading-relaxed">
              Take two minutes to help shape the future of VOW — and help end child marriage.
            </p>
            <p className="mt-4 text-sm text-vow-muted">
              Your idea helps us unlock more funding for girls&apos; futures.
            </p>
          </div>

          {/* Form card: white panel inside blush */}
          <div className="mt-10 sm:mt-12">
            <div className="rounded-lg border border-vow-navy/10 bg-white p-6 shadow-sm sm:p-8">
              <IdeaForm
                onSuccess={(summary, newCount) => {
                  setSubmitted(summary);
                  if (typeof newCount === "number") setIdeasCount(newCount);
                }}
              />
            </div>
          </div>

          {/* Ideas submitted counter */}
          <div className="mt-10 flex flex-col gap-1 border-t border-vow-navy/10 pt-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-vow-muted">
              Ideas submitted
            </span>
            <span className="text-4xl font-bold tracking-tight text-vow-navy sm:text-5xl">
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
