"use client";

import { useState } from "react";
import type { ClassificationSummary } from "@/lib/types";
import { IdeaBooster } from "./IdeaBooster";
import { NUDGES, SHORT_IDEA_THRESHOLD } from "@/lib/constants";

interface IdeaFormProps {
  onSuccess: (summary: ClassificationSummary) => void;
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
      if (data.classification) {
        onSuccess(data.classification);
      } else {
        onSuccess({
          idea_h1: trimmed.slice(0, 80),
          idea_h2: "",
          bullets: [trimmed.slice(0, 120)],
          type: "Model",
          horizon: "H1",
        });
      }
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
        <label htmlFor="idea" className="block text-sm font-medium text-vow-navy">
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
          className="mt-1.5 w-full rounded-lg border border-vow-charcoal/20 bg-white px-4 py-3 text-vow-charcoal placeholder:text-vow-charcoal/50 focus:border-vow-gold focus:outline-none focus:ring-1 focus:ring-vow-gold"
        />
        <p className="mt-1.5 text-sm text-vow-charcoal/60">
          Big, small, half-formed — all ideas welcome. This field is required.
          Everything else is optional.
        </p>
      </div>

      <IdeaBooster
        idea={idea}
        isShort={isShort}
        nudgeIndices={nudgeIndices}
        onIdeaUpdate={setIdea}
      />

      {/* Optional expandable */}
      <div className="rounded-lg border border-vow-charcoal/10 bg-white/60">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-vow-charcoal/80 hover:text-vow-navy"
        >
          Add more context (optional)
          <span className="text-vow-gold">{expanded ? "−" : "+"}</span>
        </button>
        {expanded && (
          <div className="space-y-4 border-t border-vow-charcoal/10 px-4 pb-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-vow-charcoal/60">
                What makes this repeatable?
              </label>
              <p className="text-xs text-vow-charcoal/50">
                If this works once, what makes it happen again?
              </p>
              <input
                type="text"
                value={repeatability}
                onChange={(e) => setRepeatability(e.target.value)}
                className="mt-1 w-full rounded border border-vow-charcoal/15 bg-white/80 px-3 py-2 text-sm text-vow-charcoal placeholder:text-vow-charcoal/40 focus:border-vow-gold/50 focus:outline-none"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-vow-charcoal/60">
                Who is this for?
              </label>
              <input
                type="text"
                value={whoFor}
                onChange={(e) => setWhoFor(e.target.value)}
                className="mt-1 w-full rounded border border-vow-charcoal/15 bg-white/80 px-3 py-2 text-sm text-vow-charcoal placeholder:text-vow-charcoal/40 focus:border-vow-gold/50 focus:outline-none"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-vow-charcoal/60">
                What moment does it connect to?
              </label>
              <input
                type="text"
                value={moment}
                onChange={(e) => setMoment(e.target.value)}
                className="mt-1 w-full rounded border border-vow-charcoal/15 bg-white/80 px-3 py-2 text-sm text-vow-charcoal placeholder:text-vow-charcoal/40 focus:border-vow-gold/50 focus:outline-none"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-vow-charcoal/60">
                What would success look like?
              </label>
              <input
                type="text"
                value={success}
                onChange={(e) => setSuccess(e.target.value)}
                className="mt-1 w-full rounded border border-vow-charcoal/15 bg-white/80 px-3 py-2 text-sm text-vow-charcoal placeholder:text-vow-charcoal/40 focus:border-vow-gold/50 focus:outline-none"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-vow-charcoal/60">
                Any links or references?
              </label>
              <input
                type="text"
                value={links}
                onChange={(e) => setLinks(e.target.value)}
                className="mt-1 w-full rounded border border-vow-charcoal/15 bg-white/80 px-3 py-2 text-sm text-vow-charcoal placeholder:text-vow-charcoal/40 focus:border-vow-gold/50 focus:outline-none"
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
        className="w-full rounded-lg bg-vow-navy px-4 py-3 font-medium text-white transition hover:bg-vow-navy-light disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto sm:px-8"
      >
        {loading ? "Submitting…" : "Submit idea"}
      </button>
    </form>
  );
}
