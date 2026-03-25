"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Charity = {
  id: string;
  name: string;
};

export default function CharityWidget({ 
  currentPercentage, 
  currentCharityId, 
  charities 
}: { 
  currentPercentage: number;
  currentCharityId: string | null;
  charities: Charity[];
}) {
  const router = useRouter();
  const [percentage, setPercentage] = useState(currentPercentage || 10);
  const [charityId, setCharityId] = useState(currentCharityId || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          selected_charity_id: charityId || null, 
          charity_percentage: percentage 
        }),
      });

      if (res.ok) {
        setMessage("Saved successfully");
        router.refresh();
      } else {
        const errorText = await res.text();
        setMessage(errorText || "Failed to save");
      }
    } catch (e) {
      console.error(e);
      setMessage("An error occurred");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <section className="card p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-heading mb-4 text-[#00FF87]">Charity Impact</h2>
        
        <div className="space-y-4 text-zinc-300">
          <div>
            <label className="block text-sm mb-1 text-zinc-400">Selected Charity</label>
            <select 
              value={charityId} 
              onChange={(e) => setCharityId(e.target.value)}
              className="w-full"
            >
              <option value="">-- Choose a charity --</option>
              {charities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 text-zinc-400">
              Contribution: {percentage}%
            </label>
            <input 
              type="range" 
              min="10" 
              max="100" 
              step="5"
              value={percentage} 
              onChange={(e) => setPercentage(Number(e.target.value))}
              className="w-full accent-[#00FF87]"
              style={{ background: "transparent", border: "none", padding: 0 }}
            />
            <p className="text-xs text-zinc-500 mt-1">Minimum 10% of subscription goes to charity.</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="btn-accent px-6 py-2 text-sm"
        >
          {loading ? "Saving..." : "Save Preferences"}
        </button>
        {message && <span className="text-sm text-[#00FF87]">{message}</span>}
      </div>
    </section>
  );
}
