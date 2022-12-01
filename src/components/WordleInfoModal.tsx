import clsx from "clsx";
import { createFocusTrap, FocusTrap } from "focus-trap";
import { createEffect } from "solid-js";
import { LetterGridRow } from "./letter-grid/LetterGridRow";

export interface WordleInfoModalProps {
  isOpen: () => boolean;
  onClose: () => void;
}

export function WordleInfoModal({ isOpen, onClose }: WordleInfoModalProps) {
  let focusTrap: FocusTrap | undefined = undefined;

  createEffect(() =>
    isOpen() ? focusTrap?.activate() : focusTrap?.deactivate()
  );

  return (
    <div class={clsx("modal", isOpen() && "modal-open")}>
      <div
        class="modal-box animate-fadeIn relative"
        ref={(node) => (focusTrap = createFocusTrap(node))}
      >
        <button
          type="button"
          class="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
        <div class="flex flex-col gap-2">
          <h3 class="text-lg font-bold">How to Play</h3>
          <p>Guess the WORDLE in six tries.</p>
          <p>
            Each guess must be a valid five-letter word. Hit the enter button to
            submit.
          </p>
          <p>
            After each guess, the color of the tiles will change to show how
            close your guess was to the word.
          </p>
        </div>
        <div class="divider" />
        <div class="flex flex-col gap-4">
          <p class="font-bold">Examples</p>
          <div>
            <div class="w-[15rem] mb-1">
              <LetterGridRow
                rowGuess={() => "WEARY"}
                solution={() => "WXXXX"}
                isSubmitted={() => true}
                initiallyRevealed={true}
              />
            </div>
            <p>The letter W is in the word and in the correct spot.</p>
          </div>
          <div>
            <div class="w-[15rem] mb-1">
              <LetterGridRow
                rowGuess={() => "PILLS"}
                solution={() => "XXIXX"}
                isSubmitted={() => true}
                initiallyRevealed={true}
              />
            </div>
            <p>The letter I is in the word but in the wrong spot.</p>
          </div>
          <div>
            <div class="w-[15rem] mb-1">
              <LetterGridRow
                rowGuess={() => "VAGUE"}
                solution={() => "XXXXX"}
                isSubmitted={() => true}
                initiallyRevealed={true}
              />
            </div>
            <p>No letters in the guess are in the word.</p>
          </div>
        </div>
        <footer class="flex justify-end">
          <button type="button" class="btn" onClick={onClose}>
            Close
          </button>
        </footer>
      </div>
    </div>
  );
}
