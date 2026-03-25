"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminWinnerControls({ winnerId, status, paymentStatus }: { winnerId: string, status: string, paymentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const update = async (field: 'verification_status' | 'payment_status', value: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/winners", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ winnerId, [field]: value }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Update failed");
      }
    } catch {
      alert("Error updating");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-4 items-center">
      {status === 'pending' && (
        <>
          <button disabled={loading} onClick={() => update('verification_status', 'approved')} className="text-sm bg-green-500/20 text-[#00FF87] px-3 py-1 rounded border border-green-500/30 hover:bg-green-500/30">Approve</button>
          <button disabled={loading} onClick={() => update('verification_status', 'rejected')} className="text-sm bg-red-500/20 text-red-500 px-3 py-1 rounded border border-red-500/30 hover:bg-red-500/30">Reject</button>
        </>
      )}
      {status === 'approved' && paymentStatus === 'pending' && (
        <button disabled={loading} onClick={() => update('payment_status', 'paid')} className="text-sm bg-blue-500/20 text-blue-400 px-3 py-1 rounded border border-blue-500/30 hover:bg-blue-500/30">Mark as Paid</button>
      )}
      {paymentStatus === 'paid' && (
        <span className="text-xs text-zinc-500 uppercase">Fully Processed</span>
      )}
    </div>
  );
}
