import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Shield, Zap, TrendingDown, Globe, Star,
  ChevronDown, ArrowRight, Sparkles, Eye, Lock,
  ShoppingCart, Layers, BarChart3, RefreshCw
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════
   LOOTREEF — ALTERNATE LANDING CONCEPT
   Aesthetic: Liquid Glass Frutiger Aero (early-2000s revival)
   Tech: React + Vite + Tailwind CSS only + lucide-react icons
   ═══════════════════════════════════════════════════════════════════ */

// ─── INJECTED CSS ────────────────────────────────────────────────
// Tailwind handles layout/spacing; these keyframes + glass utilities
// go beyond what core TW ships.
const AERO_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Syne:wght@700;800&display=swap');

/* ── Keyframe library ── */
@keyframes aeroFloat {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-18px) scale(1.03); }
}
@keyframes aeroFloat2 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  33% { transform: translateY(-12px) rotate(2deg); }
  66% { transform: translateY(-24px) rotate(-1deg); }
}
@keyframes aeroOrb {
  0%   { transform: translate(0, 0) scale(1); }
  25%  { transform: translate(30px, -20px) scale(1.1); }
  50%  { transform: translate(-10px, -40px) scale(0.95); }
  75%  { transform: translate(-30px, -10px) scale(1.05); }
  100% { transform: translate(0, 0) scale(1); }
}
@keyframes shimmerSweep {
  0% { transform: translateX(-100%) rotate(25deg); }
  100% { transform: translateX(200%) rotate(25deg); }
}
@keyframes pulseRing {
  0% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.08); opacity: 1; }
  100% { transform: scale(1); opacity: 0.6; }
}
@keyframes lensFlare {
  0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
  50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
}
@keyframes dropletRise {
  0% { transform: translateY(0) scale(1); opacity: 0.6; }
  50% { opacity: 1; }
  100% { transform: translateY(-120vh) scale(0.3); opacity: 0; }
}
@keyframes bgShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes revealUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes typewriter {
  from { width: 0; }
  to { width: 100%; }
}
@keyframes blink {
  0%, 100% { border-color: transparent; }
  50% { border-color: white; }
}
@keyframes rotateHue {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
}
@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 30px rgba(0, 212, 255, 0.3), 0 0 60px rgba(0, 212, 255, 0.1); }
  50% { box-shadow: 0 0 50px rgba(0, 212, 255, 0.5), 0 0 100px rgba(0, 212, 255, 0.2); }
}

/* ── Utility classes ── */
.aero-float { animation: aeroFloat 6s ease-in-out infinite; }
.aero-float-2 { animation: aeroFloat2 8s ease-in-out infinite; }
.aero-orb { animation: aeroOrb 12s ease-in-out infinite; }
.bg-shift { animation: bgShift 15s ease infinite; background-size: 400% 400%; }
.glow-pulse { animation: glowPulse 3s ease-in-out infinite; }
.reveal-up { animation: revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.scale-in { animation: scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

/* ── Glass surface: the core Frutiger look ── */
.glass-panel {
  background: linear-gradient(135deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.08) 100%);
  border: 1px solid rgba(255,255,255,0.45);
  border-top: 2px solid rgba(255,255,255,0.85);
  border-left: 1.5px solid rgba(255,255,255,0.6);
  backdrop-filter: blur(28px) saturate(170%);
  -webkit-backdrop-filter: blur(28px) saturate(170%);
  box-shadow:
    0 20px 50px rgba(0,0,0,0.12),
    inset 0 1px 0 rgba(255,255,255,0.95),
    inset 0 -6px 16px rgba(255,255,255,0.25);
}

/* Stronger glass for dark-on-dark contexts */
.glass-panel-strong {
  background: linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 100%);
  border: 1px solid rgba(255,255,255,0.6);
  border-top: 2px solid rgba(255,255,255,0.95);
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
  box-shadow:
    0 25px 60px rgba(0,0,0,0.1),
    inset 0 2px 0 rgba(255,255,255,1),
    inset 0 -8px 20px rgba(255,255,255,0.35);
}

/* ── Glossy pill button ── */
.aero-btn {
  background: linear-gradient(180deg, #00d4ff 0%, #0077ff 100%);
  border: 1px solid #005f99;
  border-top: 1px solid rgba(180,235,255,0.8);
  box-shadow:
    0 8px 28px rgba(0,119,255,0.35),
    inset 0 18px 18px rgba(255,255,255,0.35),
    inset 0 -8px 16px rgba(0,0,0,0.18);
  text-shadow: 0 1px 3px rgba(0,0,0,0.35);
  transition: all 0.2s ease;
}
.aero-btn:hover {
  transform: translateY(-2px);
  box-shadow:
    0 12px 36px rgba(0,119,255,0.45),
    inset 0 18px 18px rgba(255,255,255,0.45),
    inset 0 -8px 16px rgba(0,0,0,0.15);
}
.aero-btn:active {
  transform: translateY(1px);
  box-shadow:
    0 4px 16px rgba(0,119,255,0.3),
    inset 0 12px 14px rgba(255,255,255,0.2),
    inset 0 -4px 10px rgba(0,0,0,0.2);
}

/* Secondary ghost button */
.aero-btn-ghost {
  background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.08) 100%);
  border: 1.5px solid rgba(255,255,255,0.5);
  border-top: 2px solid rgba(255,255,255,0.8);
  backdrop-filter: blur(12px);
  box-shadow:
    0 6px 20px rgba(0,0,0,0.08),
    inset 0 1px 0 rgba(255,255,255,0.9);
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
  transition: all 0.25s ease;
}
.aero-btn-ghost:hover {
  background: linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 100%);
  transform: translateY(-2px);
  box-shadow:
    0 10px 30px rgba(0,0,0,0.1),
    inset 0 1px 0 rgba(255,255,255,1);
}

/* ── The curved top-glare that makes glass look 3D ── */
.glass-shine::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 50%;
  background: linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 100%);
  border-bottom-left-radius: 50% 20%;
  border-bottom-right-radius: 50% 20%;
  pointer-events: none;
  z-index: 1;
}

/* ── Shimmer sweep overlay ── */
.shimmer-sweep::after {
  content: '';
  position: absolute;
  top: -50%; left: -50%; right: -50%; bottom: -50%;
  width: 60%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: shimmerSweep 4s ease-in-out infinite;
  pointer-events: none;
  z-index: 2;
}

/* ── Search input glass ── */
.search-glass {
  background: linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.25) 100%);
  border: 2px solid rgba(255,255,255,0.7);
  border-top: 3px solid rgba(255,255,255,0.95);
  backdrop-filter: blur(24px) saturate(150%);
  box-shadow:
    0 15px 40px rgba(0,0,0,0.1),
    inset 0 2px 0 rgba(255,255,255,1),
    inset 0 -4px 12px rgba(255,255,255,0.3);
}
.search-glass:focus-within {
  border-color: rgba(0, 212, 255, 0.6);
  box-shadow:
    0 15px 40px rgba(0,0,0,0.1),
    0 0 0 4px rgba(0, 212, 255, 0.15),
    inset 0 2px 0 rgba(255,255,255,1),
    inset 0 -4px 12px rgba(255,255,255,0.3);
}

/* ── Feature card ── */
.feature-card {
  transition: transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.35s ease;
}
.feature-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow:
    0 30px 60px rgba(0,0,0,0.15),
    inset 0 2px 0 rgba(255,255,255,1),
    inset 0 -8px 20px rgba(255,255,255,0.4) !important;
}

/* ── Hero selector tab ── */
.hero-tab {
  transition: all 0.3s ease;
}
.hero-tab.active {
  background: linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 100%);
  border-color: rgba(255,255,255,0.8);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,1);
}
.hero-tab:not(.active):hover {
  background: rgba(255,255,255,0.15);
}

/* ── Water droplet particles ── */
.droplet {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(0,212,255,0.3));
  box-shadow: inset 0 -2px 4px rgba(0,0,0,0.1), 0 2px 8px rgba(0,212,255,0.2);
  animation: dropletRise linear infinite;
  pointer-events: none;
}

/* ── Prevent overflow ── */
.overflow-clip { overflow: clip; }
`;

// ─── FLOATING BUBBLES / DROPLETS ──────────────────────────────────
function AeroBubbles({ count = 20 }) {
  const bubbles = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 12 + 4,
      left: Math.random() * 100,
      delay: Math.random() * 15,
      duration: Math.random() * 12 + 10,
      opacity: Math.random() * 0.4 + 0.15,
    }))
  ).current;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="droplet"
          style={{
            width: b.size,
            height: b.size,
            left: `${b.left}%`,
            bottom: '-5%',
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
            opacity: b.opacity,
          }}
        />
      ))}
    </div>
  );
}

// ─── LENS FLARE ELEMENT ───────────────────────────────────────────
function LensFlare({ className = '' }) {
  return (
    <div className={`absolute pointer-events-none ${className}`} aria-hidden="true">
      <div
        className="w-32 h-32 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(0,212,255,0.3) 30%, transparent 70%)',
          filter: 'blur(8px)',
          animation: 'lensFlare 8s ease-in-out infinite',
        }}
      />
    </div>
  );
}

// ─── ORB DECORATION ───────────────────────────────────────────────
function GlowOrb({ size = 200, color = 'cyan', className = '', delay = '0s' }) {
  const colors = {
    cyan: 'from-cyan-400/40 to-blue-500/20',
    blue: 'from-blue-400/40 to-indigo-500/20',
    teal: 'from-teal-400/30 to-cyan-500/20',
    white: 'from-white/30 to-white/5',
  };
  return (
    <div
      className={`absolute rounded-full bg-gradient-to-br ${colors[color] || colors.cyan} blur-3xl aero-orb pointer-events-none ${className}`}
      style={{ width: size, height: size, animationDelay: delay }}
      aria-hidden="true"
    />
  );
}

// ─── GLASS SHINE OVERLAY (skeuomorphic curved highlight) ─────────
function GlassShine() {
  return (
    <>
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none z-[1]"
        style={{
          height: '48%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 100%)',
          borderBottomLeftRadius: '50% 18%',
          borderBottomRightRadius: '50% 18%',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.5) 45%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.5) 55%, transparent 65%)',
          opacity: 0.5,
          mixBlendMode: 'overlay',
        }}
      />
    </>
  );
}

// ─── MARKETPLACE PRICE CARD (Floating demo card) ──────────────────
function PriceCard({ seller, platform, price, rating, delay = '0s', className = '' }) {
  return (
    <div
      className={`glass-panel rounded-2xl p-4 w-56 relative overflow-hidden feature-card ${className}`}
      style={{ animationDelay: delay }}
    >
      <GlassShine />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-sky-900/70 tracking-wider uppercase">{platform}</span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-sky-900/80">{rating}</span>
          </div>
        </div>
        <p className="text-sm font-semibold text-sky-950 truncate">{seller}</p>
        <div className="flex items-end justify-between mt-3">
          <span className="text-2xl font-extrabold text-sky-900" style={{ textShadow: '0 1px 2px rgba(255,255,255,0.5)' }}>
            ${price}
          </span>
          <button className="aero-btn text-xs text-white font-bold px-3 py-1.5 rounded-full cursor-pointer">
            View
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── STAT BUBBLE ──────────────────────────────────────────────────
function StatBubble({ icon: Icon, value, label, delay = '0s' }) {
  return (
    <div
      className="glass-panel rounded-3xl px-6 py-5 text-center relative overflow-hidden feature-card"
      style={{ animationDelay: delay }}
    >
      <GlassShine />
      <div className="relative z-10">
        <div className="w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.25) 0%, rgba(0,119,255,0.15) 100%)',
            border: '1px solid rgba(0,212,255,0.3)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)',
          }}
        >
          <Icon className="w-6 h-6 text-sky-700" />
        </div>
        <p className="text-2xl font-extrabold text-sky-950" style={{ textShadow: '0 1px 2px rgba(255,255,255,0.5)' }}>
          {value}
        </p>
        <p className="text-sm text-sky-800/70 font-medium mt-1">{label}</p>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════
//  HERO TREATMENT A — "THE REEF"
//  Immersive full-bleed gradient ocean with floating glass search
//  bar, orbiting price cards, and water droplet particles
// ═══════════════════════════════════════════════════════════════════
function HeroA() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-clip">
      {/* Background: Deep ocean gradient */}
      <div
        className="absolute inset-0 bg-shift"
        style={{
          background: 'linear-gradient(135deg, #0a2342 0%, #0d4f6e 20%, #00a4cc 45%, #43e8d8 65%, #8dd8f8 80%, #bde8ff 95%)',
          backgroundSize: '400% 400%',
        }}
      />

      {/* Cloud/bokeh texture overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 600px 400px at 20% 30%, rgba(255,255,255,0.15) 0%, transparent 70%),
          radial-gradient(ellipse 500px 500px at 80% 60%, rgba(255,255,255,0.1) 0%, transparent 60%),
          radial-gradient(ellipse 800px 300px at 50% 10%, rgba(255,255,255,0.12) 0%, transparent 50%)
        `,
      }} />

      {/* Glowing orbs */}
      <GlowOrb size={350} color="cyan" className="top-[10%] left-[5%]" />
      <GlowOrb size={250} color="blue" className="top-[60%] right-[10%]" delay="3s" />
      <GlowOrb size={180} color="teal" className="bottom-[15%] left-[30%]" delay="6s" />
      <GlowOrb size={120} color="white" className="top-[20%] right-[25%]" delay="2s" />

      {/* Water droplets */}
      <AeroBubbles count={25} />

      {/* Lens flares */}
      <LensFlare className="top-[15%] right-[20%]" />
      <LensFlare className="bottom-[25%] left-[15%]" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass-panel rounded-full px-5 py-2 mb-8 relative overflow-hidden">
          <GlassShine />
          <Sparkles className="w-4 h-4 text-cyan-300 relative z-10" />
          <span className="text-sm font-semibold text-white relative z-10" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
            7 Marketplaces · One Search
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-6xl md:text-8xl font-extrabold text-white mb-6 leading-[0.95] tracking-tight"
          style={{
            fontFamily: "'Syne', sans-serif",
            textShadow: '0 4px 20px rgba(0,0,0,0.25), 0 1px 0 rgba(255,255,255,0.3)',
          }}
        >
          Dive Into
          <br />
          <span className="bg-gradient-to-r from-cyan-200 via-white to-teal-200 bg-clip-text text-transparent"
            style={{ filter: 'drop-shadow(0 2px 10px rgba(0,212,255,0.4))' }}>
            Better Prices
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-xl md:text-2xl text-white/85 max-w-2xl mx-auto mb-10 font-light leading-relaxed"
          style={{ fontFamily: "'Outfit', sans-serif", textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
        >
          LootReef scans every major gaming marketplace in real-time.
          <br className="hidden md:block" />
          Compare prices, find deals, buy with confidence.
        </p>

        {/* Glass Search Bar */}
        <div className="search-glass rounded-full max-w-2xl mx-auto flex items-center gap-3 px-6 py-4 mb-10 relative overflow-hidden">
          <GlassShine />
          <Search className="w-6 h-6 text-sky-700/70 relative z-10 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search for WoW Gold, Valorant Accounts, Fortnite V-Bucks..."
            className="flex-1 bg-transparent outline-none text-sky-950 placeholder:text-sky-700/50 text-lg font-medium relative z-10"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          />
          <button className="aero-btn text-white font-bold px-6 py-2.5 rounded-full relative z-10 cursor-pointer text-sm whitespace-nowrap">
            Search Reef
          </button>
        </div>

        {/* Platform pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {['G2G', 'Z2U', 'FunPay', 'Eldorado', 'IGVault', 'PlayerAuctions', 'Kinguin'].map((p, i) => (
            <span
              key={p}
              className="glass-panel rounded-full px-4 py-2 text-sm font-semibold text-white/90 relative overflow-hidden cursor-pointer feature-card"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)', animationDelay: `${i * 0.05}s` }}
            >
              <GlassShine />
              <span className="relative z-10">{p}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Floating price cards */}
      <div className="absolute top-[18%] left-[3%] hidden xl:block aero-float" style={{ animationDelay: '0s' }}>
        <PriceCard seller="GoldKing_EU" platform="G2G" price="12.49" rating="4.9" />
      </div>
      <div className="absolute top-[35%] right-[2%] hidden xl:block aero-float" style={{ animationDelay: '2s' }}>
        <PriceCard seller="ValorantPro" platform="FunPay" price="24.99" rating="5.0" />
      </div>
      <div className="absolute bottom-[20%] left-[5%] hidden xl:block aero-float-2" style={{ animationDelay: '4s' }}>
        <PriceCard seller="AccountVault" platform="Eldorado" price="8.75" rating="4.8" />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="glass-panel rounded-full p-3 relative overflow-hidden cursor-pointer feature-card">
          <GlassShine />
          <ChevronDown className="w-5 h-5 text-white relative z-10 animate-bounce" />
        </div>
      </div>
    </section>
  );
}


// ═══════════════════════════════════════════════════════════════════
//  HERO TREATMENT B — "GLASS COMMAND CENTER"
//  Split layout with a large glass terminal/dashboard mockup on
//  the right, strong typographic hierarchy on the left
// ═══════════════════════════════════════════════════════════════════
function HeroB() {
  const games = ['WoW Classic Gold', 'Valorant Account', 'Fortnite V-Bucks', 'Lost Ark Gold', 'Diablo IV Items'];
  const [currentGame, setCurrentGame] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrentGame((p) => (p + 1) % games.length), 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-clip">
      {/* Background */}
      <div
        className="absolute inset-0 bg-shift"
        style={{
          background: 'linear-gradient(160deg, #031b30 0%, #073b5a 25%, #00738a 50%, #0fa7b5 70%, #6dd5ed 90%, #c3f0ff 100%)',
          backgroundSize: '400% 400%',
        }}
      />

      {/* Bokeh */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(circle 300px at 10% 80%, rgba(0,212,255,0.15), transparent),
          radial-gradient(circle 400px at 90% 20%, rgba(255,255,255,0.08), transparent),
          radial-gradient(circle 250px at 60% 70%, rgba(67,232,216,0.1), transparent)
        `,
      }} />

      <GlowOrb size={300} color="cyan" className="top-[5%] right-[10%]" />
      <GlowOrb size={200} color="blue" className="bottom-[10%] left-[5%]" delay="4s" />
      <AeroBubbles count={15} />

      {/* Content grid */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 px-6 lg:px-12 py-20">
        {/* Left: Copy */}
        <div className="flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-6 w-fit relative overflow-hidden">
            <GlassShine />
            <Lock className="w-3.5 h-3.5 text-cyan-300 relative z-10" />
            <span className="text-xs font-semibold text-white/90 relative z-10" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
              Trusted by 12K+ Gamers
            </span>
          </div>

          <h1
            className="text-5xl md:text-7xl font-extrabold text-white mb-2 leading-[0.95] tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif", textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
          >
            Every Market.
          </h1>
          <h1
            className="text-5xl md:text-7xl font-extrabold mb-6 leading-[0.95] tracking-tight"
            style={{
              fontFamily: "'Syne', sans-serif",
              background: 'linear-gradient(90deg, #00d4ff, #43e8d8, #8dd8f8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 3px 12px rgba(0,212,255,0.3))',
            }}
          >
            One Search.
          </h1>

          <p className="text-lg text-white/80 max-w-md mb-8 leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif", textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
            Stop tab-hopping between G2G, Z2U, FunPay, and Eldorado.
            LootReef aggregates every listing so you always get the best price — guaranteed.
          </p>

          {/* CTA row */}
          <div className="flex flex-wrap gap-4">
            <a href="/app" className="aero-btn text-white font-bold px-8 py-3.5 rounded-full text-lg inline-flex items-center gap-2 no-underline cursor-pointer">
              Start Searching <ArrowRight className="w-5 h-5" />
            </a>
            <button className="aero-btn-ghost text-white font-semibold px-6 py-3.5 rounded-full text-lg inline-flex items-center gap-2 cursor-pointer">
              <Eye className="w-5 h-5" /> Watch Demo
            </button>
          </div>

          {/* Trust strip */}
          <div className="flex items-center gap-6 mt-10">
            <div className="flex -space-x-2">
              {[0,1,2,3,4].map((i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 border-white/50 relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, hsl(${180 + i * 25}, 70%, 60%) 0%, hsl(${200 + i * 25}, 60%, 40%) 100%)`,
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(0,0,0,0.15)',
                  }}
                >
                  <GlassShine />
                </div>
              ))}
            </div>
            <p className="text-sm text-white/70" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
              <span className="font-bold text-white">4.9★</span> from 3,200+ reviews
            </p>
          </div>
        </div>

        {/* Right: Glass Dashboard mockup */}
        <div className="relative flex items-center justify-center">
          <div className="glass-panel-strong rounded-3xl p-6 w-full max-w-lg relative overflow-hidden glow-pulse">
            <GlassShine />

            {/* Dashboard header */}
            <div className="relative z-10 flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400/80" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)' }} />
                <div className="w-3 h-3 rounded-full bg-amber-400/80" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)' }} />
                <div className="w-3 h-3 rounded-full bg-emerald-400/80" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)' }} />
              </div>
              <span className="text-xs text-sky-800/60 font-medium">lootreef.com/app</span>
            </div>

            {/* Fake search */}
            <div className="relative z-10 glass-panel rounded-2xl px-4 py-3 flex items-center gap-3 mb-5">
              <Search className="w-5 h-5 text-sky-700/60" />
              <span className="text-sky-950 font-medium" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {games[currentGame]}
              </span>
              <span className="ml-auto w-2 h-5 bg-cyan-500/60 rounded animate-pulse" />
            </div>

            {/* Fake results */}
            <div className="relative z-10 space-y-3">
              {[
                { platform: 'G2G', seller: 'GoldMaster', price: '11.24', pct: '-18%', color: 'emerald' },
                { platform: 'Eldorado', seller: 'LootVault', price: '12.99', pct: '-12%', color: 'emerald' },
                { platform: 'Z2U', seller: 'FastCoins', price: '13.50', pct: '-9%', color: 'amber' },
                { platform: 'FunPay', seller: 'CoinKing', price: '14.75', pct: 'avg', color: 'sky' },
              ].map((r, i) => (
                <div key={i} className="glass-panel rounded-xl px-4 py-3 flex items-center gap-3 relative overflow-hidden">
                  <GlassShine />
                  <div className="relative z-10 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-sky-700/70 uppercase tracking-wider">{r.platform}</span>
                      <span className="text-xs text-sky-900/60">· {r.seller}</span>
                    </div>
                  </div>
                  <div className="relative z-10 text-right">
                    <span className="text-lg font-extrabold text-sky-950">${r.price}</span>
                    <span className={`ml-2 text-xs font-bold ${r.color === 'emerald' ? 'text-emerald-600' : r.color === 'amber' ? 'text-amber-600' : 'text-sky-500'}`}>
                      {r.pct}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom bar */}
            <div className="relative z-10 flex items-center justify-between mt-5 pt-4 border-t border-white/30">
              <span className="text-xs text-sky-800/60 font-medium">4 marketplaces scanned</span>
              <span className="text-xs font-bold text-emerald-600">Best: $11.24 (−18%)</span>
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute -top-4 -right-4 glass-panel rounded-2xl px-4 py-3 aero-float hidden lg:block relative overflow-hidden">
            <GlassShine />
            <div className="relative z-10 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              <div>
                <p className="text-xs font-bold text-sky-950">Buyer Protected</p>
                <p className="text-[10px] text-sky-800/60">Every transaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


// ═══════════════════════════════════════════════════════════════════
//  HERO TREATMENT C — "CHROME MONOLITH"
//  Centered vertical stack with a massive glowing headline,
//  animated stat counters in chrome bubbles, and a dramatic
//  radial gradient vignette
// ═══════════════════════════════════════════════════════════════════
function HeroC() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-clip">
      {/* Background: dark-to-bright radial burst */}
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(ellipse 120% 100% at 50% 40%, #00d4ff22 0%, transparent 50%),
          radial-gradient(ellipse 80% 60% at 50% 50%, #0fa7b540 0%, transparent 60%),
          linear-gradient(180deg, #021a2e 0%, #053b58 30%, #0a6e8a 60%, #1aa3bf 80%, #7dd3e8 100%)
        `,
      }} />

      {/* Chrome ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full pointer-events-none"
        style={{
          background: 'transparent',
          border: '2px solid rgba(255,255,255,0.1)',
          boxShadow: '0 0 80px rgba(0,212,255,0.1), inset 0 0 80px rgba(0,212,255,0.05)',
          animation: 'pulseRing 6s ease-in-out infinite',
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[550px] md:h-[550px] rounded-full pointer-events-none"
        style={{
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 0 60px rgba(0,212,255,0.08)',
          animation: 'pulseRing 6s ease-in-out infinite 1s',
        }}
      />

      <GlowOrb size={400} color="cyan" className="top-[20%] left-1/2 -translate-x-1/2" />
      <AeroBubbles count={18} />
      <LensFlare className="top-[8%] left-[45%]" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Floating badge */}
        <div className="inline-flex items-center gap-2 glass-panel rounded-full px-5 py-2 mb-8 relative overflow-hidden">
          <GlassShine />
          <Globe className="w-4 h-4 text-cyan-300 relative z-10" />
          <span className="text-sm font-semibold text-white relative z-10" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
            The Gaming Price Aggregator
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-7xl md:text-9xl font-black text-white mb-4 leading-[0.9] tracking-tighter"
          style={{
            fontFamily: "'Syne', sans-serif",
            textShadow: '0 0 40px rgba(0,212,255,0.4), 0 4px 20px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.2)',
          }}
        >
          LOOT
          <span
            className="block"
            style={{
              background: 'linear-gradient(90deg, #00d4ff, #43e8d8, #ffffff, #43e8d8, #00d4ff)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'bgShift 6s ease infinite',
              filter: 'drop-shadow(0 4px 15px rgba(0,212,255,0.35))',
            }}
          >
            REEF
          </span>
        </h1>

        <p
          className="text-xl md:text-2xl text-white/80 max-w-xl mx-auto mb-12 leading-relaxed"
          style={{ fontFamily: "'Outfit', sans-serif", textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
        >
          One search. Seven marketplaces. Always the lowest price
          on gaming currency, accounts, and digital items.
        </p>

        {/* Stat bubbles row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
          <StatBubble icon={Layers} value="7" label="Marketplaces" delay="0s" />
          <StatBubble icon={BarChart3} value="2M+" label="Listings" delay="0.1s" />
          <StatBubble icon={TrendingDown} value="−23%" label="Avg Savings" delay="0.2s" />
          <StatBubble icon={RefreshCw} value="<5min" label="Scan Speed" delay="0.3s" />
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/app" className="aero-btn text-white font-bold px-10 py-4 rounded-full text-lg inline-flex items-center gap-3 no-underline cursor-pointer">
            <Search className="w-5 h-5" /> Search the Reef
          </a>
          <button className="aero-btn-ghost text-white font-semibold px-8 py-4 rounded-full text-lg inline-flex items-center gap-2 cursor-pointer">
            How It Works <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}


// ═══════════════════════════════════════════════════════════════════
//  FEATURE HIGHLIGHT ROW
// ═══════════════════════════════════════════════════════════════════
function FeatureRow() {
  const features = [
    {
      icon: Search,
      title: 'Universal Search',
      desc: 'One query searches G2G, Z2U, FunPay, Eldorado, and more simultaneously. No more tab-hopping.',
      gradient: 'from-cyan-400/30 to-blue-500/20',
    },
    {
      icon: TrendingDown,
      title: 'Price Intelligence',
      desc: 'Real-time price comparison across every marketplace. See historical trends and get alert when prices drop.',
      gradient: 'from-emerald-400/30 to-teal-500/20',
    },
    {
      icon: Shield,
      title: 'Verified Sellers',
      desc: 'Cross-referenced seller ratings from multiple platforms. Trade with confidence, backed by marketplace guarantees.',
      gradient: 'from-violet-400/30 to-blue-500/20',
    },
    {
      icon: Zap,
      title: 'Instant Delivery',
      desc: 'Direct links to the best offers. Click through and complete your purchase in under 60 seconds.',
      gradient: 'from-amber-400/30 to-orange-500/20',
    },
  ];

  return (
    <section className="relative py-24 px-4 overflow-clip">
      {/* Background continuation */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #0a6e8a 0%, #0d4f6e 30%, #073b5a 60%, #042d4a 100%)',
      }} />

      <GlowOrb size={250} color="teal" className="top-[10%] left-[0%]" delay="2s" />
      <GlowOrb size={200} color="blue" className="bottom-[10%] right-[5%]" delay="5s" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-6 relative overflow-hidden">
            <GlassShine />
            <Sparkles className="w-4 h-4 text-cyan-300 relative z-10" />
            <span className="text-xs font-semibold text-white/90 relative z-10 uppercase tracking-wider"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
              Why LootReef
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-extrabold text-white mb-4"
            style={{ fontFamily: "'Syne', sans-serif", textShadow: '0 3px 15px rgba(0,0,0,0.25)' }}
          >
            Your Unfair Advantage
          </h2>
          <p className="text-lg text-white/65 max-w-lg mx-auto" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Every feature built to save you money and time on digital gaming purchases.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="glass-panel rounded-3xl p-6 relative overflow-hidden feature-card group cursor-pointer"
            >
              <GlassShine />
              <div className="relative z-10">
                {/* Icon bubble */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 bg-gradient-to-br ${f.gradient} relative overflow-hidden`}
                  style={{
                    border: '1px solid rgba(255,255,255,0.4)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), 0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  <GlassShine />
                  <f.icon className="w-7 h-7 text-white relative z-10" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }} />
                </div>

                <h3
                  className="text-lg font-bold text-white mb-2"
                  style={{ textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
                >
                  {f.title}
                </h3>
                <p className="text-sm text-white/65 leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {f.desc}
                </p>

                {/* Arrow that appears on hover */}
                <div className="mt-4 flex items-center gap-1 text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-semibold">Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


// ═══════════════════════════════════════════════════════════════════
//  BOTTOM CTA
// ═══════════════════════════════════════════════════════════════════
function BottomCTA() {
  return (
    <section className="relative py-24 px-4 overflow-clip">
      {/* Background */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #042d4a 0%, #021a2e 50%, #010e1a 100%)',
      }} />

      <GlowOrb size={350} color="cyan" className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div className="glass-panel-strong rounded-[2.5rem] p-12 md:p-16 relative overflow-hidden glow-pulse">
          <GlassShine />

          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto mb-8 rounded-3xl flex items-center justify-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(0,212,255,0.3) 0%, rgba(0,119,255,0.2) 100%)',
                border: '2px solid rgba(255,255,255,0.4)',
                boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.7), 0 8px 24px rgba(0,212,255,0.2)',
              }}
            >
              <GlassShine />
              <ShoppingCart className="w-10 h-10 text-white relative z-10" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
            </div>

            <h2
              className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight"
              style={{ fontFamily: "'Syne', sans-serif", textShadow: '0 3px 15px rgba(0,0,0,0.25)' }}
            >
              Ready to Save on
              <br />
              <span
                style={{
                  background: 'linear-gradient(90deg, #00d4ff, #43e8d8, #8dd8f8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 2px 8px rgba(0,212,255,0.3))',
                }}
              >
                Every Purchase?
              </span>
            </h2>

            <p className="text-lg text-white/70 max-w-md mx-auto mb-10" style={{ fontFamily: "'Outfit', sans-serif", textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
              Join thousands of gamers who never overpay. Free to use, no sign-up required.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a href="/app" className="aero-btn text-white font-bold px-10 py-4 rounded-full text-lg inline-flex items-center gap-3 no-underline cursor-pointer">
                <Search className="w-5 h-5" /> Start Comparing Now
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              {[
                { icon: Shield, label: 'Secure' },
                { icon: Globe, label: 'Global' },
                { icon: Zap, label: 'Instant' },
                { icon: Lock, label: 'Private' },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2 text-white/50">
                  <b.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


// ═══════════════════════════════════════════════════════════════════
//  NAVBAR
// ═══════════════════════════════════════════════════════════════════
function AeroNav() {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
      <div className="glass-panel-strong rounded-full px-6 py-3 flex items-center justify-between relative overflow-hidden">
        <GlassShine />
        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #00d4ff 0%, #0077ff 100%)',
              border: '1px solid rgba(255,255,255,0.4)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 8px rgba(0,119,255,0.3)',
            }}
          >
            <GlassShine />
            <span className="text-white font-black text-sm relative z-10" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>L</span>
          </div>
          <span className="text-lg font-extrabold text-sky-950 hidden sm:block" style={{ fontFamily: "'Syne', sans-serif", textShadow: '0 1px 2px rgba(255,255,255,0.5)' }}>
            LootReef
          </span>
        </div>

        {/* Links */}
        <div className="relative z-10 hidden md:flex items-center gap-6">
          {['Features', 'Pricing', 'Blog'].map((l) => (
            <a key={l} href="#" className="text-sm font-semibold text-sky-900/80 hover:text-sky-700 transition-colors no-underline"
              style={{ fontFamily: "'Outfit', sans-serif", textShadow: '0 1px 2px rgba(255,255,255,0.4)' }}>
              {l}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="relative z-10">
          <a href="/app" className="aero-btn text-white font-bold px-5 py-2 rounded-full text-sm inline-flex items-center gap-1.5 no-underline cursor-pointer">
            <Search className="w-4 h-4" /> Search
          </a>
        </div>
      </div>
    </nav>
  );
}


// ═══════════════════════════════════════════════════════════════════
//  MAIN COMPONENT — HERO SWITCHER
// ═══════════════════════════════════════════════════════════════════
export default function LandingAlt() {
  const [activeHero, setActiveHero] = useState('A');

  useEffect(() => {
    // Inject CSS
    const id = 'aero-landing-css';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = AERO_CSS;
      document.head.appendChild(style);
    }
    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, []);

  const heroes = { A: HeroA, B: HeroB, C: HeroC };
  const ActiveHero = heroes[activeHero];

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <AeroNav />

      {/* Hero switcher tabs */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-2">
        {[
          { key: 'A', label: 'The Reef' },
          { key: 'B', label: 'Command Center' },
          { key: 'C', label: 'Chrome Monolith' },
        ].map((h) => (
          <button
            key={h.key}
            onClick={() => setActiveHero(h.key)}
            className={`hero-tab glass-panel rounded-full px-5 py-2.5 text-sm font-semibold cursor-pointer relative overflow-hidden border border-white/30 ${
              activeHero === h.key ? 'active text-sky-950' : 'text-white/80'
            }`}
            style={{ textShadow: activeHero === h.key ? '0 1px 2px rgba(255,255,255,0.4)' : '0 1px 2px rgba(0,0,0,0.3)' }}
          >
            <GlassShine />
            <span className="relative z-10">{h.label}</span>
          </button>
        ))}
      </div>

      <ActiveHero />
      <FeatureRow />
      <BottomCTA />

      {/* Footer */}
      <footer className="relative py-8 px-4 overflow-clip">
        <div className="absolute inset-0 bg-[#010e1a]" />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <p className="text-sm text-white/30" style={{ fontFamily: "'Outfit', sans-serif" }}>
            © 2025 LootReef. Not affiliated with any marketplace. All trademarks belong to their owners.
          </p>
        </div>
      </footer>
    </div>
  );
}
