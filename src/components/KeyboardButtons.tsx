import clsx from "clsx";
import { flatMap } from "lodash";
import { ComponentProps, createMemo } from "solid-js";
import { useWordleStore } from "../store/wordle-context";

export function KeyboardButtons() {
  const store = useWordleStore();

  // Only reveal the new colors on the keyboard UI after the letter box colors have been revealed:
  const revealedGuesses = createMemo(() =>
    store.wordleState.status === "REVEALING"
      ? store.wordleState.submittedGuesses.slice(0, -1)
      : store.wordleState.submittedGuesses
  );

  const submittedLetters = createMemo(() =>
    flatMap(
      revealedGuesses()
        .map((guess) => guess.split(""))
        .map((letters) => letters.map((letter, index) => ({ letter, index })))
    )
  );

  const submittedLettersSet = createMemo(
    () => new Set(submittedLetters().map((it) => it.letter))
  );

  const correctLetters = createMemo(
    () =>
      new Set(
        submittedLetters()
          .filter(
            ({ letter, index }) => store.wordleState.solution[index] === letter
          )
          .map((it) => it.letter)
      )
  );

  const misplacedLetters = createMemo(
    () =>
      new Set(
        submittedLetters()
          .filter(
            ({ letter }) =>
              store.wordleState.solution.includes(letter) &&
              !correctLetters().has(letter)
          )
          .map((it) => it.letter)
      )
  );

  const defaultButtonColors =
    "bg-gray-300 dark:bg-gray-500 text-black dark:text-white";

  function letterButtonProps(
    letter: string,
    classes?: string
  ): ComponentProps<"button"> {
    const className = correctLetters().has(letter)
      ? "bg-green-500 text-white"
      : misplacedLetters().has(letter)
      ? "bg-yellow-500 text-white"
      : submittedLettersSet().has(letter)
      ? "bg-gray-500 dark:bg-gray-700 text-white"
      : defaultButtonColors;

    return {
      onClick: () => store.addLetterToGuess?.(letter.charCodeAt(0)),
      class: clsx(className, classes),
      children: letter,
    };
  }

  const rowClasses = "flex-grow flex gap-1.5";

  return (
    <div class="h-full flex gap-1.5 flex-col font-semibold">
      <div class={rowClasses}>
        {[..."QWERTYUIOP"].map((letter) => (
          <KeyButton {...letterButtonProps(letter, "flex-1")} />
        ))}
      </div>
      <div class={rowClasses}>
        <div class="flex-[0.5]" />
        {[..."ASDFGHJKL"].map((letter) => (
          <KeyButton {...letterButtonProps(letter, "flex-1")} />
        ))}
        <div class="flex-[0.5]" />
      </div>
      <div class={rowClasses}>
        <KeyButton
          class={clsx(defaultButtonColors, "flex-[1.65]")}
          onClick={store.submitGuess}
        >
          ENTER
        </KeyButton>
        {[..."ZXCVBNM"].map((letter) => (
          <KeyButton {...letterButtonProps(letter, "flex-1")} />
        ))}
        <KeyButton
          class={clsx(defaultButtonColors, "flex-[1.65]")}
          onClick={store.removeLastLetterFromGuess}
        >
          BACK
        </KeyButton>
      </div>
    </div>
  );
}

/** A letter button on the clickable keyboard. */
function KeyButton(props: ComponentProps<"button">) {
  return (
    <button
      type="button"
      {...props}
      class={clsx("h-full rounded", props.class)}
    />
  );
}
