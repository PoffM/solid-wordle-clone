import { range } from "lodash";
import { For, Show } from "solid-js";
import { useWordleStore } from "../../store/wordle-context";
import { LetterGridRow } from "./LetterGridRow";

export function LetterGrid() {
  const store = useWordleStore();

  return (
    <Show
      when={store.wordleState.playId}
      // Any component state should be lost when the playId is changed (i.e. for a new game):
      keyed
    >
      <div class="flex flex-col m-1.5 gap-1.5 w-full max-w-[21rem]">
        <For each={range(0, store.wordleState.maxGuesses)}>
          {(rowNum) => <LetterGridRow rowNum={rowNum} />}
        </For>
      </div>
    </Show>
  );
}
