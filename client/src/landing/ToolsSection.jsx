import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function ToolsSection() {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.tool-card', {
        y: 80,
        opacity: 0,
        stagger: 0.25,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const cardStyle = {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.75), rgba(255,255,255,0.45))',
    backdropFilter: 'blur(40px) saturate(180%)',
    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
    border: '1.5px solid rgba(255,255,255,0.6)',
    borderRadius: '32px',
    boxShadow: '0 16px 48px rgba(0,58,92,0.1), inset 0 2px 4px rgba(255,255,255,0.9)',
    padding: 'clamp(40px, 6vw, 80px)',
    textAlign: 'center',
    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
  };

  return (
    <section ref={containerRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '96px 16px', gap: '80px' }}>

      {/* Translate & Convert Card */}
      <div className="tool-card" style={{ ...cardStyle, width: '100%', maxWidth: '900px' }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-6px)';
          e.currentTarget.style.boxShadow = '0 24px 64px rgba(0,58,92,0.15), inset 0 2px 4px rgba(255,255,255,0.9)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,58,92,0.1), inset 0 2px 4px rgba(255,255,255,0.9)';
        }}
      >
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', fontWeight: 700, color: '#002d47', marginBottom: '8px', letterSpacing: '-0.02em' }}>
          Translate <span style={{ fontWeight: 400, fontStyle: 'italic', color: '#005f8f', fontSize: '0.7em' }}>and</span> Convert
        </h2>
        <h3 style={{
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          fontWeight: 800,
          color: '#0077b6',
          letterSpacing: '-0.03em',
        }}>
          Instantly
        </h3>
      </div>

      {/* Bookmark Card */}
      <div className="tool-card" style={{ ...cardStyle, width: '100%', maxWidth: '900px', position: 'relative' }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-6px)';
          e.currentTarget.style.boxShadow = '0 24px 64px rgba(0,58,92,0.15), inset 0 2px 4px rgba(255,255,255,0.9)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,58,92,0.1), inset 0 2px 4px rgba(255,255,255,0.9)';
        }}
      >
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', fontWeight: 700, color: '#002d47', marginBottom: '8px', letterSpacing: '-0.02em' }}>
          Never <span style={{ color: '#0fa958', fontWeight: 800 }}>lose</span> deals again
        </h2>
        <h3 style={{ fontSize: 'clamp(1.3rem, 3vw, 2.5rem)', fontWeight: 500, color: '#005f8f', marginTop: '12px' }}>
          Bookmark them
        </h3>

        {/* Floating bookmark icon */}
        <div style={{
          position: 'absolute',
          top: '-16px',
          right: '40px',
          width: '40px',
          height: '52px',
          background: '#0096c7',
          borderRadius: '0 0 10px 10px',
          boxShadow: '0 8px 24px rgba(0,150,199,0.5)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingBottom: '8px',
        }}>
          <svg width="18" height="18" fill="white" viewBox="0 0 20 20">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
        </div>
      </div>

    </section>
  );
}
