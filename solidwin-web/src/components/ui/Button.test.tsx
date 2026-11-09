import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders a button with type=button by default", () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole("button", { name: "Click" })).toHaveAttribute("type", "button");
  });

  it("renders a link when href is provided", () => {
    render(<Button href="/request-quote">Quote</Button>);
    expect(screen.getByRole("link", { name: "Quote" })).toHaveAttribute("href", "/request-quote");
  });

  it("respects disabled", () => {
    render(<Button disabled>Nope</Button>);
    expect(screen.getByRole("button", { name: "Nope" })).toBeDisabled();
  });
});
