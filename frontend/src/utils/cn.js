import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Helper function to merge Tailwind CSS class names
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
