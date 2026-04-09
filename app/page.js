'use client';
import { useRouter } from 'next/navigation';

const LogoMark = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#A855F7"/>
    <rect x="7" y="8" width="18" height="5" rx="2.5" fill="white"/>
    <rect x="7" y="14.5" width="12" height="5" rx="2.5" fill="white" opacity="0.55"/>
    <rect x="7" y="21" width="18" height="5" rx="2.5" fill="white"/>
  </svg>
);

export default function Home() {
  const router = useRouter();

  return (
    <main style={{
      minHeight: '100vh',
      background: '#0D0B1E',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      {/* Nav */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 48px',
        borderBottom: '1px solid rgba(168, 85, 247, 0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <LogoMark size={32} />
          <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '0.05em' }}>CRATIFY</span>
        </div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <a href="#how" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: 14 }}>How it works</a>
          <a href="#pricing" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: 14 }}>Pricing</a>
          <button
            onClick={() => router.push('/login')}
            style={{
              background: 'transparent',
              border: '1px solid rgba(168,85,247,0.4)',
              borderRadius: 8,
              color: 'rgba(255,255,255,0.7)',
              padding: '9px 18px',
              fontSize: 14, fontWeight: 500, cursor: 'pointer',
            }}>
            Sign in
          </button>
          <button
            onClick={() => router.push('/onboarding')}
            style={{
              background: 'linear-gradient(135deg, #A855F7, #7C3AED)',
              border: 'none', borderRadius: 8,
              color: 'white', padding: '10px 20px',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '100px 48px 80px' }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(168, 85, 247, 0.1)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          borderRadius: 20, padding: '6px 16px',
          fontSize: 13, color: '#A855F7',
          marginBottom: 24,
        }}>
          AI-powered music file organizer
        </div>
        <h1 style={{
          fontSize: 64, fontWeight: 800,
          lineHeight: 1.1, marginBottom: 24,
          color: '#FFFFFF',
        }}>
          Your samples.<br />
          <span style={{ color: '#A855F7' }}>Finally organized.</span>
        </h1>
        <p style={{
          fontSize: 20, color: 'rgba(255,255,255,0.6)',
          maxWidth: 520, margin: '0 auto 40px',
          lineHeight: 1.6,
        }}>
          Tell Cratify how your brain works as a producer. It builds your perfect folder system and keeps it organized automatically.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <button
            onClick={() => router.push('/onboarding')}
            style={{
              background: 'linear-gradient(135deg, #A855F7, #7C3AED)',
              border: 'none', borderRadius: 12,
              color: 'white', padding: '16px 32px',
              fontSize: 16, fontWeight: 700, cursor: 'pointer',
            }}>
            Start for free — 25 sorts included
          </button>
        </div>
        <p style={{ marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
          No credit card required
        </p>
      </section>

      {/* How it works */}
      <section id="how" style={{ padding: '80px 48px', maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 36, fontWeight: 700, marginBottom: 60 }}>
          How it works
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
          {[
            { step: '01', title: 'Tell us your setup', desc: 'Answer a few questions about your DAW, plugins, and how you like to organize files.' },
            { step: '02', title: 'We build your system', desc: 'AI generates a custom folder structure based on exactly how you think about your music.' },
            { step: '03', title: 'Drop files, stay organized', desc: 'Download the app. Every new sample, preset, or MIDI file gets sorted instantly.' },
          ].map((item) => (
            <div key={item.step} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              borderRadius: 16, padding: 32,
            }}>
              <div style={{ fontSize: 13, color: '#A855F7', fontWeight: 700, marginBottom: 12 }}>{item.step}</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{item.title}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '80px 48px', maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 16 }}>Simple pricing</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 48 }}>Start free, upgrade when you're ready.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {[
            { name: 'Free', price: '$0', desc: 'Get started', features: ['25 file sorts', 'AI folder setup', 'Mac app', 'Email support'], cta: 'Start free', highlight: false },
            { name: 'Pro', price: '$8/mo', desc: 'For serious producers', features: ['Unlimited sorts', 'Everything in Free', 'Priority support', 'Config backup'], cta: 'Get Pro', highlight: true },
          ].map((plan) => (
            <div key={plan.name} style={{
              background: plan.highlight ? 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(124,58,237,0.2))' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${plan.highlight ? 'rgba(168,85,247,0.6)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 16, padding: 32, textAlign: 'left',
            }}>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>{plan.name}</div>
              <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 4 }}>{plan.price}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>{plan.desc}</div>
              {plan.features.map(f => (
                <div key={f} style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#A855F7' }}>✓</span> {f}
                </div>
              ))}
              <button
                onClick={() => router.push('/onboarding')}
                style={{
                  marginTop: 24, width: '100%',
                  background: plan.highlight ? 'linear-gradient(135deg, #A855F7, #7C3AED)' : 'rgba(255,255,255,0.08)',
                  border: 'none', borderRadius: 10,
                  color: 'white', padding: '12px',
                  fontSize: 14, fontWeight: 600, cursor: 'pointer',
                }}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: 'center', padding: '40px 48px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        color: 'rgba(255,255,255,0.3)', fontSize: 13,
      }}>
        © 2025 Cratify. Built for producers, by producers.
      </footer>
    </main>
  );
}