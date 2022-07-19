import { createWordleState } from "../logic/createWordleState";
import { LetterGrid } from "./LetterGrid";

export function WordleGame() {
  const { wordleState, continueGame } = createWordleState();

  return (
    <div class="flex flex-col h-full">
      {/* <WordleHeader /> */}
      <div class="flex flex-grow justify-center items-center">
        <LetterGrid wordleState={wordleState} onRowRevealed={continueGame} />
      </div>
      <div class="h-[12rem] p-1.5"></div>
    </div>
  );
}
