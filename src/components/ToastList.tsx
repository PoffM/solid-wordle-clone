import clsx from "clsx";
import { createEffect, createSignal, For, onCleanup } from "solid-js";

export interface ToastData {
  message: string;
}

export interface ToastListProps {
  latestToast: () => ToastData | null;
}

export function ToastList({ latestToast }: ToastListProps) {
  const [toastList, setToastList] = createSignal<ToastData[]>([]);

  createEffect(() => {
    const newToast = latestToast();
    if (newToast) {
      setToastList((current) => [newToast, ...current]);
    }
  });

  return (
    <div class="relative">
      <div class="toast absolute toast-top toast-center">
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
                  "alert alert-warning shadow-lg",
                  fadeOut() && "animate-fadeOut"
                )}
              >
                {toast.message}
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
}
