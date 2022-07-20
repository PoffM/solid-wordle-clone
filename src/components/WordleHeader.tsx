import { BsMoonFill, BsQuestionCircle, BsSunFill } from "solid-icons/bs";
import { createSignal } from "solid-js";
import { WordleInfoModal } from "./WordleInfoModal";

export interface WordleHeaderProps {
  colorMode: () => string;
  onToggleColorMode: () => void;
}

export function WordleHeader({
  colorMode,
  onToggleColorMode,
}: WordleHeaderProps) {
  const helpLabel = "Help";
  const colorModeLabel = () =>
    `Switch to ${colorMode() === "dark" ? "Light" : "Dark"} mode.`;

  const [infoIsOpen, setInfoOpen] = createSignal(false);

  const buttonClass =
    "btn btn-sm w-[40px] h-[40px]";

  return (
    <div class="flex items-center h-[3rem] border-b-2 border-gray-400 px-3 py-2">
      <div class="flex items-center">
        <button
          class={buttonClass}
          aria-label={helpLabel}
          title={helpLabel}
          onClick={() => setInfoOpen(true)}
        >
          <BsQuestionCircle size="24px" />
        </button>
      </div>
      <div class="flex-grow flex justify-center">
        <h1 class="text-3xl font-bold">Solid Wordle Clone</h1>
      </div>
      <div class="flex items-center">
        <button
          class={buttonClass}
          aria-label={colorModeLabel()}
          title={colorModeLabel()}
          onClick={onToggleColorMode}
        >
          {colorMode() === "dark" ? (
            <BsSunFill size="20px" />
          ) : (
            <BsMoonFill size="20px" />
          )}
        </button>
      </div>
      <WordleInfoModal isOpen={infoIsOpen} onClose={() => setInfoOpen(false)} />
    </div>
  );
}
