"use client";

import { useState } from "react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const join = async () => {
    if (!email) return;

    const res = await fetch("/api/waitlist", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setStatus("✅ You're on the list");
      setEmail("");
    } else {
      setStatus("Something went wrong");
    }
  };

  return (
    <div className="flex gap-3">
      <input
        type="email"
        placeholder="Enter email for early access"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-4 py-2 rounded-xl bg-white/10 text-white"
      />

      <button
        onClick={join}
        className="px-4 py-2 rounded-xl bg-white text-black font-semibold"
      >
        Join
      </button>

      {status && <p className="text-sm text-white/70">{status}</p>}
    </div>
  );
}