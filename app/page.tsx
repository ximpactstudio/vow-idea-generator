"use client";

import { useState } from "react";
import { IdeaSpark } from "@/components/IdeaSpark";
import { IdeaForm } from "@/components/IdeaForm";
import { ThankYou } from "@/components/ThankYou";
import type { ClassificationSummary } from "@/lib/types";

export default function IdeasPage() {
  const [submitted, setSubmitted] = useState<ClassificationSummary | null>(null);

  if (submitted) {
    return (
      <ThankYou
        summary={submitted}
        onSubmitAnother={() => setSubmitted(null)}
      />
    );
  }

  return (
    <main className="min-h-screen bg-vow-cream">
      <div className="mx-auto max-w-xl px-6 py-12 sm:py-16">
        <header className="mb-10 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-vow-navy sm:text-3xl">
            Submit a Model Innovation Idea
          </h1>
          <p className="mt-3 text-base text-vow-charcoal/80 sm:text-lg">
            Take two minutes to help shape the future of VOW — and help end child
            marriage.
          </p>
        </header>

        <IdeaSpark />

        <IdeaForm onSuccess={setSubmitted} />

        <p className="mt-10 text-center text-sm text-vow-charcoal/60">
          Ideas submitted this month: <span className="font-medium text-vow-navy">—</span>
        </p>
      </div>
    </main>
  );
}
