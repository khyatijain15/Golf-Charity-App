"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function UploadProofForm({ winnerId, existingProof }: { winnerId: string; existingProof?: string }) {
  const router = useRouter();
  const [proofUrl, setProofUrl] = useState(existingProof || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofUrl) return;
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/winnings/proof", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ winnerId, proofUrl }),
      });

      if (res.ok) {
        setMessage("Proof submitted successfully!");
        router.refresh();
      } else {
        setMessage("Failed to submit proof");
      }
    } catch {
      setMessage("Error submitting proof");
    } finally {
      setLoading(false);
    }
  };

  if (existingProof) {
    return (
      <div className="mt-4 pt-4 border-t border-zinc-800">
        <p className="text-sm text-zinc-400">Proof submitted: <a href={existingProof} target="_blank" rel="noreferrer" className="text-[#00FF87] hover:underline">View Link</a></p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-zinc-800 flex gap-2">
      <input
        type="url"
        placeholder="Paste link to verification screenshot"
        value={proofUrl}
        onChange={(e) => setProofUrl(e.target.value)}
        required
        className="flex-1 bg-zinc-900 border-zinc-700 text-sm"
      />
      <button type="submit" disabled={loading} className="btn-accent px-4 py-2 text-sm whitespace-nowrap">
        {loading ? "..." : "Submit"}
      </button>
      {message && <p className="text-xs text-green-400 self-center">{message}</p>}
    </form>
  );
}
