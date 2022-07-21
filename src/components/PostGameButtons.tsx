import { createMemo } from "solid-js";
import { WordleState } from "../state/createWordleState";

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
      <button
        class="btn btn-success text-white w-full"
        onClick={onRestartClick}
      >
        Next Word
      </button>
    </div>
  );
}
