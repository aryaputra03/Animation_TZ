import { SectionFrame } from "@/components/SectionFrame";
import { RabbitPair } from "@/components/characters/RabbitPair";
import type { SectionProps } from "./types";

export function S07_Rabbits({ content }: SectionProps) {
  return (
    <SectionFrame content={content}>
      <RabbitPair />
    </SectionFrame>
  );
}
