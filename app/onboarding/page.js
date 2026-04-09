'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const QUESTIONS = [
  {
    id: 'daw',
    question: "What DAW do you use?",
    type: 'choice',
    options: ['FL Studio', 'Ableton Live', 'Logic Pro', 'Pro Tools', 'Other'],
  },
  {
    id: 'plugins',
    question: "Which synths/plugins do you use most?",
    type: 'multi',
    options: ['Serum', 'Vital', 'Sylenth1', 'Massive', 'Omnisphere', 'Other'],
  },
  {
    id: 'file_types',
    question: "What types of files do you download most?",
    type: 'multi',
    options: ['Stems & Loops', 'One-shots', 'MIDI files', 'Presets', 'Sample Packs'],
  },
  {
    id: 'structure',
    question: "How do you want files organized?",
    type: 'choice',
    options: [
      'By Category + Key (Bass/Am/file.wav)',
      'By Category Only (Bass/file.wav)',
      'By Plugin (Serum/Bass/file.wav)',
      'Flat — just sort by category',
    ],
  },
  {
    id: 'account',
    question: "Last step — create your account",
    type: 'account',
  },
];

const BACKEND = 'https://web-production-a92d.up.railway.app';

const LogoMark = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#A855F7"/>
    <rect x="7" y="8" width="18" height="5" rx="2.5" fill="white"/>
    <rect x="7" y="14.5" width="12" height="5" rx="2.5" fill="white" opacity="0.55"/>
    <rect x="7" y="21" width="18" height="5" rx="2.5" fill="white"/>
  </svg>
);

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Account fields
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usernameStatus, setUsernameStatus] = useState('');

  const current = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;

  function selectChoice(val) {
    setAnswers({ ...answers, [current.id]: val });
  }

  function toggleMulti(val) {
    const prev = answers[current.id] || [];
    const next = prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val];
    setAnswers({ ...answers, [current.id]: next });
  }

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

  function canContinue() {
    if (current.type === 'account') {
      return email.includes('@') && username.length >= 2 &&
             password.length >= 6 && password === confirmPassword &&
             usernameStatus === 'available';
    }
    if (current.type === 'multi') return (answers[current.id] || []).length > 0;
    return !!answers[current.id];
  }

  async function handleNext() {
    if (isLast) {
      await handleSubmit();
    } else {
      setStep(step + 1);
    }
  }

  async function handleSubmit() {
    setLoading(true);
    setError('');
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
        localStorage.setItem('sortdrop_answers', JSON.stringify({ ...answers, email }));
        router.push('/dashboard');
      } else {
        setError(data.error === 'email already registered'
          ? 'Email already registered. Try signing in.'
          : data.error === 'username already taken'
          ? `@${username} is already taken.`
          : data.error || 'Something went wrong.');
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

  return (
    <main style={{
      minHeight: '100vh', background: '#0D0B1E', color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '48px 24px',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
        <LogoMark size={32} />
        <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '0.05em' }}>CRATIFY</span>
      </div>

      {/* Already have account */}
      <div style={{ marginBottom: 24, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
        Already have an account?{' '}
        <span
          onClick={() => router.push('/login')}
          style={{ color: '#A855F7', cursor: 'pointer' }}>
          Sign in
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ width: '100%', maxWidth: 560, marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Step {step + 1} of {QUESTIONS.length}</span>
          <span style={{ fontSize: 13, color: '#A855F7' }}>{Math.round(((step + 1) / QUESTIONS.length) * 100)}%</span>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }}>
          <div style={{
            height: 4, borderRadius: 4,
            background: 'linear-gradient(90deg, #A855F7, #7C3AED)',
            width: `${((step + 1) / QUESTIONS.length) * 100}%`,
            transition: 'width 0.3s ease',
          }}/>
        </div>
      </div>

      {/* Question card */}
      <div style={{
        width: '100%', maxWidth: 560,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(168,85,247,0.2)',
        borderRadius: 20, padding: 40,
      }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 32 }}>{current.question}</h2>

        {current.type === 'choice' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {current.options.map(opt => (
              <button key={opt} onClick={() => selectChoice(opt)} style={{
                padding: '14px 20px', borderRadius: 10, textAlign: 'left',
                background: answers[current.id] === opt ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${answers[current.id] === opt ? '#A855F7' : 'rgba(255,255,255,0.1)'}`,
                color: 'white', fontSize: 15, cursor: 'pointer',
              }}>{opt}</button>
            ))}
          </div>
        )}

        {current.type === 'multi' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {current.options.map(opt => {
              const selected = (answers[current.id] || []).includes(opt);
              return (
                <button key={opt} onClick={() => toggleMulti(opt)} style={{
                  padding: '10px 18px', borderRadius: 20,
                  background: selected ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${selected ? '#A855F7' : 'rgba(255,255,255,0.1)'}`,
                  color: 'white', fontSize: 14, cursor: 'pointer',
                }}>{opt}</button>
              );
            })}
          </div>
        )}

        {current.type === 'account' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input type="email" placeholder="Email" value={email}
              onChange={e => setEmail(e.target.value)} style={inputStyle} />
            <div>
              <input type="text" placeholder="Username (e.g. zee)" value={username}
                onChange={e => checkUsername(e.target.value)} style={inputStyle} />
              {usernameStatus === 'available' && (
                <div style={{ fontSize: 12, color: '#10B981', marginTop: 4 }}>✓ @{username} is available</div>
              )}
              {usernameStatus === 'taken' && (
                <div style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>✗ @{username} is already taken</div>
              )}
            </div>
            <input type="password" placeholder="Password (min 6 characters)" value={password}
              onChange={e => setPassword(e.target.value)} style={inputStyle} />
            <input type="password" placeholder="Confirm password" value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)} style={inputStyle} />
            {error && <div style={{ color: '#EF4444', fontSize: 13, textAlign: 'center' }}>{error}</div>}
          </div>
        )}

        <button
          onClick={handleNext}
          disabled={!canContinue() || loading}
          style={{
            marginTop: 32, width: '100%', padding: '14px',
            background: canContinue() ? 'linear-gradient(135deg, #A855F7, #7C3AED)' : 'rgba(255,255,255,0.1)',
            border: 'none', borderRadius: 10,
            color: 'white', fontSize: 15, fontWeight: 600,
            cursor: canContinue() ? 'pointer' : 'not-allowed',
          }}>
          {loading ? 'Creating your account...' : isLast ? 'Create my account →' : 'Continue →'}
        </button>
      </div>
    </main>
  );
}