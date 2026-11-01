import { AnimatePresence, m } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

interface Props {
  /** id section (kucing besar) atau 'mini'. Balon hanya tampil di pemiliknya. */
  owner: string;
  placement?: 'center' | 'mini' | 'barista' | 'game';
}

/** Balon chat kucing. Satu balon pada satu waktu, ditampilkan di dekat kucing pemiliknya. */
export function SpeechBubble({ owner, placement = 'center' }: Props) {
  const bubble = useAppStore((s) => s.bubble);
  const show = bubble !== null && bubble.owner === owner;
  const mini = placement === 'mini';
  const barista = placement === 'barista';
  const game = placement === 'game';
  const bubbleSize = game
    ? 'px-3 py-2 text-sm leading-tight'
    : 'px-4 py-3 text-[0.98rem] leading-snug';

  return (
    <div
      role="status"
      aria-live="polite"
      className={
        mini
          ? 'pointer-events-none absolute right-full bottom-[34%] mr-2 w-[min(56vw,215px)]'
          : barista
            ? 'pointer-events-none absolute inset-x-0 top-[-2rem] z-20 flex justify-center px-2'
            : game
              ? 'game-chat-slot pointer-events-none flex w-full shrink-0 items-center justify-center px-1'
              : 'pointer-events-none flex min-h-[5.5rem] w-full items-end justify-center px-2 pb-4'
      }
    >
      <AnimatePresence mode="wait">
        {show && bubble && (
          <m.div
            key={bubble.id}
            className={mini ? '' : 'max-w-[20rem]'}
            initial={{ opacity: 0, scale: 0.7, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -6, transition: { duration: 0.15, ease: 'easeIn' } }}
            transition={{ type: 'spring', stiffness: 320, damping: 20 }}
          >
            <div
              className={`bubble card-cream ${bubbleSize} text-center font-extrabold ${mini ? 'bubble-side text-left' : ''}`}
            >
              {bubble.text}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
