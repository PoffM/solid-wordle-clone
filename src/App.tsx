import type { Component } from "solid-js";
import { WordleGame } from "./components/WordleGame";
import { WordleHeader } from "./components/WordleHeader";

const App: Component = () => {
  return (
    <div
      data-theme="light"
      class="flex flex-col"
      style={{ height: "calc(100vh - env(safe-area-inset-bottom))" }}
    >
      <WordleHeader />
      <div class="flex-grow flex justify-center h-100">
        <WordleGame />
      </div>
    </div>
  );
};

export default App;
