import React from "react";

export const Select: React.FC<
  React.SelectHTMLAttributes<HTMLSelectElement> & { className?: string }
> = ({ className, children, ...rest }) => (
  <select
    {...rest}
    className={["border rounded-md px-3 py-2 text-sm", className]
      .filter(Boolean)
      .join(" ")}
  >
    {children}
  </select>
);
