export type PlanTier = "free" | "pro";

export type SubscriptionStatus =
  | "inactive"
  | "active"
  | "trial"
  | "canceled"
  | "past_due";

export type UserEntitlement = {
  tier: PlanTier;
  status: SubscriptionStatus;

  maxFileSizeMb: number;
  dailyConversionLimit: number | null;

  trimEnabled: boolean;

  audioBitrateControl: boolean;
  audioSampleRateControl: boolean;

  videoResolutionControl: boolean;
  videoQualityControl: boolean;
  videoCodecControl: boolean;

  batchEnabled: boolean;
  priorityQueue: boolean;
};

export type ViewerEntitlementResponse = {
  ok: true;
  entitlement: UserEntitlement;
};