import clsx from "clsx";
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "outline" | "outlineInverse" | "secondary" | "ghost";
type Size = "sm" | "md";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  /** Show a trailing arrow, as in the Figma CTAs. */
  withArrow?: boolean;
  className?: string;
  children: ReactNode;
}

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type LinkButtonProps = CommonProps & { href: string };

function Arrow() {
  return (
    <svg
      className={styles.arrow}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Polymorphic button: renders a Next `Link` when `href` is given, else a `button`. */
export function Button(props: ButtonProps | LinkButtonProps) {
  const { variant = "primary", size = "md", withArrow, className, children } = props;
  const classes = clsx(styles.button, styles[variant], styles[size], className);
  const content = (
    <>
      <span>{children}</span>
      {withArrow && <Arrow />}
    </>
  );

  if (props.href !== undefined) {
    return (
      <Link href={props.href} className={classes}>
        {content}
      </Link>
    );
  }

  const {
    variant: _v,
    size: _s,
    withArrow: _w,
    className: _c,
    children: _ch,
    href: _h,
    type = "button",
    ...rest
  } = props;
  void [_v, _s, _w, _c, _ch, _h];
  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  );
}
