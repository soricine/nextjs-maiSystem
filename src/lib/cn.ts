import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes, letting later classes win over earlier ones.
 *
 * Plain string concatenation keeps both conflicting classes and lets CSS
 * order decide the winner, which is why DESIGN.md requires this helper:
 *
 *   cn("p-2", "p-4")                     // -> "p-4"
 *   cn("text-sm", isLarge && "text-lg")  // -> "text-lg" when isLarge
 *
 * Use it in every component that accepts a `className` prop, so callers can
 * override the defaults:
 *
 *   <Button className={cn("w-full", className)} />
 */
export type ClassValue =
  string | number | null | undefined | false | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  return twMerge(flatten(inputs));
}

function flatten(inputs: ClassValue[]): string {
  const parts: string[] = [];

  for (const input of inputs) {
    if (!input && input !== 0) continue;
    parts.push(Array.isArray(input) ? flatten(input) : String(input));
  }

  return parts.join(" ");
}
