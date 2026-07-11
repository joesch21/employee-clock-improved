import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Clock } from 'lucide-react';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      // In real app call your backend. For now just demo sign in.
      await signIn({ email, token: 'demo' });
      navigate('/');
    } catch (e) {
      setErr('Login failed. Try the wallet option below.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-5">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3 text-white">
            <div className="w-11 h-11 bg-emerald-600 rounded-2xl flex items-center justify-center"><Clock /></div>
            <div className="text-3xl font-semibold tracking-tighter">EasyClock</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Sign in to continue</h2>

          {err && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-2xl">{err}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="email" value={email} onChange={e=>setEmail(e.target.value)} required
              placeholder="Work email" className="w-full border rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-emerald-500" 
            />
            <input 
              type="password" value={pass} onChange={e=>setPass(e.target.value)} required
              placeholder="Password" className="w-full border rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-emerald-500" 
            />
            <button type="submit" className="w-full py-3.5 rounded-2xl bg-zinc-900 text-white font-semibold active:bg-black">Sign In</button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-200" />
            <div className="text-xs text-zinc-500">OR</div>
            <div className="h-px flex-1 bg-zinc-200" />
          </div>

          <Link 
            to="/"
            className="block w-full text-center py-3.5 rounded-2xl border font-medium hover:bg-zinc-50"
          >
            Continue with Work Wallet (Recommended)
          </Link>

          <p className="text-center mt-6 text-xs text-zinc-500">
            New here? Your manager will give you the wallet address or you can create one on the dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
