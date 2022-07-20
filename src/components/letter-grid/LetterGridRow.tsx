import { range } from "lodash";
import { createMemo, For } from "solid-js";
import { LetterBox } from "./LetterBox";

export interface LetterGridRowProps {
  rowGuess: () => string | undefined;
  solution: () => string;
  rowError?: () => { message: string } | null;
  isSubmitted: () => boolean;
  onRowRevealed?: () => void;
  /** Renders the letter boxes with the solution color already revealed. */
  initiallyRevealed?: boolean;
}

export function LetterGridRow({
  isSubmitted,
  solution,
  onRowRevealed,
  rowError,
  rowGuess,
  initiallyRevealed,
}: LetterGridRowProps) {
  const remainingLetters = createMemo(() =>
    range(0, solution().length)
      .filter((idx) => rowGuess()?.[idx] !== solution()[idx])
      .map((idx) => solution()[idx])
  );

  const solutionLen = createMemo(() => solution().length);

  return (
    <div class="flex gap-1 flex-grow w-full" data-testid="letter-grid-row">
      <For each={range(0, solutionLen())}>
        {(colNum) => {
          const isLast = () => colNum === solutionLen() - 1;
          const letter = createMemo(() => rowGuess()?.charAt(colNum));

          const letterIsInRemainingLetters = createMemo(() =>
            Boolean(letter() && remainingLetters().includes(letter()!))
          );

          const letterIsInRightSpot = createMemo(() =>
            Boolean(letter() && solution().charAt(colNum) === letter())
          );

          function onBoxRevealed() {
            if (isLast()) {
              onRowRevealed?.();
            }
          }

          return (
            <LetterBox
              letter={letter}
              letterIsInRemainingLetters={letterIsInRemainingLetters}
              letterIsInRightSpot={letterIsInRightSpot}
              isSubmitted={isSubmitted}
              revealDelaySeconds={() => colNum * (1 / solutionLen())}
              onRevealed={onBoxRevealed}
              initiallyRevealed={initiallyRevealed}
            />
          );
        }}
      </For>
    </div>
  );
}
