import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMinutes(minutes: number | null | undefined): string {
  if (!minutes) return "--";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
}

export function formatDifficulty(diff: string | null | undefined): string {
  switch (diff) {
    case "FACIL":
      return "Fácil";
    case "MEDIO":
      return "Médio";
    case "DIFICIL":
      return "Difícil";
    default:
      return "Fácil";
  }
}
