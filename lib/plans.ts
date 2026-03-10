import type { PlanTier, UserEntitlement } from "@/types/billing";

export const FREE_PLAN: UserEntitlement = {
  tier: "free",
  status: "active",

  maxFileSizeMb: 100,
  dailyConversionLimit: null,

  trimEnabled: false,

  audioBitrateControl: false,
  audioSampleRateControl: false,

  videoResolutionControl: false,
  videoQualityControl: false,
  videoCodecControl: false,

  batchEnabled: false,
  priorityQueue: false,
};

export const PRO_PLAN: UserEntitlement = {
  tier: "pro",
  status: "active",

  maxFileSizeMb: 1000,
  dailyConversionLimit: null,

  trimEnabled: true,

  audioBitrateControl: true,
  audioSampleRateControl: true,

  videoResolutionControl: true,
  videoQualityControl: true,
  videoCodecControl: true,

  batchEnabled: true,
  priorityQueue: true,
};

export function getPlanTemplate(tier: PlanTier): UserEntitlement {
  return tier === "pro" ? { ...PRO_PLAN } : { ...FREE_PLAN };
}