import type { SectionContent } from '@/content/sections';

export interface SectionProps {
  content: SectionContent;
  /** Urutan section di halaman (0 = paling atas). */
  index: number;
}
