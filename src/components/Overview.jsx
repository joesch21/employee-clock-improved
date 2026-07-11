import React from 'react';
import { useAppContext } from '../App';
import { 
  Users, Clock, TrendingUp, Calendar, ArrowRight, 
  LogIn, LogOut, AlertTriangle, RefreshCw 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

function Overview() {
  const { mappings, logs, isLoadingLogs, fetchLogs, getDisplayName } = useAppContext();

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  // ==================== COMPUTED STATS ====================
  const totalEmployees = mappings.length;

  const todayLogs = logs.filter(log => 
    log.rawTimestamp && format(new Date(log.rawTimestamp), 'yyyy-MM-dd') === todayStr
  );

  const uniqueToday = new Set(todayLogs.map(l => l.employee)).size;

  const totalOvertimeToday = todayLogs
    .filter(l => l.eventName === 'ClockOut')
    .reduce((sum, l) => sum + (l.overtimeMinutes || 0), 0);

  const recentLogs = [...logs]
    .sort((a, b) => (b.rawTimestamp || 0) - (a.rawTimestamp || 0))
    .slice(0, 5);

  const totalOvertimeAll = logs
    .filter(l => l.eventName === 'ClockOut')
    .reduce((sum, l) => sum + (l.overtimeMinutes || 0), 0);

  // ==================== RENDER ====================
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="px-4 py-1.5 bg-primary-100 text-primary-700 rounded-2xl text-sm font-medium inline-flex items-center gap-2">
              <Clock className="w-4 h-4" /> LIVE FROM BLOCKCHAIN
            </div>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900">Good afternoon, Manager</h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your team today.</p>
        </div>

        <Link to="/logs" className="btn btn-primary text-sm self-start lg:self-auto">
          View Full Attendance Logs <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Registered Employees */}
        <div className="card p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-gray-500">Registered Employees</div>
              <div className="text-4xl font-semibold mt-2 text-gray-900">{totalEmployees}</div>
            </div>
            <div className="p-3 bg-primary-100 rounded-2xl">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
          </div>
          <div className="mt-4 text-xs text-emerald-600 font-medium">+2 this month</div>
        </div>

        {/* Clocked In Today */}
        <div className="card p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-gray-500">Clocked In Today</div>
              <div className="text-4xl font-semibold mt-2 text-gray-900">{uniqueToday}</div>
            </div>
            <div className="p-3 bg-emerald-100 rounded-2xl">
              <LogIn className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">out of {totalEmployees} mapped</div>
        </div>

        {/* Overtime Today */}
        <div className="card p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-gray-500">Overtime Today</div>
              <div className="text-4xl font-semibold mt-2 text-amber-600">
                {totalOvertimeToday} <span className="text-2xl font-normal">min</span>
              </div>
            </div>
            <div className="p-3 bg-amber-100 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div className="mt-4 text-xs text-amber-600 font-medium">Across {todayLogs.length} events</div>
        </div>

        {/* Total Overtime All Time */}
        <div className="card p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-gray-500">Total Overtime (All Time)</div>
              <div className="text-4xl font-semibold mt-2 text-gray-900">
                {Math.round(totalOvertimeAll / 60)} <span className="text-2xl font-normal">hrs</span>
              </div>
            </div>
            <div className="p-3 bg-rose-100 rounded-2xl">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">From {logs.length} total records</div>
        </div>
      </div>

      {/* Quick Actions + Recent Activity */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 card p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-600" /> Quick Actions
          </h3>

          <div className="space-y-3">
            <Link to="/logs" className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition group">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-white rounded-xl shadow-sm">
                  <Clock className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <div className="font-medium">View Today's Logs</div>
                  <div className="text-xs text-gray-500">Filter by date &amp; employee</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-0.5 transition" />
            </Link>

            <Link to="/mappings" className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition group">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-white rounded-xl shadow-sm">
                  <Users className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <div className="font-medium">Manage Employee Mappings</div>
                  <div className="text-xs text-gray-500">Add wallets • Import CSV</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-0.5 transition" />
            </Link>

            <button
              onClick={() => fetchLogs(true)}
              disabled={isLoadingLogs}
              className="w-full flex items-center justify-center gap-3 p-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-2xl font-medium transition"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingLogs ? 'animate-spin' : ''}`} />
              {isLoadingLogs ? "Syncing blockchain..." : "Refresh Logs from Blockchain"}
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-3 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Recent Activity</h3>
            <Link to="/logs" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
              See all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentLogs.length > 0 ? (
            <div className="space-y-3">
              {recentLogs.map((log, idx) => {
                const isIn = log.eventName === 'ClockIn';
                const displayName = getDisplayName(log.employee);

                return (
                  <div key={idx} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-xl ${isIn ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                        {isIn ? (
                          <LogIn className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <LogOut className="w-4 h-4 text-rose-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{displayName}</div>
                        <div className="text-xs text-gray-500">{log.timestamp}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={isIn ? 'clockin-badge' : 'clockout-badge'}>
                        {log.eventName}
                      </div>
                      {log.overtimeMinutes > 0 && (
                        <div className="overtime-badge mt-1 inline-block">+{log.overtimeMinutes} min OT</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">
              No recent activity yet. Try refreshing logs.
            </div>
          )}
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 pt-4">
        Data is read-only from the smart contract. Mappings are stored locally in your browser.
      </div>
    </div>
  );
}

export default Overview;