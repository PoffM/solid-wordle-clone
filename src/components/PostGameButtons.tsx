import { useWordleStore } from "../store/wordle-context";

export function PostGameButtons() {
  const store = useWordleStore();

  return (
    <div class="flex flex-col gap-2">
      {store.wordleState.status === "LOST" && (
        <div class="text-center">
          <h2>SOLUTION</h2>
          <p class="text-3xl">{store.wordleState.solution}</p>
        </div>
      )}
      {store.wordleState.status === "WON" && (
        <div class="text-center">
          <p class="text-3xl">WINNER!</p>
        </div>
      )}
      <button class="btn btn-success text-white w-full" onClick={store.restart}>
        Next Word
      </button>
    </div>
  );
}
