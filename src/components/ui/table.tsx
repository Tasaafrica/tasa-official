import React from "react";

export const Table: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ children, className }) => (
  <table
    className={["min-w-full text-sm", className].filter(Boolean).join(" ")}
  >
    {children}
  </table>
);

export const TableHeader: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ children, className }) => (
  <thead className={className}>{children}</thead>
);

export const TableBody: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ children, className }) => (
  <tbody className={className}>{children}</tbody>
);
