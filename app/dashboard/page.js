'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const BACKEND = 'https://web-production-a92d.up.railway.app';
const DOWNLOAD_URL = 'https://github.com/zelahisiddiqui15-prog/cratify-backend/releases/download/v1.0.0/Cratify.zip';

const LogoMark = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#A855F7"/>
    <rect x="7" y="8" width="18" height="5" rx="2.5" fill="white"/>
    <rect x="7" y="14.5" width="12" height="5" rx="2.5" fill="white" opacity="0.55"/>
    <rect x="7" y="21" width="18" height="5" rx="2.5" fill="white"/>
  </svg>
);

export default function Dashboard() {
  const router = useRouter();
  const [status, setStatus] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const uid = localStorage.getItem('sortdrop_user_id');
    const savedAnswers = localStorage.getItem('sortdrop_answers');
    const savedUsername = localStorage.getItem('cratify_username');
    if (!uid) { router.push('/login'); return; }
    setUserId(uid);
    if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
    if (savedUsername) setUsername(savedUsername);

    fetch(`${BACKEND}/subscription/status?user_id=${uid}`)
      .then(r => r.json())
      .then(data => {
        setStatus(data);
        if (data.username) setUsername(data.username);
      });
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('sortdrop_user_id');
    localStorage.removeItem('cratify_username');
    localStorage.removeItem('cratify_email');
    localStorage.removeItem('sortdrop_answers');
    router.push('/login');
  };

  if (!status) return (
    <main style={{ minHeight: '100vh', background: '#0D0B1E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'sans-serif' }}>Loading...</div>
    </main>
  );

  const sortsLeft = status.sorts_remaining;
  const isPro = status.subscription_active;

  return (
    <main style={{
      minHeight: '100vh', background: '#0D0B1E', color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', padding: '40px 48px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LogoMark size={32} />
          <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '0.05em' }}>CRATIFY</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {username && (
            <span style={{ fontSize: 14, color: '#A855F7', fontWeight: 600 }}>@{username}</span>
          )}
          <div style={{
            background: isPro ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${isPro ? '#A855F7' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 20, padding: '6px 14px', fontSize: 13,
            color: isPro ? '#A855F7' : 'rgba(255,255,255,0.5)',
          }}>
            {isPro ? '✓ Pro — Unlimited' : `${sortsLeft} sorts remaining`}
          </div>
          <button onClick={handleLogout} style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, color: 'rgba(255,255,255,0.4)',
            padding: '6px 14px', fontSize: 13, cursor: 'pointer',
          }}>
            Sign out
          </button>
        </div>
      </div>

      {/* Welcome */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
          {username ? `Hey @${username} 👋` : 'Your setup is ready 🎉'}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>
          Here's your personalized folder structure based on your answers.
        </p>
      </div>

      {/* User ID Card */}
      <div style={{
        background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.3)',
        borderRadius: 16, padding: '20px 24px', marginBottom: 32,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 12, color: '#A855F7', fontWeight: 600, marginBottom: 4, letterSpacing: '0.08em' }}>YOUR USER ID</div>
          <div style={{ fontFamily: 'monospace', fontSize: 15, color: 'rgba(255,255,255,0.9)' }}>{userId}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Paste this into the Cratify app under "Enter User ID"</div>
        </div>
        <button onClick={handleCopy} style={{
          background: copied ? 'rgba(168,85,247,0.3)' : 'rgba(168,85,247,0.15)',
          border: '1px solid rgba(168,85,247,0.4)',
          borderRadius: 8, color: copied ? '#C084FC' : '#A855F7',
          padding: '8px 16px', fontSize: 13, fontWeight: 600,
          cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
        }}>
          {copied ? '✓ Copied!' : 'Copy ID'}
        </button>
      </div>

      {/* Folder preview */}
      {answers && (
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(168,85,247,0.2)',
          borderRadius: 16, padding: 32, marginBottom: 32, fontFamily: 'monospace',
        }}>
          <div style={{ color: '#A855F7', fontSize: 13, marginBottom: 16, fontFamily: 'sans-serif', fontWeight: 600 }}>YOUR FOLDER STRUCTURE</div>
          <div style={{ fontSize: 14, lineHeight: 2, color: 'rgba(255,255,255,0.8)' }}>
            <div>📁 Cratify/</div>
            {answers.file_types?.includes('Stems & Loops') && <>
              <div>&nbsp;&nbsp;📁 Bass/</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;📁 Am/ &nbsp;&nbsp;<span style={{ color: 'rgba(255,255,255,0.3)' }}>← stems sorted by key</span></div>
              <div>&nbsp;&nbsp;📁 Lead/</div>
              <div>&nbsp;&nbsp;📁 Pad/</div>
              <div>&nbsp;&nbsp;📁 FX/</div>
            </>}
            {answers.file_types?.includes('MIDI files') && <div>&nbsp;&nbsp;📁 MIDI/</div>}
            {answers.file_types?.includes('Presets') && <>
              <div>&nbsp;&nbsp;📁 Presets/</div>
              {answers.plugins?.map(p => <div key={p}>&nbsp;&nbsp;&nbsp;&nbsp;📁 {p}/</div>)}
            </>}
            {answers.file_types?.includes('One-shots') && <div>&nbsp;&nbsp;📁 One-shots/</div>}
          </div>
        </div>
      )}

      {/* Next steps */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 24, marginBottom: 12 }}>⬇️</div>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Download the app</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>Mac menu bar app that watches your folders automatically.</div>
          <button
            onClick={() => window.open(DOWNLOAD_URL, '_blank')}
            style={{ background: 'linear-gradient(135deg, #A855F7, #7C3AED)', border: 'none', borderRadius: 8, color: 'white', padding: '10px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Download for Mac
          </button>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 24, marginBottom: 12 }}>⚡</div>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Upgrade to Pro</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>Unlimited sorts, config backup, priority support.</div>
          <button
            onClick={() => window.open(`https://buy.stripe.com/test_3cI28sgyudkXaSHbqI0sU00?client_reference_id=${userId}`, '_blank')}
            style={{
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, color: 'white', padding: '10px 16px', fontSize: 13,
              fontWeight: 600, cursor: 'pointer',
            }}>
            {isPro ? '✓ Already Pro' : 'Upgrade — $8/mo'}
          </button>
        </div>
      </div>
    </main>
  );
}