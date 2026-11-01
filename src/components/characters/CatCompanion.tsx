import { AnimatePresence, m } from "framer-motion";
import { MAIN_CAT_SECTIONS } from "@/content/sections";
import { useAppStore } from "@/store/useAppStore";
import { SpeechBubble } from "../ui/SpeechBubble";
import { InteractiveCat } from "./InteractiveCat";

/**
 * Kucing pendamping: hanya kepala dan tangan yang mengintip dari tepi bawah layar,
 * di pojok kanan. Muncul di section yang tidak punya kucing besar.
 */
export function CatCompanion() {
  const started = useAppStore((s) => s.started);
  const active = useAppStore((s) => s.activeSectionId);
  const activeGameId = useAppStore((s) => s.activeGameId);
  const show =
    started && activeGameId === null && active !== null && !MAIN_CAT_SECTIONS.includes(active);

  return (
    <AnimatePresence>
      {show && (
        <m.div
          key="cat-mini"
          className={`fixed z-40 ${active === 'game-beans' ? 'pointer-events-none' : ''}`}
          // bottom negatif: sebagian bawah kucing keluar dari layar, seperti mengintip di jendela
          style={{
            right: "calc(env(safe-area-inset-right, 0px) + 10px)",
            bottom: "-6px",
          }}
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 70 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <SpeechBubble owner="mini" placement="mini" />
          <InteractiveCat
            variant="lookout"
            mood="cheerful"
            className="w-[120px]"
          />
        </m.div>
      )}
    </AnimatePresence>
  );
}
