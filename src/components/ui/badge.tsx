import React from "react";

export const Badge: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ children, className }) => (
  <span
    className={[
      "inline-flex items-center px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-800",
      className,
    ]
      .filter(Boolean)
      .join(" ")}
  >
    {children}
  </span>
);
