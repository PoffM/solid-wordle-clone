import { get, range } from "lodash";
import { createMemo, onCleanup } from "solid-js";
import { createWordleState } from "../logic/createWordleState";
import { KeyboardButtons } from "./KeyboardButtons";
import { LetterGrid } from "./LetterGrid";

const ALPHABET = range(0, 26).map((i) => String.fromCharCode(i + 65));

export function WordleGame() {
  const {
    wordleState,
    continueGame,
    addLetterToGuess,
    removeLastLetterFromGuess,
    submitGuess,
  } = createWordleState({ solution: "REACT" });

  // Key presses change the game state:
  function callGameFunction(event: KeyboardEvent) {
    if (ALPHABET.includes(event.key.toUpperCase())) {
      addLetterToGuess?.(event.key.toUpperCase().charCodeAt(0));
    }
    if (event.key === "Backspace") {
      removeLastLetterFromGuess?.();
    }
    if (
      event.key === "Enter" &&
      // Don't submit the guess if the user is tabbed to a button,
      // e.g. navigating the page keyboard-only:
      get(event.target, "type") !== "button"
    ) {
      submitGuess?.();
    }
  }
  document.addEventListener("keydown", callGameFunction);
  onCleanup(() => document.removeEventListener("keydown", callGameFunction));

  // Only reveal the new colors on the keyboard UI after the letter box colors have been revealed:
  const revealedGuesses = createMemo(() =>
    wordleState().status === "REVEALING"
      ? wordleState().submittedGuesses.slice(0, -1)
      : wordleState().submittedGuesses
  );

  return (
    <div class="flex flex-col h-full w-full max-w-[31rem]">
      {/* <WordleHeader /> */}
      <div class="flex flex-grow justify-center items-center">
        <LetterGrid wordleState={wordleState} onRowRevealed={continueGame} />
      </div>
      <div class="h-[12rem] p-1.5">
        {(wordleState().status === "GUESSING" ||
          wordleState().status === "REVEALING") && (
          <KeyboardButtons
            submittedGuesses={revealedGuesses}
            solution={() => wordleState().solution}
            onLetterClick={addLetterToGuess}
            onBackspaceClick={removeLastLetterFromGuess}
            onEnterClick={submitGuess}
          />
        )}
      </div>
    </div>
  );
}
