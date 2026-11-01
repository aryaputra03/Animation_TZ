import { SectionFrame } from "@/components/SectionFrame";
import { RedPandaScene } from "@/components/characters/RedPandaScene";
import type { SectionProps } from "./types";

export function S09_RedPanda({ content }: SectionProps) {
  return (
    <SectionFrame content={content}>
      <RedPandaScene />
    </SectionFrame>
  );
}
