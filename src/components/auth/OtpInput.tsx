"use client";

import React, { useEffect, useMemo, useRef } from "react";

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  name?: string;
};

function clampDigits(value: string, length: number) {
  return value.replace(/\D/g, "").slice(0, length);
}

export default function OtpInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  autoFocus = false,
  name = "otp",
}: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = useMemo(() => {
    const normalized = clampDigits(value ?? "", length).padEnd(length, " ");
    return normalized.split("");
  }, [length, value]);

  const inputKeys = useMemo(
    () => Array.from({ length }, (_, index) => `${name}-${index}`),
    [length, name],
  );

  useEffect(() => {
    if (!autoFocus) return;
    const firstEmpty = digits.indexOf(" ");
    const index = firstEmpty === -1 ? length - 1 : firstEmpty;
    refs.current[index]?.focus();
  }, [autoFocus, digits, length]);

  const setAt = (index: number, nextChar: string) => {
    const next = digits
      .map((d, i) => (i === index ? nextChar : d))
      .join("")
      .replace(/\s/g, "");
    onChange(clampDigits(next, length));
  };

  return (
    <div className="flex items-center justify-between gap-2">
      {Array.from({ length }).map((_, index) => {
        const char = digits[index] === " " ? "" : digits[index];
        return (
          <input
            key={inputKeys[index]}
            ref={(el) => {
              refs.current[index] = el;
            }}
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            aria-label={`OTP digit ${index + 1}`}
            className="h-12 w-12 rounded-lg border border-gray-300 bg-white text-center text-lg font-medium text-black shadow-sm outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
            type="text"
            name={`${name}-${index}`}
            value={char}
            disabled={disabled}
            maxLength={1}
            onChange={(e) => {
              const nextChar = e.target.value.slice(-1).replace(/\D/g, "");
              if (!nextChar) {
                setAt(index, " ");
                return;
              }
              setAt(index, nextChar);
              refs.current[Math.min(index + 1, length - 1)]?.focus();
            }}
            onKeyDown={(e) => {
              if (e.key !== "Backspace") return;
              if (char) {
                setAt(index, " ");
                return;
              }
              const prev = Math.max(index - 1, 0);
              refs.current[prev]?.focus();
              setAt(prev, " ");
            }}
            onPaste={(e) => {
              e.preventDefault();
              const pasted = clampDigits(
                e.clipboardData.getData("text"),
                length,
              );
              if (!pasted) return;
              const current = clampDigits(value ?? "", length);
              const merged =
                current.slice(0, index) + pasted + current.slice(index);
              const next = clampDigits(merged, length);
              onChange(next);
              const nextIndex = Math.min(index + pasted.length, length - 1);
              refs.current[nextIndex]?.focus();
            }}
          />
        );
      })}
    </div>
  );
}
