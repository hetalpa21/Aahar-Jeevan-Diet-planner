import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toTitleCase(str: string) {
  if (!str) return "";
  return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
}

export function getInitials(name: string) {
  if (!name) return "";
  return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
}

const AVATAR_THEMES = [
  { bg: "bg-orange-100", text: "text-orange-700", border: "border-l-orange-500" },
  { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-l-emerald-500" },
  { bg: "bg-blue-100", text: "text-blue-700", border: "border-l-blue-500" },
  { bg: "bg-purple-100", text: "text-purple-700", border: "border-l-purple-500" },
  { bg: "bg-rose-100", text: "text-rose-700", border: "border-l-rose-500" },
];

export function getThemeForName(name: string) {
  const hash = Array.from(name || "A").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_THEMES[hash % AVATAR_THEMES.length];
}
