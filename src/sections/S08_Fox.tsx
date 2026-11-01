import { SectionFrame } from "@/components/SectionFrame";
import { FoxScene } from "@/components/characters/FoxScene";
import type { SectionProps } from "./types";

export function S08_Fox({ content }: SectionProps) {
  return (
    <SectionFrame content={content}>
      <FoxScene />
    </SectionFrame>
  );
}
