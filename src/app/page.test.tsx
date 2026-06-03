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

  it("shows the sign up and log in actions", () => {
    render(<Home />);

    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });
});
