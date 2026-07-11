import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { saveAs } from 'file-saver';

export default function Timesheet() {
  const [entries] = useState([
    { date: '2026-07-08', type: 'IN', time: '07:58', site: 'Main Site' },
    { date: '2026-07-08', type: 'OUT', time: '16:02', site: 'Main Site' },
    { date: '2026-07-09', type: 'IN', time: '08:01', site: 'Main Site' },
    { date: '2026-07-09', type: 'OUT', time: '16:05', site: 'Main Site' },
  ]);

  const exportCsv = () => {
    const header = ['Date', 'Type', 'Time', 'Site'];
    const rows = entries.map(e => [e.date, e.type, e.time, e.site]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'easyclock-timesheet.csv');
  };

  return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-emerald-700"><ArrowLeft className="w-4 h-4" /> Back</Link>
        <button onClick={exportCsv} className="flex items-center gap-2 text-sm px-4 py-2 rounded-2xl border hover:bg-zinc-50">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <h1 className="text-3xl font-semibold tracking-tight mb-6">Timesheet History</h1>

      <div className="bg-white border rounded-3xl overflow-hidden">
        {entries.map((e, i) => (
          <div key={i} className="flex justify-between px-6 py-4 border-b last:border-b-0 text-sm">
            <div>{e.date} <span className="text-zinc-400">•</span> {e.time}</div>
            <div className={`font-medium ${e.type === 'IN' ? 'text-emerald-600' : 'text-red-600'}`}>{e.type}</div>
            <div className="text-zinc-500">{e.site}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
