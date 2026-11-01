import { SYSTEM } from "@/content/system";
import type { SectionProps } from "./types";

/**
 * Section sementara untuk Tahap 1. Setiap section akan diganti komponen aslinya
 * di Tahap 2 sampai 5 lewat registry di sections/index.tsx.
 */
export function PlaceholderSection({ content, index }: SectionProps) {
  const Heading = index === 0 ? "h1" : "h2";
  const titleId = `${content.id}-title`;

  return (
    <section
      id={content.id}
      data-section={content.id}
      aria-labelledby={titleId}
      className="relative flex min-h-dvh flex-col items-center justify-center gap-5 px-6 py-24 text-center"
    >
      <div className="card-cream flex max-w-[22rem] flex-col items-center gap-3 px-6 py-6">
        <span aria-hidden="true" className="text-[4rem] leading-none">
          {content.emoji}
        </span>
        <Heading
          id={titleId}
          className="text-[clamp(1.7rem,8vw,2.3rem)] leading-[1.05] font-extrabold text-balance"
        >
          {content.title}
        </Heading>
        <p className="text-lg font-semibold text-coffee-800/80">
          {content.subtitle}
        </p>
      </div>

      {index === 0 && (
        <p
          aria-hidden="true"
          className="nudge text-base font-bold text-coffee-800"
        >
          ↓ {SYSTEM.scrollHint}
        </p>
      )}
      {import.meta.env.DEV && (
        <small className="absolute bottom-4 rounded-full bg-forest-900/70 px-3 py-1 text-xs text-cream-50">
          placeholder · tahap {content.stage}
        </small>
      )}
    </section>
  );
}
