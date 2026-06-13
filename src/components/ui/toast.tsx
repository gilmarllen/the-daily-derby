"use client";

import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import { CheckCircle2, X } from "lucide-react";

import { cn } from "@/lib/utils";

/** Re-exported so callers can fire toasts: `useToastManager().add({ ... })`. */
export const useToastManager = ToastPrimitive.useToastManager;

/**
 * App-wide toast host. Wrap a subtree in this, then any descendant can call
 * `useToastManager().add(...)` to pop a toast. Toasts stack bottom-up, sit
 * bottom-center on mobile and bottom-right on desktop, auto-dismiss, and can be
 * swiped away.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToastPrimitive.Provider>
      {children}
      <ToastPrimitive.Portal>
        <ToastPrimitive.Viewport className="fixed right-0 bottom-0 left-0 z-50 mx-auto flex w-full max-w-sm flex-col gap-2 p-4 sm:left-auto">
          <ToastList />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  );
}

function ToastList() {
  const { toasts } = useToastManager();
  return toasts.map((toast) => (
    <ToastPrimitive.Root
      key={toast.id}
      toast={toast}
      className={cn(
        "bg-card ring-foreground/10 flex items-start gap-3 rounded-xl p-4 shadow-lg ring-1",
        "transition-[transform,opacity] duration-300 data-[ending-style]:opacity-0 data-[starting-style]:translate-y-4 data-[starting-style]:opacity-0",
        "data-[swipe-direction=down]:data-[ending-style]:translate-y-full data-[swipe-direction=left]:data-[ending-style]:-translate-x-full data-[swipe-direction=right]:data-[ending-style]:translate-x-full"
      )}
    >
      <CheckCircle2
        className="mt-0.5 size-5 shrink-0 text-emerald-500"
        aria-hidden
      />
      <div className="flex min-w-0 flex-col gap-0.5">
        <ToastPrimitive.Title className="text-sm font-semibold" />
        <ToastPrimitive.Description className="text-muted-foreground text-sm" />
      </div>
      <ToastPrimitive.Close
        aria-label="Close"
        className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring -mt-1 -mr-1 ml-auto inline-flex size-7 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        <X className="size-4" />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  ));
}
