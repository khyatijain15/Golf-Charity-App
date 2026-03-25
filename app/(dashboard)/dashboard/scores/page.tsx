"use client";

import { FormEvent, useState } from "react";
import { addScore } from "@/lib/scores";

export default function ScoresPage() {
  const [userId, setUserId] = useState("");
  const [score, setScore] = useState(30);
  const [date, setDate] = useState("");
  const [state, setState] = useState("Idle");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setState("Saving...");
    const { error } = await addScore(userId, score, date);
    setState(error ? `Error: ${error.message}` : "Saved score.");
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">Your Scores</h1>
      <form onSubmit={onSubmit} className="card mt-6 p-6 space-y-4">
        <input className="w-full rounded-lg bg-zinc-900 p-3" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
        <input className="w-full rounded-lg bg-zinc-900 p-3" type="number" min={1} max={45} value={score} onChange={(e) => setScore(Number(e.target.value))} />
        <input className="w-full rounded-lg bg-zinc-900 p-3" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button className="cta px-5 py-3 rounded-lg">Add score</button>
        <p className="text-zinc-300">{state}</p>
      </form>
    </main>
  );
}
