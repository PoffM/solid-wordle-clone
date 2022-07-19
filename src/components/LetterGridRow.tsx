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
    range(0, solution.length)
      .filter((idx) => rowGuess()?.[idx] !== solution()[idx])
      .map((idx) => solution()[idx])
  );

  const columnData = createMemo(() =>
    range(0, solution().length).map((colNum) => {
      const letter = rowGuess()?.charAt(colNum);
      const letterIsInRemainingLetters = Boolean(
        letter && remainingLetters().includes(letter)
      );
      const letterIsInRightSpot = Boolean(
        letter && solution().charAt(colNum) === letter
      );

      return { letter, letterIsInRightSpot, letterIsInRemainingLetters };
    })
  );

  return (
    <div class="flex gap-1 flex-grow w-full" data-testid="letter-grid-row">
      <For each={columnData()}>
        {(letterBoxData, letterPosition) => {
          const isLast = letterPosition() === columnData().length - 1;

          return (
            <LetterBox
              letterBoxData={() => letterBoxData}
              isSubmitted={isSubmitted}
              revealDelaySeconds={() =>
                letterPosition() * (1 / columnData().length)
              }
              onRevealed={isLast ? onRowRevealed : undefined}
              initiallyRevealed={initiallyRevealed}
            />
          );
        }}
      </For>
    </div>
  );
}
