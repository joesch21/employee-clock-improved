import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Clock, Copy, QrCode, RefreshCw, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { makeLocalAccount } from '../web3/write';
import {
  clockInOut,
  getIsClockedIn,
  getClockRecords,
  getNativeBalance,
  getSiteConfig
} from '../web3/write';
import { useToast } from '../lib/toast';
import { format } from 'date-fns';

const SCALE = 1_000_000;

export default function CheckInCard() {
  const [account, setAccount] = useState(null);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('0.0000');
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [msg, setMsg] = useState('');
  const [siteConfig, setSiteConfig] = useState(null);
  const toast = useToast();

  // Load wallet + site config on mount
  useEffect(() => {
    const savedPk = localStorage.getItem('ec_pk');
    if (savedPk) {
      try {
        const acc = makeLocalAccount(savedPk);
        setAccount(acc);
        setAddress(acc.address);
        refreshAll(acc.address);
        loadSiteConfig();
      } catch (e) {
        console.error('Invalid saved wallet', e);
        localStorage.removeItem('ec_pk');
      }
    }
  }, []);

  const refreshAll = async (addr) => {
    if (!addr) return;
    try {
      const [clocked, bal, recs] = await Promise.all([
        getIsClockedIn(addr),
        getNativeBalance(addr),
        getClockRecords(addr)
      ]);
      setIsClockedIn(clocked);
      setBalance((Number(bal) / 1e18).toFixed(4));
      setRecords([...recs].reverse().slice(0, 6));
    } catch (e) {
      console.error(e);
    }
  };

  const loadSiteConfig = async () => {
    try {
      const config = await getSiteConfig();
      setSiteConfig(config);
    } catch (e) {
      console.error('Failed to load site config', e);
    }
  };

  const createWallet = () => {
    const entropy = crypto.getRandomValues(new Uint8Array(32));
    const pk = '0x' + Array.from(entropy).map(b => b.toString(16).padStart(2, '0')).join('');
    localStorage.setItem('ec_pk', pk);
    const acc = makeLocalAccount(pk);
    setAccount(acc);
    setAddress(acc.address);
    setMsg('Wallet created securely on this device.');
    toast.show('Work wallet ready! Share your address with your manager.', 'success');
    refreshAll(acc.address);
  };

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address);
    toast.show('Address copied — send to your manager for funding', 'success');
  };

  const getLocation = () => new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation is not supported on this device'));
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocLoading(false);
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      (err) => {
        setLocLoading(false);
        let message = 'Could not get location. ';
        if (err.code === 1) message += 'Please allow location permission.';
        else if (err.code === 2) message += 'Location unavailable.';
        else message += 'Request timed out.';
        reject(new Error(message));
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 5000 }
    );
  });

  const handleClock = async (isIn) => {
    if (!account) {
      toast.show('Create your work wallet first', 'error');
      return;
    }
    if (parseFloat(balance) < 0.0008) {
      toast.show('Low balance — ask your manager to send tBNB for gas fees', 'error');
      return;
    }
    if (!isIn && !window.confirm('Are you sure you want to clock OUT now?')) {
      return;
    }

    setLoading(true);
    setMsg('');

    try {
      const loc = await getLocation();

      const txHash = await clockInOut({
        account,
        isIn,
        lat: loc.lat,
        lng: loc.lng
      });

      const explorerUrl = `https://testnet.opbnbscan.com/tx/${txHash}`;
      toast.show(`${isIn ? 'Clocked IN' : 'Clocked OUT'} successfully!`, 'success');
      setMsg(`Success! View on explorer: ${explorerUrl}`);

      setTimeout(() => {
        refreshAll(account.address);
        setMsg('');
      }, 4500);

    } catch (err) {
      console.error(err);
      let friendly = err.message || 'Transaction failed';

      if (friendly.includes('User denied') || friendly.includes('rejected')) {
        friendly = 'Transaction was rejected in wallet.';
      } 
      else if (friendly.toLowerCase().includes('geofence') || friendly.includes('revert')) {
        if (siteConfig) {
          friendly = `You are outside the allowed area.\nYou must be within ${siteConfig.radiusMeters} meters of the site.`;
        } else {
          friendly = 'You are outside the allowed geofence area.';
        }
      } 
      else if (friendly.includes('insufficient')) {
        friendly = 'Not enough tBNB for gas. Ask your manager to fund this wallet.';
      }

      toast.show(friendly, 'error');
      setMsg(friendly);
    } finally {
      setLoading(false);
    }
  };

  // ==================== RENDER ====================

  if (!address) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-zinc-100 p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
            <Clock className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-semibold tracking-tight">Welcome to EasyClock</h2>
          <p className="mt-3 text-zinc-600">Your shifts. Secured on-chain.<br />Private key stays on your phone.</p>

          <button
            onClick={createWallet}
            className="mt-8 w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-lg font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.985]"
          >
            Create My Work Wallet
          </button>
          <p className="mt-6 text-xs text-zinc-500">One tap. No seed phrase shown. Manager will fund gas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[520px] mx-auto">
      {/* Wallet Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <div className="text-xs uppercase tracking-[1px] text-zinc-500 font-medium">Your Secure Work Wallet</div>
          <button onClick={copyAddress} className="font-mono text-lg text-emerald-700 flex items-center gap-1.5 mt-0.5">
            {address.slice(0, 8)}…{address.slice(-6)} <Copy className="w-4 h-4" />
          </button>
        </div>
        <div className="text-right">
          <div className="text-xs text-zinc-500">Balance</div>
          <div className={`font-semibold tabular-nums ${parseFloat(balance) > 0.001 ? 'text-emerald-600' : 'text-amber-600'}`}>
            {balance} tBNB
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`rounded-3xl px-5 py-4 mb-6 flex items-center gap-4 border ${isClockedIn ? 'bg-emerald-50 border-emerald-200' : 'bg-zinc-50 border-zinc-200'}`}>
        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${isClockedIn ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`} />
        <div className="flex-1">
          <div className="font-semibold text-lg tracking-tight">
            {isClockedIn ? 'You are CLOCKED IN' : 'You are CLOCKED OUT'}
          </div>
          <div className="text-sm text-zinc-600">GPS + on-chain proof</div>
        </div>
        <button onClick={() => refreshAll(address)} className="p-2 text-zinc-500 hover:text-zinc-700 rounded-xl">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Main Clock Button */}
      <div className="mb-6">
        {!isClockedIn ? (
          <button
            onClick={() => handleClock(true)}
            disabled={loading || locLoading}
            className="w-full py-8 rounded-3xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-70 text-white flex flex-col items-center justify-center gap-1 shadow-lg active:scale-[0.985] transition-all"
          >
            {loading || locLoading ? <Loader2 className="w-9 h-9 animate-spin mb-1" /> : <CheckCircle className="w-9 h-9 mb-1" />}
            <span className="text-3xl font-semibold tracking-tighter">CLOCK IN</span>
            <span className="text-emerald-100 text-sm">Tap to record arrival</span>
          </button>
        ) : (
          <button
            onClick={() => handleClock(false)}
            disabled={loading || locLoading}
            className="w-full py-8 rounded-3xl bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-70 text-white flex flex-col items-center justify-center gap-1 shadow-lg active:scale-[0.985] transition-all"
          >
            {loading || locLoading ? <Loader2 className="w-9 h-9 animate-spin mb-1" /> : <Clock className="w-9 h-9 mb-1" />}
            <span className="text-3xl font-semibold tracking-tighter">CLOCK OUT</span>
            <span className="text-red-100 text-sm">Tap to record departure</span>
          </button>
        )}
      </div>

      {msg && (
        <div className="mb-6 px-4 py-3 bg-zinc-900 text-white text-sm rounded-2xl flex gap-2 items-start">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="break-all whitespace-pre-line">{msg}</span>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <button onClick={copyAddress} className="flex flex-col items-center justify-center gap-1.5 py-3.5 rounded-2xl border border-zinc-200 hover:bg-zinc-50 text-sm font-medium">
          <Copy className="w-5 h-5" /> Copy Address
        </button>
        <button onClick={() => setShowQR(true)} className="flex flex-col items-center justify-center gap-1.5 py-3.5 rounded-2xl border border-zinc-200 hover:bg-zinc-50 text-sm font-medium">
          <QrCode className="w-5 h-5" /> QR for Manager
        </button>
        <button onClick={() => refreshAll(address)} className="flex flex-col items-center justify-center gap-1.5 py-3.5 rounded-2xl border border-zinc-200 hover:bg-zinc-50 text-sm font-medium">
          <RefreshCw className="w-5 h-5" /> Refresh
        </button>
      </div>

      {/* Recent Activity */}
      {records.length > 0 && (
        <div>
          <div className="flex items-center justify-between px-1 mb-3">
            <div className="font-semibold text-sm tracking-tight">Recent On-Chain Activity</div>
          </div>
          <div className="space-y-2">
            {records.map((rec, idx) => {
              const ts = Number(rec.timestamp) * 1000;
              return (
                <div key={idx} className="flex justify-between items-center bg-white border border-zinc-100 rounded-2xl px-4 py-3 text-sm">
                  <div>
                    <div className="font-medium">{format(ts, 'MMM dd, HH:mm')}</div>
                    <div className="text-xs text-zinc-500 tabular-nums">
                      {rec.latitude / 1e6}°, {rec.longitude / 1e6}°
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${idx % 2 === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {idx % 2 === 0 ? 'IN' : 'OUT'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-8 text-center text-[10px] text-zinc-400">
        Contract: 0x4654...945e • opBNB Testnet • Location secured on-chain
      </div>

      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6" onClick={() => setShowQR(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-xs w-full text-center" onClick={e => e.stopPropagation()}>
            <div className="font-semibold mb-1 text-xl">Share with Manager</div>
            <p className="text-sm text-zinc-600 mb-6">Scan this QR or copy the address so they can send you tBNB for gas.</p>
            <div className="inline-block p-4 bg-white border rounded-2xl mb-4">
              <QRCodeSVG value={address} size={220} />
            </div>
            <div className="font-mono text-xs break-all bg-zinc-100 p-3 rounded-xl mb-6 select-all">{address}</div>
            <button onClick={() => setShowQR(false)} className="w-full py-3 rounded-2xl border font-medium">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}