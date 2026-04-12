"use client";

import { initializePaddle } from "@paddle/paddle-js";

let paddleInstance: Awaited<ReturnType<typeof initializePaddle>> | null = null;

export async function getPaddle() {
  if (!paddleInstance) {
    paddleInstance = await initializePaddle({
      environment: "production",
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
    });
  }

  return paddleInstance;
}