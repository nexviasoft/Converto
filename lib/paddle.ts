"use client";

import { initializePaddle } from "@paddle/paddle-js";

let paddleInstance: Awaited<ReturnType<typeof initializePaddle>> | null = null;

export async function getPaddle() {
  if (!paddleInstance) {
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

    console.log("PADDLE TOKEN EXISTS:", !!token);
    console.log("PADDLE TOKEN PREFIX:", token?.slice(0, 12));

    paddleInstance = await initializePaddle({
      environment: "production",
      token: token!,
    });

    console.log("PADDLE INIT RESULT:", paddleInstance);
  }

  return paddleInstance;
}