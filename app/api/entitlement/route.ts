import { NextResponse } from "next/server";
import { getViewerEntitlement } from "@/lib/entitlements";
import type { ViewerEntitlementResponse } from "@/types/billing";

export async function GET() {
  const entitlement = await getViewerEntitlement();

  const body: ViewerEntitlementResponse = {
    ok: true,
    entitlement,
  };

  return NextResponse.json(body);
}