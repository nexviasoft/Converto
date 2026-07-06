export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-4933934041035226";

export const AD_SLOTS = {
  LEFT_RAIL: process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEFT_RAIL || "",
  RIGHT_RAIL: process.env.NEXT_PUBLIC_ADSENSE_SLOT_RIGHT_RAIL || "",
  IN_CONTENT: process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT || "",
} as const;

export const ADSENSE_ENABLED = ADSENSE_CLIENT.startsWith("ca-pub-");

export function isAdSlotReady(slot?: string) {
  return ADSENSE_ENABLED && /^\d{6,}$/.test(slot || "");
}

export function hasRailAdSlots() {
  return isAdSlotReady(AD_SLOTS.LEFT_RAIL) && isAdSlotReady(AD_SLOTS.RIGHT_RAIL);
}
