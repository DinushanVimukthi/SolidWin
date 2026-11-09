"use client";

import { useState, useRef, type FormEvent, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { TextField, SelectField, TextareaField } from "@/components/ui/Field";
import { FileUpload } from "@/components/ui/FileUpload";
import { rfqSchema, type RfqInput } from "./schema";
import styles from "./RfqForm.module.css";

function RfqFormInternal() {
  const searchParams = useSearchParams();

  // Prefilled parameters from calculators or catalogue
  const paramService = searchParams.get("service") as "construction" | "ready-mix" | "hardware" | null;
  const paramVolume = searchParams.get("volume");
  const paramGrade = searchParams.get("grade");
  const paramItems = searchParams.get("items");
  const paramShape = searchParams.get("shape");

  const [division, setDivision] = useState<"construction" | "ready-mix" | "hardware">(
    paramService ?? "construction"
  );
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submittedRef, setSubmittedRef] = useState<string>("");
  const requestId = useRef<string | null>(null);

  const initialDescription = paramVolume
    ? `Calculated concrete requirement: ${paramVolume} m³ (${paramShape ?? "slab"}).`
    : paramItems
    ? `Requested materials list: ${paramItems}`
    : "";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RfqInput>({
    resolver: zodResolver(rfqSchema),
    defaultValues: {
      serviceDivision: division,
      concreteVolumeM3: paramVolume ?? "",
      concreteGrade: paramGrade ?? "G25",
      hardwareItemsList: paramItems ?? "",
      projectDescription: initialDescription,
    },
    mode: "onBlur",
  });

  const onSubmitHandler = async (data: RfqInput) => {
    setStatus("submitting");
    requestId.current ??= crypto.randomUUID();

    try {
      // Simulate submission of payload + attachment to backend API
      void [data, attachedFile];
      await new Promise((resolve) => setTimeout(resolve, 800));

      const generatedLeadRef = `SW-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedRef(generatedLeadRef);
      setStatus("success");
      reset();
      setAttachedFile(null);
      requestId.current = null;
    } catch {
      setStatus("error");
    }
  };

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => handleSubmit(onSubmitHandler)(e);

  if (status === "success") {
    return (
      <div className={styles.successCard} role="region" aria-label="RFQ Confirmation">
        <div className={styles.successIcon}>✓</div>
        <h2 className={styles.successTitle}>Request for Quote Received</h2>
        <p className={styles.successText}>
          Thank you for trusting Solidwin. Your inquiry has been routed to our technical estimators.
        </p>
        <div className={styles.refBox}>
          <span>Reference Number:</span>
          <strong>{submittedRef}</strong>
        </div>
        <p className={styles.followupNote}>
          A project engineer will review your specifications and contact you within 24 business hours.
        </p>
        <Button href="/" variant="outline">
          Return to Homepage
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onFormSubmit} noValidate className={styles.form} aria-label="Request quote form">
      {/* 1. Division & Scope */}
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>1. Select Division</legend>

        <div className={styles.divisionSelector}>
          <button
            type="button"
            className={`${styles.divBtn} ${division === "construction" ? styles.divActive : ""}`}
            onClick={() => setDivision("construction")}
          >
            Construction Services
          </button>
          <button
            type="button"
            className={`${styles.divBtn} ${division === "ready-mix" ? styles.divActive : ""}`}
            onClick={() => setDivision("ready-mix")}
          >
            Ready-Mix Concrete
          </button>
          <button
            type="button"
            className={`${styles.divBtn} ${division === "hardware" ? styles.divActive : ""}`}
            onClick={() => setDivision("hardware")}
          >
            Hardware & Rentals
          </button>
        </div>
        <input type="hidden" value={division} {...register("serviceDivision")} />
      </fieldset>

      {/* 2. Division Specific Options */}
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>2. Project Specifications</legend>

        <div className={styles.grid2}>
          <TextField
            label="Project Location / Site Address"
            placeholder="e.g. Plot 42, North Coast Corridor"
            required
            error={errors.projectLocation?.message}
            {...register("projectLocation")}
          />
          <TextField
            label="Estimated Budget (Optional)"
            placeholder="e.g. $50,000"
            {...register("estimatedBudget")}
          />
        </div>

        {division === "ready-mix" && (
          <div className={styles.divisionSpecific}>
            <div className={styles.grid2}>
              <SelectField label="Concrete Mix Grade" {...register("concreteGrade")}>
                <option value="G15">G15 - Blinding / Mass Concrete (15 N/mm²)</option>
                <option value="G20">G20 - Domestic Ground Slabs (20 N/mm²)</option>
                <option value="G25">G25 - Reinforced Footings & Slabs (25 N/mm²)</option>
                <option value="G30">G30 - Structural Columns & Beams (30 N/mm²)</option>
                <option value="G35">G35 - Heavy Commercial & Retaining (35 N/mm²)</option>
              </SelectField>

              <TextField
                label="Required Volume (m³)"
                placeholder="e.g. 24.5"
                {...register("concreteVolumeM3")}
              />
            </div>

            <div className={styles.grid2}>
              <TextField
                label="Target Pour Date"
                type="date"
                {...register("targetPourDate")}
              />
              <SelectField label="Preferred Pour Time Slot" {...register("pourTimeSlot")}>
                <option value="morning">Morning (06:00 - 10:00) - Recommended for slabs</option>
                <option value="midday">Midday (10:00 - 14:00)</option>
                <option value="afternoon">Afternoon (14:00 - 18:00)</option>
                <option value="night">Night Pour (by special technical arrangement)</option>
              </SelectField>
            </div>

            <TextField
              label="Site Access Restrictions & Clearances"
              placeholder="e.g. Narrow street, overhead cables (<5m), unpaved muddy road, or bridge weight limits"
              {...register("siteAccessRestrictions")}
            />

            <div className={styles.checkboxWrapper}>
              <label className={styles.checkLabel}>
                <input type="checkbox" {...register("pumpTruckRequired")} />
                <span>Require boom pump truck on site (32m / 42m boom)</span>
              </label>
            </div>

            <p className={styles.rmcDisclaimer}>
              <strong>Notice:</strong> Concrete pour requests require technical staff confirmation. Submission does not promise truck availability or batching slot until confirmed by Solidwin dispatch.
            </p>
          </div>
        )}

        {division === "construction" && (
          <div className={styles.divisionSpecific}>
            <SelectField label="Project Sector / Type" {...register("constructionType")}>
              <option value="residential">Residential Villa / Housing</option>
              <option value="commercial">Commercial Building / Retail</option>
              <option value="industrial">Industrial Warehouse / Manufacturing</option>
              <option value="turnkey">Turnkey Design & Build (EPC)</option>
            </SelectField>
          </div>
        )}

        {division === "hardware" && (
          <div className={styles.divisionSpecific}>
            <TextField
              label="Manual Item List / Quantities (or attach BOQ below)"
              placeholder="e.g. 5,000 Hollow Blocks (200mm), 200 m² Interlocking Pavers, 1 × 20T Excavator (2 weeks)"
              {...register("hardwareItemsList")}
            />
          </div>
        )}

        <TextareaField
          label="Project Scope & Technical Details"
          placeholder="Please describe your site requirements, pour schedule, or scope of works..."
          required
          error={errors.projectDescription?.message}
          {...register("projectDescription")}
        />

        <FileUpload
          label="Attach plans, drawings or BOQ (Optional)"
          hint="Supports PDF, DWG, PNG, JPG, Excel (.xlsx/.xls) up to 25 MB"
          maxSizeMb={25}
          onFileSelect={setAttachedFile}
        />
      </fieldset>

      {/* 3. Contact Information */}
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>3. Contact Details</legend>
        <div className={styles.grid2}>
          <TextField
            label="Full Name"
            autoComplete="name"
            required
            error={errors.fullName?.message}
            {...register("fullName")}
          />
          <TextField
            label="Company / Contractor Name (Optional)"
            autoComplete="organization"
            {...register("companyName")}
          />
        </div>

        <div className={styles.grid2}>
          <TextField
            label="Phone Number"
            type="tel"
            autoComplete="tel"
            required
            error={errors.phone?.message}
            {...register("phone")}
          />
          <TextField
            label="Email Address"
            type="email"
            autoComplete="email"
            required
            error={errors.email?.message}
            {...register("email")}
          />
        </div>
      </fieldset>

      <div className={styles.actionRow}>
        <Button type="submit" disabled={status === "submitting"} withArrow>
          {status === "submitting" ? "Submitting RFQ..." : "Submit Request for Quote"}
        </Button>
        {status === "error" && (
          <p className={styles.errorBanner} role="alert">
            Submission failed. Please check your network connection and try again.
          </p>
        )}
      </div>
    </form>
  );
}

export function RfqForm() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <RfqFormInternal />
    </Suspense>
  );
}
