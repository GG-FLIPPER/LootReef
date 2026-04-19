import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function HeroSection() {
  const containerRef = useRef(null);
  const arrowRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.hero-word', {
        y: 80,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: 'power4.out',
        delay: 0.3
      });

      gsap.to(arrowRef.current, {
        y: 12,
        repeat: -1,
        yoyo: true,
        duration: 1.2,
        ease: 'sine.inOut'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[92vh] flex flex-col items-center justify-center w-full max-w-6xl px-4 pt-10">
      <div className="text-center z-10">
        <h2 className="hero-word mb-6" style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)', fontWeight: 500, color: '#00628f', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Introducing
        </h2>
        <h1 className="hero-word leading-none" style={{ fontSize: 'clamp(4rem, 12vw, 10rem)', fontWeight: 800, letterSpacing: '-0.04em' }}>
          <span style={{ color: '#003a5c' }}>Loot</span>
          <span style={{ color: '#0096c7', textShadow: '0 0 40px rgba(0,150,199,0.5), 0 0 80px rgba(0,150,199,0.2)' }}>Reef</span>
        </h1>
      </div>

      <div className="absolute bottom-16 flex flex-col items-center" style={{ opacity: 0.7 }}>
        <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#00628f', marginBottom: '12px' }}>Scroll Down</span>
        <div ref={arrowRef} style={{ width: '30px', height: '50px', borderRadius: '999px', border: '2px solid rgba(0,150,199,0.4)', display: 'flex', justifyContent: 'center', padding: '6px 0', background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)' }}>
          <div style={{ width: '6px', height: '12px', background: '#0096c7', borderRadius: '999px', marginTop: '4px' }}></div>
        </div>
      </div>
    </section>
  );
}
