import type { ReactNode } from "react";
import type { SectionContent } from "@/content/sections";

/**
 * Kerangka section hewan: kartu judul di atas, panggung di bawah. Sisi bawah diberi ruang
 * lebih agar tidak tertutup kucing pendamping yang mengintip di pojok kanan bawah.
 */
export function SectionFrame({
  content,
  children,
}: {
  content: SectionContent;
  children: ReactNode;
}) {
  const titleId = `${content.id}-title`;
  return (
    <section
      id={content.id}
      data-section={content.id}
      aria-labelledby={titleId}
      className="relative flex min-h-dvh flex-col items-center justify-between gap-8 px-6 pt-24 pb-40 text-center"
    >
      <div className="card-cream max-w-[22rem] px-6 py-5">
        <h2
          id={titleId}
          className="text-[clamp(1.7rem,8vw,2.3rem)] leading-[1.05] font-extrabold text-balance"
        >
          {content.title}
        </h2>
        <p className="mt-1 text-lg font-semibold text-coffee-800/80">
          {content.subtitle}
        </p>
      </div>
      {children}
    </section>
  );
}
