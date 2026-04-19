import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function ComparisonSection() {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.comp-vs', {
        scale: 0,
        opacity: 0,
        rotation: 360,
        duration: 0.8,
        ease: 'back.out(2)',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 65%',
        }
      });

      gsap.from('.comp-card-left', {
        x: -80,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 65%',
        }
      });

      gsap.from('.comp-card-right', {
        x: 80,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 65%',
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const glassCard = {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.75), rgba(255,255,255,0.45))',
    backdropFilter: 'blur(40px) saturate(180%)',
    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
    border: '1.5px solid rgba(255,255,255,0.6)',
    borderRadius: '28px',
    padding: 'clamp(32px, 4vw, 56px)',
    boxShadow: '0 12px 40px rgba(0,58,92,0.1), inset 0 2px 4px rgba(255,255,255,0.9)',
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  };

  return (
    <section ref={containerRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '112px 16px' }}>

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', width: '100%', maxWidth: '1000px' }}>

        {/* Desktop layout */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center', gap: '64px', width: '100%', flexWrap: 'wrap' }}>

          {/* LootReef Card */}
          <div className="comp-card-left" style={{
            ...glassCard,
            flex: '1 1 380px',
            maxWidth: '440px',
            borderColor: 'rgba(0,150,199,0.35)',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,150,199,0.2), inset 0 2px 4px rgba(255,255,255,0.9)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,58,92,0.1), inset 0 2px 4px rgba(255,255,255,0.9)';
            }}
          >
            <h3 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, textAlign: 'center', marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.4)' }}>
              <span style={{ color: '#002d47' }}>Loot</span>
              <span style={{ color: '#0096c7', textShadow: '0 0 15px rgba(0,150,199,0.4)' }}>Reef</span>
            </h3>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {['Helps creators', 'Shows all codes', 'Finds the best deal', 'Has Morals'].map((text) => (
                <li key={text} style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '16px', fontWeight: 600, color: '#002d47' }}>
                  <span style={{
                    width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(0,150,199,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <svg width="16" height="16" fill="#0096c7" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          {/* VS Badge - sits between the cards */}
          <div className="comp-vs" style={{
            alignSelf: 'center',
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.5))',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1.5px solid rgba(255,255,255,0.6)',
            boxShadow: '0 8px 24px rgba(0,58,92,0.1)',
            fontSize: '18px',
            fontWeight: 900,
            color: '#002d47',
            fontStyle: 'italic',
            letterSpacing: '0.05em',
            flexShrink: 0,
            margin: '0 -48px',
            zIndex: 5,
          }}>
            VS
          </div>

          {/* Honey Card */}
          <div className="comp-card-right" style={{
            ...glassCard,
            flex: '1 1 380px',
            maxWidth: '440px',
            opacity: 0.75,
            borderColor: 'rgba(180,180,180,0.4)',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <h3 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, textAlign: 'center', marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid rgba(200,200,200,0.3)', color: '#5a6370' }}>
              Honey
            </h3>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {['Steals from creators', 'Only shows chosen promo codes', "Doesn't find deals"].map((text) => (
                <li key={text} style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '16px', fontWeight: 600, color: '#5a6370' }}>
                  <span style={{
                    width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <svg width="14" height="14" fill="none" stroke="#ef4444" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
