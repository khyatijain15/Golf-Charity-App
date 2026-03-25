"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ScoreEntryForm() {
    const router = useRouter();
    const [score, setScore] = useState<number | ''>('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch('/api/scores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ score: Number(score), played_date: date })
            });
            
            if (res.ok) {
                setScore('');
                router.refresh();
            } else {
                const data = await res.json();
                setError(typeof data.error === 'object' ? JSON.stringify(data.error) : data.error || 'Failed to add score');
            }
        } catch (err) {
            console.error(err);
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full justify-between">
            <div>
            {error && (
                <div className="bg-red-500/10 text-red-500 p-3 rounded mb-4 text-sm border border-red-500/20">
                    {error}
                </div>
            )}
            
            <div className="flex gap-4 mb-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-1 text-zinc-300">Score (1-45)</label>
                    <input 
                        type="number" 
                        min="1" 
                        max="45" 
                        value={score} 
                        onChange={e => setScore(Number(e.target.value))}
                        className="w-full"
                        required 
                    />
                </div>
                <div className="flex-1">
                     <label className="block text-sm font-medium mb-1 text-zinc-300">Date Played</label>
                     <input 
                        type="date" 
                        value={date} 
                        onChange={e => setDate(e.target.value)}
                        className="w-full"
                        required 
                    />
                </div>
            </div>
            </div>
            
            <button 
                type="submit" 
                disabled={loading}
                className="btn-accent w-full flex justify-center mt-2 disabled:opacity-50"
            >
                {loading ? 'Adding Score...' : 'Submit Score'}
            </button>
        </form>
    );
}
