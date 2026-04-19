import React from "react";

export const Card: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ children, className }) => (
  <div className={["rounded-lg bg-white", className].filter(Boolean).join(" ")}>
    {children}
  </div>
);

export const CardHeader: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ children, className }) => (
  <div className={["p-4 border-b", className].filter(Boolean).join(" ")}>
    {children}
  </div>
);

export const CardContent: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ children, className }) => (
  <div className={["p-4", className].filter(Boolean).join(" ")}>{children}</div>
);

export const CardTitle: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ children, className }) => (
  <h3
    className={["text-base font-semibold", className].filter(Boolean).join(" ")}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ children, className }) => (
  <p
    className={["text-sm text-slate-500", className].filter(Boolean).join(" ")}
  >
    {children}
  </p>
);
