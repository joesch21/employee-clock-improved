import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Roster() {
  const shifts = [
    { date: '2026-07-13', day: 'Mon', start: '08:00', end: '16:00', site: 'Main Site' },
    { date: '2026-07-14', day: 'Tue', start: '08:00', end: '16:00', site: 'Main Site' },
    { date: '2026-07-15', day: 'Wed', start: '09:00', end: '17:00', site: 'Warehouse' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      <Link to="/" className="inline-flex items-center gap-1 text-sm mb-6 text-emerald-700"><ArrowLeft className="w-4 h-4" /> Back to Clock</Link>
      <h1 className="text-3xl font-semibold tracking-tight mb-6">My Roster</h1>

      <div className="space-y-3">
        {shifts.map((s, i) => (
          <div key={i} className="bg-white border rounded-3xl p-5 flex justify-between items-center">
            <div>
              <div className="font-semibold">{s.date} <span className="font-normal text-zinc-500">({s.day})</span></div>
              <div className="text-sm text-zinc-600">{s.start} – {s.end} • {s.site}</div>
            </div>
            <div className="text-emerald-600 text-xs font-medium px-3 py-1 bg-emerald-50 rounded-full">Confirmed</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-center text-zinc-500 mt-8">Roster data synced from manager system. Contact your supervisor for changes.</p>
    </div>
  );
}
