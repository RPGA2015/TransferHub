"use client";

import { useState } from "react";

export default function LockTransferHubButton() {
  const [locking, setLocking] = useState(false);

  async function handleLock() {
    setLocking(true);

    try {
      await fetch("/api/access", {
        method: "DELETE",
      });

      window.location.href = "/access";
    } finally {
      setLocking(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLock}
      disabled={locking}
      className="rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {locking ? "Locking..." : "Lock TransferHub"}
    </button>
  );
}