import clsx from "clsx";
import { flatMap } from "lodash";
import { ComponentProps, createMemo } from "solid-js";

export interface KeyboardButtonsProps {
  onLetterClick?: (charCode: number) => void;
  onEnterClick?: () => void;
  onBackspaceClick?: () => void;
  submittedGuesses: () => string[];
  solution: () => string;
}

export function KeyboardButtons({
  onLetterClick,
  onEnterClick,
  onBackspaceClick,
  submittedGuesses,
  solution,
}: KeyboardButtonsProps) {
  const submittedLetters = createMemo(() =>
    flatMap(
      submittedGuesses()
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
          .filter(({ letter, index }) => solution()[index] === letter)
          .map((it) => it.letter)
      )
  );

  const misplacedLetters = createMemo(
    () =>
      new Set(
        submittedLetters()
          .filter(
            ({ letter }) =>
              solution().includes(letter) && !correctLetters().has(letter)
          )
          .map((it) => it.letter)
      )
  );

  const defaultButtonColors = "bg-gray-300 dark:bg-gray-500 text-black dark:text-white"

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
      onClick: () => onLetterClick?.(letter.charCodeAt(0)),
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
          onClick={onEnterClick}
        >
          ENTER
        </KeyButton>
        {[..."ZXCVBNM"].map((letter) => (
          <KeyButton  {...letterButtonProps(letter, "flex-1")} />
        ))}
        <KeyButton
          class={clsx(defaultButtonColors, "flex-[1.65]")}
          onClick={onBackspaceClick}
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
      onClick={(e) => {
        // @ts-ignore ("This expression is not callable")
        props.onClick?.(e);
        (e.target as any)?.blur();
      }}
      class={clsx("h-full rounded", props.class)}
    />
  );
}
