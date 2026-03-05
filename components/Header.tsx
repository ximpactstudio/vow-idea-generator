"use client";

import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <a
          href="https://www.vowforgirls.org"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center"
        >
          <Image
            src="/branding/vow-logo.png"
            alt="VOW for Girls"
            width={90}
            height={40}
            priority
          />
        </a>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide text-[var(--vow-ink)]">
          <a
            href="https://www.vowforgirls.org/about"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--vow-coral)] transition"
          >
            ABOUT
          </a>

          <a
            href="https://www.vowforgirls.org/impact"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--vow-coral)] transition"
          >
            IMPACT
          </a>

          <a
            href="https://www.vowforgirls.org/ways-to-give"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--vow-coral)] transition"
          >
            GET INVOLVED
          </a>

          <a
            href="https://www.vowforgirls.org/partners"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--vow-coral)] transition"
          >
            PARTNERS
          </a>

          <a
            href="https://www.vowforgirls.org/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--vow-coral)] transition"
          >
            BLOG
          </a>
        </nav>

        {/* Donate Button */}
        <a
          href="https://www.vowforgirls.org/?campaign=675521"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-[var(--vow-coral)] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          DONATE NOW
        </a>

      </div>
    </header>
  );
}