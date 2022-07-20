import { createMemo } from "solid-js";
import { WordleState } from "../logic/createWordleState";

export interface PostGameButtonsProps {
  wordleState: () => WordleState;
  onRestartClick: () => void;
}

export function PostGameButtons({
  wordleState,
  onRestartClick,
}: PostGameButtonsProps) {
  const status = createMemo(() => wordleState().status);
  const solution = createMemo(() => wordleState().solution);

  return (
    <div class="flex flex-col gap-2">
      {status() === "LOST" && (
        <div class="text-center">
          <h2>SOLUTION</h2>
          <p class="text-3xl">{solution}</p>
        </div>
      )}
      {status() === "WON" && (
        <div class="text-center">
          <p class="text-3xl">WINNER!</p>
        </div>
      )}
      <div class="flex w-full">
        <button class="flex-1 bg-green-500 rounded py-2" onClick={onRestartClick}>
          Next Word
        </button>
      </div>
    </div>
  );
}
