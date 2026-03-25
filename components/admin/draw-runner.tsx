"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DrawType } from '@/lib/types';

export default function DrawManager({ drawId, currentStatus }: { drawId: string, currentStatus: string }) {
    const router = useRouter();
    const [status, setStatus] = useState(currentStatus);
    const [loading, setLoading] = useState(false);
    const [drawType, setDrawType] = useState<DrawType>('random');

    const run = async (action: 'simulate' | 'publish') => {
        setLoading(true);
        const endpoint = action === 'simulate' ? '/api/draws/simulate' : '/api/draws/run';
        
        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                body: JSON.stringify({ drawId, drawType: action === 'simulate' ? drawType : undefined }),
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) {
                setStatus(action === 'simulate' ? 'simulated' : 'published');
                router.refresh();
            } else {
                const err = await res.json();
                alert(err.error || 'Operation failed');
            }
        } catch (e) {
            console.error(e);
            alert('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 border rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Draw Management</h3>
                <span className={`px-2 py-1 rounded text-sm ${
                    status === 'published' ? 'bg-green-100 text-green-800' :
                    status === 'simulated' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                }`}>
                    {status.toUpperCase()}
                </span>
            </div>
            
            <div className="flex gap-4 items-center mb-6">
                 <label>Method:</label>
                 <select 
                    value={drawType} 
                    onChange={(e) => setDrawType(e.target.value as DrawType)}
                    className="p-2 border rounded"
                    disabled={status !== 'pending' || loading}
                 >
                    <option value="random">Random Generator</option>
                    <option value="algorithmic">Weighted Algorithm</option>
                 </select>
            </div>

            <div className="flex gap-4">
                {(status === 'pending' || status === 'simulated') && (
                    <button 
                        onClick={() => run('simulate')} 
                        disabled={loading}
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Run Simulation'}
                    </button>
                )}
                
                {status === 'simulated' && (
                    <button 
                        onClick={() => {
                            if (confirm("Are you sure? This will finalize winners and payouts.")) {
                                run('publish');
                            }
                        }} 
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    >
                         {loading ? 'Processing...' : 'Publish Results'}
                    </button>
                )}
            </div>
        </div>
    );
}
