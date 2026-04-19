import React, { useEffect, useRef, useState } from 'react';

// ─── THEME CONSTANTS ───
const BG = '#020e17';
const BG_LIGHT = '#061a2a';
const GREEN = '#00e87a';
const GREEN_DIM = 'rgba(0,232,122,0.15)';
const GREEN_GLOW = '0 0 40px rgba(0,232,122,0.35)';
const GREEN_GLOW_TEXT = '0 0 30px rgba(0,232,122,0.5), 0 0 60px rgba(0,232,122,0.2)';
const RED = '#ff3c3c';
const RED_DIM = 'rgba(255,60,60,0.04)';
const WHITE = '#f0f4f8';
const MUTED = '#7a8ea0';
const GLASS_BG = 'rgba(255,255,255,0.04)';
const GLASS_BORDER = 'rgba(255,255,255,0.08)';
const FONT_DISPLAY = "'Syne', sans-serif";
const FONT_BODY = "'Figtree', sans-serif";

// ─── MARKETPLACE DATA ───
const PLATFORMS = [
  'G2G', 'FunPay', 'Eldorado.gg', 'PlayerAuctions', 'Z2U', 'Gameflip', 'Plati.market'
];

// ─── COMPARISON DATA ───
const COMPARISON_ROWS = [
  { label: 'Grey market price comparison', loot: true, honey: false, lDesc: 'Searches G2G, FunPay, Eldorado & more', hDesc: 'Only mainstream retail stores' },
  { label: 'Game key deals', loot: true, honey: false, lDesc: 'Compares game key prices across 7 platforms', hDesc: 'No game key marketplaces supported' },
  { label: 'In-game currency prices', loot: true, honey: false, lDesc: 'Gold, gems, V-Bucks, and more', hDesc: 'Not applicable' },
  { label: 'Real-time price tracking', loot: true, honey: false, lDesc: 'Live scraping, updated every search', hDesc: 'Cached coupon database' },
  { label: 'Currency conversion', loot: true, honey: false, lDesc: 'Auto-converts to your local currency', hDesc: 'Limited to store currency' },
  { label: 'Bookmark deals', loot: true, honey: false, lDesc: 'Save listings for later', hDesc: 'No bookmarking' },
];

export default function LandingPage() {
  const heroRef = useRef(null);
  const [navVisible, setNavVisible] = useState(false);
  const [featureLit, setFeatureLit] = useState([false, false, false, false]);
  const bookmarkCardRef = useRef(null);
  const [bookmarkHover, setBookmarkHover] = useState(false);

  // ─── INJECT KEYFRAMES + GOOGLE FONTS ───
  useEffect(() => {
    const styleId = 'lootreef-landing-styles';
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Figtree:wght@300;400;500;600;700&display=swap');

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(50px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-80px); }
        to   { opacity: 1; transform: translateX(0); }
      }
      @keyframes slideInRight {
        from { opacity: 0; transform: translateX(80px); }
        to   { opacity: 1; transform: translateX(0); }
      }
      @keyframes bounceArrow {
        0%, 100% { transform: translateY(0); }
        50%      { transform: translateY(14px); }
      }
      @keyframes pulseGlow {
        0%, 100% { text-shadow: 0 0 20px rgba(0,232,122,0.3), 0 0 40px rgba(0,232,122,0.15); }
        50%      { text-shadow: 0 0 40px rgba(0,232,122,0.6), 0 0 80px rgba(0,232,122,0.3); }
      }
      @keyframes floatDot {
        0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
        25%      { transform: translateY(-20px) translateX(10px); opacity: 0.7; }
        50%      { transform: translateY(-10px) translateX(-8px); opacity: 0.4; }
        75%      { transform: translateY(-25px) translateX(5px); opacity: 0.6; }
      }
      @keyframes rotateBorder {
        from { --angle: 0deg; }
        to   { --angle: 360deg; }
      }
      @keyframes fillBookmark {
        from { fill: transparent; }
        to   { fill: #00e87a; }
      }
      @keyframes shimmer {
        0%   { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      @keyframes navSlideDown {
        from { transform: translateY(-100%); opacity: 0; }
        to   { transform: translateY(0); opacity: 1; }
      }
      @keyframes spinGlow {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }

      /* Reveal system */
      [data-reveal] {
        opacity: 0;
        transform: translateY(40px);
        transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
      }
      [data-reveal].active {
        opacity: 1;
        transform: translateY(0);
      }
      [data-reveal="slideLeft"] {
        transform: translateX(-80px);
      }
      [data-reveal="slideLeft"].active {
        transform: translateX(0);
      }
      [data-reveal="slideRight"] {
        transform: translateX(80px);
      }
      [data-reveal="slideRight"].active {
        transform: translateX(0);
      }

      /* Scrollbar */
      .lr-landing::-webkit-scrollbar { width: 6px; }
      .lr-landing::-webkit-scrollbar-track { background: #020e17; }
      .lr-landing::-webkit-scrollbar-thumb { background: rgba(0,232,122,0.25); border-radius: 3px; }

      /* Platform chip hover */
      .lr-chip:hover {
        background: rgba(0,232,122,0.12) !important;
        border-color: rgba(0,232,122,0.4) !important;
        box-shadow: 0 0 20px rgba(0,232,122,0.15);
        transform: translateY(-2px);
      }

      /* CTA button hover */
      .lr-cta:hover {
        box-shadow: 0 0 30px rgba(0,232,122,0.4), 0 0 60px rgba(0,232,122,0.15) !important;
        transform: translateY(-2px);
      }
      .lr-cta:active {
        transform: translateY(0);
      }

      /* Nav link hover */
      .lr-nav-link:hover {
        color: #00e87a !important;
      }

      /* Bookmark card hover */
      .lr-bookmark-card:hover .lr-bookmark-icon path {
        fill: #00e87a;
        transition: fill 0.4s ease;
      }

      /* Glass pill shimmer */
      .lr-shimmer {
        background: linear-gradient(110deg, rgba(0,232,122,0.08) 0%, rgba(0,232,122,0.18) 40%, rgba(0,232,122,0.08) 60%, rgba(0,232,122,0.08) 100%);
        background-size: 200% 100%;
        animation: shimmer 3s ease-in-out infinite;
      }

      /* Comparison row hover */
      .lr-comp-row:hover {
        background: rgba(255,255,255,0.03);
      }

      /* Rotating border for CTA card */
      .lr-rotating-border {
        position: relative;
        border-radius: 24px;
        overflow: hidden;
      }
      .lr-rotating-border::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: conic-gradient(from 0deg, transparent, #00e87a, transparent, transparent);
        animation: spinGlow 4s linear infinite;
        z-index: 0;
      }
      .lr-rotating-border::after {
        content: '';
        position: absolute;
        inset: 2px;
        background: #0a1a28;
        border-radius: 22px;
        z-index: 1;
      }

      @media (max-width: 768px) {
        .lr-comp-grid {
          grid-template-columns: 1fr !important;
          gap: 24px !important;
        }
        .lr-vs-badge-desktop {
          display: none !important;
        }
        .lr-hook-line {
          align-self: center !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
          text-align: center !important;
        }
        .lr-footer-inner {
          flex-direction: column !important;
          gap: 12px !important;
          text-align: center !important;
        }
        .lr-currency-pills {
          flex-direction: column !important;
          align-items: center !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, []);

  // ─── INTERSECTION OBSERVER — SCROLL REVEALS ───
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay') || 0;
            setTimeout(() => {
              entry.target.classList.add('active');
            }, Number(delay));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    const revealEls = document.querySelectorAll('[data-reveal]');
    revealEls.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // ─── NAV VISIBILITY — HERO OBSERVER ───
  useEffect(() => {
    if (!heroRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setNavVisible(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  // ─── FEATURES LIGHTING CHAIN ───
  const featuresRef = useRef(null);
  useEffect(() => {
    if (!featuresRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setFeatureLit(p => [true, p[1], p[2], p[3]]), 0);
          setTimeout(() => setFeatureLit(p => [p[0], true, p[2], p[3]]), 400);
          setTimeout(() => setFeatureLit(p => [p[0], p[1], true, p[3]]), 800);
          setTimeout(() => setFeatureLit(p => [p[0], p[1], p[2], true]), 1300);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(featuresRef.current);
    return () => observer.disconnect();
  }, []);

  // Force page BG
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = BG;
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    return () => { document.body.style.background = prev; };
  }, []);

  // ─── FLOATING DOTS ───
  const dots = Array.from({ length: 8 }, (_, i) => ({
    top: `${10 + Math.random() * 75}%`,
    left: `${5 + Math.random() * 90}%`,
    size: 3 + Math.random() * 5,
    delay: `${i * 0.7}s`,
    duration: `${4 + Math.random() * 4}s`,
  }));

  const sectionPadding = { padding: 'clamp(60px, 10vw, 120px) clamp(20px, 5vw, 80px)' };

  // ─── SVG HELPERS ───
  const CheckIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="9" cy="9" r="9" fill="rgba(0,232,122,0.15)" />
      <path d="M5.5 9.5L7.5 11.5L12.5 6.5" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  const XIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="9" cy="9" r="9" fill="rgba(255,60,60,0.1)" />
      <path d="M6.5 6.5L11.5 11.5M11.5 6.5L6.5 11.5" stroke={RED} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
  const BookmarkSVG = ({ hovered }) => (
    <svg className="lr-bookmark-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ cursor: 'pointer', transition: 'transform 0.2s', transform: hovered ? 'scale(1.15)' : 'scale(1)' }}>
      <path
        d="M5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21L12 17.5L5 21V5Z"
        stroke={GREEN}
        strokeWidth="1.8"
        fill={hovered ? GREEN : 'transparent'}
        style={{ transition: 'fill 0.4s ease' }}
      />
    </svg>
  );
  const ScrollArrow = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ animation: 'bounceArrow 2s ease-in-out infinite' }}>
      <path d="M7 10L12 15L17 10" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div className="lr-landing" style={{ background: BG, color: WHITE, fontFamily: FONT_BODY, minHeight: '100vh', overflowX: 'hidden', position: 'relative' }}>

      {/* ═══════════════════════════════════════════
          1. NAV — fixed, hidden until hero leaves
         ═══════════════════════════════════════════ */}
      {navVisible && (
        <nav style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'rgba(2,14,23,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${GLASS_BORDER}`,
          padding: '0 clamp(20px, 5vw, 80px)',
          animation: 'navSlideDown 0.4s ease-out',
        }}>
          <div style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 64,
          }}>
            <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 22, color: GREEN }}>
              LootReef
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              {['Why Us', 'How it Works', 'LootReef'].map(link => (
                <a key={link} href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} className="lr-nav-link" style={{
                  color: MUTED,
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 500,
                  transition: 'color 0.2s',
                }}>
                  {link}
                </a>
              ))}
              <a href="/app" style={{
                background: GREEN,
                color: BG,
                padding: '8px 22px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}>
                Use Now
              </a>
            </div>
          </div>
        </nav>
      )}

      {/* ═══════════════════════════════════════════
          2. HERO
         ═══════════════════════════════════════════ */}
      <section ref={heroRef} style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
        padding: '0 20px',
      }}>
        {/* Grid background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,232,122,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,232,122,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          zIndex: 0,
        }} />

        {/* Radial green glow */}
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80vw',
          height: '60vh',
          background: 'radial-gradient(ellipse, rgba(0,232,122,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        {/* Floating dots */}
        {dots.map((dot, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: dot.top,
            left: dot.left,
            width: dot.size,
            height: dot.size,
            borderRadius: '50%',
            background: GREEN,
            opacity: 0.3,
            animation: `floatDot ${dot.duration} ease-in-out infinite`,
            animationDelay: dot.delay,
            pointerEvents: 'none',
            zIndex: 1,
          }} />
        ))}

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 800 }}>
          {/* Introducing tag */}
          <div style={{
            display: 'inline-block',
            padding: '6px 18px',
            borderRadius: 100,
            border: `1px solid ${GLASS_BORDER}`,
            background: GLASS_BG,
            fontSize: 13,
            fontWeight: 500,
            color: MUTED,
            marginBottom: 28,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            ✦ Introducing
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 'clamp(3rem, 8vw, 6.5rem)',
            lineHeight: 1,
            margin: '0 0 24px 0',
            letterSpacing: '-0.03em',
          }}>
            <span style={{
              color: GREEN,
              textShadow: GREEN_GLOW_TEXT,
            }}>
              Loot
            </span>
            <span style={{ color: WHITE }}>Reef</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.3rem)',
            color: MUTED,
            maxWidth: 560,
            margin: '0 auto 40px',
            lineHeight: 1.7,
            fontWeight: 400,
          }}>
            Compare prices across 7 grey market gaming marketplaces.
            Find the cheapest game keys, in-game currency, and digital goods — instantly.
          </p>

          {/* CTA */}
          <a href="/app" className="lr-cta" style={{
            display: 'inline-block',
            background: GREEN,
            color: BG,
            padding: '16px 44px',
            borderRadius: 14,
            fontSize: 16,
            fontWeight: 700,
            fontFamily: FONT_DISPLAY,
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            boxShadow: '0 0 20px rgba(0,232,122,0.2)',
          }}>
            Use Now
          </a>
        </div>

        {/* Scroll arrow */}
        <div style={{ position: 'absolute', bottom: 40, zIndex: 2 }}>
          <ScrollArrow />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3. HOOK — diagonal misalignment
         ═══════════════════════════════════════════ */}
      <section id="why-us" style={{
        ...sectionPadding,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <div className="lr-hook-line" data-reveal style={{
          alignSelf: 'flex-end',
          paddingRight: '5%',
          fontFamily: FONT_DISPLAY,
          fontWeight: 800,
          fontSize: 'clamp(2.5rem, 5.5vw, 5.5rem)',
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          color: WHITE,
        }}>
          Stop paying{' '}
          <span style={{
            color: GREEN,
            textShadow: GREEN_GLOW_TEXT,
            position: 'relative',
          }}>
            full price
          </span>
        </div>
        <div className="lr-hook-line" data-reveal data-delay="200" style={{
          alignSelf: 'flex-start',
          paddingLeft: '8%',
          fontFamily: FONT_DISPLAY,
          fontWeight: 800,
          fontSize: 'clamp(2.5rem, 5.5vw, 5.5rem)',
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          color: WHITE,
        }}>
          <span style={{ color: GREEN, fontWeight: 800 }}>LootReef</span>{' '}
          gets it easier
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          4. 7 MARKETPLACES
         ═══════════════════════════════════════════ */}
      <section id="how-it-works" style={{
        ...sectionPadding,
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div data-reveal="slideLeft" style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 'clamp(2rem, 4.5vw, 4rem)',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
          }}>
            Find deals from{' '}
            <span style={{ color: GREEN, textShadow: GREEN_GLOW_TEXT }}>7 marketplaces</span>
          </div>
          <div data-reveal="slideRight" data-delay="150" style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 'clamp(2rem, 4.5vw, 4rem)',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginTop: 4,
            color: MUTED,
          }}>
            in a single click
          </div>
        </div>

        {/* Platform chips */}
        <div data-reveal data-delay="300" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: 14,
          maxWidth: 800,
          margin: '0 auto',
        }}>
          {PLATFORMS.map((p) => (
            <div key={p} className="lr-chip" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '14px 20px',
              borderRadius: 12,
              background: GLASS_BG,
              border: `1px solid ${GLASS_BORDER}`,
              fontSize: 15,
              fontWeight: 500,
              color: WHITE,
              transition: 'all 0.25s ease',
              cursor: 'default',
            }}>
              <span style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: GREEN,
                boxShadow: `0 0 8px ${GREEN}`,
                flexShrink: 0,
              }} />
              {p}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          5. FEATURES — stagger-light words
         ═══════════════════════════════════════════ */}
      <section ref={featuresRef} style={{
        ...sectionPadding,
        textAlign: 'center',
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <div style={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 800,
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          lineHeight: 1.2,
          letterSpacing: '-0.03em',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '0 20px',
        }}>
          {['Deals', 'Codes', 'Live Updates'].map((word, i) => (
            <span key={word} style={{
              color: featureLit[i] ? GREEN : 'rgba(255,255,255,0.15)',
              textShadow: featureLit[i] ? GREEN_GLOW_TEXT : 'none',
              transition: 'color 0.6s ease, text-shadow 0.6s ease',
            }}>
              {word}
              {i < 2 ? <span style={{ color: 'rgba(255,255,255,0.1)', margin: '0 4px' }}> / </span> : ''}
            </span>
          ))}
        </div>
        <div style={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 800,
          fontSize: 'clamp(2rem, 5vw, 4rem)',
          marginTop: 16,
          color: featureLit[3] ? GREEN : 'rgba(255,255,255,0.1)',
          textShadow: featureLit[3] ? GREEN_GLOW_TEXT : 'none',
          animation: featureLit[3] ? 'pulseGlow 2.5s ease-in-out infinite' : 'none',
          transition: 'color 0.6s ease',
        }}>
          All in one
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          6. TRANSLATE & CONVERT
         ═══════════════════════════════════════════ */}
      <section style={{
        ...sectionPadding,
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}>
        {/* Text layout */}
        <div style={{ marginBottom: 16 }}>
          <span data-reveal="slideLeft" style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            color: WHITE,
            letterSpacing: '-0.03em',
          }}>
            Translate
          </span>
          <span data-reveal data-delay="100" style={{
            fontFamily: FONT_BODY,
            fontWeight: 400,
            fontStyle: 'italic',
            fontSize: 'clamp(1.2rem, 2vw, 1.6rem)',
            color: MUTED,
            margin: '0 16px',
          }}>
            and
          </span>
          <span data-reveal="slideRight" data-delay="200" style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            color: WHITE,
            letterSpacing: '-0.03em',
          }}>
            Convert
          </span>
        </div>
        <div data-reveal data-delay="400" style={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 800,
          fontSize: 'clamp(3rem, 7vw, 6rem)',
          color: GREEN,
          letterSpacing: '-0.03em',
          animation: 'pulseGlow 3s ease-in-out infinite',
          marginBottom: 48,
        }}>
          Instantly
        </div>

        {/* Currency demo pills */}
        <div className="lr-currency-pills" data-reveal data-delay="500" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          flexWrap: 'wrap',
          marginBottom: 24,
        }}>
          <div style={{
            padding: '14px 28px',
            borderRadius: 100,
            background: GLASS_BG,
            border: `1px solid ${GLASS_BORDER}`,
            fontSize: 18,
            fontWeight: 600,
            color: WHITE,
            fontFamily: FONT_BODY,
          }}>
            €24.99
          </div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19M19 12L14 7M19 12L14 17" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="lr-shimmer" style={{
            padding: '14px 28px',
            borderRadius: 100,
            border: `1px solid rgba(0,232,122,0.2)`,
            fontSize: 18,
            fontWeight: 600,
            color: GREEN,
            fontFamily: FONT_BODY,
          }}>
            $26.80 USD
          </div>
          <span style={{ color: MUTED, fontSize: 14 }}>/</span>
          <div className="lr-shimmer" style={{
            padding: '14px 28px',
            borderRadius: 100,
            border: `1px solid rgba(0,232,122,0.2)`,
            fontSize: 18,
            fontWeight: 600,
            color: GREEN,
            fontFamily: FONT_BODY,
          }}>
            £21.40 GBP
          </div>
        </div>
        <p data-reveal data-delay="600" style={{
          color: MUTED,
          fontSize: 15,
          fontWeight: 400,
          maxWidth: 400,
          margin: '0 auto',
          lineHeight: 1.6,
        }}>
          Prices shown in your currency. No mental math.
        </p>
      </section>

      {/* ═══════════════════════════════════════════
          7. BOOKMARK
         ═══════════════════════════════════════════ */}
      <section style={{
        ...sectionPadding,
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <div data-reveal style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            margin: 0,
          }}>
            Never lose<br />deals again
          </h2>
          <p style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            color: GREEN,
            textShadow: GREEN_GLOW_TEXT,
            margin: '12px 0 0 0',
          }}>
            Bookmark them.
          </p>
        </div>

        {/* Card stack */}
        <div data-reveal data-delay="200" style={{
          position: 'relative',
          maxWidth: 480,
          margin: '0 auto',
          paddingBottom: 30,
        }}>
          {/* Ghost cards behind */}
          {[2, 1].map((i) => (
            <div key={i} style={{
              position: 'absolute',
              top: i * 12,
              left: i * 8,
              right: -(i * 8),
              height: '100%',
              borderRadius: 16,
              background: 'rgba(255,255,255,0.02)',
              border: `1px solid rgba(255,255,255,0.04)`,
              backdropFilter: 'blur(4px)',
              transform: `scale(${1 - i * 0.03})`,
              opacity: 0.3 + (0.15 * (2 - i)),
              zIndex: 10 - i,
            }} />
          ))}

          {/* Main card */}
          <div
            ref={bookmarkCardRef}
            className="lr-bookmark-card"
            onMouseEnter={() => setBookmarkHover(true)}
            onMouseLeave={() => setBookmarkHover(false)}
            style={{
              position: 'relative',
              zIndex: 12,
              padding: '24px 28px',
              borderRadius: 16,
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid rgba(255,255,255,0.1)`,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              transition: 'border-color 0.3s',
              borderColor: bookmarkHover ? 'rgba(0,232,122,0.3)' : 'rgba(255,255,255,0.1)',
            }}
          >
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: WHITE, marginBottom: 6 }}>
                Valorant Points 1000
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: MUTED,
                  padding: '3px 10px',
                  borderRadius: 6,
                  background: 'rgba(255,255,255,0.06)',
                }}>
                  G2G
                </span>
                <span style={{ fontSize: 18, fontWeight: 700, color: GREEN }}>
                  $4.20
                </span>
              </div>
            </div>
            <BookmarkSVG hovered={bookmarkHover} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          8. VS COMPARISON — LootReef vs Honey
         ═══════════════════════════════════════════ */}
      <section id="lootreef" style={{
        ...sectionPadding,
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <div data-reveal style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
            letterSpacing: '-0.03em',
            margin: 0,
          }}>
            <span style={{ color: GREEN }}>LootReef</span>
            {' '}vs{' '}
            <span style={{ color: RED }}>Honey</span>
          </h2>
        </div>

        <div className="lr-comp-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: 0,
          alignItems: 'start',
          maxWidth: 960,
          margin: '0 auto',
        }}>
          {/* LootReef column */}
          <div data-reveal="slideLeft" style={{
            background: 'rgba(0,232,122,0.04)',
            border: `1px solid rgba(0,232,122,0.15)`,
            borderRadius: 20,
            padding: 28,
            position: 'relative',
          }}>
            {/* Winner badge */}
            <div style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: GREEN,
              color: BG,
              padding: '4px 14px',
              borderRadius: 100,
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              Winner
            </div>
            <div style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 800,
              fontSize: 22,
              color: GREEN,
              marginBottom: 24,
            }}>
              LootReef
            </div>
            {COMPARISON_ROWS.map((row, i) => (
              <div key={i} className="lr-comp-row" style={{
                display: 'flex',
                gap: 12,
                padding: '12px 0',
                borderBottom: i < COMPARISON_ROWS.length - 1 ? `1px solid rgba(0,232,122,0.08)` : 'none',
                alignItems: 'flex-start',
              }}>
                <div style={{ marginTop: 2 }}><CheckIcon /></div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: WHITE, marginBottom: 3 }}>{row.label}</div>
                  <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.4 }}>{row.lDesc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* VS badge — center */}
          <div className="lr-vs-badge-desktop" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: `linear-gradient(135deg, rgba(0,232,122,0.2), rgba(255,60,60,0.15))`,
            border: `1px solid rgba(255,255,255,0.1)`,
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 14,
            color: WHITE,
            margin: '0 -12px',
            boxShadow: '0 0 30px rgba(0,232,122,0.15), 0 0 30px rgba(255,60,60,0.1)',
            flexShrink: 0,
            zIndex: 5,
          }}>
            VS
          </div>

          {/* Honey column */}
          <div data-reveal="slideRight" data-delay="150" style={{
            background: RED_DIM,
            border: `1px solid rgba(255,60,60,0.12)`,
            borderRadius: 20,
            padding: 28,
          }}>
            <div style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 800,
              fontSize: 22,
              color: 'rgba(255,60,60,0.6)',
              marginBottom: 24,
            }}>
              Honey
            </div>
            {COMPARISON_ROWS.map((row, i) => (
              <div key={i} className="lr-comp-row" style={{
                display: 'flex',
                gap: 12,
                padding: '12px 0',
                borderBottom: i < COMPARISON_ROWS.length - 1 ? `1px solid rgba(255,60,60,0.06)` : 'none',
                alignItems: 'flex-start',
              }}>
                <div style={{ marginTop: 2 }}><XIcon /></div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 3 }}>{row.label}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', lineHeight: 1.4 }}>{row.hDesc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom line */}
        <div data-reveal data-delay="300" style={{
          textAlign: 'center',
          marginTop: 48,
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          fontStyle: 'italic',
          fontSize: 'clamp(1.3rem, 3vw, 2rem)',
          color: GREEN,
          textShadow: GREEN_GLOW_TEXT,
        }}>
          LootReef just hits different.
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          9. FINAL CTA — rotating border
         ═══════════════════════════════════════════ */}
      <section style={{
        ...sectionPadding,
        maxWidth: 700,
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <div data-reveal className="lr-rotating-border" style={{
          padding: 3,
        }}>
          <div style={{
            position: 'relative',
            zIndex: 2,
            background: '#0a1a28',
            borderRadius: 22,
            padding: 'clamp(40px, 6vw, 64px)',
            textAlign: 'center',
          }}>
            <h2 style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 800,
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              letterSpacing: '-0.03em',
              margin: '0 0 16px 0',
              color: WHITE,
            }}>
              Ready to stop{' '}
              <span style={{ color: GREEN, textShadow: GREEN_GLOW_TEXT }}>overpaying</span>?
            </h2>
            <p style={{
              color: MUTED,
              fontSize: 15,
              lineHeight: 1.7,
              maxWidth: 440,
              margin: '0 auto 32px',
              fontWeight: 400,
            }}>
              Join thousands of gamers who compare prices across 7 marketplaces before buying.
              No extensions. No sign-up required. Just search and save.
            </p>
            <a href="/app" className="lr-cta" style={{
              display: 'inline-block',
              background: GREEN,
              color: BG,
              padding: '16px 48px',
              borderRadius: 14,
              fontSize: 16,
              fontWeight: 700,
              fontFamily: FONT_DISPLAY,
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 0 20px rgba(0,232,122,0.2)',
            }}>
              Use Now
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          10. FOOTER
         ═══════════════════════════════════════════ */}
      <footer style={{
        borderTop: `1px solid ${GLASS_BORDER}`,
        padding: '32px clamp(20px, 5vw, 80px)',
        marginTop: 40,
      }}>
        <div className="lr-footer-inner" style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 18, color: GREEN }}>
            LootReef
          </span>
          <span style={{ fontSize: 13, color: MUTED }}>
            © {new Date().getFullYear()} LootReef. All rights reserved.
          </span>
          <span style={{ fontSize: 13, color: GREEN, fontWeight: 500 }}>
            ♥ Made for gamers
          </span>
        </div>
      </footer>
    </div>
  );
}
