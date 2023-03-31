import { createContext, useContext } from "solid-js";
import { createWordleStore } from "./createWordleStore";

export const WordleContext = createContext<ReturnType<typeof createWordleStore>>();

export function useWordleStore() {
  const ctx = useContext(WordleContext);
  if (!ctx)
    throw new Error("Missing Wordle context");
  return ctx;
}
