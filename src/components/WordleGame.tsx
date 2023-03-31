import { get, range } from "lodash";
import { createMemo, onCleanup } from "solid-js";
import {
  createWordleStore,
  WordleStoreParams,
} from "../store/createWordleStore";
import { WordleContext } from "../store/wordle-context";
import { KeyboardButtons } from "./KeyboardButtons";
import { LetterGrid } from "./letter-grid/LetterGrid";
import { PostGameButtons } from "./PostGameButtons";
import { ToastList } from "./ToastList";

const ALPHABET = range(0, 26).map((i) => String.fromCharCode(i + 65));

export function WordleGame(params: WordleStoreParams) {
  const store = createWordleStore(params);

  // Key presses change the game state:
  function callGameFunction(event: KeyboardEvent) {
    if (ALPHABET.includes(event.key.toUpperCase())) {
      store.addLetterToGuess?.(event.key.toUpperCase().charCodeAt(0));
    }
    if (event.key === "Backspace") {
      store.removeLastLetterFromGuess?.();
    }
    if (
      event.key === "Enter" &&
      // Don't submit the guess if the user is tabbed to a button,
      // e.g. navigating the page keyboard-only:
      get(event.target, "type") !== "button"
    ) {
      store.submitGuess?.();
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

  const status = () => store.wordleState.status;

  return (
    <WordleContext.Provider value={store}>
      <div class="flex flex-col h-full w-full max-w-[31rem]">
        <ToastList latestToast={store.wordleState.currentGuessError} />
        <div class="flex flex-grow justify-center items-center">
          <LetterGrid />
        </div>
        <div class="h-[12rem] p-1.5">
          {(status() === "WON" || status() === "LOST") && <PostGameButtons />}
          {(status() === "GUESSING" || status() === "REVEALING") && (
            <KeyboardButtons />
          )}
        </div>
      </div>
    </WordleContext.Provider>
  );
}
