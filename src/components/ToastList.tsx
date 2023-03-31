import clsx from "clsx";
import { RiSystemErrorWarningFill } from "solid-icons/ri";
import { createEffect, createSignal, For } from "solid-js";

export interface ToastData {
  message: string;
}

export interface ToastListProps {
  latestToast: ToastData | null;
}

export function ToastList(props: ToastListProps) {
  const [toastList, setToastList] = createSignal<ToastData[]>([]);

  createEffect(() => {
    const newToast = props.latestToast;
    if (newToast) {
      setToastList((current) => [newToast, ...current]);
    }
  });

  return (
    <div class="relative">
      <div class="toast absolute toast-top toast-center z-10 w-[280px]">
        <For each={toastList()}>
          {(toast) => {
            // After showing the toast, wait, then fade out, then remove the toast:
            const [fadeOut, setFadeOut] = createSignal(false);
            setTimeout(() => {
              setFadeOut(true);
              setTimeout(
                () => setToastList(toastList().filter((it) => it !== toast)),
                1000
              );
            }, 2000);

            return (
              <div
                class={clsx(
                  "alert alert-warning shadow-lg justify-start gap-2",
                  fadeOut() && "animate-fadeOut"
                )}
              >
                <RiSystemErrorWarningFill size="25px" />
                <span>{toast.message}</span>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
}
