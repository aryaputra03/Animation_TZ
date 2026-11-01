import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { m } from 'framer-motion';
import {
  SECRET_GIFT_BLOOM_LABEL,
  SECRET_GIFT_BLOOM_RESTART_LABEL,
  SECRET_GIFT_BLOOM_RESTART_MESSAGE,
  SECRET_GIFT_BLOOM_RESET_MESSAGE,
} from '@/content/closing';

interface SecretGiftBloomProps {
  reducedMotion: boolean;
  onClose: () => void;
}

interface FlowerProps {
  x: number;
  y: number;
  scale: number;
  delay: number;
  reducedMotion: boolean;
}

interface LeafProps {
  x: number;
  y: number;
  fromX: number;
  angle: number;
  scale: number;
  delay: number;
  shade: number;
  sway: boolean;
  reducedMotion: boolean;
}

interface FloatingPetalProps {
  x: number;
  y: number;
  duration: number;
  delay: number;
  scale: number;
  reducedMotion: boolean;
}

const READY_TO_RESTART_DELAY_MS = 10000;
const PETAL_ANGLES = [0, 72, 144, 216, 288] as const;
const FLOWERS: readonly Omit<FlowerProps, 'reducedMotion'>[] = [
  { x: 78, y: 535, scale: 0.48, delay: 4.45 },
  { x: 127, y: 346, scale: 0.76, delay: 3.8 },
  { x: 180, y: 246, scale: 1, delay: 3.35 },
  { x: 244, y: 356, scale: 0.8, delay: 4.05 },
  { x: 294, y: 560, scale: 0.52, delay: 4.65 },
];

const LEAVES: readonly Omit<LeafProps, 'reducedMotion' | 'sway'>[] = [
  { x: 177, y: 759, fromX: 174, angle: -58, scale: 0.78, delay: 2.2, shade: 1 },
  { x: 183, y: 742, fromX: 173, angle: 55, scale: 0.84, delay: 2.28, shade: 2 },
  { x: 173, y: 716, fromX: 170, angle: -56, scale: 0.88, delay: 2.36, shade: 0 },
  { x: 186, y: 696, fromX: 170, angle: 57, scale: 0.9, delay: 2.44, shade: 2 },
  { x: 171, y: 673, fromX: 173, angle: -53, scale: 0.94, delay: 2.52, shade: 1 },
  { x: 187, y: 650, fromX: 177, angle: 53, scale: 1, delay: 2.6, shade: 0 },
  { x: 172, y: 624, fromX: 183, angle: -57, scale: 0.95, delay: 2.68, shade: 2 },
  { x: 187, y: 601, fromX: 185, angle: 57, scale: 0.96, delay: 2.76, shade: 1 },
  { x: 174, y: 575, fromX: 187, angle: -54, scale: 0.9, delay: 2.84, shade: 0 },
  { x: 187, y: 553, fromX: 188, angle: 55, scale: 0.88, delay: 2.92, shade: 2 },
  { x: 176, y: 529, fromX: 189, angle: -51, scale: 0.79, delay: 3, shade: 1 },
  { x: 187, y: 506, fromX: 185, angle: 53, scale: 0.77, delay: 3.08, shade: 0 },
  { x: 172, y: 484, fromX: 183, angle: -49, scale: 0.68, delay: 3.16, shade: 2 },
  { x: 186, y: 462, fromX: 181, angle: 50, scale: 0.66, delay: 3.24, shade: 1 },
  { x: 151, y: 741, fromX: 150, angle: -64, scale: 0.76, delay: 2.48, shade: 2 },
  { x: 146, y: 711, fromX: 150, angle: 55, scale: 0.82, delay: 2.56, shade: 0 },
  { x: 139, y: 679, fromX: 145, angle: -60, scale: 0.78, delay: 2.64, shade: 1 },
  { x: 137, y: 647, fromX: 138, angle: 58, scale: 0.74, delay: 2.72, shade: 2 },
  { x: 132, y: 614, fromX: 132, angle: -58, scale: 0.7, delay: 2.8, shade: 0 },
  { x: 130, y: 581, fromX: 129, angle: 55, scale: 0.66, delay: 2.88, shade: 1 },
  { x: 209, y: 743, fromX: 216, angle: -56, scale: 0.82, delay: 2.56, shade: 0 },
  { x: 214, y: 711, fromX: 218, angle: 62, scale: 0.84, delay: 2.64, shade: 2 },
  { x: 222, y: 679, fromX: 222, angle: -58, scale: 0.78, delay: 2.72, shade: 1 },
  { x: 228, y: 646, fromX: 227, angle: 59, scale: 0.75, delay: 2.8, shade: 0 },
  { x: 233, y: 614, fromX: 233, angle: -55, scale: 0.71, delay: 2.88, shade: 2 },
  { x: 237, y: 582, fromX: 239, angle: 53, scale: 0.66, delay: 2.96, shade: 1 },
  { x: 116, y: 759, fromX: 150, angle: -88, scale: 0.64, delay: 2.92, shade: 0 },
  { x: 246, y: 754, fromX: 216, angle: 83, scale: 0.68, delay: 3, shade: 2 },
  { x: 153, y: 548, fromX: 125, angle: -71, scale: 0.58, delay: 3.28, shade: 1 },
  { x: 205, y: 529, fromX: 189, angle: 72, scale: 0.61, delay: 3.34, shade: 0 },
  { x: 61, y: 760, fromX: 84, angle: -79, scale: 0.5, delay: 2.8, shade: 0 },
  { x: 98, y: 729, fromX: 82, angle: 59, scale: 0.54, delay: 2.9, shade: 2 },
  { x: 64, y: 692, fromX: 81, angle: -67, scale: 0.52, delay: 3, shade: 1 },
  { x: 97, y: 651, fromX: 80, angle: 64, scale: 0.48, delay: 3.1, shade: 0 },
  { x: 304, y: 778, fromX: 284, angle: 61, scale: 0.54, delay: 2.8, shade: 1 },
  { x: 271, y: 739, fromX: 287, angle: -60, scale: 0.52, delay: 2.9, shade: 0 },
  { x: 309, y: 696, fromX: 290, angle: 62, scale: 0.5, delay: 3, shade: 2 },
  { x: 272, y: 653, fromX: 292, angle: -62, scale: 0.48, delay: 3.1, shade: 1 },
];

const FLOATING_PETALS: readonly Omit<FloatingPetalProps, 'reducedMotion'>[] = [
  { x: -28, y: 132, duration: 10.5, delay: 0.2, scale: 0.62 },
  { x: -75, y: 208, duration: 12.2, delay: 1.3, scale: 0.82 },
  { x: -122, y: 284, duration: 9.8, delay: 2.4, scale: 0.68 },
  { x: -168, y: 360, duration: 11.6, delay: 0.7, scale: 0.76 },
  { x: -214, y: 436, duration: 13.1, delay: 1.9, scale: 0.58 },
  { x: -260, y: 512, duration: 10.9, delay: 3.1, scale: 0.9 },
  { x: -306, y: 588, duration: 12.7, delay: 0.4, scale: 0.72 },
  { x: -352, y: 664, duration: 11.2, delay: 2.7, scale: 0.64 },
  { x: -48, y: 746, duration: 13.4, delay: 4.2, scale: 0.8 },
  { x: -96, y: 170, duration: 11.9, delay: 5.1, scale: 0.54 },
  { x: -145, y: 246, duration: 10.2, delay: 3.8, scale: 0.74 },
  { x: -192, y: 322, duration: 12.9, delay: 6.2, scale: 0.62 },
  { x: -238, y: 398, duration: 9.6, delay: 4.8, scale: 0.86 },
  { x: -284, y: 474, duration: 11.4, delay: 7.1, scale: 0.56 },
  { x: -330, y: 550, duration: 13.2, delay: 5.7, scale: 0.78 },
  { x: -22, y: 626, duration: 10.7, delay: 8.1, scale: 0.66 },
  { x: -134, y: 702, duration: 12.5, delay: 6.8, scale: 0.88 },
];

const GRASS: readonly { d: string; delay: number; color: string; width: number }[] = [
  { d: 'M8 832C24 749 19 676 5 622', delay: 3.15, color: '#4da44d', width: 3 },
  { d: 'M28 832C48 753 57 660 48 587', delay: 3.25, color: '#65be51', width: 2.5 },
  { d: 'M54 832C44 758 71 698 88 650', delay: 3.3, color: '#3c923f', width: 2.4 },
  { d: 'M77 832C99 766 105 703 97 648', delay: 3.35, color: '#76c84d', width: 2.2 },
  { d: 'M99 832C91 775 109 736 124 701', delay: 3.4, color: '#4da64a', width: 2 },
  { d: 'M119 832C128 759 116 713 103 678', delay: 3.45, color: '#8bd04d', width: 2.3 },
  { d: 'M257 832C247 763 252 692 275 633', delay: 3.3, color: '#62b84c', width: 2.4 },
  { d: 'M278 832C290 757 282 693 269 665', delay: 3.38, color: '#4a9e43', width: 2.2 },
  { d: 'M300 832C291 768 306 692 326 647', delay: 3.45, color: '#7dc94c', width: 2.4 },
  { d: 'M326 832C339 757 336 687 355 621', delay: 3.52, color: '#54a846', width: 2.7 },
  { d: 'M349 832C342 770 350 716 357 681', delay: 3.58, color: '#6fc34c', width: 2.1 },
  { d: 'M62 832C76 776 73 748 64 719', delay: 3.64, color: '#8acb50', width: 1.8 },
  { d: 'M294 832C278 778 282 744 293 712', delay: 3.7, color: '#94d24c', width: 1.9 },
];

const FIREFLIES: readonly { x: number; y: number; color: string; radius: number }[] = [
  { x: 120, y: 217, color: '#f4bb77', radius: 2.2 },
  { x: 218, y: 203, color: '#f7a96c', radius: 2 },
  { x: 168, y: 184, color: '#eed39a', radius: 1.7 },
  { x: 193, y: 225, color: '#67d1c2', radius: 2.1 },
  { x: 149, y: 258, color: '#e8c67d', radius: 1.8 },
  { x: 237, y: 278, color: '#77cfc1', radius: 1.7 },
  { x: 103, y: 318, color: '#e7ad77', radius: 1.9 },
  { x: 263, y: 317, color: '#efc978', radius: 2 },
  { x: 85, y: 451, color: '#62c6ae', radius: 1.7 },
  { x: 282, y: 470, color: '#eab774', radius: 1.8 },
  { x: 45, y: 536, color: '#eab774', radius: 1.9 },
  { x: 319, y: 553, color: '#72cbb2', radius: 1.9 },
];

function Flower({ x, y, scale, delay, reducedMotion }: FlowerProps) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <m.g
        initial={reducedMotion ? false : { opacity: 0, scale: 0.16, rotate: -16 }}
        animate={{ opacity: 1, scale: 1, rotate: reducedMotion ? 0 : [0, -3.2, 1.8, 0] }}
        transition={{
          opacity: { duration: reducedMotion ? 0 : 0.3, delay: reducedMotion ? 0 : delay },
          scale: {
            duration: reducedMotion ? 0 : 1.05,
            delay: reducedMotion ? 0 : delay,
            ease: [0.22, 1, 0.36, 1],
          },
          rotate: reducedMotion
            ? { duration: 0 }
            : { duration: 4.8, delay: delay + 1.05, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
        }}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      >
        {PETAL_ANGLES.map((angle, index) => (
          <path
            key={angle}
            d="M0 1C-8-9-24-22-23-37C-22-50-8-57 1-48C13-36 12-15 0 1Z"
            transform={`rotate(${angle})`}
            fill={index % 2 === 0 ? 'url(#flower-petal)' : 'url(#flower-petal-light)'}
            stroke="#ffad83"
            strokeOpacity="0.42"
            strokeWidth="1.5"
          />
        ))}
        <ellipse cx="0" cy="-3" rx="9" ry="5.5" fill="#f7d887" />
        <ellipse cx="0" cy="-4" rx="5.5" ry="3.2" fill="#fff0ba" opacity="0.8" />
      </m.g>
      <m.circle
        cx="-2"
        cy="-8"
        r="2"
        fill="#fff1c4"
        initial={reducedMotion ? false : { opacity: 0, scale: 0.2 }}
        animate={{ opacity: 0.9, scale: 1 }}
        transition={{ duration: reducedMotion ? 0 : 0.45, delay: reducedMotion ? 0 : delay + 0.55 }}
      />
    </g>
  );
}

function Leaf({ x, y, angle, scale, delay, shade, sway, reducedMotion }: LeafProps) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
      <m.g
        initial={reducedMotion ? false : { opacity: 0, scale: 0.08 }}
        animate={{
          opacity: 1,
          scale: 1,
          rotate: reducedMotion || !sway ? 0 : [-1.4, 1.7, -0.8, 1.4],
        }}
        transition={{
          opacity: { duration: reducedMotion ? 0 : 0.3, delay: reducedMotion ? 0 : delay },
          scale: {
            duration: reducedMotion ? 0 : 0.62,
            delay: reducedMotion ? 0 : delay,
            ease: [0.22, 1, 0.36, 1],
          },
          rotate: reducedMotion || !sway
            ? { duration: 0 }
            : { duration: 3.6, delay: delay + 0.62, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
        }}
        style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
      >
        <path
          d="M0 1C-19-17-24-52-3-79C18-61 24-27 0 1Z"
          fill={`url(#leaf-${shade})`}
        />
        <path
          d="M0-2C-3-25-4-51-3-73"
          fill="none"
          stroke="#a5efe0"
          strokeOpacity="0.54"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          d="M-1-29Q-9-40-17-45M-3-44Q5-53 12-56"
          fill="none"
          stroke="#7ed5ca"
          strokeOpacity="0.35"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
      </m.g>
    </g>
  );
}

function FloatingPetal({ x, y, duration, delay, scale, reducedMotion }: FloatingPetalProps) {
  const travelDistance = 388 - x;

  return (
    <m.g
      transform={`translate(${x} ${y}) scale(${scale})`}
      initial={reducedMotion ? false : { opacity: 0, x: 0, y: 0, rotate: -24 }}
      animate={reducedMotion
        ? { opacity: 0 }
        : {
          opacity: [0, 0.72, 0.62, 0],
          x: [0, travelDistance * 0.34, travelDistance * 0.68, travelDistance],
          y: [0, -7, 5, -2],
          rotate: [-24, 70, 192, 360],
        }}
      transition={{
        duration: reducedMotion ? 0 : duration,
        delay: reducedMotion ? 0 : delay,
        repeat: reducedMotion ? 0 : Infinity,
        ease: 'linear',
      }}
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
    >
      <path d="M0-8C5-7 7-2 0 8C-7-2-5-7 0-8Z" fill="#f27661" stroke="#ffc29a" strokeOpacity="0.55" strokeWidth="1" />
    </m.g>
  );
}

export function SecretGiftBloom({ reducedMotion, onClose }: SecretGiftBloomProps) {
  const [canRestart, setCanRestart] = useState(false);

  useEffect(() => {
    const readyTimer = window.setTimeout(() => setCanRestart(true), READY_TO_RESTART_DELAY_MS);
    return () => window.clearTimeout(readyTimer);
  }, []);

  return createPortal(
    <div
      className="secret-gift-bloom fixed inset-0 z-[100] flex h-[100dvh] w-[100vw] flex-col items-center justify-between overflow-hidden px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-[calc(env(safe-area-inset-top)+1.5rem)] text-center text-cream-50"
      role="status"
      aria-live="polite"
    >
      <svg
        viewBox="0 0 360 800"
        role="img"
        aria-label={SECRET_GIFT_BLOOM_LABEL}
        className="secret-gift-bloom-art pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMax meet"
      >
        <defs>
          <linearGradient id="garden-night" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0c0810" />
            <stop offset="0.43" stopColor="#130a15" />
            <stop offset="1" stopColor="#07090c" />
          </linearGradient>
          <radialGradient id="garden-glow" cx="50%" cy="40%" r="65%">
            <stop offset="0" stopColor="#8d2632" stopOpacity="0.34" />
            <stop offset="0.46" stopColor="#541621" stopOpacity="0.17" />
            <stop offset="1" stopColor="#32101a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="garden-ground-glow" cx="50%" cy="90%" r="58%">
            <stop offset="0" stopColor="#144c3d" stopOpacity="0.32" />
            <stop offset="1" stopColor="#07100f" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="stem-teal" x1="0" y1="1" x2="0.8" y2="0">
            <stop offset="0" stopColor="#167d7e" />
            <stop offset="0.55" stopColor="#38b5ad" />
            <stop offset="1" stopColor="#7de1c7" />
          </linearGradient>
          <linearGradient id="flower-petal" x1="0" y1="0" x2="0.8" y2="1">
            <stop offset="0" stopColor="#ff9a6f" />
            <stop offset="0.52" stopColor="#f26552" />
            <stop offset="1" stopColor="#c9363f" />
          </linearGradient>
          <linearGradient id="flower-petal-light" x1="0" y1="0" x2="0.8" y2="1">
            <stop offset="0" stopColor="#ffb27c" />
            <stop offset="0.56" stopColor="#f47959" />
            <stop offset="1" stopColor="#d94544" />
          </linearGradient>
          <linearGradient id="leaf-0" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#54c7c5" />
            <stop offset="0.5" stopColor="#238fa1" />
            <stop offset="1" stopColor="#145c75" />
          </linearGradient>
          <linearGradient id="leaf-1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#64d4c8" />
            <stop offset="0.56" stopColor="#2ca2ad" />
            <stop offset="1" stopColor="#176b80" />
          </linearGradient>
          <linearGradient id="leaf-2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#43b7b7" />
            <stop offset="0.53" stopColor="#217f91" />
            <stop offset="1" stopColor="#124e68" />
          </linearGradient>
        </defs>

        <rect width="360" height="800" fill="url(#garden-night)" />
        <rect width="360" height="800" fill="url(#garden-glow)" />
        <rect width="360" height="800" fill="url(#garden-ground-glow)" />

        {[{ x: 24, y: 86 }, { x: 70, y: 181 }, { x: 114, y: 115 }, { x: 159, y: 68 }, { x: 203, y: 138 }, { x: 271, y: 94 }, { x: 330, y: 207 }, { x: 44, y: 349 }, { x: 312, y: 378 }].map((star, index) => (
          <circle key={`star-${index}`} cx={star.x} cy={star.y} r={index % 3 === 0 ? 1.7 : 1.1} fill="#ffddb0" opacity="0.36" />
        ))}

        {FLOATING_PETALS.filter((_, index) => index % 2 === 0).map((petal, index) => (
          <FloatingPetal key={`back-petal-${index}`} {...petal} reducedMotion={reducedMotion} />
        ))}

        <m.g
          initial={reducedMotion ? false : { rotate: 0 }}
          animate={reducedMotion ? { rotate: 0 } : { rotate: [0, -0.65, 0.55, -0.35, 0] }}
          transition={reducedMotion
            ? { duration: 0 }
            : { duration: 6.8, delay: 5.1, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
        >
        <g className="garden-stems">
          <m.path
            d="M180 834C166 708 192 575 181 455C177 397 178 316 180 257"
            fill="none"
            stroke="url(#stem-teal)"
            strokeWidth="4.4"
            strokeLinecap="round"
            initial={reducedMotion ? false : { opacity: 0, scaleY: 0.02 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: reducedMotion ? 0 : 2.8, delay: reducedMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
          />
          <m.path
            d="M151 834C149 704 123 573 127 365"
            fill="none"
            stroke="url(#stem-teal)"
            strokeWidth="3.6"
            strokeLinecap="round"
            initial={reducedMotion ? false : { opacity: 0, scaleY: 0.02 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: reducedMotion ? 0 : 2.55, delay: reducedMotion ? 0 : 0.72, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
          />
          <m.path
            d="M209 834C219 697 242 564 244 375"
            fill="none"
            stroke="url(#stem-teal)"
            strokeWidth="3.7"
            strokeLinecap="round"
            initial={reducedMotion ? false : { opacity: 0, scaleY: 0.02 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: reducedMotion ? 0 : 2.6, delay: reducedMotion ? 0 : 0.88, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
          />
          <m.path
            d="M84 834C82 738 72 638 78 548"
            fill="none"
            stroke="url(#stem-teal)"
            strokeWidth="2.8"
            strokeLinecap="round"
            initial={reducedMotion ? false : { opacity: 0, scaleY: 0.02 }}
            animate={{ opacity: 0.95, scaleY: 1 }}
            transition={{ duration: reducedMotion ? 0 : 2.4, delay: reducedMotion ? 0 : 1.05, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
          />
          <m.path
            d="M284 834C285 743 300 648 294 573"
            fill="none"
            stroke="url(#stem-teal)"
            strokeWidth="2.9"
            strokeLinecap="round"
            initial={reducedMotion ? false : { opacity: 0, scaleY: 0.02 }}
            animate={{ opacity: 0.95, scaleY: 1 }}
            transition={{ duration: reducedMotion ? 0 : 2.45, delay: reducedMotion ? 0 : 1.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
          />
        </g>

        {LEAVES.map((leaf, index) => (
          <m.path
            key={`petiole-${index}`}
            d={`M${leaf.fromX} ${leaf.y}Q${(leaf.fromX + leaf.x) / 2} ${leaf.y - 4} ${leaf.x} ${leaf.y}`}
            fill="none"
            stroke="url(#stem-teal)"
            strokeWidth="1.8"
            strokeLinecap="round"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 0.88 }}
            transition={{ duration: reducedMotion ? 0 : 0.3, delay: reducedMotion ? 0 : leaf.delay - 0.08 }}
          />
        ))}

        {LEAVES.map((leaf, index) => (
          <Leaf key={`leaf-${index}`} {...leaf} sway={index % 4 === 0} reducedMotion={reducedMotion} />
        ))}

        {FLOWERS.map((flower) => (
          <Flower key={`${flower.x}-${flower.y}`} {...flower} reducedMotion={reducedMotion} />
        ))}
        </m.g>

        {GRASS.map((blade, index) => (
          <m.path
            key={`grass-${index}`}
            d={blade.d}
            fill="none"
            stroke={blade.color}
            strokeOpacity="0.95"
            strokeWidth={blade.width}
            strokeLinecap="round"
            initial={reducedMotion ? false : { opacity: 0, scaleY: 0.02 }}
            animate={{
              opacity: 0.94,
              scaleY: 1,
              rotate: reducedMotion || index % 2 !== 0 ? 0 : [-1.8, 1.6, -1.1, 0.8],
            }}
            transition={{
              opacity: { duration: reducedMotion ? 0 : 0.35, delay: reducedMotion ? 0 : blade.delay },
              scaleY: { duration: reducedMotion ? 0 : 0.9, delay: reducedMotion ? 0 : blade.delay, ease: 'easeOut' },
              rotate: reducedMotion || index % 2 !== 0
                ? { duration: 0 }
                : { duration: 2.7, delay: blade.delay + 0.9, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
            }}
            style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
          />
        ))}

        {FLOATING_PETALS.filter((_, index) => index % 2 !== 0).map((petal, index) => (
          <FloatingPetal key={`front-petal-${index}`} {...petal} reducedMotion={reducedMotion} />
        ))}

        {FIREFLIES.map((firefly, index) => (
          <m.circle
            key={`firefly-${index}`}
            cx={firefly.x}
            cy={firefly.y}
            r={firefly.radius}
            fill={firefly.color}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.55 }}
            animate={reducedMotion ? { opacity: 0.7, scale: 1 } : { opacity: [0.2, 0.9, 0.34], scale: [0.7, 1.2, 0.78], y: [0, -5, 0] }}
            transition={{ duration: reducedMotion ? 0 : 2.6, delay: reducedMotion ? 0 : 4.2 + index * 0.12, repeat: reducedMotion ? 0 : 1, ease: 'easeInOut' }}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          />
        ))}
      </svg>

      <p className="sr-only">
        {canRestart ? SECRET_GIFT_BLOOM_RESTART_MESSAGE : SECRET_GIFT_BLOOM_RESET_MESSAGE}
      </p>

      <m.button
        type="button"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: canRestart ? 1 : 0, scale: canRestart ? 1 : 0.8 }}
        transition={{ duration: reducedMotion ? 0 : 0.35 }}
        whileTap={canRestart && !reducedMotion ? { scale: 0.92 } : undefined}
        className="absolute z-30 flex size-12 items-center justify-center rounded-full border border-cream-50/35 bg-coffee-900/60 text-cream-50 shadow-lg backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-50 disabled:pointer-events-none"
        style={{
          top: 'calc(env(safe-area-inset-top, 0px) + 1rem)',
          right: 'calc(env(safe-area-inset-right, 0px) + 1rem)',
        }}
        aria-label={SECRET_GIFT_BLOOM_RESTART_LABEL}
        aria-hidden={!canRestart}
        tabIndex={canRestart ? 0 : -1}
        disabled={!canRestart}
        onClick={onClose}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none">
          <path d="m7 7 10 10M17 7 7 17" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </m.button>
    </div>,
    document.body,
  );
}
