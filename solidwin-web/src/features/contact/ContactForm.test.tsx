import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { InquiryService } from "@/services/inquiry";
import { ContactForm } from "./ContactForm";

function setup(service: Pick<InquiryService, "submitContact">) {
  render(<ContactForm service={service} />);
  return userEvent.setup();
}

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
  await user.type(screen.getByLabelText(/phone/i), "+44 20 7946 0958");
  await user.type(screen.getByLabelText(/email/i), "jane@example.com");
  await user.type(screen.getByLabelText(/message/i), "I would like to discuss a project.");
}

describe("ContactForm", () => {
  it("shows validation errors and does not submit empty input", async () => {
    const submitContact = vi.fn();
    const user = setup({ submitContact });
    await user.click(screen.getByRole("button", { name: /send enquiry/i }));
    expect(await screen.findByText("Enter your name")).toBeInTheDocument();
    expect(submitContact).not.toHaveBeenCalled();
  });

  it("submits valid input with a request id and shows success", async () => {
    const submitContact = vi.fn().mockResolvedValue({ ok: true, requestId: "x" });
    const user = setup({ submitContact });
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: /send enquiry/i }));
    await waitFor(() => expect(submitContact).toHaveBeenCalledTimes(1));
    expect(submitContact.mock.calls[0][0]).toMatchObject({
      name: "Jane Doe",
      email: "jane@example.com",
      requestId: expect.any(String),
    });
    expect(await screen.findByText(/has been received/i)).toBeInTheDocument();
  });

  it("shows an error and keeps the same request id on retry", async () => {
    const submitContact = vi
      .fn()
      .mockRejectedValueOnce(new Error("down"))
      .mockResolvedValueOnce({ ok: true, requestId: "x" });
    const user = setup({ submitContact });
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: /send enquiry/i }));
    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /send enquiry/i }));
    await waitFor(() => expect(submitContact).toHaveBeenCalledTimes(2));
    expect(submitContact.mock.calls[1][0].requestId).toBe(submitContact.mock.calls[0][0].requestId);
  });
});
