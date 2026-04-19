import React from "react";

export const Input: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & { className?: string }
> = ({ className, ...rest }) => (
  <input
    {...rest}
    className={["border rounded-md px-3 py-2 text-sm", className]
      .filter(Boolean)
      .join(" ")}
  />
);
