import React from "react";

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: string;
    className?: string;
  }
> = ({ children, className, variant, ...rest }) => {
  const base =
    "inline-flex items-center gap-2 px-3 py-2 rounded-md font-semibold";
  const variantClass =
    variant === "outline"
      ? "border bg-transparent"
      : variant === "ghost"
        ? "bg-transparent"
        : "bg-slate-900 text-white";
  return (
    <button
      {...rest}
      className={[base, variantClass, className].filter(Boolean).join(" ")}
    >
      {children}
    </button>
  );
};
