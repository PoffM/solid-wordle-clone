import clsx from "clsx";
import { createSignal } from "solid-js";
import { WordleInfoModal } from "./WordleInfoModal";

export function WordleHeader() {
  const helpLabel = "Help";
  // const colorModeLabel = `Switch to ${
  //   colorMode === "dark" ? "Light" : "Dark"
  // } mode.`;

  const [infoIsOpen, setInfoOpen] = createSignal(false);

  return (
    <div class="flex items-center h-[3rem] border-b-2 border-gray-400 px-3 py-2">
      <div class="flex items-center">
        <button
          class="btn btn-sm w-[40px] h-[40px]"
          aria-label={helpLabel}
          title={helpLabel}
          onClick={() => setInfoOpen(true)}
        >
          M
        </button>
      </div>
      <div class="flex-grow flex justify-center">
        <h1 class="text-3xl font-bold">Solid Wordle Clone</h1>
      </div>
      <div class="flex items-center">
        <button class="btn btn-sm w-[40px] h-[40px]">C</button>
      </div>
      <WordleInfoModal isOpen={infoIsOpen} onClose={() => setInfoOpen(false)} />
    </div>
  );
}
