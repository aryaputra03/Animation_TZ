import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { m, useAnimationControls } from 'framer-motion';
import {
  SECRET_GIFT_ANSWER,
  SECRET_GIFT_ANSWER_LABEL,
  SECRET_GIFT_ANSWER_PLACEHOLDER,
  SECRET_GIFT_CLOSE_LABEL,
  SECRET_GIFT_COPY_DONE_LABEL,
  SECRET_GIFT_COPY_ERROR,
  SECRET_GIFT_COPY_LABEL,
  SECRET_GIFT_COPY_SUCCESS,
  SECRET_GIFT_CORRECT_MESSAGE,
  SECRET_GIFT_HEX_HINT,
  SECRET_GIFT_HEX_HINT_TRIGGER,
  SECRET_GIFT_PLAIN_HINT_NOTICE,
  SECRET_GIFT_PLAIN_HINT_TRIGGER,
  SECRET_GIFT_PROBLEM,
  SECRET_GIFT_PROMPT,
  SECRET_GIFT_STICKER_LABEL,
  SECRET_GIFT_SUBMIT_LABEL,
  SECRET_GIFT_TITLE,
  SECRET_GIFT_WRONG_MESSAGE,
} from '@/content/closing';
import { ProgrammingMonkeySticker } from '@/components/characters/ProgrammingMonkeySticker';

const JAVASCRIPT_TOKEN_PATTERN = /(\/\/[^\r\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:const|let|while|true|return|function|yield|new)\b|\b(?:TextDecoder|TextEncoder|Uint8Array|Array|Number|console)\b|\b(?:decode|encode|from|padStart|join|log|next|extract)\b|0x[\da-fA-F]+n?|\b\d+n?\b|=>|===|!==|==|!=|&&|\|\||[+\-*/%=<>!&|^~]+|(?:\[|\]|[{}().,;]))/g;

const JAVASCRIPT_KEYWORDS = new Set(['const', 'let', 'while', 'true', 'return', 'function', 'yield', 'new']);
const JAVASCRIPT_BUILT_INS = new Set(['TextDecoder', 'TextEncoder', 'Uint8Array', 'Array', 'Number', 'console']);
const JAVASCRIPT_METHODS = new Set(['decode', 'encode', 'from', 'padStart', 'join', 'log', 'next', 'extract']);

function getTokenClass(token: string): string {
  if (token.startsWith('//')) return 'syntax-comment';
  if (/^["'`]/.test(token)) return 'syntax-string';
  if (/^0x[\da-fA-F]+n?$|^\d+n?$/.test(token)) return 'syntax-number';
  if (JAVASCRIPT_KEYWORDS.has(token)) return 'syntax-keyword';
  if (JAVASCRIPT_BUILT_INS.has(token)) return 'syntax-builtin';
  if (JAVASCRIPT_METHODS.has(token)) return 'syntax-method';
  if (/^(?:=>|===|!==|==|!=|&&|\|\||[+\-*/%=<>!&|^~]+)$/.test(token)) return 'syntax-operator';
  return 'syntax-punctuation';
}

function highlightJavaScript(source: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let cursor = 0;

  for (const match of source.matchAll(JAVASCRIPT_TOKEN_PATTERN)) {
    const token = match[0];
    const index = match.index ?? 0;
    if (index > cursor) parts.push(source.slice(cursor, index));
    parts.push(<span key={`token-${index}`} className={getTokenClass(token)}>{token}</span>);
    cursor = index + token.length;
  }

  if (cursor < source.length) parts.push(source.slice(cursor));
  return parts;
}

interface SecretGiftDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSolved: () => void;
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Coba salin melalui textarea untuk browser yang menolak Clipboard API.
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();

  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    textarea.remove();
  }
}

export function SecretGiftDialog({ isOpen, onClose, onSolved }: SecretGiftDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const answerInputRef = useRef<HTMLInputElement>(null);
  const copyAnimation = useAnimationControls();
  const [answer, setAnswer] = useState('');
  const [answerFeedback, setAnswerFeedback] = useState('');
  const [answerAccepted, setAnswerAccepted] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState('');
  const [copySucceeded, setCopySucceeded] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      setAnswer('');
      setAnswerFeedback('');
      setAnswerAccepted(false);
      setCopyFeedback('');
      setCopySucceeded(false);
      dialog.showModal();
      answerInputRef.current?.focus();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedAnswer = answer.trim().toLowerCase();
    if (normalizedAnswer === SECRET_GIFT_HEX_HINT_TRIGGER) {
      setAnswerAccepted(false);
      setAnswerFeedback(SECRET_GIFT_HEX_HINT);
      return;
    }
    if (normalizedAnswer === SECRET_GIFT_PLAIN_HINT_TRIGGER) {
      setAnswerAccepted(false);
      setAnswerFeedback(SECRET_GIFT_PLAIN_HINT_NOTICE);
      return;
    }

    const isCorrect = normalizedAnswer === SECRET_GIFT_ANSWER;
    setAnswerAccepted(isCorrect);
    setAnswerFeedback(isCorrect ? SECRET_GIFT_CORRECT_MESSAGE : SECRET_GIFT_WRONG_MESSAGE);
    if (isCorrect) onSolved();
  };

  const handleCopy = async () => {
    const copied = await copyText(SECRET_GIFT_PROBLEM);
    setCopyFeedback(copied ? SECRET_GIFT_COPY_SUCCESS : SECRET_GIFT_COPY_ERROR);
    setCopySucceeded(copied);

    if (copied) {
      void copyAnimation.start({
        scale: [1, 0.94, 1.08, 1],
        y: [0, 2, -2, 0],
        transition: { duration: 0.42, ease: 'easeOut' },
      });
    } else {
      copyAnimation.stop();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="secret-gift-title"
      className="secret-gift-dialog"
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex flex-col gap-4">
        <header className="flex items-start justify-between gap-3">
          <h2 id="secret-gift-title" className="pt-1 text-xl leading-tight font-extrabold sm:text-2xl">
            {SECRET_GIFT_TITLE}
          </h2>
          <button
            type="button"
            aria-label={SECRET_GIFT_CLOSE_LABEL}
            onClick={onClose}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cream-200 text-2xl font-bold focus-visible:outline-offset-2"
          >
            ×
          </button>
        </header>

        <div className="flex items-center gap-3">
          <ProgrammingMonkeySticker className="h-24 w-24 shrink-0 sm:h-28 sm:w-28" label={SECRET_GIFT_STICKER_LABEL} />
          <p className="min-w-0 flex-1 text-sm leading-snug font-semibold text-coffee-800/85 sm:text-base">
            {SECRET_GIFT_PROMPT}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-bold">JavaScript</span>
            <m.button
              type="button"
              animate={copyAnimation}
              whileTap={{ scale: 0.94 }}
              onClick={() => void handleCopy()}
              className="flex min-h-12 items-center justify-center rounded-full bg-matcha-500 px-4 text-sm font-bold text-cream-50 focus-visible:outline-offset-2"
            >
              {copySucceeded ? SECRET_GIFT_COPY_DONE_LABEL : SECRET_GIFT_COPY_LABEL}
            </m.button>
          </div>
          <pre tabIndex={0} aria-label="Kode soal JavaScript" className="secret-gift-code mt-2 max-h-56 overflow-auto rounded-2xl p-3 font-mono text-[0.68rem] leading-relaxed sm:text-xs">
            <code>{highlightJavaScript(SECRET_GIFT_PROBLEM)}</code>
          </pre>
          <p role="status" aria-live="polite" className="mt-1 min-h-5 text-sm font-semibold text-sage-600">
            {copyFeedback}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <label htmlFor="secret-gift-answer" className="text-sm font-bold">
            {SECRET_GIFT_ANSWER_LABEL}
          </label>
          <input
            ref={answerInputRef}
            id="secret-gift-answer"
            type="text"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder={SECRET_GIFT_ANSWER_PLACEHOLDER}
            className="min-h-12 rounded-xl border-2 border-matcha-700 bg-white px-4 text-base font-semibold text-coffee-800 outline-offset-2"
          />
          <button type="submit" className="btn-matcha mt-1 min-h-12 px-5 text-base font-extrabold focus-visible:outline-offset-2">
            {SECRET_GIFT_SUBMIT_LABEL}
          </button>
          <p role="status" aria-live="polite" data-correct={answerAccepted} className="min-h-6 text-sm font-bold">
            {answerFeedback}
          </p>
        </form>
      </div>
    </dialog>
  );
}
