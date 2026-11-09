import clsx from "clsx";
import type { ElementType, ReactNode } from "react";
import styles from "./Container.module.css";

interface ContainerProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

export function Container({ children, as: Tag = "div", className }: ContainerProps) {
  return <Tag className={clsx(styles.container, className)}>{children}</Tag>;
}
