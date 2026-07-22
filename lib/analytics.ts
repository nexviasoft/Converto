"use client";

type ClarityFn = (...args: unknown[]) => void;

type AnalyticsTags = Record<
  string,
  string | number | boolean | null | undefined
>;

function getClarity(): ClarityFn | null {
  if (typeof window === "undefined") return null;

  const clarity = (window as Window & { clarity?: ClarityFn }).clarity;
  return typeof clarity === "function" ? clarity : null;
}

/**
 * Sends a named event to Microsoft Clarity and attaches non-personal context
 * as session tags. Filenames and file contents must never be passed here.
 */
export function trackClarityEvent(
  eventName: string,
  tags: AnalyticsTags = {},
) {
  const clarity = getClarity();
  if (!clarity) return;

  for (const [key, value] of Object.entries(tags)) {
    if (value === null || value === undefined || value === "") continue;
    clarity("set", `converto_${key}`, String(value).slice(0, 255));
  }

  clarity("event", eventName);
}
