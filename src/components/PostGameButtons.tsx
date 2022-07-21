import { WordleState } from "../store/createWordleStore";

export interface PostGameButtonsProps {
  wordleState: () => WordleState;
  onRestartClick: () => void;
}

export function PostGameButtons({
  wordleState,
  onRestartClick,
}: PostGameButtonsProps) {
  return (
    <div class="flex flex-col gap-2">
      {wordleState().status === "LOST" && (
        <div class="text-center">
          <h2>SOLUTION</h2>
          <p class="text-3xl">{wordleState().solution}</p>
        </div>
      )}
      {wordleState().status === "WON" && (
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
