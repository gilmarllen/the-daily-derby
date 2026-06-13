import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LocaleProvider } from "@/components/i18n/locale-provider";
import en from "@/lib/i18n/dictionaries/en";
import Home from "./page";

// Home is a server component that resolves the locale via `next/headers`
// (server-only). Stub the dictionary so the page can render in jsdom.
vi.mock("@/lib/i18n/server", () => ({
  getServerDictionary: async () => en,
}));

// The language switcher (a client island in Home) reads the app router.
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}));

async function renderHome() {
  render(<LocaleProvider locale="en">{await Home()}</LocaleProvider>);
}

describe("Home page", () => {
  it("renders the game title", async () => {
    await renderHome();

    expect(
      screen.getByRole("heading", { name: /the daily derby/i })
    ).toBeInTheDocument();
  });

  it("links sign up and log in to the auth pages", async () => {
    await renderHome();

    const signUp = screen.getByRole("link", { name: /sign up/i });
    const logIn = screen.getByRole("link", { name: /log in/i });

    expect(signUp).toHaveAttribute("href", "/signup");
    expect(logIn).toHaveAttribute("href", "/login");
  });
});
