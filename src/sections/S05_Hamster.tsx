import { SectionFrame } from "@/components/SectionFrame";
import { HamsterWheel } from "@/components/characters/HamsterWheel";
import type { SectionProps } from "./types";

export function S05_Hamster({ content }: SectionProps) {
  return (
    <SectionFrame content={content}>
      <HamsterWheel />
    </SectionFrame>
  );
}
