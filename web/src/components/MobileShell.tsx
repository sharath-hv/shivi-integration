import type { ReactNode } from "react";
import "./mobile-shell.css";

type MobileShellProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
};

export function MobileShell({ children, className = "", innerClassName = "" }: MobileShellProps) {
  return (
    <div className={`mobile-shell ${className}`.trim()}>
      <div className={`mobile-shell__inner ${innerClassName}`.trim()}>{children}</div>
    </div>
  );
}
