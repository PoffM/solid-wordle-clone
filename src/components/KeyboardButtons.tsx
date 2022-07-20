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

  function letterButtonProps(letter: string): ComponentProps<"button"> {
    const className = correctLetters().has(letter)
      ? "bg-green-500"
      : misplacedLetters().has(letter)
      ? "bg-yellow-500"
      : submittedLettersSet().has(letter)
      ? "bg-gray-500"
      : "bg-gray-500 text-black";

    return {
      onClick: () => onLetterClick?.(letter.charCodeAt(0)),
      class: className,
      children: letter,
    };
  }

  const rowClasses = "flex-grow flex gap-1.5";

  return (
    <div class="h-full flex gap-1.5 flex-col">
      <div class={rowClasses}>
        {[..."QWERTYUIOP"].map((letter) => (
          <KeyButton {...letterButtonProps(letter)} />
        ))}
      </div>
      <div class={rowClasses}>
        {[..."ASDFGHJKL"].map((letter) => (
          <KeyButton {...letterButtonProps(letter)} />
        ))}
      </div>
      <div class={rowClasses}>
        {[..."ZXCVBNM"].map((letter) => (
          <KeyButton {...letterButtonProps(letter)} />
        ))}
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
      class={clsx("h-full flex-grow", props.class)}
    />
  );
}
