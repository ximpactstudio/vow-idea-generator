"use client";

import { useState } from "react";
import type { ClassificationSummary } from "@/lib/types";
import { IdeaBooster } from "./IdeaBooster";
import { NUDGES, SHORT_IDEA_THRESHOLD } from "@/lib/constants";

interface IdeaFormProps {
  onSuccess: (summary: ClassificationSummary, ideasSubmitted?: number) => void;
}

export function IdeaForm({ onSuccess }: IdeaFormProps) {
  const [idea, setIdea] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [repeatability, setRepeatability] = useState("");
  const [whoFor, setWhoFor] = useState("");
  const [moment, setMoment] = useState("");
  const [success, setSuccess] = useState("");
  const [links, setLinks] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = idea.trim();
    if (!trimmed) {
      setError("Please share your idea.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: trimmed,
          name: name.trim() || undefined,
          email: email.trim() || undefined,
          repeatability: repeatability.trim() || undefined,
          whoFor: whoFor.trim() || undefined,
          moment: moment.trim() || undefined,
          success: success.trim() || undefined,
          links: links.trim() || undefined,
          honeypot: honeypot || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      const summary = data.classification
        ? data.classification
        : {
            idea_h1: trimmed.slice(0, 80),
            idea_h2: "",
            bullets: [trimmed.slice(0, 120)],
            type: "Model",
            horizon: "H1",
          };
      const newCount =
        typeof data.ideas_submitted === "number" ? data.ideas_submitted : undefined;
      onSuccess(summary, newCount);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isShort = idea.length > 0 && idea.length < SHORT_IDEA_THRESHOLD;
  const nudgeIndices = isShort ? [] : [0, 1].map((i) => i % NUDGES.length);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot — hidden from users */}
      <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
        <label htmlFor="website_url">Website</label>
        <input
          id="website_url"
          name="website_url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="idea" className="block text-sm font-semibold uppercase tracking-wider text-vow-navy">
          Idea
        </label>
        <textarea
          id="idea"
          name="idea"
          required
          rows={4}
          placeholder='e.g. "What if couples could automatically donate when guests RSVP?"'
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          className="mt-3 w-full rounded-lg border border-vow-navy/15 bg-white px-4 py-3 text-vow-navy placeholder:text-vow-muted focus:border-vow-coral focus:outline-none focus:ring-1 focus:ring-vow-coral"
        />
        <p className="mt-2 text-sm text-vow-muted">
          Big, small, half-formed — all ideas welcome.
        </p>
      </div>

      <IdeaBooster
        idea={idea}
        isShort={isShort}
        nudgeIndices={nudgeIndices}
        onIdeaUpdate={setIdea}
      />

      {/* Optional expandable: Name, Email + context */}
      <div className="rounded-lg border border-vow-navy/10 bg-white">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-vow-muted hover:text-vow-navy"
        >
          Add more context (optional)
          <span className="text-vow-coral">{expanded ? "−" : "+"}</span>
        </button>
        {expanded && (
          <div className="space-y-4 border-t border-vow-navy/10 px-4 pb-4 pt-3">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-vow-muted">
                Your name (optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-lg border border-vow-navy/10 bg-white px-3 py-2 text-sm text-vow-navy placeholder:text-vow-muted focus:border-vow-coral focus:outline-none"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-vow-muted">
                Your email (optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-lg border border-vow-navy/10 bg-white px-3 py-2 text-sm text-vow-navy placeholder:text-vow-muted focus:border-vow-coral focus:outline-none"
                placeholder="Optional"
              />
              <p className="mt-1 text-xs text-vow-muted">
                Only if you&apos;re open to follow-up — we won&apos;t spam you.
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-vow-muted">
                What makes this repeatable?
              </label>
              <p className="mt-0.5 text-xs text-vow-muted/80">
                If this works once, what makes it happen again?
              </p>
              <input
                type="text"
                value={repeatability}
                onChange={(e) => setRepeatability(e.target.value)}
                className="mt-2 w-full rounded-lg border border-vow-navy/10 bg-white px-3 py-2 text-sm text-vow-navy placeholder:text-vow-muted focus:border-vow-coral focus:outline-none"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-vow-muted">
                Who is this for?
              </label>
              <input
                type="text"
                value={whoFor}
                onChange={(e) => setWhoFor(e.target.value)}
                className="mt-2 w-full rounded-lg border border-vow-navy/10 bg-white px-3 py-2 text-sm text-vow-navy placeholder:text-vow-muted focus:border-vow-coral focus:outline-none"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-vow-muted">
                What moment does it connect to?
              </label>
              <input
                type="text"
                value={moment}
                onChange={(e) => setMoment(e.target.value)}
                className="mt-2 w-full rounded-lg border border-vow-navy/10 bg-white px-3 py-2 text-sm text-vow-navy placeholder:text-vow-muted focus:border-vow-coral focus:outline-none"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-vow-muted">
                What would success look like?
              </label>
              <input
                type="text"
                value={success}
                onChange={(e) => setSuccess(e.target.value)}
                className="mt-2 w-full rounded-lg border border-vow-navy/10 bg-white px-3 py-2 text-sm text-vow-navy placeholder:text-vow-muted focus:border-vow-coral focus:outline-none"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-vow-muted">
                Any links or references?
              </label>
              <input
                type="text"
                value={links}
                onChange={(e) => setLinks(e.target.value)}
                className="mt-2 w-full rounded-lg border border-vow-navy/10 bg-white px-3 py-2 text-sm text-vow-navy placeholder:text-vow-muted focus:border-vow-coral focus:outline-none"
                placeholder="Optional"
              />
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !idea.trim()}
        className="w-full rounded-full bg-vow-coral px-6 py-3.5 font-bold uppercase tracking-wider text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto sm:px-10"
      >
        {loading ? "Submitting…" : "Submit idea"}
      </button>
    </form>
  );
}
