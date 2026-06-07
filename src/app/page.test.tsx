import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("Home page", () => {
  it("renders the game title", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: /the daily derby/i })
    ).toBeInTheDocument();
  });

  it("links sign up and log in to the auth pages", () => {
    render(<Home />);

    const signUp = screen.getByRole("link", { name: /sign up/i });
    const logIn = screen.getByRole("link", { name: /log in/i });

    expect(signUp).toHaveAttribute("href", "/signup");
    expect(logIn).toHaveAttribute("href", "/login");
  });
});
