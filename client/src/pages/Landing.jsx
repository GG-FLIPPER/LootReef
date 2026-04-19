import React, { useEffect, useRef, useState } from 'react';

// ─── COLOR PALETTE (FRUTIGER AERO / WINDOWS 7 GLASS) ───
const AQUA = '#00d4ff'; 
const DEEP_BLUE = '#005f99'; 
const GREEN_AERO = '#55ff77';
const TEXT_PRIMARY = '#0d2847'; 
const TEXT_MUTED = 'rgba(13,40,71,0.7)';

// ─── PURE GLASS PANEL STYLE ───
// Lower opacity background to let the blur show through, strong white highlights for the 3D volume
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

// ─── FRUTIGER AERO SHINE (THE GLARE & REFLECTION) ───
function GlassShine() {
  return (
    <>
      {/* Top curved glare typical of skeuomorphic buttons/glass */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '45%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 100%)',
        borderBottomLeftRadius: '50% 15%',
        borderBottomRightRadius: '50% 15%',
        pointerEvents: 'none',
        zIndex: 1,
      }} />
      
      {/* Diagonal diagonal light sweep */}
      <div style={{
        position: 'absolute',
        top: 0, left: '-100%', right: '-100%', bottom: 0,
        background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.6) 45%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.6) 55%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.6,
        mixBlendMode: 'overlay'
      }} />
    </>
  );
}

// ─── CTA BUTTON STYLE (GLOSSY & TACTILE) ───
const ctaButtonStyle = {
  background: 'linear-gradient(180deg, #00d4ff 0%, #0077ff 100%)',
  border: '1px solid #005f99',
  borderTop: '1px solid #b3ebff',
  boxShadow: '0 8px 24px rgba(0,119,255,0.4), inset 0 20px 20px rgba(255,255,255,0.4), inset 0 -10px 20px rgba(0,0,0,0.2)',
  color: '#ffffff',
  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
  fontWeight: 700,
  display: 'inline-block',
  padding: '1.2rem 3rem',
  borderRadius: 60,
  textDecoration: 'none',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  letterSpacing: '0.02em',
  position: 'relative',
  overflow: 'hidden',
};

// ─── SVG ICONS ───
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 7L6 10L11 4" stroke={DEEP_BLUE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 3L11 11M11 3L3 11" stroke="rgba(255,60,60,1)" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

// ─── INJECTED STYLES ───
const INJECTED_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Figtree:wght@300;400;600;700&display=swap');

@keyframes bounceArrow {
  0%, 100% { transform: rotate(45deg) translateY(0); opacity: 1; }
  50% { transform: rotate(45deg) translateY(6px); opacity: 0.5; }
}
@keyframes pulseGlow {
  0%, 100% { text-shadow: 0 0 20px rgba(255,255,255,0.6); }
  50% { text-shadow: 0 0 40px rgba(255,255,255,1), 0 0 80px rgba(0,212,255,0.6); }
}
@keyframes floatBubble {
  0% { transform: translateY(0) scale(1) translateX(0); }
  50% { transform: translateY(-40px) scale(1.05) translateX(10px); }
  100% { transform: translateY(0) scale(1) translateX(0); }
}
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes spinPulse {
  0% { transform: rotate(0deg); opacity: 1; }
  50% { opacity: 0.8; }
  100% { transform: rotate(360deg); opacity: 1; }
}
@keyframes movingBackground {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Reveal animations */
[data-reveal] { 
  opacity: 0; 
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); 
}
[data-reveal="fadeUp"] { transform: translateY(50px); }
[data-reveal="slideInLeft"] { transform: translateX(-60px); }
[data-reveal="slideInRight"] { transform: translateX(60px); }
[data-reveal].revealed { opacity: 1 !important; transform: none !important; }

/* Stagger delays */
[data-delay="100"] { transition-delay: 100ms; }
[data-delay="200"] { transition-delay: 200ms; }
[data-delay="300"] { transition-delay: 300ms; }
[data-delay="400"] { transition-delay: 400ms; }
[data-delay="500"] { transition-delay: 500ms; }

/* Nav link underline animation */
.nav-link {
  position: relative;
  text-decoration: none;
  color: ${TEXT_PRIMARY};
  font-family: 'Figtree', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  transition: color 0.3s ease;
  padding-bottom: 2px;
  text-shadow: 0 1px 2px rgba(255,255,255,0.4);
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 3px;
  background: ${DEEP_BLUE};
  transition: width 0.3s ease;
  border-radius: 2px;
}
.nav-link:hover {
  color: ${DEEP_BLUE};
}
.nav-link:hover::after {
  width: 100%;
}

/* Bookmark hover */
.bookmark-card {
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
}
.bookmark-card:hover {
  transform: scale(1.04) translateY(-5px) !important;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,1), inset 0 -5px 15px rgba(255,255,255,0.5) !important;
}
.bookmark-card:hover .bm-icon { 
  fill: ${DEEP_BLUE}; 
}

/* Platform chip hover */
.platform-chip {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.platform-chip:hover {
  transform: translateY(-4px) scale(1.05);
  border-color: rgba(255,255,255,1) !important;
  color: ${DEEP_BLUE} !important;
  box-shadow: 0 15px 30px rgba(0,95,153,0.2), inset 0 1px 0 rgba(255,255,255,1) !important;
}

/* Scrollbar styling */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(0,95,153,0.3); border-radius: 4px; border: 1px solid rgba(255,255,255,0.4); }
::-webkit-scrollbar-thumb:hover { background: rgba(0,95,153,0.5); }
`;

// ─── PARTICLES DATA (AERO BUBBLES) ───
const BUBBLES = Array.from({ length: 25 }, (_, i) => ({
  size: 20 + Math.random() * 80,
  left: `${-5 + Math.random() * 110}%`,
  top: `${-5 + Math.random() * 110}%`,
  opacity: 0.4 + Math.random() * 0.5,
  duration: 10 + Math.random() * 15,
  delay: Math.random() * 10,
}));

// ─── MARKETPLACE DATA ───
const MARKETPLACES = [
  { name: 'G2G', logo: '/logos/g2g.png' },
  { name: 'FunPay', logo: '/logos/funpay.png' },
  { name: 'Eldorado', logo: '/logos/eldorado.png' },
  { name: 'PlayerAuctions', logo: '/logos/playerauctions.png' },
  { name: 'Z2U', logo: '/logos/z2u.png' },
  { name: 'Gameflip', logo: '/logos/gameflip.png' },
  { name: 'Plati.market', logo: '/logos/plati.png' }
];

// ─── COMPARISON DATA ───
const LOOTREEF_ROWS = [
  { label: 'Helps & supports creators', desc: 'Revenue goes back to the community' },
  { label: 'Shows all available codes', desc: 'No hidden deals, no pay-to-win placements' },
  { label: 'Finds the actual best deal', desc: 'Real-time prices across 7 platforms' },
  { label: 'Searches grey market platforms', desc: 'G2G, FunPay, Eldorado and more' },
  { label: 'Has morals', desc: "We don't take affiliate cuts that hurt you" },
];

const HONEY_ROWS = [
  { label: 'Steals revenue from creators', desc: 'Replaces affiliate links at checkout' },
  { label: 'Shows only chosen promo codes', desc: 'Paid placements hide better deals' },
  { label: "Doesn't actually find deals", desc: 'Often applies expired or useless codes' },
  { label: 'Only mainstream retail stores', desc: 'Misses the best gaming grey market prices' },
];


export default function LandingPage() {
  const [navVisible, setNavVisible] = useState(false);
  const heroRef = useRef(null);

  // Inject styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = INJECTED_CSS;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  // IntersectionObserver for scroll reveals
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(el => {
        if (el.isIntersecting) {
          el.target.classList.add('revealed');
          observer.unobserve(el.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Nav visibility
  useEffect(() => {
    if (!heroRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setNavVisible(!entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  const sectionPadding = { padding: '6rem 5%', position: 'relative', zIndex: 2 };
  const displayFont = { fontFamily: "'Syne', sans-serif", fontWeight: 800 };
  const bodyFont = { fontFamily: "'Figtree', sans-serif" };

  return (
    <div style={{
      /* RICH AERO BACKGROUND - Deep vibrant cyan into rich aqua/blue, animated */
      background: 'linear-gradient(-45deg, #4facfe 0%, #00f2fe 50%, #43e97b 100%)',
      backgroundSize: '400% 400%',
      animation: 'movingBackground 15s ease infinite',
      color: TEXT_PRIMARY,
      minHeight: '100vh',
      ...bodyFont,
      fontWeight: 400,
      overflowX: 'hidden',
      position: 'relative',
    }}>
      {/* ═══════════ LIQUID AERO ORBS & LIGHTING ═══════════ */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {/* Soft sunlight reflection */}
        <div style={{
          position: 'fixed', width: '150vw', height: '100vh',
          top: '-20vh', left: '-25vw', zIndex: 0,
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 60%)',
          filter: 'blur(40px)'
        }} />
        {/* Spring Green blur bottom left */}
        <div style={{
          position: 'fixed', width: 800, height: 800, borderRadius: '50%',
          bottom: -200, left: -200, zIndex: 0,
          background: 'radial-gradient(circle, rgba(67,233,123,0.6) 0%, transparent 70%)',
          filter: 'blur(100px)'
        }} />
        {/* Deep ocean blue right */}
        <div style={{
          position: 'fixed', width: 900, height: 900, borderRadius: '50%',
          top: '20%', right: -300, zIndex: 0,
          background: 'radial-gradient(circle, rgba(0,95,153,0.5) 0%, transparent 70%)',
          filter: 'blur(120px)'
        }} />

        {/* ─── REAL FRUTIGER AERO BUBBLES ─── */}
        {BUBBLES.map((p, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: p.size, height: p.size,
            borderRadius: '50%',
            /* Liquid bubble styling */
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.1) 40%, transparent 80%)',
            border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: 'inset -5px -5px 15px rgba(255, 255, 255, 0.4), inset 2px 2px 5px rgba(255,255,255,0.8), 0 5px 15px rgba(0,0,0,0.05)',
            opacity: p.opacity,
            left: p.left, top: p.top,
            animation: `floatBubble ${p.duration}s ease-in-out infinite ${p.delay}s`,
            pointerEvents: 'none',
          }} />
        ))}
      </div>

      {/* ═══════════ 1. NAV (THICK GLOSSY BAR) ═══════════ */}
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.8rem 5%',
        opacity: navVisible ? 1 : 0,
        transform: navVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.25) 100%)',
        backdropFilter: 'blur(40px) saturate(200%)',
        WebkitBackdropFilter: 'blur(40px) saturate(200%)',
        borderBottom: '1px solid rgba(255,255,255,0.8)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,1)',
      }}>
        <div style={{ ...displayFont, fontSize: '1.6rem', letterSpacing: '-0.02em', color: TEXT_PRIMARY, textShadow: '0 2px 4px rgba(255,255,255,0.8)' }}>
          <span style={{ color: DEEP_BLUE }}>Loot</span>
          Reef
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#marketplaces" className="nav-link">Marketplaces</a>
          <a href="#features" className="nav-link">Features</a>
          <a href="#compare" className="nav-link">Compare</a>
          <a href="/app" style={{
            ...glassPanel,
            borderRadius: 50,
            padding: '0.6rem 1.6rem',
            color: DEEP_BLUE,
            fontSize: '0.9rem',
            fontWeight: 800,
            textDecoration: 'none',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,1)',
          }}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = '0 10px 25px rgba(0,95,153,0.2), inset 0 1px 0 rgba(255,255,255,1)';
            e.target.style.transform = 'translateY(-2px) scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,1)';
            e.target.style.transform = 'translateY(0) scale(1)';
          }}
          >
            <GlassShine />
            <span style={{ position: 'relative', zIndex: 2 }}>Use Now</span>
          </a>
        </div>
      </nav>

      {/* ═══════════ 2. HERO ═══════════ */}
      <section ref={heroRef} style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1,
      }}>
        {/* Curved light ray overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'conic-gradient(from 180deg at 50% 0%, transparent 160deg, rgba(255,255,255,0.4) 180deg, transparent 200deg)',
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
        }} />

        {/* "Introducing" tag */}
        <div data-reveal="fadeUp" style={{
          ...glassPanel,
          padding: '0.4rem 1.2rem',
          borderRadius: 50,
          fontSize: '0.8rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: DEEP_BLUE,
          marginBottom: '2rem',
          ...bodyFont,
          fontWeight: 800,
          boxShadow: '0 4px 15px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)'
        }}>
          <GlassShine />
          <span style={{ position: 'relative', zIndex: 2 }}>Introducing</span>
        </div>

        {/* Title */}
        <h1 data-reveal="fadeUp" data-delay="100" style={{
          ...displayFont,
          fontSize: 'clamp(5rem, 16vw, 13rem)',
          lineHeight: 0.88,
          letterSpacing: '-0.04em',
          margin: 0,
          position: 'relative',
          color: 'white',
          textShadow: '0 4px 20px rgba(0,95,153,0.3)',
        }}>
          Loot
          <span style={{ color: TEXT_PRIMARY }}>Reef</span>
        </h1>

        {/* Subtitle */}
        <p data-reveal="fadeUp" data-delay="200" style={{
          color: TEXT_PRIMARY,
          maxWidth: 480,
          margin: '2rem auto 3rem',
          fontSize: '1.15rem',
          lineHeight: 1.6,
          ...bodyFont,
          fontWeight: 600,
          textShadow: '0 2px 4px rgba(255,255,255,0.8)'
        }}>
          Compare prices across 7 grey market gaming platforms. Find the cheapest keys, codes, and in-game goods with crystal clarity.
        </p>

        {/* CTA Button */}
        <div data-reveal="fadeUp" data-delay="300" style={{ display: 'inline-block', position: 'relative', borderRadius: 60 }}>
           {/* Glow behind button */}
           <div style={{
             position:'absolute', inset: -10, background: 'rgba(255,255,255,0.8)', filter:'blur(20px)', zIndex: -1, borderRadius: 60
           }} />
           <a href="/app" style={ctaButtonStyle}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05) translateY(-3px)';
              e.target.style.boxShadow = '0 15px 30px rgba(0,119,255,0.5), inset 0 25px 25px rgba(255,255,255,0.6), inset 0 -10px 20px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1) translateY(0)';
              e.target.style.boxShadow = ctaButtonStyle.boxShadow;
            }}
          >
            <GlassShine />
            <span style={{ position: 'relative', zIndex: 2, fontSize: '1.2rem' }}>Start Comparing</span>
          </a>
        </div>

        {/* Scroll arrow */}
        <div style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
        }}>
          <div style={{
            width: 16, height: 16,
            borderRight: `4px solid white`,
            borderBottom: `4px solid white`,
            filter: 'drop-shadow(0 2px 4px rgba(0,95,153,0.4))',
            animation: 'bounceArrow 2s ease-in-out infinite',
          }} />
        </div>
      </section>

      {/* ═══════════ 3. HOOK (THICK TEXT & REFLECTIONS) ═══════════ */}
      <section style={{ ...sectionPadding, padding: '8rem 5%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div data-reveal="fadeUp" style={{
            ...displayFont,
            fontSize: 'clamp(2.8rem, 6vw, 5rem)',
            lineHeight: 1,
            letterSpacing: '-0.03em',
            marginLeft: 'auto',
            textAlign: 'right',
            maxWidth: '90%',
            color: 'white',
            textShadow: '0 4px 15px rgba(0,95,153,0.2)'
          }}>
            Stop paying{' '}
            <span style={{
              color: DEEP_BLUE,
              position: 'relative',
              display: 'inline-block',
              textShadow: '0 2px 4px rgba(255,255,255,0.8)'
            }}>
              full price
            </span>
          </div>
          <div data-reveal="fadeUp" data-delay="200" style={{
            ...displayFont,
            fontSize: 'clamp(2.8rem, 6vw, 5rem)',
            lineHeight: 1,
            letterSpacing: '-0.03em',
            marginRight: 'auto',
            textAlign: 'left',
            paddingLeft: '8%',
            textShadow: '0 2px 4px rgba(255,255,255,0.6)'
          }}>
            <span style={{ color: 'white', fontWeight: 800, textShadow: '0 4px 20px rgba(0,95,153,0.3)' }}>LootReef</span>{' '}gets it easier
          </div>
        </div>
      </section>

      {/* ═══════════ 4. MARKETPLACES ═══════════ */}
      <section id="marketplaces" style={{ ...sectionPadding, textAlign: 'center' }}>
        <div style={{
          ...displayFont,
          fontSize: 'clamp(2rem, 5.5vw, 4.5rem)',
          lineHeight: 1.1,
          marginBottom: '3.5rem',
          textShadow: '0 2px 10px rgba(255,255,255,0.8)'
        }}>
          <div data-reveal="slideInLeft">
            Find deals from{' '}
            <span style={{ color: 'white', fontSize: '1.2em', textShadow: '0 4px 20px rgba(0,95,153,0.3)' }}>7</span> marketplaces
          </div>
          <div data-reveal="slideInRight" data-delay="200">
            in a single click
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 16,
          maxWidth: 900,
          margin: '0 auto',
        }}>
          {MARKETPLACES.map((market, i) => (
            <div key={market.name} className="platform-chip" data-reveal="fadeUp" data-delay={`${i * 100}`} style={{
              ...glassPanel,
              borderRadius: 60,
              padding: '1rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.8rem',
              color: TEXT_PRIMARY,
              fontSize: '1rem',
              fontWeight: 800,
              cursor: 'default',
              minHeight: 64, // to ensure consistent shape when replacing text with images
            }}>
              <GlassShine />
              {market.logo ? (
                <img 
                  src={market.logo} 
                  alt={market.name} 
                  style={{ 
                    height: 28, 
                    maxWidth: 120, 
                    objectFit: 'contain', 
                    position: 'relative', 
                    zIndex: 2,
                    filter: 'drop-shadow(0 2px 4px rgba(255,255,255,0.6))'
                  }} 
                />
              ) : (
                <>
                  <span style={{
                    width: 12, height: 12,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, white, #00d4ff)',
                    boxShadow: '0 2px 5px rgba(0,95,153,0.4)',
                    border: '1px solid white',
                    flexShrink: 0,
                    position: 'relative',
                    zIndex: 2,
                  }} />
                  <span style={{ position: 'relative', zIndex: 2 }}>{market.name}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ 5. DEALS / CODES / LIVE UPDATES ═══════════ */}
      <section id="features" style={{ ...sectionPadding, textAlign: 'center', padding: '8rem 5%' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          maxWidth: '1100px',
          margin: '0 auto 5rem',
        }}>
          {/* Card 1 — Deals */}
          <div data-reveal="fadeUp" style={{ ...glassPanel, padding: '2.5rem', borderRadius: 32, textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
            <GlassShine />
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{
                width: 50, height: 50, borderRadius: 16, background: 'linear-gradient(135deg, #00d4ff, #005f99)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
                boxShadow: '0 10px 20px rgba(0,95,153,0.3), inset 0 2px 2px rgba(255,255,255,0.5)', border: '1px solid white'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '2rem', color: DEEP_BLUE, marginBottom: '0.5rem', textShadow: '0 2px 4px rgba(255,255,255,0.8)' }}>Deals</div>
              <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: TEXT_PRIMARY, flexGrow: 1, marginBottom: '2rem' }}>
                Real-time prices across every platform. Always the lowest.
              </div>
            </div>
            {/* Glossy bottom sweep */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(0deg, rgba(0,212,255,0.1), transparent)', zIndex: 0 }} />
          </div>

          {/* Card 2 — Codes */}
          <div data-reveal="fadeUp" data-delay="100" style={{ ...glassPanel, padding: '2.5rem', borderRadius: 32, textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
            <GlassShine />
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{
                width: 50, height: 50, borderRadius: 16, background: 'linear-gradient(135deg, white, #e0e0e0)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1), inset 0 2px 2px rgba(255,255,255,1)', border: '1px solid #ddd'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={DEEP_BLUE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
                </svg>
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '2rem', color: DEEP_BLUE, marginBottom: '0.5rem', textShadow: '0 2px 4px rgba(255,255,255,0.8)' }}>Codes</div>
              <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: TEXT_PRIMARY, flexGrow: 1, marginBottom: '2rem' }}>
                Every promo code shown. No paid placements, no hidden discounts.
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(0deg, rgba(255,255,255,0.3), transparent)', zIndex: 0 }} />
          </div>

          {/* Card 3 — Live Updates */}
          <div data-reveal="fadeUp" data-delay="200" style={{ ...glassPanel, padding: '2.5rem', borderRadius: 32, textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
            <GlassShine />
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{
                width: 50, height: 50, borderRadius: 16, background: 'linear-gradient(135deg, #55ff77, #00cc44)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
                boxShadow: '0 10px 20px rgba(0,204,68,0.3), inset 0 2px 2px rgba(255,255,255,0.5)', border: '1px solid white',
                animation: 'spinPulse 3s linear infinite'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                </svg>
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '2rem', color: DEEP_BLUE, marginBottom: '0.5rem', textShadow: '0 2px 4px rgba(255,255,255,0.8)' }}>Live Updates</div>
              <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: TEXT_PRIMARY, flexGrow: 1, marginBottom: '2rem' }}>
                Prices refresh constantly. Never miss a deal that just dropped.
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(0deg, rgba(85,255,119,0.15), transparent)', zIndex: 0 }} />
          </div>
        </div>

        <div data-reveal="fadeUp" style={{
          ...displayFont,
          fontSize: 'clamp(3.5rem,8vw,6.5rem)',
          color: 'white',
          textShadow: '0 4px 20px rgba(0,95,153,0.3)',
          animation: 'pulseGlow 3s ease-in-out infinite',
          lineHeight: 1,
        }}>
          All in one
        </div>
      </section>

      {/* ═══════════ 6. TRANSLATE & CONVERT ═══════════ */}
      <section style={{ ...sectionPadding, textAlign: 'center', padding: '6rem 5%' }}>
        <div data-reveal="slideInLeft" style={{
          ...displayFont,
          fontSize: 'clamp(3rem, 7vw, 6rem)',
          lineHeight: 1,
          color: DEEP_BLUE,
          textShadow: '0 2px 6px rgba(255,255,255,0.9)'
        }}>
          Translate
        </div>
        <div data-reveal="fadeUp" style={{
          ...bodyFont,
          fontWeight: 700,
          fontStyle: 'italic',
          fontSize: '1.3rem',
          color: TEXT_PRIMARY,
          margin: '0.5em 0',
        }}>
          and
        </div>
        <div data-reveal="slideInRight" style={{
          ...displayFont,
          fontSize: 'clamp(3rem, 7vw, 6rem)',
          lineHeight: 1,
          color: DEEP_BLUE,
          textShadow: '0 2px 6px rgba(255,255,255,0.9)'
        }}>
          Convert
        </div>
        <div data-reveal="fadeUp" data-delay="400" style={{
          ...displayFont,
          fontSize: 'clamp(5rem, 13vw, 11rem)',
          lineHeight: 0.88,
          color: 'white',
          animation: 'pulseGlow 3s ease-in-out infinite',
          marginTop: '0.4em',
        }}>
          Instantly
        </div>

        {/* Currency demo card */}
        <div data-reveal="fadeUp" data-delay="500" style={{
          ...glassPanel,
          borderRadius: 40,
          maxWidth: 400,
          margin: '4rem auto 1.5rem',
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
        }}>
          <GlassShine />
          {/* Euro price with shimmer */}
          <div style={{
            fontSize: '3rem',
            fontWeight: 800,
            color: DEEP_BLUE,
            ...displayFont,
            backgroundImage: `linear-gradient(90deg, ${DEEP_BLUE} 30%, white 50%, ${DEEP_BLUE} 70%)`,
            backgroundSize: '200% 100%',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            animation: 'shimmer 2s infinite linear',
            position: 'relative',
            zIndex: 2,
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 2px 4px rgba(255,255,255,0.8))'
          }}>
            €24.99
          </div>

          <div style={{ color: DEEP_BLUE, fontSize: '2rem', zIndex: 2, fontWeight: 800 }}>↓</div>

          {/* Result pills */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', zIndex: 2 }}>
            {[['$26.80', 'USD'], ['£21.40', 'GBP']].map(([amount, currency]) => (
              <div key={currency} style={{
                ...glassPanel,
                boxShadow: '0 5px 15px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,1)',
                borderRadius: 50,
                padding: '0.8rem 1.6rem',
                color: DEEP_BLUE,
                fontSize: '1.1rem',
                fontWeight: 800,
              }}>
                <GlassShine />
                <span style={{ position: 'relative', zIndex: 2 }}>
                  {amount} <span style={{ opacity: 0.6, color: TEXT_PRIMARY }}>{currency}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <p data-reveal="fadeUp" style={{
          ...bodyFont,
          fontWeight: 700,
          color: TEXT_PRIMARY,
          fontSize: '1.1rem',
          textShadow: '0 1px 3px rgba(255,255,255,0.7)'
        }}>
          Prices shown in your currency. No mental math.
        </p>
      </section>

      {/* ═══════════ 7. BOOKMARK (GLOSSY DEPTH) ═══════════ */}
      <section style={{ ...sectionPadding, textAlign: 'center', padding: '8rem 5%' }}>
        <h2 data-reveal="fadeUp" style={{
          ...displayFont,
          fontSize: 'clamp(3.5rem,8vw,6.5rem)',
          lineHeight: 0.9,
          margin: '0 0 0.5rem',
          color: 'white',
          textShadow: '0 4px 15px rgba(0,95,153,0.3)'
        }}>
          Never lose<br />deals again
        </h2>
        <div data-reveal="fadeUp" data-delay="100" style={{
          ...displayFont,
          fontSize: 'clamp(1.5rem,3vw,2.5rem)',
          color: DEEP_BLUE,
          marginBottom: '4rem',
          textShadow: '0 2px 4px rgba(255,255,255,0.8)'
        }}>
          Bookmark them.
        </div>

        {/* Card stack deeply blurred & glassy */}
        <div style={{
          position: 'relative',
          height: 120,
          maxWidth: 560,
          margin: '3rem auto 0',
        }}>
          {/* Ghost card 2 (back) */}
          <div data-reveal="fadeUp" style={{
            ...glassPanel,
            position: 'absolute',
            top: 0, bottom: 0, left: '6%', right: '6%',
            transform: 'scale(0.88) translateY(32px)',
            opacity: 0.4,
            zIndex: 1,
          }}>
            <GlassShine />
          </div>

          {/* Ghost card 1 (middle) */}
          <div data-reveal="fadeUp" data-delay="100" style={{
            ...glassPanel,
            position: 'absolute',
            top: 0, bottom: 0, left: '3%', right: '3%',
            transform: 'scale(0.94) translateY(16px)',
            opacity: 0.7,
            zIndex: 2,
          }}>
            <GlassShine />
          </div>

          {/* Main card (front) */}
          <div className="bookmark-card" data-reveal="fadeUp" data-delay="200" style={{
            ...glassPanel,
            position: 'absolute',
            top: 0, bottom: 0, left: 0, right: 0,
            zIndex: 3,
            padding: '2rem 2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 100%)',
          }}>
            <GlassShine />
            
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 800, fontSize: '1.25rem', color: TEXT_PRIMARY, textShadow: '0 2px 4px rgba(255,255,255,0.8)' }}>
                Valorant Points 1000
              </div>
              <div style={{
                ...glassPanel,
                fontSize: '0.85rem',
                color: DEEP_BLUE,
                padding: '4px 14px',
                borderRadius: 50,
                marginTop: 10,
                display: 'inline-block',
                fontWeight: 800,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,1), 0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <GlassShine />
                <span style={{ position: 'relative', zIndex: 2 }}>G2G</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 2 }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '2rem', color: DEEP_BLUE, filter: 'drop-shadow(0 2px 4px rgba(255,255,255,0.9))' }}>
                $4.20
              </span>
              <svg className="bm-icon" width="28" height="32" viewBox="0 0 24 24" style={{ marginLeft: 20, stroke: DEEP_BLUE, fill: 'none', strokeWidth: 2, transition: 'fill 0.3s ease', filter: 'drop-shadow(0 2px 4px rgba(255,255,255,0.5))' }}>
                <path d="M5 2h14a1 1 0 011 1v18l-8-4-8 4V3a1 1 0 011-1z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 8. LOOTREEF VS HONEY ═══════════ */}
      <section id="compare" style={{ ...sectionPadding, padding: '8rem 5%' }}>
        <div data-reveal="fadeUp" style={{
          textTransform: 'uppercase',
          fontSize: '0.9rem',
          letterSpacing: '0.2em',
          color: DEEP_BLUE,
          textAlign: 'center',
          marginBottom: '3rem',
          ...bodyFont,
          fontWeight: 800,
          textShadow: '0 2px 4px rgba(255,255,255,0.8)'
        }}>
          The Comparison
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: '2rem',
          maxWidth: 1100,
          margin: '0 auto',
          alignItems: 'start',
        }}>
          {/* LootReef card */}
          <div data-reveal="slideInLeft" style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 100%)',
            border: `2px solid ${AQUA}`,
            boxShadow: '0 20px 50px rgba(0,212,255,0.2), inset 0 2px 0 rgba(255,255,255,1)',
            padding: '2.5rem',
            position: 'relative'
          }}>
            <GlassShine />
            {/* Glowing winner backdrop */}
            <div style={{
              position:'absolute', top: 0, left: 0, right: 0, height: '100%',
              background: 'linear-gradient(to bottom, rgba(0,212,255,0.1), transparent)', zIndex: 0
            }} />
            
            <div style={{
              position: 'absolute',
              top: 16, right: 16,
              background: 'linear-gradient(180deg, #00d4ff 0%, #0077ff 100%)',
              color: 'white',
              borderRadius: 50,
              padding: '0.4rem 1rem',
              fontSize: '0.8rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              zIndex: 2,
              boxShadow: '0 4px 12px rgba(0,119,255,0.4), inset 0 1px 0 rgba(255,255,255,0.8)'
            }}>
              WINNER
            </div>

            <div style={{
              ...displayFont,
              fontSize: '1.8rem',
              color: DEEP_BLUE,
              marginBottom: '1.5rem',
              position: 'relative',
              zIndex: 2,
              textShadow: '0 2px 4px rgba(255,255,255,0.8)'
            }}>
              LootReef
            </div>

            <div style={{ position: 'relative', zIndex: 2 }}>
              {LOOTREEF_ROWS.map((row, i) => (
                <div key={i} data-reveal="slideInLeft" data-delay={`${i * 100}`} style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '0.8rem 0',
                  borderBottom: i < LOOTREEF_ROWS.length - 1 ? '1px solid rgba(255,255,255,0.5)' : 'none',
                  alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: 26, height: 26, minWidth: 26,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, white, #e0e0e0)',
                    border: `1px solid white`,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1), inset 0 2px 2px rgba(255,255,255,1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 2,
                  }}>
                    <CheckIcon />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: TEXT_PRIMARY }}>{row.label}</div>
                    <div style={{ fontSize: '0.9rem', color: TEXT_MUTED, marginTop: 4, fontWeight: 600 }}>{row.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* VS divider */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            gap: 0,
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              width: 3, height: 80,
              background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.8))',
            }} />
            <div style={{
              ...glassPanel,
              borderRadius: '50%',
              width: 60, height: 60,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 10px 20px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,1)',
              margin: '0.5rem 0'
            }}>
              <GlassShine />
              <div style={{
                ...displayFont,
                fontSize: '1.4rem',
                color: DEEP_BLUE,
                padding: 0,
                position: 'relative',
                zIndex: 2,
                textShadow: '0 2px 4px rgba(255,255,255,0.8)'
              }}>
                VS
              </div>
            </div>
            <div style={{
              width: 3, height: 80,
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.8), transparent)',
            }} />
          </div>

          {/* Honey card */}
          <div data-reveal="slideInRight" style={{
            ...glassPanel,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 100%)',
            border: '1px solid rgba(255,255,255,0.8)',
            padding: '2.5rem',
            opacity: 0.85
          }}>
            <GlassShine />
            <div style={{
              ...displayFont,
              fontSize: '1.8rem',
              color: 'rgba(255,60,60,0.9)',
              marginBottom: '1.5rem',
              position: 'relative',
              zIndex: 2,
              textShadow: '0 2px 4px rgba(255,255,255,0.8)'
            }}>
              Honey
            </div>

            <div style={{ position: 'relative', zIndex: 2 }}>
              {HONEY_ROWS.map((row, i) => (
                <div key={i} data-reveal="slideInRight" data-delay={`${i * 100}`} style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '0.8rem 0',
                  borderBottom: i < HONEY_ROWS.length - 1 ? '1px solid rgba(255,255,255,0.5)' : 'none',
                  alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: 26, height: 26, minWidth: 26,
                    borderRadius: '50%',
                    background: 'white',
                    border: `1px solid rgba(255,60,60,0.3)`,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05), inset 0 2px 2px rgba(255,255,255,1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 2,
                  }}>
                    <CrossIcon />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: TEXT_PRIMARY }}>{row.label}</div>
                    <div style={{ fontSize: '0.9rem', color: TEXT_MUTED, marginTop: 4, fontWeight: 600 }}>{row.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div data-reveal="fadeUp" style={{
          ...displayFont,
          fontStyle: 'italic',
          fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
          color: 'white',
          textShadow: '0 4px 15px rgba(0,95,153,0.3)',
          textAlign: 'center',
          marginTop: '4rem',
        }}>
          LootReef just hits different.
        </div>
      </section>

      {/* ═══════════ 9. FINAL CTA ═══════════ */}
      <section style={{ ...sectionPadding, padding: '4rem 5% 8rem' }}>
        <div style={{
          maxWidth: 900,
          margin: '0 auto',
        }}>
          <div style={{
            ...glassPanel,
            borderRadius: 40,
            padding: '6rem 3rem',
            textAlign: 'center',
            position: 'relative',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.3) 100%)',
            boxShadow: '0 30px 60px rgba(0,95,153,0.15), inset 0 2px 0 rgba(255,255,255,1), inset 0 -10px 20px rgba(255,255,255,0.4)'
          }}>            
            <GlassShine />
            
            <h2 data-reveal="fadeUp" style={{
              ...displayFont,
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              color: DEEP_BLUE,
              margin: '0 0 1rem',
              position: 'relative',
              zIndex: 2,
              textShadow: '0 2px 4px rgba(255,255,255,0.8)'
            }}>
              Ready to stop overpaying?
            </h2>
            <p data-reveal="fadeUp" data-delay="100" style={{
              color: TEXT_PRIMARY,
              ...bodyFont,
              fontWeight: 700,
              maxWidth: 500,
              margin: '0 auto 3rem',
              fontSize: '1.15rem',
              lineHeight: 1.6,
              position: 'relative',
              zIndex: 2,
            }}>
              Join thousands of gamers who never pay full price. Compare prices across every major grey market in seconds.
            </p>
            
            <div data-reveal="fadeUp" data-delay="200" style={{ display: 'inline-block', position: 'relative' }}>
              <div style={{
                position:'absolute', inset: -15, background: 'rgba(255,255,255,0.8)', filter:'blur(20px)', zIndex: -1, borderRadius: 60
              }} />
              <a href="/app" style={ctaButtonStyle}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05) translateY(-3px)';
                  e.target.style.boxShadow = '0 15px 30px rgba(0,119,255,0.5), inset 0 25px 25px rgba(255,255,255,0.6), inset 0 -10px 20px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1) translateY(0)';
                  e.target.style.boxShadow = ctaButtonStyle.boxShadow;
                }}
              >
                <GlassShine />
                <span style={{ position: 'relative', zIndex: 2, fontSize: '1.2rem' }}>Start Comparing</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 10. FOOTER ═══════════ */}
      <footer style={{
        borderTop: '2px solid rgba(255,255,255,0.8)',
        padding: '2.5rem 5%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2,
        flexWrap: 'wrap',
        gap: '1rem',
        background: 'rgba(255,255,255,0.3)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}>
        <div style={{ ...displayFont, fontSize: '1.4rem', color: TEXT_PRIMARY, textShadow: '0 2px 4px rgba(255,255,255,0.8)' }}>
          <span style={{ color: DEEP_BLUE }}>Loot</span>
          Reef
        </div>
        <div style={{ color: TEXT_PRIMARY, fontSize: '0.9rem', fontWeight: 800 }}>
          {new Date().getFullYear()} LootReef. All rights reserved.
        </div>
        <div style={{ color: DEEP_BLUE, fontSize: '1rem', fontWeight: 800, textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}>
          ♥ Made for gamers
        </div>
      </footer>
    </div>
  );
}
