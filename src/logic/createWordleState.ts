import { uniqueId } from "lodash";
import { createSignal } from "solid-js";
import COMMON_WORDS from "../word-list/common-words.json";
import UNCOMMON_WORDS from "../word-list/uncommon-words.json";

export interface WordleState {
  /** Unique ID per game instance. */
  playId: string;
  solution: string;
  maxGuesses: number;
  wordLength: number;
  submittedGuesses: string[];
  currentGuess: string;
  currentGuessError: { message: string } | null;
  status: "GUESSING" | "WON" | "LOST" | "REVEALING";
}

const VALID_WORDS = [...COMMON_WORDS, ...UNCOMMON_WORDS];

export interface WordleStateParams {
  solution?: string;
}

export function createWordleState(params: WordleStateParams = {}) {
  const [wordleState, setWordleState] = createSignal(
    makeInitialState(params.solution)
  );

  return {
    wordleState,

    addLetterToGuess: (charCode: number) => {
      if (wordleState().status !== "GUESSING") return;

      const { currentGuess, wordLength } = wordleState();

      const newGuess = (currentGuess + String.fromCharCode(charCode)).slice(
        0,
        wordLength
      );
      setWordleState({
        ...wordleState(),
        currentGuessError: null,
        currentGuess: newGuess,
      });
    },

    removeLastLetterFromGuess: () => {
      if (wordleState().status !== "GUESSING") return;

      setWordleState({
        ...wordleState(),
        currentGuessError: null,
        currentGuess: wordleState().currentGuess.slice(0, -1),
      });
    },

    submitGuess: () => {
      if (wordleState().status !== "GUESSING") return;

      const { currentGuess, solution, submittedGuesses } = wordleState();

      const currentGuessError =
        currentGuess.length < solution.length
          ? { message: "Not enough letters." }
          : !VALID_WORDS.includes(currentGuess)
          ? { message: "Word not in word list." }
          : null;

      if (currentGuessError) {
        setWordleState({ ...wordleState(), currentGuessError });
        return;
      }

      const newSubmittedGuesses = [...submittedGuesses, currentGuess];

      const newStatus = "REVEALING";

      setWordleState({
        ...wordleState(),
        submittedGuesses: newSubmittedGuesses,
        currentGuess: "",
        status: newStatus,
      });
    },

    continueGame: () => {
      if (wordleState().status !== "REVEALING") return;

      const { submittedGuesses, solution, maxGuesses } = wordleState();

      const lastGuess = submittedGuesses.at(-1);

      const newStatus =
        lastGuess === solution
          ? "WON"
          : submittedGuesses.length >= maxGuesses
          ? "LOST"
          : "GUESSING";

      setWordleState({ ...wordleState(), status: newStatus });
    },

    restart: () => void setWordleState(makeInitialState()),
  };
}

function makeInitialState(solutionWord?: string): WordleState {
  const solution = (
    solutionWord ??
    COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)]
  )?.toUpperCase();

  if (!solution) {
    // Shouldn't happen:
    throw new Error("Random word selection failed.");
  }

  return {
    playId: uniqueId(),
    solution,
    maxGuesses: 6,
    wordLength: solution.length,
    submittedGuesses: [] as string[],
    currentGuess: "",
    currentGuessError: null,
    status: "GUESSING",
  };
}
