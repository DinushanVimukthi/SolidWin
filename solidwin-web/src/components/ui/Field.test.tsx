import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TextField } from "./Field";

describe("TextField", () => {
  it("associates the label with the input", () => {
    render(<TextField label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("exposes errors accessibly", () => {
    render(<TextField label="Email" error="Enter a valid email address" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid email address");
    expect(input.getAttribute("aria-describedby")).toBe(screen.getByRole("alert").id);
  });
});
