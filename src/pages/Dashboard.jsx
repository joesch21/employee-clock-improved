import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Calendar, ArrowRight } from 'lucide-react';
import CheckInCard from '../components/CheckInCard';
import { useAuth } from '../lib/auth';

export default function Dashboard() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-50 pb-12">
      {/* Top nav */}
      <div className="border-b bg-white sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-600 rounded-2xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold tracking-tighter text-2xl">EasyClock</div>
              <div className="text-[10px] text-emerald-600 -mt-1">ON-CHAIN • PRIVATE</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            {user && <span className="text-zinc-600 hidden sm:block">Hello, {user.email?.split('@')[0]}</span>}
            <button 
              onClick={signOut}
              className="text-sm px-4 py-1.5 rounded-xl border hover:bg-zinc-100 active:bg-zinc-200"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 pt-8">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold tracking-tighter">Good morning.</h1>
          <p className="text-xl text-zinc-600 mt-1">Ready to start your shift?</p>
        </div>

        <CheckInCard />

        {/* Quick nav to other sections */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/roster" className="group flex items-center justify-between bg-white border hover:border-emerald-200 rounded-3xl p-5 transition-all active:scale-[0.985]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-2xl"><Calendar className="w-6 h-6 text-emerald-600" /></div>
              <div>
                <div className="font-semibold">My Roster</div>
                <div className="text-xs text-zinc-500">Upcoming shifts</div>
              </div>
            </div>
            <ArrowRight className="text-emerald-600 group-hover:translate-x-0.5 transition" />
          </Link>

          <Link to="/timesheet" className="group flex items-center justify-between bg-white border hover:border-emerald-200 rounded-3xl p-5 transition-all active:scale-[0.985]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-2xl"><Clock className="w-6 h-6 text-emerald-600" /></div>
              <div>
                <div className="font-semibold">Timesheet</div>
                <div className="text-xs text-zinc-500">Full history + export</div>
              </div>
            </div>
            <ArrowRight className="text-emerald-600 group-hover:translate-x-0.5 transition" />
          </Link>

          <Link to="/swaps" className="group flex items-center justify-between bg-white border hover:border-emerald-200 rounded-3xl p-5 transition-all active:scale-[0.985]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-2xl"><Users className="w-6 h-6 text-emerald-600" /></div>
              <div>
                <div className="font-semibold">Shift Swaps</div>
                <div className="text-xs text-zinc-500">Request or respond</div>
              </div>
            </div>
            <ArrowRight className="text-emerald-600 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

        <div className="text-center mt-10 text-xs text-zinc-400">
          Tip: Add EasyClock to your home screen for one-tap access. Scan any worksite QR to open here instantly.
        </div>
      </div>
    </div>
  );
}
