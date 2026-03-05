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
        <label htmlFor="idea" className="block text-sm font-semibold uppercase tracking-wider text-[#1a1a1a]/90">
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
          className="mt-3 w-full rounded-lg border border-black/12 bg-white px-4 py-3 text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:border-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]"
        />
        <p className="mt-2 text-sm text-[#1a1a1a]/60">
          Big, small, half-formed — all ideas welcome.
        </p>
      </div>

      <IdeaBooster
        idea={idea}
        isShort={isShort}
        nudgeIndices={nudgeIndices}
        onIdeaUpdate={setIdea}
      />

      {/* Optional expandable */}
      <div className="rounded-lg border border-black/8 bg-[#fafaf9]">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-[#1a1a1a]/80 hover:text-[#1a1a1a]"
        >
          Add more context (optional)
          <span className="text-[#1a1a1a]/60">{expanded ? "−" : "+"}</span>
        </button>
        {expanded && (
          <div className="space-y-4 border-t border-black/8 px-4 pb-4 pt-3">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#1a1a1a]/70">
                What makes this repeatable?
              </label>
              <p className="mt-0.5 text-xs text-[#1a1a1a]/50">
                If this works once, what makes it happen again?
              </p>
              <input
                type="text"
                value={repeatability}
                onChange={(e) => setRepeatability(e.target.value)}
                className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:border-[#1a1a1a] focus:outline-none"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#1a1a1a]/70">
                Who is this for?
              </label>
              <input
                type="text"
                value={whoFor}
                onChange={(e) => setWhoFor(e.target.value)}
                className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:border-[#1a1a1a] focus:outline-none"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#1a1a1a]/70">
                What moment does it connect to?
              </label>
              <input
                type="text"
                value={moment}
                onChange={(e) => setMoment(e.target.value)}
                className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:border-[#1a1a1a] focus:outline-none"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#1a1a1a]/70">
                What would success look like?
              </label>
              <input
                type="text"
                value={success}
                onChange={(e) => setSuccess(e.target.value)}
                className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:border-[#1a1a1a] focus:outline-none"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#1a1a1a]/70">
                Any links or references?
              </label>
              <input
                type="text"
                value={links}
                onChange={(e) => setLinks(e.target.value)}
                className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:border-[#1a1a1a] focus:outline-none"
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
        className="w-full rounded-full bg-[#1a1a1a] px-6 py-3.5 font-semibold text-white transition hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto sm:px-10"
      >
        {loading ? "Submitting…" : "Submit idea"}
      </button>
    </form>
  );
}
