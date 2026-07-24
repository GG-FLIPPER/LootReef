import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// ─── COLOR PALETTE (matching Landing.jsx Frutiger Aero) ───
const AQUA = '#00d4ff';
const DEEP_BLUE = '#005f99';
const GREEN_AERO = '#55ff77';
const TEXT_PRIMARY = '#0d2847';
const TEXT_MUTED = 'rgba(13,40,71,0.7)';

// ─── GLASS PANEL (matching Landing.jsx) ───
const glassPanel = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 100%)',
  border: '1px solid rgba(255,255,255,0.5)',
  borderTop: '2px solid rgba(255,255,255,0.9)',
  borderLeft: '1.5px solid rgba(255,255,255,0.7)',
  borderRadius: 32,
  backdropFilter: 'blur(32px) saturate(160%)',
  WebkitBackdropFilter: 'blur(32px) saturate(160%)',
  boxShadow: '0 20px 40px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,1), inset 0 -5px 15px rgba(255,255,255,0.3)',
  position: 'relative',
  overflow: 'hidden',
};

// ─── GLASS SHINE ───
function GlassShine() {
  return (
    <>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '45%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 100%)',
        borderBottomLeftRadius: '50% 15%', borderBottomRightRadius: '50% 15%',
        pointerEvents: 'none', zIndex: 1,
      }} />
      <div style={{
        position: 'absolute', top: 0, left: '-100%', right: '-100%', bottom: 0,
        background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.6) 45%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.6) 55%, transparent 70%)',
        pointerEvents: 'none', zIndex: 1, opacity: 0.6, mixBlendMode: 'overlay',
      }} />
    </>
  );
}

// ─── PRICING DATA ───
const PRICING = {
  deal_card: {
    label: 'Sponsored Deal Card',
    desc: 'Your card appears alongside search results — seen by every searcher.',
    tiers: { '3day': 8, '7day': 15, '14day': 25, '30day': 45 },
  },
  todays_deal: {
    label: "Sponsored Today's Deal",
    desc: 'Premium top-of-page placement — the very first thing visitors see.',
    tiers: { '3day': 15, '7day': 28, '14day': 45, '30day': 80 },
  },
};

const TIER_LABELS = {
  '3day': '3 Days',
  '7day': '7 Days',
  '14day': '14 Days',
  '30day': '30 Days',
};

// ─── INJECTED CSS ───
const INJECTED_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Figtree:wght@300;400;600;700&display=swap');

@keyframes movingBackground {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes floatBubble {
  0% { transform: translateY(0) scale(1) translateX(0); }
  50% { transform: translateY(-40px) scale(1.05) translateX(10px); }
  100% { transform: translateY(0) scale(1) translateX(0); }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes successPop {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}

.advertise-input {
  width: 100%;
  padding: 1rem 1.2rem;
  border-radius: 16px;
  border: 2px solid rgba(255,255,255,0.5);
  background: rgba(255,255,255,0.35);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  font-family: 'Figtree', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  color: ${TEXT_PRIMARY};
  outline: none;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.04);
  box-sizing: border-box;
}
.advertise-input::placeholder {
  color: rgba(13,40,71,0.45);
}
.advertise-input:focus {
  border-color: ${AQUA};
  box-shadow: 0 0 0 4px rgba(0,212,255,0.15), inset 0 2px 4px rgba(0,0,0,0.04);
}

.advertise-select {
  width: 100%;
  padding: 1rem 1.2rem;
  border-radius: 16px;
  border: 2px solid rgba(255,255,255,0.5);
  background: rgba(255,255,255,0.35);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  font-family: 'Figtree', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  color: ${TEXT_PRIMARY};
  outline: none;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.04);
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23005f99' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1.2rem center;
  padding-right: 3rem;
  box-sizing: border-box;
}
.advertise-select:focus {
  border-color: ${AQUA};
  box-shadow: 0 0 0 4px rgba(0,212,255,0.15), inset 0 2px 4px rgba(0,0,0,0.04);
}

textarea.advertise-input {
  resize: vertical;
  min-height: 100px;
}

.placement-radio {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.placement-radio:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 15px 30px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,1), inset 0 -5px 15px rgba(255,255,255,0.4) !important;
}

.submit-btn {
  background: linear-gradient(180deg, #00d4ff 0%, #0077ff 100%);
  border: 1px solid #005f99;
  border-top: 1px solid #b3ebff;
  box-shadow: 0 8px 24px rgba(0,119,255,0.4), inset 0 20px 20px rgba(255,255,255,0.4), inset 0 -10px 20px rgba(0,0,0,0.2);
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  font-weight: 700;
  font-family: 'Figtree', sans-serif;
  padding: 1.2rem 3rem;
  border-radius: 60px;
  cursor: pointer;
  font-size: 1.15rem;
  letter-spacing: 0.02em;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  width: 100%;
}
.submit-btn:hover:not(:disabled) {
  transform: scale(1.03) translateY(-2px);
  box-shadow: 0 15px 30px rgba(0,119,255,0.5), inset 0 25px 25px rgba(255,255,255,0.6), inset 0 -10px 20px rgba(0,0,0,0.1);
}
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Pricing table hover */
.pricing-row {
  transition: all 0.25s ease;
}
.pricing-row:hover {
  background: rgba(255,255,255,0.3) !important;
}

@media (max-width: 768px) {
  body, html { overflow-x: hidden !important; }
  div[style*="backdropFilter"],
  div[style*="backdrop-filter"] {
    backdrop-filter: blur(8px) saturate(120%) !important;
    -webkit-backdrop-filter: blur(8px) saturate(120%) !important;
  }
  div[style*="floatBubble"],
  div[style*="floatBubble"] * {
    display: none !important;
    animation: none !important;
  }
}
`;

// ─── BUBBLES (fewer than landing — lighter page) ───
const BUBBLES = Array.from({ length: 12 }, (_, i) => ({
  size: 20 + Math.random() * 60,
  left: `${-5 + Math.random() * 110}%`,
  top: `${-5 + Math.random() * 110}%`,
  opacity: 0.3 + Math.random() * 0.4,
  duration: 10 + Math.random() * 15,
  delay: Math.random() * 10,
}));

export default function Advertise() {
  const displayFont = { fontFamily: "'Syne', sans-serif", fontWeight: 800 };
  const bodyFont = { fontFamily: "'Figtree', sans-serif" };

  const [form, setForm] = useState({
    company_name: '',
    contact_email: '',
    card_title: '',
    card_description: '',
    image_url: '',
    target_url: '',
    placement: 'deal_card',
    tier: '7day',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // Inject styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = INJECTED_CSS;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const selectedPrice = PRICING[form.placement]?.tiers[form.tier] ?? 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/sponsors/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setError('Network error — please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── SUCCESS STATE ───
  if (submitted) {
    return (
      <div style={{
        background: 'linear-gradient(-45deg, #4facfe 0%, #00f2fe 50%, #43e97b 100%)',
        backgroundSize: '400% 400%', animation: 'movingBackground 15s ease infinite',
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        ...bodyFont, padding: '2rem',
      }}>
        <div style={{
          ...glassPanel, borderRadius: 40, padding: '4rem 3rem', maxWidth: 520,
          width: '100%', textAlign: 'center', animation: 'successPop 0.5s ease-out',
        }}>
          <GlassShine />
          <div style={{ position: 'relative', zIndex: 2 }}>
            {/* Success checkmark */}
            <div style={{
              width: 80, height: 80, borderRadius: '50%', margin: '0 auto 2rem',
              background: 'linear-gradient(135deg, #55ff77, #00cc44)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(0,204,68,0.4), inset 0 2px 2px rgba(255,255,255,0.5)',
              border: '2px solid white',
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 style={{ ...displayFont, fontSize: '2rem', color: DEEP_BLUE, margin: '0 0 1rem',
              textShadow: '0 2px 4px rgba(255,255,255,0.8)' }}>
              Application Received!
            </h2>
            <p style={{ color: TEXT_PRIMARY, fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.6, margin: '0 0 2rem' }}>
              Thanks for your interest in advertising on LootReef. We'll review your application and get back to you via email shortly.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/" style={{
                ...glassPanel, borderRadius: 50, padding: '0.8rem 2rem',
                color: DEEP_BLUE, fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,1)',
              }}>
                <GlassShine />
                <span style={{ position: 'relative', zIndex: 2 }}>← Back to Home</span>
              </Link>
              <Link to="/app" style={{
                ...glassPanel, borderRadius: 50, padding: '0.8rem 2rem',
                color: DEEP_BLUE, fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,1)',
              }}>
                <GlassShine />
                <span style={{ position: 'relative', zIndex: 2 }}>Start Comparing →</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(-45deg, #4facfe 0%, #00f2fe 50%, #43e97b 100%)',
      backgroundSize: '400% 400%', animation: 'movingBackground 15s ease infinite',
      color: TEXT_PRIMARY, minHeight: '100vh', ...bodyFont, fontWeight: 400,
      overflowX: 'hidden', position: 'relative',
    }}>
      {/* ─── Background orbs ─── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'fixed', width: '150vw', height: '100vh', top: '-20vh', left: '-25vw',
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 60%)',
          filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'fixed', width: 600, height: 600, borderRadius: '50%', bottom: -200, left: -150,
          background: 'radial-gradient(circle, rgba(67,233,123,0.5) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }} />
        <div style={{
          position: 'fixed', width: 700, height: 700, borderRadius: '50%', top: '10%', right: -250,
          background: 'radial-gradient(circle, rgba(0,95,153,0.4) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }} />
        {BUBBLES.map((p, i) => (
          <div key={i} style={{
            position: 'absolute', width: p.size, height: p.size, borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.1) 40%, transparent 80%)',
            border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: 'inset -5px -5px 15px rgba(255,255,255,0.4), inset 2px 2px 5px rgba(255,255,255,0.8), 0 5px 15px rgba(0,0,0,0.05)',
            opacity: p.opacity, left: p.left, top: p.top,
            animation: `floatBubble ${p.duration}s ease-in-out infinite ${p.delay}s`,
            pointerEvents: 'none',
          }} />
        ))}
      </div>

      {/* ─── Top nav bar ─── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 5%', position: 'relative', zIndex: 10,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.15) 100%)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        borderBottom: '1px solid rgba(255,255,255,0.7)',
        boxShadow: '0 5px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)',
      }}>
        <Link to="/" style={{ ...displayFont, fontSize: '1.5rem', textDecoration: 'none', color: TEXT_PRIMARY,
          textShadow: '0 2px 4px rgba(255,255,255,0.8)' }}>
          <span style={{ color: DEEP_BLUE }}>Loot</span>Reef
        </Link>
        <Link to="/app" style={{
          ...glassPanel, borderRadius: 50, padding: '0.5rem 1.4rem',
          color: DEEP_BLUE, fontSize: '0.85rem', fontWeight: 800, textDecoration: 'none',
          boxShadow: '0 5px 15px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)',
        }}>
          <GlassShine />
          <span style={{ position: 'relative', zIndex: 2 }}>← Back to App</span>
        </Link>
      </nav>

      {/* ─── Main content ─── */}
      <main style={{ position: 'relative', zIndex: 2, padding: '3rem 5% 5rem', maxWidth: 960, margin: '0 auto' }}>

        {/* ─── Header ─── */}
        <div style={{ textAlign: 'center', marginBottom: '3rem', animation: 'fadeInUp 0.6s ease-out' }}>
          <div style={{
            ...glassPanel, display: 'inline-block', padding: '0.4rem 1.2rem', borderRadius: 50,
            fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase',
            color: DEEP_BLUE, fontWeight: 800, marginBottom: '1.5rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)',
          }}>
            <GlassShine />
            <span style={{ position: 'relative', zIndex: 2 }}>Advertise</span>
          </div>

          <h1 style={{
            ...displayFont, fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', lineHeight: 1, margin: '0 0 1rem',
            color: 'white', textShadow: '0 4px 20px rgba(0,95,153,0.3)',
          }}>
            Get Your Brand in Front of{' '}
            <span style={{ color: TEXT_PRIMARY }}>Gamers</span>
          </h1>

          <p style={{
            color: TEXT_PRIMARY, fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.6,
            maxWidth: 520, margin: '0 auto',
            textShadow: '0 1px 3px rgba(255,255,255,0.7)',
          }}>
            Promote your products directly on LootReef search results. Affordable, visible, and seen by thousands of gamers daily.
          </p>
        </div>

        {/* ─── Pricing Reference ─── */}
        <div style={{ marginBottom: '3rem', animation: 'fadeInUp 0.7s ease-out' }}>
          <h2 style={{
            ...displayFont, fontSize: '1.6rem', color: DEEP_BLUE, textAlign: 'center',
            margin: '0 0 1.5rem', textShadow: '0 2px 4px rgba(255,255,255,0.8)',
          }}>
            Pricing
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {Object.entries(PRICING).map(([key, p]) => (
              <div key={key} style={{
                ...glassPanel, borderRadius: 24, padding: '2rem',
                borderColor: form.placement === key ? AQUA : 'rgba(255,255,255,0.5)',
                borderWidth: form.placement === key ? 3 : 1,
                boxShadow: form.placement === key
                  ? `0 10px 30px rgba(0,212,255,0.15), inset 0 1px 0 rgba(255,255,255,1), inset 0 -5px 15px rgba(255,255,255,0.3)`
                  : glassPanel.boxShadow,
              }}>
                <GlassShine />
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ ...displayFont, fontSize: '1.2rem', color: DEEP_BLUE, marginBottom: '0.3rem',
                    textShadow: '0 2px 4px rgba(255,255,255,0.8)' }}>
                    {p.label}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: TEXT_MUTED, fontWeight: 600, marginBottom: '1.2rem' }}>
                    {p.desc}
                  </div>

                  {/* Price rows */}
                  {Object.entries(p.tiers).map(([tier, price]) => (
                    <div key={tier} className="pricing-row" style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '0.65rem 1rem', borderRadius: 12,
                      background: (form.placement === key && form.tier === tier) ? 'rgba(0,212,255,0.12)' : 'transparent',
                    }}>
                      <span style={{ fontWeight: 600, color: TEXT_PRIMARY }}>{TIER_LABELS[tier]}</span>
                      <span style={{ fontWeight: 800, color: DEEP_BLUE, fontSize: '1.1rem' }}>${price}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Application Form ─── */}
        <form onSubmit={handleSubmit} style={{ animation: 'fadeInUp 0.8s ease-out' }}>
          <div style={{
            ...glassPanel, borderRadius: 32, padding: '2.5rem',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 100%)',
          }}>
            <GlassShine />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h2 style={{
                ...displayFont, fontSize: '1.5rem', color: DEEP_BLUE, margin: '0 0 0.3rem',
                textShadow: '0 2px 4px rgba(255,255,255,0.8)',
              }}>
                Apply for a Sponsored Slot
              </h2>
              <p style={{ color: TEXT_MUTED, fontWeight: 600, fontSize: '0.95rem', margin: '0 0 2rem' }}>
                Fill in the details below. We'll review your application and reach out via email.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem' }}>
                {/* Company Name */}
                <div>
                  <label style={labelStyle}>Company Name *</label>
                  <input className="advertise-input" type="text" name="company_name" required
                    placeholder="e.g. GameVault" value={form.company_name} onChange={handleChange} />
                </div>

                {/* Contact Email */}
                <div>
                  <label style={labelStyle}>Contact Email *</label>
                  <input className="advertise-input" type="email" name="contact_email" required
                    placeholder="you@company.com" value={form.contact_email} onChange={handleChange} />
                </div>

                {/* Card Title */}
                <div>
                  <label style={labelStyle}>Card Title *</label>
                  <input className="advertise-input" type="text" name="card_title" required
                    placeholder="e.g. WoW Gold — Best Prices" value={form.card_title} onChange={handleChange} />
                </div>

                {/* Target URL */}
                <div>
                  <label style={labelStyle}>Target URL *</label>
                  <input className="advertise-input" type="url" name="target_url" required
                    placeholder="https://yoursite.com/deal" value={form.target_url} onChange={handleChange} />
                </div>

                {/* Image URL (optional) */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Image URL <span style={{ opacity: 0.5 }}>(optional)</span></label>
                  <input className="advertise-input" type="url" name="image_url"
                    placeholder="https://yoursite.com/promo-image.png" value={form.image_url} onChange={handleChange} />
                </div>

                {/* Card Description (optional) */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Card Description <span style={{ opacity: 0.5 }}>(optional)</span></label>
                  <textarea className="advertise-input" name="card_description"
                    placeholder="A short description that appears on the sponsored card..."
                    value={form.card_description} onChange={handleChange} />
                </div>
              </div>

              {/* ─── Placement Radio Cards ─── */}
              <div style={{ marginTop: '2rem' }}>
                <label style={{ ...labelStyle, marginBottom: '0.8rem', display: 'block' }}>Placement *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  {Object.entries(PRICING).map(([key, p]) => (
                    <div key={key} className="placement-radio"
                      onClick={() => setForm((prev) => ({ ...prev, placement: key }))}
                      style={{
                        ...glassPanel, borderRadius: 20, padding: '1.2rem 1.5rem', cursor: 'pointer',
                        borderColor: form.placement === key ? AQUA : 'rgba(255,255,255,0.5)',
                        borderWidth: form.placement === key ? 3 : 1,
                        background: form.placement === key
                          ? 'linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(255,255,255,0.3) 100%)'
                          : glassPanel.background,
                        boxShadow: form.placement === key
                          ? `0 8px 24px rgba(0,212,255,0.15), inset 0 1px 0 rgba(255,255,255,1)`
                          : '0 5px 15px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
                      }}
                    >
                      <GlassShine />
                      <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        {/* Radio indicator */}
                        <div style={{
                          width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                          border: `2px solid ${form.placement === key ? AQUA : 'rgba(0,95,153,0.3)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.3s ease',
                        }}>
                          {form.placement === key && (
                            <div style={{
                              width: 12, height: 12, borderRadius: '50%',
                              background: `linear-gradient(135deg, ${AQUA}, ${DEEP_BLUE})`,
                            }} />
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: DEEP_BLUE, fontSize: '1rem' }}>{p.label}</div>
                          <div style={{ fontSize: '0.8rem', color: TEXT_MUTED, fontWeight: 500, marginTop: 2 }}>{p.desc}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ─── Tier Select ─── */}
              <div style={{ marginTop: '1.5rem' }}>
                <label style={labelStyle}>Duration *</label>
                <select className="advertise-select" name="tier" value={form.tier} onChange={handleChange}>
                  {Object.entries(TIER_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label} — ${PRICING[form.placement]?.tiers[key] ?? '?'}
                    </option>
                  ))}
                </select>
              </div>

              {/* ─── Price Summary ─── */}
              <div style={{
                marginTop: '1.5rem', padding: '1.2rem 1.5rem', borderRadius: 20,
                background: 'linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(255,255,255,0.25) 100%)',
                border: '1px solid rgba(0,212,255,0.2)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: '0.5rem',
              }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: TEXT_MUTED, fontWeight: 600 }}>Selected</div>
                  <div style={{ fontWeight: 700, color: TEXT_PRIMARY }}>
                    {PRICING[form.placement]?.label} · {TIER_LABELS[form.tier]}
                  </div>
                </div>
                <div style={{ ...displayFont, fontSize: '2rem', color: DEEP_BLUE,
                  textShadow: '0 2px 4px rgba(255,255,255,0.8)' }}>
                  ${selectedPrice}
                </div>
              </div>

              {/* ─── Error ─── */}
              {error && (
                <div style={{
                  marginTop: '1rem', padding: '1rem 1.2rem', borderRadius: 16,
                  background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.3)',
                  color: '#cc0000', fontWeight: 600, fontSize: '0.95rem',
                }}>
                  {error}
                </div>
              )}

              {/* ─── Submit ─── */}
              <div style={{ marginTop: '2rem' }}>
                <button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting ? 'Submitting…' : `Submit Application — $${selectedPrice}`}
                </button>
                <p style={{ textAlign: 'center', color: TEXT_MUTED, fontSize: '0.8rem', fontWeight: 600, marginTop: '0.8rem' }}>
                  No payment required now. We'll reach out after reviewing your application.
                </p>
              </div>
            </div>
          </div>
        </form>

        {/* ─── Footer ─── */}
        <footer style={{
          marginTop: '4rem', textAlign: 'center', color: TEXT_MUTED, fontSize: '0.85rem', fontWeight: 600,
        }}>
          <Link to="/" style={{ color: DEEP_BLUE, textDecoration: 'none', fontWeight: 700 }}>LootReef</Link>
          {' · '}
          <Link to="/app" style={{ color: DEEP_BLUE, textDecoration: 'none', fontWeight: 700 }}>Compare Prices</Link>
          {' · '}
          <span>© {new Date().getFullYear()}</span>
        </footer>
      </main>
    </div>
  );
}

// ─── Shared label style ───
const labelStyle = {
  display: 'block',
  fontWeight: 700,
  fontSize: '0.85rem',
  color: TEXT_PRIMARY,
  marginBottom: '0.4rem',
  letterSpacing: '0.02em',
  fontFamily: "'Figtree', sans-serif",
};
