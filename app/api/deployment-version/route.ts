import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Small public deployment marker used by the GitHub IndexNow workflow.
 * Vercel exposes VERCEL_GIT_COMMIT_SHA at runtime for Git deployments.
 */
export function GET() {
  return NextResponse.json(
    {
      sha: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
      environment: process.env.VERCEL_ENV ?? null,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
