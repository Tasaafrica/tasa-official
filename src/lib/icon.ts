// lib/icons.ts (Server-side)
import * as Icons from "lucide-react";

export function getIcon(name: string) {
  // Convert kebab-case to PascalCase for Lucide exports
  // e.g., "graduation-cap" -> "GraduationCap"
  const key = name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  return (Icons as any)[key] || Icons.HelpCircle; // fallback
}
