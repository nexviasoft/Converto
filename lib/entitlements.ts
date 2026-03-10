import { getPlanTemplate } from "@/lib/plans";
import type { PlanTier, SubscriptionStatus, UserEntitlement } from "@/types/billing";

type ResolveEntitlementArgs = {
  tier?: PlanTier | null;
  status?: SubscriptionStatus | null;
};

export function resolveUserEntitlement(
  args?: ResolveEntitlementArgs
): UserEntitlement {
  const tier = args?.tier ?? "free";
  const status = args?.status ?? "active";

  const base = getPlanTemplate(tier);

  if (tier === "pro" && status === "active") {
    return {
      ...base,
      tier: "pro",
      status: "active",
    };
  }

  if (tier === "pro" && status === "trial") {
    return {
      ...base,
      tier: "pro",
      status: "trial",
    };
  }

  return {
    ...getPlanTemplate("free"),
    status: status === "inactive" ? "inactive" : "active",
  };
}

/**
 * Şimdilik demo/mock.
 * Sonra burada:
 * - session oku
 * - user bul
 * - subscription bul
 * - usage/limits kontrol et
 */
export async function getViewerEntitlement(): Promise<UserEntitlement> {
  return resolveUserEntitlement({
    tier: "free",
    status: "active",
  });
}