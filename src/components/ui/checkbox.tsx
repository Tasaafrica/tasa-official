import React from "react";

export const Checkbox: React.FC<{
  checked?: boolean;
  onCheckedChange?: (v: boolean) => void;
  className?: string;
}> = ({ checked, onCheckedChange, className }) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={(e) => onCheckedChange?.(e.target.checked)}
    className={["w-4 h-4", className].filter(Boolean).join(" ")}
  />
);
