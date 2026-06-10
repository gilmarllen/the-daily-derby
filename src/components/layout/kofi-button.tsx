"use client";

import Script from "next/script";
import { useRef } from "react";

declare global {
  interface Window {
    kofiwidget2?: {
      init: (text: string, color: string, id: string) => void;
      getHTML: () => string;
    };
  }
}

/**
 * Ko-fi "Support me" button. The widget's own `draw()` uses document.write
 * (breaks after load), so we load Widget_2.js and inject its `getHTML()` markup
 * into a container instead.
 */
export function KofiButton() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={ref} />
      <Script
        src="https://storage.ko-fi.com/cdn/widget/Widget_2.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (!ref.current || !window.kofiwidget2) return;
          window.kofiwidget2.init(
            "Support me on Ko-fi",
            "#10C185",
            "N4R6215OF6"
          );
          ref.current.innerHTML = window.kofiwidget2.getHTML();
        }}
      />
    </>
  );
}
