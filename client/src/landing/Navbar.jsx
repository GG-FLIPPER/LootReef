import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

export default function Navbar() {
  const navRef = useRef(null);

  useEffect(() => {
    const st = gsap.fromTo(navRef.current,
      { yPercent: -120, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: 'body',
          start: 'top+300px top',
          toggleActions: 'play none none reverse'
        }
      }
    );

    return () => st.scrollTrigger && st.scrollTrigger.kill();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav ref={navRef} style={{ position: 'fixed', top: '16px', left: 0, right: 0, zIndex: 50, padding: '0 16px', display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
      <div style={{
        width: '100%',
        maxWidth: '960px',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.45), rgba(255,255,255,0.15))',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.4)',
        borderRadius: '24px',
        padding: '14px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 8px 32px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.6)',
        pointerEvents: 'auto',
      }}>

        {/* Left Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button onClick={() => scrollTo('hook')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#00628f', fontFamily: 'inherit', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = '#0096c7'}
            onMouseLeave={e => e.target.style.color = '#00628f'}
          >Why Us?</button>
          <button onClick={() => scrollTo('features')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#00628f', fontFamily: 'inherit', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = '#0096c7'}
            onMouseLeave={e => e.target.style.color = '#00628f'}
          >How it works</button>
        </div>

        {/* Center Logo */}
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div style={{
            width: '32px', height: '32px', background: '#0096c7', borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0,150,199,0.4)',
            transition: 'transform 0.3s',
          }}>
            <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <span style={{ fontSize: '18px', fontWeight: 700 }}>
            <span style={{ color: '#003a5c' }}>Loot</span>
            <span style={{ color: '#0096c7', textShadow: '0 0 10px rgba(0,150,199,0.3)' }}>Reef</span>
          </span>
        </div>

        {/* Right CTA */}
        <div>
          <Link to="/app" style={{
            background: '#0096c7',
            color: 'white',
            padding: '10px 24px',
            borderRadius: '999px',
            fontSize: '14px',
            fontWeight: 700,
            textDecoration: 'none',
            display: 'inline-block',
            boxShadow: '0 4px 20px rgba(0,150,199,0.35)',
            transition: 'all 0.3s ease',
          }}
            onMouseEnter={e => {
              e.target.style.background = '#0077b6';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 24px rgba(0,150,199,0.5)';
            }}
            onMouseLeave={e => {
              e.target.style.background = '#0096c7';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 20px rgba(0,150,199,0.35)';
            }}
          >
            Use Now
          </Link>
        </div>

      </div>
    </nav>
  );
}
