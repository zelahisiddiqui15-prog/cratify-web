'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const BACKEND = 'https://web-production-a92d.up.railway.app';

const LogoMark = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#A855F7"/>
    <rect x="7" y="8" width="18" height="5" rx="2.5" fill="white"/>
    <rect x="7" y="14.5" width="12" height="5" rx="2.5" fill="white" opacity="0.55"/>
    <rect x="7" y="21" width="18" height="5" rx="2.5" fill="white"/>
  </svg>
);

export default function Login() {
  const router = useRouter();
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [usernameStatus, setUsernameStatus] = useState('');
  const [loading, setLoading] = useState(false);

  async function checkUsername(val) {
    setUsername(val);
    if (val.length < 2) { setUsernameStatus(''); return; }
    try {
      const res = await fetch(`${BACKEND}/auth/check-username?username=${encodeURIComponent(val)}`);
      const data = await res.json();
      setUsernameStatus(data.available ? 'available' : 'taken');
    } catch {
      setUsernameStatus('');
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('sortdrop_user_id', data.user_id);
        localStorage.setItem('cratify_username', data.username || '');
        localStorage.setItem('cratify_email', data.email || '');
        router.push('/dashboard');
      } else {
        setError(data.error === 'invalid credentials' ? 'Invalid email or password.' : data.error);
      }
    } catch {
      setError('Connection error. Please try again.');
    }
    setLoading(false);
  }

  async function handleSignup(e) {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError("Passwords don't match."); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (usernameStatus === 'taken') { setError('That username is already taken.'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('sortdrop_user_id', data.user_id);
        localStorage.setItem('cratify_username', username);
        localStorage.setItem('cratify_email', email);
        router.push('/dashboard');
      } else {
        setError(data.error === 'email already registered' ? 'Email already registered. Try signing in.' : data.error);
      }
    } catch {
      setError('Connection error. Please try again.');
    }
    setLoading(false);
  }

  const inputStyle = {
    width: '100%', padding: '13px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(168,85,247,0.3)',
    borderRadius: 10, color: 'white', fontSize: 15,
    outline: 'none', boxSizing: 'border-box',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  };

  const btnStyle = {
    width: '100%', padding: '14px',
    background: 'linear-gradient(135deg, #A855F7, #7C3AED)',
    border: 'none', borderRadius: 10,
    color: 'white', fontSize: 15, fontWeight: 600,
    cursor: 'pointer', marginTop: 8,
  };

  return (
    <main style={{
      minHeight: '100vh', background: '#0D0B1E', color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '48px 24px',
    }}>
      {/* Logo */}
      <div
        onClick={() => router.push('/')}
        style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40, cursor: 'pointer' }}>
        <LogoMark size={32} />
        <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '0.05em' }}>CRATIFY</span>
      </div>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 480,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(168,85,247,0.2)',
        borderRadius: 20, padding: 40,
      }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          {['login', 'signup'].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(''); }} style={{
              flex: 1, padding: '10px',
              background: tab === t ? 'rgba(168,85,247,0.2)' : 'transparent',
              border: `1px solid ${tab === t ? '#A855F7' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 8, color: tab === t ? '#A855F7' : 'rgba(255,255,255,0.5)',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>
              {t === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {/* Login form */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input type="email" placeholder="Email" value={email}
              onChange={e => setEmail(e.target.value)} required style={inputStyle} />
            <input type="password" placeholder="Password" value={password}
              onChange={e => setPassword(e.target.value)} required style={inputStyle} />
            {error && <div style={{ color: '#EF4444', fontSize: 13, textAlign: 'center' }}>{error}</div>}
            <button type="submit" disabled={loading} style={btnStyle}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
        )}

        {/* Signup form */}
        {tab === 'signup' && (
          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input type="email" placeholder="Email" value={email}
              onChange={e => setEmail(e.target.value)} required style={inputStyle} />
            <div>
              <input type="text" placeholder="Username (e.g. zee)" value={username}
                onChange={e => checkUsername(e.target.value)} required style={inputStyle} />
              {usernameStatus === 'available' && (
                <div style={{ fontSize: 12, color: '#10B981', marginTop: 4 }}>✓ @{username} is available</div>
              )}
              {usernameStatus === 'taken' && (
                <div style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>✗ @{username} is already taken</div>
              )}
            </div>
            <input type="password" placeholder="Password" value={password}
              onChange={e => setPassword(e.target.value)} required style={inputStyle} />
            <input type="password" placeholder="Confirm password" value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)} required style={inputStyle} />
            {error && <div style={{ color: '#EF4444', fontSize: 13, textAlign: 'center' }}>{error}</div>}
            <button type="submit" disabled={loading} style={btnStyle}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
          {tab === 'login' ? (
            <span>Don't have an account?{' '}
              <span onClick={() => setTab('signup')} style={{ color: '#A855F7', cursor: 'pointer' }}>Sign up</span>
            </span>
          ) : (
            <span>Already have an account?{' '}
              <span onClick={() => setTab('login')} style={{ color: '#A855F7', cursor: 'pointer' }}>Sign in</span>
            </span>
          )}
        </div>
      </div>
    </main>
  );
}