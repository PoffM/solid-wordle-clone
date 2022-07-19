import type { Component } from "solid-js";
import { WordleGame } from "./components/WordleGame";

const App: Component = () => {
  return (
    <div style={{ height: "calc(100vh - env(safe-area-inset-bottom))" }}>
      <WordleGame />
    </div>
  );
};

export default App;
