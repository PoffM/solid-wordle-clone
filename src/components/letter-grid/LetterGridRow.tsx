import clsx from "clsx";
import { range } from "lodash";
import { createEffect, createMemo, For } from "solid-js";
import { useWordleStore } from "../../store/wordle-context";
import { LetterBox } from "./LetterBox";

export interface LetterGridRowProps {
  rowNum: number;

  /** Renders the letter boxes with the solution color already revealed. */
  initiallyRevealed?: boolean;
}

export function LetterGridRow(props: LetterGridRowProps) {
  const store = useWordleStore();

  const isCurrentGuess = createMemo(
    () => props.rowNum === store.wordleState.submittedGuesses.length
  );
  const rowGuess = createMemo(() =>
    isCurrentGuess()
      ? store.wordleState.currentGuess
      : store.wordleState.submittedGuesses[props.rowNum]
  );

  const rowError = createMemo(() =>
    isCurrentGuess() ? store.wordleState.currentGuessError : null
  );

  const remainingLetters = createMemo(() =>
    range(0, store.wordleState.solution.length)
      .filter((idx) => rowGuess()?.[idx] !== store.wordleState.solution[idx])
      .map((idx) => store.wordleState.solution[idx])
  );

  const solutionLen = createMemo(() => store.wordleState.solution.length);

  let rowDiv: HTMLDivElement | undefined;
  // Shake horizontally when there is a new error:
  createEffect(() => {
    if (rowError?.() && rowDiv) {
      const shakeClass = "animate-shake";
      rowDiv.classList.remove(shakeClass);
      setTimeout(() => rowDiv?.classList.add(shakeClass));
    }
  });

  return (
    <div
      class={clsx("flex gap-1 flex-grow w-full")}
      data-testid="letter-grid-row"
      ref={rowDiv}
    >
      <For each={range(0, solutionLen())}>
        {(colNum) => {
          return (
            <LetterBox
              rowNum={props.rowNum}
              colNum={colNum}
              remainingLetters={remainingLetters}
              rowGuess={rowGuess}
              initiallyRevealed={props.initiallyRevealed}
            />
          );
        }}
      </For>
    </div>
  );
}
