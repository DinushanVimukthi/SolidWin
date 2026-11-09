import { describe, expect, it } from "vitest";
import { contactSchema } from "./schema";

const valid = {
  name: "Jane Doe",
  phone: "+44 20 7946 0958",
  email: "jane@example.com",
  message: "I would like to discuss a project.",
  consent: true,
};

describe("contactSchema", () => {
  it("accepts valid input", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(contactSchema.safeParse({ ...valid, email: "nope" }).success).toBe(false);
  });

  it("rejects phone numbers with letters or too few digits", () => {
    expect(contactSchema.safeParse({ ...valid, phone: "abc" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, phone: "123" }).success).toBe(false);
  });

  it("accepts valid input without phone", () => {
    const withoutPhone = {
      name: valid.name,
      email: valid.email,
      message: valid.message,
      consent: valid.consent,
    };
    expect(contactSchema.safeParse(withoutPhone).success).toBe(true);
  });

  it("rejects too-short messages", () => {
    expect(contactSchema.safeParse({ ...valid, message: "hi" }).success).toBe(false);
  });
});
