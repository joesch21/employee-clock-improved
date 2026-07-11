import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Swaps() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      <Link to="/" className="inline-flex items-center gap-1 text-sm mb-6 text-emerald-700"><ArrowLeft className="w-4 h-4" /> Back to Clock</Link>
      <h1 className="text-3xl font-semibold tracking-tight mb-2">Shift Swaps</h1>
      <p className="text-zinc-600 mb-8">Request a swap or respond to open requests from your team.</p>

      <div className="bg-white border border-dashed rounded-3xl p-10 text-center">
        <p className="text-zinc-500">No open swap requests right now.</p>
        <button className="mt-4 px-6 py-2.5 rounded-2xl bg-emerald-600 text-white text-sm font-medium">Request a Swap</button>
      </div>
    </div>
  );
}
