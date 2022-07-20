import { Component, createEffect, createSignal } from "solid-js";
import { WordleGame } from "./components/WordleGame";
import { WordleHeader } from "./components/WordleHeader";

const App: Component = () => {
  const initialColorMode =
    localStorage.getItem("color-mode") ??
    (window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");

  const [colorMode, setColorMode] = createSignal(initialColorMode);

  // Persist color mode to local storage:
  createEffect(() => {
    if (colorMode()) {
      localStorage.setItem("color-mode", colorMode());
    }
  });

  return (
    <div data-theme={colorMode()} class={colorMode()}>
      <div
        class="flex flex-col"
        style={{ height: "calc(100vh - env(safe-area-inset-bottom))" }}
      >
        <WordleHeader
          colorMode={colorMode}
          onToggleColorMode={() =>
            setColorMode(colorMode() === "light" ? "dark" : "light")
          }
        />
        <div class="flex-grow flex justify-center h-100">
          <WordleGame />
        </div>
      </div>
    </div>
  );
};

export default App;
