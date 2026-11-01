import { useRef } from 'react';

/**
 * Kepala kucing oren yang mengintip dari bawah layar.
 * Diambil dari desain referensi (SVG yang sama, tanpa badan). Kucing lengkap dibuat di Tahap 2.
 */
export function CatPeek() {
  const bounceRef = useRef<HTMLDivElement>(null);

  const poke = () => {
    bounceRef.current?.animate(
      [
        { transform: 'translateY(0) scale(1,1)' },
        { transform: 'translateY(-18px) scale(.95,1.07)' },
        { transform: 'translateY(0) scale(1.05,.94)' },
        { transform: 'translateY(0) scale(1,1)' },
      ],
      { duration: 420, easing: 'ease-out' },
    );
  };

  return (
    <div className="cat-peek pointer-events-none absolute inset-x-0 bottom-0 mx-auto w-[min(72vw,300px)]">
      <div ref={bounceRef}>
        <button
          type="button"
          onPointerDown={poke}
          aria-label="Colek kucing"
          className="pointer-events-auto block w-full cursor-pointer border-0 bg-transparent p-0"
        >
          <svg className="cat-svg block w-full" viewBox="40 40 220 230" aria-hidden="true">
            <defs>
              <radialGradient id="furPeek" cx="50%" cy="35%" r="70%">
                <stop offset="0" stopColor="#ffc884" />
                <stop offset="1" stopColor="#f59a3c" />
              </radialGradient>
            </defs>

            <g className="head">
              <g className="ear-l">
                <path d="M80 112 L68 48 L124 86 Z" fill="#f59a3c" />
                <path d="M86 98 L81 66 L109 86 Z" fill="#ffb6c8" />
              </g>
              <g className="ear-r">
                <path d="M220 112 L232 48 L176 86 Z" fill="#f59a3c" />
                <path d="M214 98 L219 66 L191 86 Z" fill="#ffb6c8" />
              </g>
              <ellipse cx="150" cy="152" rx="90" ry="78" fill="url(#furPeek)" />
              <path
                d="M150 76 L150 96 M131 79 L136 95 M169 79 L164 95"
                stroke="#d9771e"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <ellipse cx="150" cy="180" rx="32" ry="22" fill="#fff3e0" />
              <ellipse cx="90" cy="180" rx="15" ry="9" fill="#ff8fa8" opacity=".6" />
              <ellipse cx="210" cy="180" rx="15" ry="9" fill="#ff8fa8" opacity=".6" />

              <g stroke="#b45f12" strokeWidth="5" strokeLinecap="round" fill="none">
                <path d="M96 118 L132 106" />
                <path d="M204 118 L168 106" />
              </g>

              <g className="blink">
                <ellipse cx="118" cy="150" rx="26" ry="30" fill="#2b1a2e" />
                <ellipse cx="182" cy="150" rx="26" ry="30" fill="#2b1a2e" />
                <g className="glint">
                  <circle cx="109" cy="138" r="10" fill="#fff" />
                  <circle cx="173" cy="138" r="10" fill="#fff" />
                </g>
                <circle cx="128" cy="164" r="5" fill="#fff" />
                <circle cx="192" cy="164" r="5" fill="#fff" />
                <circle cx="124" cy="126" r="3" fill="#bfe9ff" />
                <circle cx="188" cy="126" r="3" fill="#bfe9ff" />
              </g>

              <path d="M141 172 Q150 167 159 172 Q150 184 141 172 Z" fill="#ff7a9c" />
              <g className="lip" stroke="#7a3b12" strokeWidth="3.5" strokeLinecap="round" fill="none">
                <path d="M150 181 Q150 192 138 193" />
                <path d="M150 181 Q150 192 162 193" />
              </g>
              <g stroke="#7a3b12" strokeWidth="2.5" strokeLinecap="round" opacity=".55">
                <path d="M70 176 L98 180 M68 190 L97 188" />
                <path d="M230 176 L202 180 M232 190 L203 188" />
              </g>
            </g>

            <g>
              <ellipse cx="124" cy="238" rx="21" ry="18" fill="url(#furPeek)" />
              <ellipse cx="176" cy="238" rx="21" ry="18" fill="url(#furPeek)" />
              <path
                d="M118 228 L118 236 M127 227 L127 236 M169 227 L169 236 M178 228 L178 236"
                stroke="#d9771e"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="124" cy="244" r="5" fill="#ff9db3" />
              <circle cx="176" cy="244" r="5" fill="#ff9db3" />
            </g>
          </svg>
        </button>
      </div>
    </div>
  );
}
