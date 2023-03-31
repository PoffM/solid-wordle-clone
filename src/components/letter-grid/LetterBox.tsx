import { clsx } from "clsx";
import { createEffect, createMemo, createSignal } from "solid-js";
import { useWordleStore } from "../../store/wordle-context";

export interface LetterBoxProps {
  rowNum: number;
  colNum: number;

  // memoized at row level
  rowGuess: () => string | undefined;
  remainingLetters: () => (string | undefined)[];

  /**
   * Renders the letter box with the solution color already revealed.
   * Used in the tutorial modal.
   */
  initiallyRevealed?: boolean;
}

export function LetterBox({
  rowNum,
  colNum,
  rowGuess,
  remainingLetters,
  initiallyRevealed = false,
}: LetterBoxProps) {
  const store = useWordleStore();

  function isSubmitted() {
    return rowNum in store.wordleState.submittedGuesses;
  }

  const letter = createMemo(() => rowGuess()?.charAt(colNum));

  const letterIsInRemainingLetters = createMemo(() =>
    Boolean(letter() && remainingLetters().includes(letter()!))
  );

  const letterIsInRightSpot = createMemo(() =>
    Boolean(letter() && store.wordleState.solution.charAt(colNum) === letter())
  );

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

  function doReveal() {
    setRevealed(true);

    const isLast = colNum === store.wordleState.solution.length - 1;
    if (isLast) {
      store.continueGame?.();
    }
  }

  createEffect(() => {
    const revealDelaySeconds = colNum * (1 / store.wordleState.solution.length);

    if (isSubmitted() && !revealed()) {
      // Don't do a delay during tests:
      if (globalThis?.process?.env?.JEST_WORKER_ID) {
        doReveal();
      } else {
        const timeout = setTimeout(doReveal, (revealDelaySeconds ?? 0) * 1000);
        return () => clearTimeout(timeout);
      }
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
            "border-2",
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
