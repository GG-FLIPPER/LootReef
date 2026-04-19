import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function MarketplacesSection() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  const marketplaces = [
    { name: 'G2G', color: '#ff6b00', logo: 'https://images.g2g.com/favicon.ico' },
    { name: 'FunPay', color: '#7c3aed', logo: 'https://funpay.com/favicon.ico' },
    { name: 'Eldorado.gg', color: '#d97706', logo: 'https://www.eldorado.gg/favicon.ico' },
    { name: 'PlayerAuctions', color: '#2563eb', logo: 'https://www.playerauctions.com/favicon.ico' },
    { name: 'Z2U', color: '#dc2626', logo: 'https://www.z2u.com/favicon.ico' },
    { name: 'Gameflip', color: '#059669', logo: 'https://gameflip.com/favicon.ico' },
    { name: 'Plati.market', color: '#0891b2', logo: 'https://plati.market/favicon.ico' },
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.mp-heading', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        }
      });

      gsap.from(cardsRef.current, {
        y: 60,
        opacity: 0,
        scale: 0.85,
        stagger: 0.08,
        duration: 0.6,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: '.mp-grid',
          start: 'top 85%',
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="flex flex-col items-center justify-center w-full px-4 py-24">

      <div className="text-center max-w-4xl mb-14">
        <h2 className="mp-heading" style={{ fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', fontWeight: 700, color: '#003a5c', lineHeight: 1.2 }}>
          Find deals from{' '}
          <span style={{ color: '#0096c7', fontWeight: 800, fontSize: '1.3em', textShadow: '0 0 20px rgba(0,150,199,0.4)' }}>7</span>
          {' '}marketplaces<br />
          in a{' '}
          <span style={{ color: '#2dc653', fontStyle: 'italic', fontWeight: 800 }}>single click</span>
        </h2>
      </div>

      <div className="mp-grid grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-5 max-w-5xl w-full">
        {marketplaces.map((mp, i) => (
          <div
            key={mp.name}
            ref={el => cardsRef.current[i] = el}
            className="group cursor-default"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '24px 12px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0.2))',
              backdropFilter: 'blur(30px) saturate(180%)',
              WebkitBackdropFilter: 'blur(30px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.5)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.8)',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = `0 20px 50px ${mp.color}30, 0 8px 32px rgba(0,0,0,0.08), inset 0 2px 4px rgba(255,255,255,0.8)`;
              e.currentTarget.style.borderColor = `${mp.color}60`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.8)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
            }}
          >
            {/* Logo circle */}
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: `${mp.color}15`,
              border: `2px solid ${mp.color}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              overflow: 'hidden',
            }}>
              <img
                src={mp.logo}
                alt={mp.name}
                style={{ width: '28px', height: '28px', objectFit: 'contain' }}
                onError={(e) => {
                  // Fallback to initials if favicon fails
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `<span style="font-weight:800;font-size:16px;color:${mp.color}">${mp.name.charAt(0)}</span>`;
                }}
              />
            </div>

            {/* Name */}
            <span style={{
              fontSize: '12px',
              fontWeight: 700,
              color: mp.color,
              textAlign: 'center',
              letterSpacing: '0.02em',
              lineHeight: 1.2,
            }}>
              {mp.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
