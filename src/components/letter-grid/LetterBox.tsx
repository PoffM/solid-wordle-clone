import { clsx } from "clsx";
import { createEffect, createMemo, createSignal } from "solid-js";

export interface LetterBoxData {
  letterIsInRightSpot: () => boolean | undefined;
  letterIsInRemainingLetters: () => boolean | undefined;
  letter: () => string | undefined;
}

export interface LetterBoxProps extends LetterBoxData {
  isSubmitted: () => boolean;
  revealDelaySeconds: () => number | undefined;
  onRevealed?: () => void;
  /** Renders the letter box with the solution color already revealed. */
  initiallyRevealed?: boolean;
}

export function LetterBox({
  letter,
  letterIsInRightSpot,
  letterIsInRemainingLetters,
  isSubmitted,
  revealDelaySeconds,
  onRevealed,
  initiallyRevealed = false,
}: LetterBoxProps) {
  // Flip animation to reveal the answer:
  const [revealed, setRevealed] = createSignal(initiallyRevealed);

  const bgColor = createMemo(() =>
    revealed()
      ? letterIsInRightSpot()
        ? "bg-green-500"
        : letterIsInRemainingLetters()
        ? "bg-yellow-500"
        : "bg-gray-500 dark:bg-gray-600"
      : undefined
  );

  createEffect(() => {
    if (isSubmitted() && !revealed()) {
      const timeout = setTimeout(() => {
        setRevealed(true);
        onRevealed?.();
      }, (revealDelaySeconds() ?? 0) * 1000);
      return () => clearTimeout(timeout);
    }
  });

  const letterBoxClass =
    "absolute w-full h-full flex items-center justify-center font-bold select-none text-[2rem] [backface-visibility:hidden]";

  return (
    <div
      class="relative aspect-square flex-1"
      data-background-color={bgColor()}
      data-revealed={revealed()}
      data-testid="letter-box"
    >
      {/* Back of card (revealed with color) */}
      {revealed() && (
        <div
          class={clsx(
            letterBoxClass,
            !initiallyRevealed && "[transform:rotateX(-180deg)] animate-flipIn",
            "text-white",
            bgColor()
          )}
        >
          {letter()}
        </div>
      )}
      {/* Front of card (black and white) */}
      {!initiallyRevealed && (
        <div
          class={clsx(
            letterBoxClass,
            "border-2 text-black dark:text-gray-100",
            letter()
              ? "border-black dark:border-gray-400 animate-popIn"
              : "border-gray-400 dark:border-gray-600",
            revealed() && "animate-flipOut"
          )}
        >
          {letter()}
        </div>
      )}
    </div>
  );
}
