import clsx from "clsx";
import { useId } from "react";
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import styles from "./Field.module.css";

interface ShellProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

function FieldShell({ id, label, hint, error, required, children }: ShellProps) {
  return (
    <div className={clsx(styles.field, error && styles.invalid)}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface BaseFieldProps {
  label: string;
  hint?: string;
  error?: string;
}

function describedBy(id: string, hint?: string, error?: string) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

export function TextField({
  label,
  hint,
  error,
  required,
  id: idProp,
  className,
  ...rest
}: BaseFieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const generated = useId();
  const id = idProp ?? generated;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      <input
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={clsx(styles.control, className)}
        {...rest}
      />
    </FieldShell>
  );
}

export function SelectField({
  label,
  hint,
  error,
  required,
  id: idProp,
  className,
  children,
  ...rest
}: BaseFieldProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const generated = useId();
  const id = idProp ?? generated;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      <select
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={clsx(styles.control, styles.select, className)}
        {...rest}
      >
        {children}
      </select>
    </FieldShell>
  );
}

export function TextareaField({
  label,
  hint,
  error,
  required,
  id: idProp,
  className,
  ...rest
}: BaseFieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const generated = useId();
  const id = idProp ?? generated;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      <textarea
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={clsx(styles.control, styles.textarea, className)}
        rows={4}
        {...rest}
      />
    </FieldShell>
  );
}

export function CheckboxField({
  label,
  description,
  error,
  required,
  id: idProp,
  className,
  ...rest
}: Omit<BaseFieldProps, "hint"> & { description?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const generated = useId();
  const id = idProp ?? generated;
  return (
    <div className={clsx(styles.checkboxContainer, error && styles.invalid)}>
      <label htmlFor={id} className={styles.checkboxLabel}>
        <input
          id={id}
          type="checkbox"
          required={required}
          aria-invalid={error ? true : undefined}
          className={clsx(styles.checkboxInput, className)}
          {...rest}
        />
        <div className={styles.checkboxText}>
          <span className={styles.checkboxTitle}>
            {label}
            {required && <span aria-hidden="true"> *</span>}
          </span>
          {description && <span className={styles.checkboxDescription}>{description}</span>}
        </div>
      </label>
      {error && (
        <p id={`${id}-error`} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
