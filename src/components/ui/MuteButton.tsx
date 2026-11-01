import { SYSTEM } from '@/content/system';
import { say } from '@/core/bubbles';
import { useAppStore } from '@/store/useAppStore';

export function MuteButton() {
  const muted = useAppStore((s) => s.muted);
  const setMuted = useAppStore((s) => s.setMuted);

  return (
    <button
      type="button"
      aria-pressed={muted}
      aria-label={muted ? SYSTEM.muteOff : SYSTEM.muteOn}
      onClick={() => {
        const next = !muted;
        setMuted(next);
        say('system', { id: next ? 'mute-on' : 'mute-off' });
      }}
      className="fixed z-[60] flex size-12 items-center justify-center rounded-full bg-cream-50/90 text-matcha-700 shadow-[0_3px_0_rgba(31,58,43,0.2)] active:scale-95"
      style={{
        left: 'calc(env(safe-area-inset-left, 0px) + 12px)',
        top: 'calc(env(safe-area-inset-top, 0px) + 12px)',
        transition: 'transform 0.12s ease',
      }}
    >
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z" fill="currentColor" />
        {muted ? (
          <path d="M16 9.5l5 5M21 9.5l-5 5" />
        ) : (
          <>
            <path d="M15.5 9a4.2 4.2 0 0 1 0 6" />
            <path d="M18 6.5a8 8 0 0 1 0 11" />
          </>
        )}
      </svg>
    </button>
  );
}
