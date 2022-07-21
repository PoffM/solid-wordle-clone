import { get, range } from "lodash";
import { createMemo, onCleanup } from "solid-js";
import {
  createWordleStore,
  WordleStoreParams,
} from "../store/createWordleStore";
import { KeyboardButtons } from "./KeyboardButtons";
import { LetterGrid } from "./letter-grid/LetterGrid";
import { PostGameButtons } from "./PostGameButtons";
import { ToastList } from "./ToastList";

const ALPHABET = range(0, 26).map((i) => String.fromCharCode(i + 65));

export function WordleGame(params: WordleStoreParams) {
  const {
    wordleState,
    continueGame,
    addLetterToGuess,
    removeLastLetterFromGuess,
    submitGuess,
    restart,
  } = createWordleStore(params);

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

  // Defocus the button after clicking it,
  function blurElement() {
    // eslint-disable-next-line
    (document.activeElement as any)?.blur?.();
  }
  document.addEventListener("click", blurElement);
  onCleanup(() => document.removeEventListener("click", blurElement));

  // Only reveal the new colors on the keyboard UI after the letter box colors have been revealed:
  const revealedGuesses = createMemo(() =>
    wordleState.status === "REVEALING"
      ? wordleState.submittedGuesses.slice(0, -1)
      : wordleState.submittedGuesses
  );

  const status = () => wordleState.status;

  return (
    <div class="flex flex-col h-full w-full max-w-[31rem]">
      <ToastList latestToast={() => wordleState.currentGuessError} />
      <div class="flex flex-grow justify-center items-center">
        <LetterGrid
          wordleState={() => wordleState}
          onRowRevealed={continueGame}
        />
      </div>
      <div class="h-[12rem] p-1.5">
        {(status() === "WON" || status() === "LOST") && (
          <PostGameButtons
            onRestartClick={restart}
            wordleState={() => wordleState}
          />
        )}
        {(status() === "GUESSING" || status() === "REVEALING") && (
          <KeyboardButtons
            submittedGuesses={revealedGuesses}
            solution={() => wordleState.solution}
            onLetterClick={addLetterToGuess}
            onBackspaceClick={removeLastLetterFromGuess}
            onEnterClick={submitGuess}
          />
        )}
      </div>
    </div>
  );
}
