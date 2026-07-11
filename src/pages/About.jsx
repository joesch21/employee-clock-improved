import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Clock, Shield, MapPin, Users, HelpCircle, 
  ExternalLink, Copy, AlertTriangle 
} from 'lucide-react';

export default function About() {
  const contractAddress = '0x4654675c8C068aC49047e9E607C34BE2492c945e';
  const explorerUrl = `https://testnet.opbnbscan.com/address/${contractAddress}`;

  const copyContract = async () => {
    await navigator.clipboard.writeText(contractAddress);
    const btns = document.querySelectorAll('.copy-btn');
    btns.forEach(b => {
      const orig = b.innerHTML;
      b.innerHTML = 'Copied!';
      setTimeout(() => { b.innerHTML = orig; }, 1500);
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-12">
      {/* Top nav - consistent with Dashboard */}
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
          <Link 
            to="/" 
            className="text-sm px-4 py-1.5 rounded-xl border hover:bg-zinc-100 active:bg-zinc-200 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Clock
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 pt-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium mb-3">
            EMPLOYEE GUIDE
          </div>
          <h1 className="text-4xl font-semibold tracking-tighter">About EasyClock</h1>
          <p className="text-xl text-zinc-600 mt-2">Your shifts. Secured on-chain. Private key stays on your device.</p>
        </div>

        {/* Quick Essentials */}
        <div className="bg-white border border-zinc-100 rounded-3xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 rounded-xl"><Shield className="w-5 h-5 text-emerald-600" /></div>
            <div className="font-semibold text-lg tracking-tight">Read Me Essentials</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <div className="flex gap-3">
              <div className="font-mono text-emerald-600 mt-0.5">01</div>
              <div><span className="font-medium">Create once</span> — Your work wallet is generated locally and saved in your browser. No seed phrase, no MetaMask.</div>
            </div>
            <div className="flex gap-3">
              <div className="font-mono text-emerald-600 mt-0.5">02</div>
              <div><span className="font-medium">Stay funded</span> — Ask your manager to send a small amount of tBNB (testnet BNB) for gas fees using the QR code.</div>
            </div>
            <div className="flex gap-3">
              <div className="font-mono text-emerald-600 mt-0.5">03</div>
              <div><span className="font-medium">Clock with GPS</span> — Must be within the 500m geofence of the site. High-accuracy location is recorded on-chain.</div>
            </div>
            <div className="flex gap-3">
              <div className="font-mono text-emerald-600 mt-0.5">04</div>
              <div><span className="font-medium">One tap in/out</span> — Tap the big button. Transaction is signed locally and submitted. View proof on explorer.</div>
            </div>
          </div>
        </div>

        {/* How Clocking Works */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4 px-1">
            <Clock className="w-5 h-5 text-emerald-600" />
            <div className="font-semibold text-lg tracking-tight">How Clock In / Out Works</div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white border rounded-3xl p-5">
              <div className="font-medium mb-2 flex items-center gap-2">1. Wallet Ready</div>
              <p className="text-sm text-zinc-600">If you don't have a wallet yet, tap "Create My Work Wallet". Your private key is generated with browser crypto and stored only under <span className="font-mono text-xs bg-zinc-100 px-1.5 py-0.5 rounded">ec_pk</span> in localStorage. It never leaves your device.</p>
            </div>
            
            <div className="bg-white border rounded-3xl p-5">
              <div className="font-medium mb-2 flex items-center gap-2">2. Check Your Balance</div>
              <p className="text-sm text-zinc-600">You need a tiny amount of tBNB (~0.001+) for gas. If balance is low, use the QR button to share your address with your manager for funding.</p>
            </div>
            
            <div className="bg-white border rounded-3xl p-5">
              <div className="font-medium mb-2 flex items-center gap-2">3. Be At The Site</div>
              <p className="text-sm text-zinc-600">The smart contract enforces a strict 500m geofence. Stand near the worksite (outdoors or by a window for best GPS signal). The app will show clear error messages if you're too far.</p>
            </div>
            
            <div className="bg-white border rounded-3xl p-5">
              <div className="font-medium mb-2 flex items-center gap-2">4. Tap &amp; Confirm</div>
              <p className="text-sm text-zinc-600">Press the big CLOCK IN or CLOCK OUT button. Approve the transaction in your browser. Your location (scaled by 1,000,000) + timestamp is recorded permanently on opBNB Testnet.</p>
            </div>
          </div>
        </div>

        {/* Geofence & Location */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4 px-1">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <div className="font-semibold text-lg tracking-tight">Geofence Rules</div>
          </div>
          <div className="bg-white border rounded-3xl p-5 text-sm text-zinc-600 space-y-2">
            <p>• Fixed site location is stored in the smart contract (no one can change it without redeploy).</p>
            <p>• Radius: <span className="font-semibold">500 meters</span>.</p>
            <p>• If outside: You'll see "You are outside the allowed area. You must be within 500 meters of the site."</p>
            <p>• Tip: Enable high-accuracy GPS in your device settings and allow location permission when prompted.</p>
            <p className="pt-2 border-t mt-3 text-xs">Site coordinates are private to the contract — your clock events include your GPS position for audit.</p>
          </div>
        </div>

        {/* Security & On-Chain */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4 px-1">
            <Shield className="w-5 h-5 text-emerald-600" />
            <div className="font-semibold text-lg tracking-tight">Security &amp; Privacy</div>
          </div>
          <div className="bg-white border rounded-3xl p-5 text-sm">
            <ul className="space-y-2 text-zinc-600">
              <li className="flex gap-2"><span className="text-emerald-600">•</span> Private key lives only on <span className="font-medium">your device</span>. No cloud, no seed phrase shown, no external wallet connection needed for daily use.</li>
              <li className="flex gap-2"><span className="text-emerald-600">•</span> Every clock event creates an immutable on-chain record with your address, timestamp, and GPS coordinates.</li>
              <li className="flex gap-2"><span className="text-emerald-600">•</span> No overtime or complex logic on-chain — keeps it simple and gas-efficient. Timesheet calculations happen off-chain if needed.</li>
              <li className="flex gap-2"><span className="text-emerald-600">•</span> Contract is verified on opBNB Testnet. Anyone can audit the clock history for your address.</li>
            </ul>
          </div>
        </div>

        {/* Contract Info */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4 px-1">
            <ExternalLink className="w-5 h-5 text-emerald-600" />
            <div className="font-semibold text-lg tracking-tight">Smart Contract Details</div>
          </div>
          <div className="bg-zinc-900 text-white rounded-3xl p-5 font-mono text-sm break-all">
            <div className="text-emerald-400 text-xs tracking-widest mb-1">opBNB TESTNET • CHAIN ID 5611</div>
            {contractAddress}
            <div className="mt-4 flex gap-3">
              <a 
                href={explorerUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs px-4 py-2 bg-white/10 hover:bg-white/20 rounded-2xl transition"
              >
                View on opBNBScan <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button 
                onClick={copyContract}
                className="copy-btn inline-flex items-center gap-2 text-xs px-4 py-2 bg-white/10 hover:bg-white/20 rounded-2xl transition"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Address
              </button>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4 px-1">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            <div className="font-semibold text-lg tracking-tight">Common Issues</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white border rounded-3xl p-5">
              <div className="font-medium text-red-600 flex items-center gap-2 mb-1"><AlertTriangle className="w-4 h-4" /> Low Balance</div>
              <p className="text-zinc-600">Ask manager to send tBNB to your wallet address (tap QR in clock screen). Minimum ~0.001 tBNB recommended.</p>
            </div>
            <div className="bg-white border rounded-3xl p-5">
              <div className="font-medium text-red-600 flex items-center gap-2 mb-1"><AlertTriangle className="w-4 h-4" /> Outside Geofence</div>
              <p className="text-zinc-600">Move within 500m of the site. Use the refresh button after moving. GPS accuracy improves outdoors.</p>
            </div>
            <div className="bg-white border rounded-3xl p-5">
              <div className="font-medium text-red-600 flex items-center gap-2 mb-1"><AlertTriangle className="w-4 h-4" /> Transaction Rejected</div>
              <p className="text-zinc-600">You cancelled the signature request. Try again. Or check you have enough gas.</p>
            </div>
            <div className="bg-white border rounded-3xl p-5">
              <div className="font-medium text-red-600 flex items-center gap-2 mb-1"><AlertTriangle className="w-4 h-4" /> Wallet Lost?</div>
              <p className="text-zinc-600">Your private key is only in localStorage on this browser/device. Clear site data = lose access. Back up address with manager if needed.</p>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="text-center text-xs text-zinc-400 pb-8">
          EasyClock v2.1 • Lightweight employee clocking • Built for simplicity &amp; on-chain trust<br />
          No central login required for core clocking features.
        </div>
      </div>
    </div>
  );
}