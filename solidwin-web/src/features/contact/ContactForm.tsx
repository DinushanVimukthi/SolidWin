"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, type FormEvent } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { SelectField, TextareaField, TextField, CheckboxField } from "@/components/ui/Field";
import { mockInquiryService, type InquiryService } from "@/services/inquiry";
import { contactSchema, type ContactInput } from "./schema";
import styles from "./ContactForm.module.css";

interface ContactFormProps {
  service?: Pick<InquiryService, "submitContact">;
}

type Status = "idle" | "success" | "error";

export function ContactForm({ service = mockInquiryService }: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  // One id per form session: retries and double clicks reuse it (idempotency).
  const requestId = useRef<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      division: "",
      message: "",
      consent: true,
    },
  });

  const submit = async (values: ContactInput) => {
    setStatus("idle");
    requestId.current ??= crypto.randomUUID();
    try {
      const result = await service.submitContact({ ...values, requestId: requestId.current });
      if (!result.ok) throw new Error("Submission rejected");
      setStatus("success");
      reset();
      requestId.current = null;
    } catch {
      setStatus("error");
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => handleSubmit(submit)(event);

  return (
    <form onSubmit={onSubmit} noValidate className={styles.form} aria-label="Contact form">
      <div className={styles.header}>
        <div className={styles.accentDash} aria-hidden="true" />
        <h2 className={styles.title}>Get in touch</h2>
        <p className={styles.subtitle}>Tell us about your project and how we can help.</p>
      </div>

      <div className={styles.grid}>
        <TextField
          label="Full name"
          placeholder="Your full name"
          autoComplete="name"
          required
          error={errors.name?.message}
          {...register("name")}
        />

        <TextField
          label="Email address"
          placeholder="you@company.com"
          type="email"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register("email")}
        />

        <TextField
          label="Phone number (optional)"
          placeholder="Your phone number"
          type="tel"
          autoComplete="tel"
          error={errors.phone?.message}
          {...register("phone")}
        />

        <SelectField
          label="Select a division"
          required
          error={errors.division?.message}
          {...register("division")}
        >
          <option value="">Choose a division</option>
          <option value="Construction Services">Construction Services</option>
          <option value="Ready-Mix Concrete">Ready-Mix Concrete</option>
          <option value="Blocks & Pavers">Blocks &amp; Pavers</option>
          <option value="Equipment Rental">Equipment Rental</option>
          <option value="General Enquiry">General Enquiry</option>
        </SelectField>
      </div>

      <TextareaField
        label="Message"
        placeholder="Tell us about your project or requirements..."
        required
        rows={4}
        error={errors.message?.message}
        {...register("message")}
      />

      <CheckboxField
        label="I agree to be contacted about this enquiry."
        description="We will use your details to respond to your enquiry."
        defaultChecked
        {...register("consent")}
      />

      <div className={styles.actionRow}>
        <Button type="submit" disabled={isSubmitting} withArrow size="md">
          {isSubmitting ? "Sending..." : "Send Enquiry"}
        </Button>
      </div>

      <div aria-live="polite" className={styles.status}>
        {status === "success" && (
          <p className={styles.success}>Thank you. Your message has been received.</p>
        )}
        {status === "error" && (
          <p className={styles.failure}>Something went wrong. Please try again.</p>
        )}
      </div>
    </form>
  );
}
