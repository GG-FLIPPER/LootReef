import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function FeaturesSection() {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Simple staggered entrance — NO pinning, NO scrub
      gsap.from('.feat-word', {
        y: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      });

      gsap.from('.feat-glow', {
        y: 40,
        opacity: 0,
        scale: 0.9,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.feat-glow',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={containerRef} className="flex flex-col items-center justify-center w-full px-4 py-32">

      <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 mb-12 text-center">
        <span className="feat-word" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 700, color: '#00628f' }}>Deals</span>
        <span className="feat-word" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 700, color: '#00628f' }}>Codes</span>
        <span className="feat-word" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 700, color: '#00628f' }}>Live Updates</span>
      </div>

      <div className="feat-glow relative mt-4">
        <h2 style={{
          fontSize: 'clamp(3rem, 8vw, 7rem)',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #48cae4, #0096c7, #2dc653)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1.1,
          padding: '8px 16px',
          position: 'relative',
          zIndex: 10,
        }}>
          All in one
        </h2>
        {/* Glow behind text */}
        <div style={{
          position: 'absolute',
          inset: '-20px',
          background: 'linear-gradient(135deg, rgba(72,202,228,0.4), rgba(0,150,199,0.3), rgba(45,198,83,0.3))',
          filter: 'blur(40px)',
          borderRadius: '50%',
          zIndex: 0,
          pointerEvents: 'none',
        }}></div>
      </div>

    </section>
  );
}
