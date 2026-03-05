"use client";

import { useState } from "react";

const NAV_LINKS = [
  { label: "ABOUT", href: "#" },
  { label: "IMPACT", href: "#" },
  { label: "GET INVOLVED", href: "#" },
  { label: "PARTNERS", href: "#" },
  { label: "BLOG", href: "#" },
];

const DONATE_URL = "https://www.vowforgirls.org/?campaign=675521";

export function Header() {
  const [logoError, setLogoError] = useState(false);
  return (
    <header className="border-b border-vow-navy/10 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        {/* Logo: use PNG if present, else SVG, else text */}
        <a href="/" className="flex shrink-0 items-center focus:outline-none focus:ring-2 focus:ring-vow-coral focus:ring-offset-2 rounded">
          {!logoError ? (
            <img
              src="/branding/vow-logo.png"
              alt="VOW for Girls"
              className="h-8 w-auto"
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className="text-lg font-bold tracking-tight text-vow-navy">VOW for Girls</span>
          )}
        </a>

        {/* Nav — hidden on small screens */}
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-xs font-semibold uppercase tracking-widest text-vow-navy/80 hover:text-vow-navy focus:outline-none focus:ring-2 focus:ring-vow-coral focus:ring-offset-2 rounded"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Donate CTA */}
        <a
          href={DONATE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full bg-vow-coral px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-vow-coral focus:ring-offset-2"
        >
          DONATE NOW
        </a>
      </div>
    </header>
  );
}
