import { range } from "lodash";
import { createMemo, For } from "solid-js";
import { WordleState } from "../logic/createWordleState";
import { LetterGridRow } from "./LetterGridRow";

export interface LetterGridProps {
  wordleState: () => WordleState;
  onRowRevealed?: () => void;
}

export function LetterGrid({ wordleState, onRowRevealed }: LetterGridProps) {
  return (
    <div class="flex flex-col m-1.5 gap-1.5 w-full max-w-[21rem]">
      <For each={range(0, wordleState().maxGuesses)}>
        {(rowNum) => {
          const isCurrentGuess = createMemo(
            () => rowNum === wordleState().submittedGuesses.length
          );
          const isSubmitted = createMemo(
            () => rowNum in wordleState().submittedGuesses
          );
          const rowGuess = createMemo(() =>
            isCurrentGuess()
              ? wordleState().currentGuess
              : wordleState().submittedGuesses[rowNum]
          );

          const rowError = createMemo(() =>
            isCurrentGuess() ? wordleState().currentGuessError : null
          );

          return (
            <LetterGridRow
              isSubmitted={isSubmitted}
              rowError={rowError}
              rowGuess={rowGuess}
              solution={() => wordleState().solution}
              onRowRevealed={onRowRevealed}
            />
          );
        }}
      </For>
    </div>
  );
}
