import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function HookSection() {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.hook-line', {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hook" ref={containerRef} className="min-h-[55vh] flex flex-col items-center justify-center w-full px-4 my-16">
      <div className="max-w-5xl w-full text-center">

        <h2 className="hook-line" style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', fontWeight: 800, color: '#003a5c', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Stop paying full price
        </h2>

        <h2 className="hook-line mt-3" style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          <span style={{ color: '#0096c7', textShadow: '0 0 30px rgba(0,150,199,0.4)' }}>LootReef</span>
          <span style={{ color: '#003a5c', marginLeft: '16px' }}>gets it easier</span>
        </h2>

      </div>
    </section>
  );
}
