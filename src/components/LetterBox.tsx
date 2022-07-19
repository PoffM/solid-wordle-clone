import { createMemo, createSignal } from "solid-js";
import { clsx } from "clsx";

export interface LetterBoxData {
  letterIsInRightSpot?: boolean;
  letterIsInRemainingLetters?: boolean;
  letter?: string;
}

export interface LetterBoxProps {
  letterBoxData: () => LetterBoxData;
  isSubmitted: () => boolean;
  revealDelaySeconds: () => number | undefined;
  onRevealed?: () => void;
  /** Renders the letter box with the solution color already revealed. */
  initiallyRevealed?: boolean;
}

export function LetterBox({
  letterBoxData,
  isSubmitted,
  revealDelaySeconds,
  onRevealed,
  initiallyRevealed = false,
}: LetterBoxProps) {
  // Flip animation to reveal the answer:
  const [revealed, setRevealed] = createSignal(initiallyRevealed);

  const bgColor = createMemo(() =>
    revealed()
      ? letterBoxData().letterIsInRightSpot
        ? "green-500"
        : letterBoxData().letterIsInRemainingLetters
        ? "gray-500"
        : "gray-500"
      : undefined
  );

  return (
    <div
      class={clsx(
        "aspect-square flex-grow font-bold select-none",
        !revealed() && "border-2",
        `bg-${bgColor()}`,
        "border-gray-400",
        letterBoxData().letter && "border-black",
        revealed() ? "text-white" : "text-black"
      )}
      style={{ "font-size": "2rem" }}
      data-testid="letter-box"
      data-background-color={bgColor}
      data-revealed={revealed}
    >
      {letterBoxData().letter}
    </div>
  );
}
