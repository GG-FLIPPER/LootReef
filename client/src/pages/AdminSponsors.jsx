import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SponsorCardPreview from '../components/SponsorCardPreview';

// ─── COLOR PALETTE (matching Landing.jsx) ───
const AQUA = '#00d4ff';
const DEEP_BLUE = '#005f99';
const TEXT_PRIMARY = '#0d2847';
const TEXT_MUTED = 'rgba(13,40,71,0.7)';

// ─── GLASS PANEL ───
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

function GlassShine() {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: '45%',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 100%)',
      borderBottomLeftRadius: '50% 15%', borderBottomRightRadius: '50% 15%',
      pointerEvents: 'none', zIndex: 1,
    }} />
  );
}

// ─── TIER LABELS & DAYS ───
const TIER_LABELS = { '3day': '3 Days', '7day': '7 Days', '14day': '14 Days', '30day': '30 Days' };
const TIER_DAYS = { '3day': 3, '7day': 7, '14day': 14, '30day': 30 };
const PLACEMENT_LABELS = { deal_card: 'Sponsored Deal Card', todays_deal: "Sponsored Today's Deal" };

function formatDateStr(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── INJECTED CSS ───
const INJECTED_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Figtree:wght@300;400;600;700&display=swap');

@keyframes movingBackground {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideOut {
  to { opacity: 0; transform: translateX(80px) scale(0.95); max-height: 0; padding: 0; margin: 0; overflow: hidden; }
}

.admin-input {
  width: 100%;
  padding: 0.7rem 1rem;
  border-radius: 12px;
  border: 2px solid rgba(255,255,255,0.5);
  background: rgba(255,255,255,0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  font-family: 'Figtree', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  color: ${TEXT_PRIMARY};
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
}
.admin-input:focus {
  border-color: ${AQUA};
  box-shadow: 0 0 0 3px rgba(0,212,255,0.15);
}
textarea.admin-input {
  resize: vertical;
  min-height: 60px;
}

.admin-btn {
  padding: 0.7rem 1.5rem;
  border-radius: 50px;
  font-family: 'Figtree', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}
.admin-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.admin-btn-approve {
  background: linear-gradient(180deg, #55ff77 0%, #00cc44 100%);
  color: white;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
  box-shadow: 0 6px 20px rgba(0,204,68,0.3), inset 0 1px 0 rgba(255,255,255,0.5);
}
.admin-btn-approve:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0,204,68,0.4), inset 0 1px 0 rgba(255,255,255,0.6);
}
.admin-btn-reject {
  background: linear-gradient(180deg, #ff6b6b 0%, #cc0000 100%);
  color: white;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
  box-shadow: 0 6px 20px rgba(204,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3);
}
.admin-btn-reject:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(204,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.4);
}
.admin-btn-warn {
  background: linear-gradient(180deg, #ffb703 0%, #fb8500 100%);
  color: white;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
  box-shadow: 0 6px 20px rgba(251,133,0,0.3), inset 0 1px 0 rgba(255,255,255,0.5);
}
.admin-btn-warn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(251,133,0,0.4), inset 0 1px 0 rgba(255,255,255,0.6);
}

.slot-card-enter {
  animation: fadeInUp 0.4s ease-out both;
}
.slot-card-exit {
  animation: slideOut 0.4s ease-in forwards;
}

.admin-tab {
  padding: 0.6rem 1.4rem;
  border-radius: 50px;
  font-family: 'Figtree', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid rgba(255,255,255,0.5);
  background: rgba(255,255,255,0.25);
  color: ${TEXT_PRIMARY};
}
.admin-tab-active {
  background: rgba(255,255,255,0.75);
  color: ${DEEP_BLUE};
  box-shadow: 0 5px 15px rgba(0,95,153,0.15), inset 0 1px 0 rgba(255,255,255,1);
  border-color: white;
}

@media (max-width: 768px) {
  body, html { overflow-x: hidden !important; }
}
`;

export default function AdminSponsors() {
  const displayFont = { fontFamily: "'Syne', sans-serif", fontWeight: 800 };
  const bodyFont = { fontFamily: "'Figtree', sans-serif" };

  // Auth State
  const [adminPwd, setAdminPwd] = useState(() => sessionStorage.getItem('lootreef_admin_pwd') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginInput, setLoginInput] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [verifying, setVerifying] = useState(false);

  // Tab State: 'pending' | 'active'
  const [activeTab, setActiveTab] = useState('pending');

  // Slots State
  const [pendingSlots, setPendingSlots] = useState([]);
  const [activeSlots, setActiveSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Edit State for Pending
  const [edits, setEdits] = useState({});
  const [processing, setProcessing] = useState({});
  const [exiting, setExiting] = useState({});

  // Inject styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = INJECTED_CSS;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  // Fetch pending & active slots with auth header
  const fetchData = useCallback(async (pwdToUse) => {
    const pwd = pwdToUse || adminPwd;
    if (!pwd) return;

    setLoading(true);
    setError(null);

    const headers = { 'X-Admin-Password': pwd };

    try {
      const [pendingRes, activeRes] = await Promise.all([
        fetch('/api/sponsors/admin/pending', { headers }),
        fetch('/api/sponsors/admin/active', { headers }),
      ]);

      if (pendingRes.status === 401 || activeRes.status === 401) {
        setIsAuthenticated(false);
        sessionStorage.removeItem('lootreef_admin_pwd');
        setError('Session expired or invalid password');
        return;
      }

      const pendingData = await pendingRes.json();
      const activeData = await activeRes.json();

      if (!pendingRes.ok) throw new Error(pendingData.error || 'Failed to fetch pending applications');
      if (!activeRes.ok) throw new Error(activeData.error || 'Failed to fetch active applications');

      setPendingSlots(pendingData.slots || []);
      setActiveSlots(activeData.slots || []);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [adminPwd]);

  // Initial verify / fetch if pwd stored in session
  useEffect(() => {
    if (adminPwd) {
      fetchData(adminPwd);
    }
  }, [adminPwd, fetchData]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setVerifying(true);

    try {
      const res = await fetch('/api/sponsors/admin/verify', {
        method: 'POST',
        headers: { 'X-Admin-Password': loginInput },
      });

      if (!res.ok) {
        setLoginError('Incorrect password');
        setVerifying(false);
        return;
      }

      sessionStorage.setItem('lootreef_admin_pwd', loginInput);
      setAdminPwd(loginInput);
      setLoginInput('');
      fetchData(loginInput);
    } catch (err) {
      setLoginError('Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('lootreef_admin_pwd');
    setAdminPwd('');
    setIsAuthenticated(false);
    setPendingSlots([]);
    setActiveSlots([]);
  };

  // Helper for edits on pending slots
  const getEditState = (slot) => {
    if (edits[slot.id]) return edits[slot.id];
    return {
      card_title: slot.card_title,
      card_description: slot.card_description || '',
      target_url: slot.target_url,
    };
  };

  const handleEditChange = (slotId, field, value) => {
    setEdits((prev) => ({
      ...prev,
      [slotId]: {
        ...getEditState(pendingSlots.find((s) => s.id === slotId)),
        ...prev[slotId],
        [field]: value,
      },
    }));
  };

  const getPreviewSlot = (slot) => {
    const editState = getEditState(slot);
    return { ...slot, ...editState };
  };

  const removePendingSlot = (slotId) => {
    setExiting((prev) => ({ ...prev, [slotId]: true }));
    setTimeout(() => {
      setPendingSlots((prev) => prev.filter((s) => s.id !== slotId));
      setExiting((prev) => { const n = { ...prev }; delete n[slotId]; return n; });
      setEdits((prev) => { const n = { ...prev }; delete n[slotId]; return n; });
      setProcessing((prev) => { const n = { ...prev }; delete n[slotId]; return n; });
    }, 400);
  };

  const handleApprove = async (slot) => {
    setProcessing((prev) => ({ ...prev, [slot.id]: 'approving' }));
    try {
      const editState = getEditState(slot);
      const res = await fetch(`/api/sponsors/admin/${slot.id}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': adminPwd,
        },
        body: JSON.stringify(editState),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Approve failed');
      
      removePendingSlot(slot.id);
      // Refresh active slots list
      fetchData(adminPwd);
    } catch (err) {
      alert(`Failed to approve: ${err.message}`);
      setProcessing((prev) => { const n = { ...prev }; delete n[slot.id]; return n; });
    }
  };

  const handleReject = async (slot) => {
    if (!window.confirm(`Reject application from "${slot.company_name}"? This will soft-delete it (status → expired).`)) return;
    setProcessing((prev) => ({ ...prev, [slot.id]: 'rejecting' }));
    try {
      const res = await fetch(`/api/sponsors/admin/${slot.id}/reject`, {
        method: 'PATCH',
        headers: { 'X-Admin-Password': adminPwd },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reject failed');
      removePendingSlot(slot.id);
    } catch (err) {
      alert(`Failed to reject: ${err.message}`);
      setProcessing((prev) => { const n = { ...prev }; delete n[slot.id]; return n; });
    }
  };

  const handleDeactivate = async (slot) => {
    if (!window.confirm(`Deactivate early: "${slot.card_title}" from "${slot.company_name}"? This will set active=false and status=expired.`)) return;
    setProcessing((prev) => ({ ...prev, [slot.id]: 'deactivating' }));
    try {
      const res = await fetch(`/api/sponsors/admin/${slot.id}/deactivate`, {
        method: 'PATCH',
        headers: { 'X-Admin-Password': adminPwd },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Deactivation failed');

      // Animate out from active slots
      setExiting((prev) => ({ ...prev, [slot.id]: true }));
      setTimeout(() => {
        setActiveSlots((prev) => prev.filter((s) => s.id !== slot.id));
        setExiting((prev) => { const n = { ...prev }; delete n[slot.id]; return n; });
        setProcessing((prev) => { const n = { ...prev }; delete n[slot.id]; return n; });
      }, 400);
    } catch (err) {
      alert(`Failed to deactivate: ${err.message}`);
      setProcessing((prev) => { const n = { ...prev }; delete n[slot.id]; return n; });
    }
  };

  const getDatePreview = (tier) => {
    const days = TIER_DAYS[tier] || 7;
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + days);
    return `${formatDate(start)} – ${formatDate(end)}`;
  };

  // ═══════════════════════════════════════════════════════════
  // LOGIN SCREEN IF NOT AUTHENTICATED
  // ═══════════════════════════════════════════════════════════
  if (!isAuthenticated) {
    return (
      <div style={{
        background: 'linear-gradient(-45deg, #4facfe 0%, #00f2fe 50%, #43e97b 100%)',
        backgroundSize: '400% 400%', animation: 'movingBackground 15s ease infinite',
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        ...bodyFont, padding: '2rem',
      }}>
        <div style={{
          ...glassPanel, borderRadius: 36, padding: '3.5rem 2.5rem', maxWidth: 440,
          width: '100%', textAlign: 'center', animation: 'fadeInUp 0.5s ease-out',
        }}>
          <GlassShine />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{
              width: 70, height: 70, borderRadius: '50%', margin: '0 auto 1.5rem',
              background: 'linear-gradient(135deg, #00d4ff, #005f99)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(0,95,153,0.3), inset 0 2px 2px rgba(255,255,255,0.5)',
              border: '2px solid white', fontSize: '1.8rem',
            }}>
              🔒
            </div>

            <h1 style={{ ...displayFont, fontSize: '1.8rem', color: DEEP_BLUE, margin: '0 0 0.5rem',
              textShadow: '0 2px 4px rgba(255,255,255,0.8)' }}>
              Sponsor Admin
            </h1>
            <p style={{ color: TEXT_MUTED, fontSize: '0.95rem', fontWeight: 600, margin: '0 0 2rem' }}>
              Enter password to manage sponsor applications
            </p>

            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <input
                  type="password"
                  className="admin-input"
                  placeholder="Enter admin password"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  autoFocus
                />
              </div>

              {loginError && (
                <div style={{
                  marginBottom: '1.2rem', padding: '0.7rem 1rem', borderRadius: 12,
                  background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.3)',
                  color: '#cc0000', fontWeight: 700, fontSize: '0.9rem',
                }}>
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="admin-btn admin-btn-approve"
                style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}
                disabled={verifying || !loginInput}
              >
                {verifying ? 'Verifying…' : 'Access Admin Dashboard →'}
              </button>
            </form>

            <div style={{ marginTop: '2rem' }}>
              <Link to="/app" style={{ color: DEEP_BLUE, textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem' }}>
                ← Return to LootReef App
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // MAIN ADMIN DASHBOARD
  // ═══════════════════════════════════════════════════════════
  return (
    <div style={{
      background: 'linear-gradient(-45deg, #4facfe 0%, #00f2fe 50%, #43e97b 100%)',
      backgroundSize: '400% 400%', animation: 'movingBackground 15s ease infinite',
      color: TEXT_PRIMARY, minHeight: '100vh', ...bodyFont, fontWeight: 400,
      overflowX: 'hidden', position: 'relative',
    }}>
      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'fixed', width: '150vw', height: '100vh', top: '-20vh', left: '-25vw',
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 60%)',
          filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'fixed', width: 600, height: 600, borderRadius: '50%', bottom: -200, left: -150,
          background: 'radial-gradient(circle, rgba(67,233,123,0.5) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }} />
      </div>

      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 5%', position: 'relative', zIndex: 10,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.15) 100%)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        borderBottom: '1px solid rgba(255,255,255,0.7)',
        boxShadow: '0 5px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)',
      }}>
        <Link to="/" style={{ ...displayFont, fontSize: '1.5rem', textDecoration: 'none', color: TEXT_PRIMARY,
          textShadow: '0 2px 4px rgba(255,255,255,0.8)' }}>
          <span style={{ color: DEEP_BLUE }}>Loot</span>Reef
        </Link>
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <span style={{
            padding: '0.35rem 0.9rem', borderRadius: 50,
            background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.3)',
            color: '#cc0000', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            Admin
          </span>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.6)',
              borderRadius: 50, padding: '0.4rem 1rem', color: TEXT_PRIMARY,
              fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main style={{ position: 'relative', zIndex: 2, padding: '2.5rem 5% 5rem', maxWidth: 1050, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem', animation: 'fadeInUp 0.5s ease-out' }}>
          <h1 style={{
            ...displayFont, fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', lineHeight: 1, margin: '0 0 0.5rem',
            color: 'white', textShadow: '0 4px 20px rgba(0,95,153,0.3)',
          }}>
            Sponsor Slot Management
          </h1>
          <p style={{ color: TEXT_MUTED, fontWeight: 600, fontSize: '1rem' }}>
            Review pending applications and monitor active/approved sponsor placements.
          </p>
        </div>

        {/* ─── TABS ─── */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '0.8rem', marginBottom: '2.5rem', flexWrap: 'wrap',
        }}>
          <button
            className={`admin-tab ${activeTab === 'pending' ? 'admin-tab-active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Applications ({pendingSlots.length})
          </button>
          <button
            className={`admin-tab ${activeTab === 'active' ? 'admin-tab-active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Active & Approved Slots ({activeSlots.length})
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{
              width: 40, height: 40, border: '4px solid rgba(255,255,255,0.3)',
              borderTop: `4px solid ${DEEP_BLUE}`, borderRadius: '50%',
              margin: '0 auto', animation: 'spin 0.8s linear infinite',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ marginTop: '1rem', color: TEXT_MUTED, fontWeight: 600 }}>Loading slots…</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{
            ...glassPanel, borderRadius: 20, padding: '2rem', textAlign: 'center',
            background: 'rgba(255,60,60,0.08)', border: '1px solid rgba(255,60,60,0.3)',
          }}>
            <p style={{ color: '#cc0000', fontWeight: 700, margin: '0 0 1rem' }}>Error: {error}</p>
            <button onClick={() => fetchData()} className="admin-btn" style={{
              background: 'linear-gradient(180deg, #00d4ff 0%, #0077ff 100%)',
              color: 'white', boxShadow: '0 6px 20px rgba(0,119,255,0.3)',
            }}>
              Retry
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* TAB 1: PENDING APPLICATIONS */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'pending' && !loading && !error && (
          <>
            {pendingSlots.length === 0 ? (
              <div style={{
                ...glassPanel, borderRadius: 28, padding: '4rem 2rem', textAlign: 'center',
                animation: 'fadeInUp 0.5s ease-out',
              }}>
                <GlassShine />
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                  <h2 style={{ ...displayFont, fontSize: '1.5rem', color: DEEP_BLUE, margin: '0 0 0.5rem',
                    textShadow: '0 2px 4px rgba(255,255,255,0.8)' }}>
                    All Clear!
                  </h2>
                  <p style={{ color: TEXT_MUTED, fontWeight: 600, fontSize: '1rem' }}>
                    No pending sponsor applications to review.
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {pendingSlots.map((slot, i) => {
                  const editState = getEditState(slot);
                  const previewSlot = getPreviewSlot(slot);
                  const isProcessing = processing[slot.id];
                  const isExiting = exiting[slot.id];

                  return (
                    <div
                      key={slot.id}
                      className={isExiting ? 'slot-card-exit' : 'slot-card-enter'}
                      style={{ animationDelay: isExiting ? '0ms' : `${i * 80}ms` }}
                    >
                      <div style={{
                        ...glassPanel, borderRadius: 28, padding: '2rem',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 100%)',
                      }}>
                        <GlassShine />
                        <div style={{ position: 'relative', zIndex: 2 }}>

                          {/* Top row: meta info */}
                          <div style={{
                            display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center',
                            marginBottom: '1.5rem',
                          }}>
                            <span style={{
                              background: 'rgba(0,95,153,0.08)', border: '1px solid rgba(0,95,153,0.2)',
                              borderRadius: 50, padding: '0.3rem 0.8rem', fontSize: '0.75rem',
                              fontWeight: 700, color: DEEP_BLUE,
                            }}>
                              {PLACEMENT_LABELS[slot.placement] || slot.placement}
                            </span>
                            <span style={{
                              background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)',
                              borderRadius: 50, padding: '0.3rem 0.8rem', fontSize: '0.75rem',
                              fontWeight: 700, color: DEEP_BLUE,
                            }}>
                              {TIER_LABELS[slot.tier] || slot.tier}
                            </span>
                            <span style={{
                              background: 'rgba(85,255,119,0.1)', border: '1px solid rgba(85,255,119,0.3)',
                              borderRadius: 50, padding: '0.3rem 0.8rem', fontSize: '0.75rem',
                              fontWeight: 800, color: '#00994d',
                            }}>
                              ${slot.price_paid}
                            </span>
                            <span style={{
                              fontSize: '0.75rem', color: TEXT_MUTED, fontWeight: 600, marginLeft: 'auto',
                            }}>
                              Applied {formatDateStr(slot.created_at)}
                            </span>
                          </div>

                          {/* Two-column layout: Details + Preview */}
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                            gap: '2rem',
                          }}>
                            {/* LEFT — Submitted data & editable fields */}
                            <div>
                              <h3 style={{ ...displayFont, fontSize: '1.1rem', color: DEEP_BLUE, margin: '0 0 1rem',
                                textShadow: '0 2px 4px rgba(255,255,255,0.8)' }}>
                                Application Details
                              </h3>

                              <div style={{ marginBottom: '1rem' }}>
                                <FieldRow label="Company" value={slot.company_name} />
                                <FieldRow label="Email" value={slot.contact_email} />
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                                <div>
                                  <label style={labelStyle}>Card Title</label>
                                  <input className="admin-input" value={editState.card_title}
                                    onChange={(e) => handleEditChange(slot.id, 'card_title', e.target.value)} />
                                </div>
                                <div>
                                  <label style={labelStyle}>Card Description</label>
                                  <textarea className="admin-input" value={editState.card_description}
                                    onChange={(e) => handleEditChange(slot.id, 'card_description', e.target.value)} />
                                </div>
                                <div>
                                  <label style={labelStyle}>Target URL</label>
                                  <input className="admin-input" value={editState.target_url}
                                    onChange={(e) => handleEditChange(slot.id, 'target_url', e.target.value)} />
                                </div>
                              </div>

                              <div style={{
                                marginTop: '1rem', padding: '0.8rem 1rem', borderRadius: 14,
                                background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)',
                              }}>
                                <div style={{ fontSize: '0.75rem', color: TEXT_MUTED, fontWeight: 600, marginBottom: '0.2rem' }}>
                                  If approved today:
                                </div>
                                <div style={{ fontWeight: 700, color: DEEP_BLUE, fontSize: '0.95rem' }}>
                                  📅 {getDatePreview(slot.tier)}
                                </div>
                              </div>
                            </div>

                            {/* RIGHT — Live Preview */}
                            <div>
                              <h3 style={{ ...displayFont, fontSize: '1.1rem', color: DEEP_BLUE, margin: '0 0 1rem',
                                textShadow: '0 2px 4px rgba(255,255,255,0.8)' }}>
                                Live Preview
                              </h3>
                              <div style={{
                                background: 'rgba(255,255,255,0.5)', borderRadius: 16, padding: '1rem',
                                border: '1px solid rgba(255,255,255,0.6)',
                              }}>
                                <SponsorCardPreview slot={previewSlot} showImageWarning={false} />
                              </div>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div style={{
                            display: 'flex', gap: '0.8rem', marginTop: '1.5rem',
                            justifyContent: 'flex-end', flexWrap: 'wrap',
                          }}>
                            <button
                              className="admin-btn admin-btn-reject"
                              disabled={!!isProcessing}
                              onClick={() => handleReject(slot)}
                            >
                              {isProcessing === 'rejecting' ? 'Rejecting…' : 'Reject'}
                            </button>
                            <button
                              className="admin-btn admin-btn-approve"
                              disabled={!!isProcessing}
                              onClick={() => handleApprove(slot)}
                            >
                              {isProcessing === 'approving' ? 'Approving…' : 'Approve & Activate'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* TAB 2: ACTIVE & APPROVED SLOTS */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'active' && !loading && !error && (
          <>
            {activeSlots.length === 0 ? (
              <div style={{
                ...glassPanel, borderRadius: 28, padding: '4rem 2rem', textAlign: 'center',
                animation: 'fadeInUp 0.5s ease-out',
              }}>
                <GlassShine />
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📌</div>
                  <h2 style={{ ...displayFont, fontSize: '1.5rem', color: DEEP_BLUE, margin: '0 0 0.5rem',
                    textShadow: '0 2px 4px rgba(255,255,255,0.8)' }}>
                    No Active Sponsors
                  </h2>
                  <p style={{ color: TEXT_MUTED, fontWeight: 600, fontSize: '1rem' }}>
                    There are currently no active or approved sponsor slots running.
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {activeSlots.map((slot, i) => {
                  const isProcessing = processing[slot.id];
                  const isExiting = exiting[slot.id];

                  return (
                    <div
                      key={slot.id}
                      className={isExiting ? 'slot-card-exit' : 'slot-card-enter'}
                      style={{ animationDelay: isExiting ? '0ms' : `${i * 80}ms` }}
                    >
                      <div style={{
                        ...glassPanel, borderRadius: 28, padding: '2rem',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 100%)',
                      }}>
                        <GlassShine />
                        <div style={{ position: 'relative', zIndex: 2 }}>

                          {/* Top row: status + placement */}
                          <div style={{
                            display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center',
                            marginBottom: '1.5rem',
                          }}>
                            <span style={{
                              background: slot.active ? 'rgba(85,255,119,0.15)' : 'rgba(255,183,3,0.15)',
                              border: `1px solid ${slot.active ? 'rgba(85,255,119,0.4)' : 'rgba(255,183,3,0.4)'}`,
                              borderRadius: 50, padding: '0.3rem 0.8rem', fontSize: '0.75rem',
                              fontWeight: 800, color: slot.active ? '#00994d' : '#b77900',
                              textTransform: 'uppercase',
                            }}>
                              ● {slot.active ? 'Active' : slot.status}
                            </span>
                            <span style={{
                              background: 'rgba(0,95,153,0.08)', border: '1px solid rgba(0,95,153,0.2)',
                              borderRadius: 50, padding: '0.3rem 0.8rem', fontSize: '0.75rem',
                              fontWeight: 700, color: DEEP_BLUE,
                            }}>
                              {PLACEMENT_LABELS[slot.placement] || slot.placement}
                            </span>
                            <span style={{
                              background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)',
                              borderRadius: 50, padding: '0.3rem 0.8rem', fontSize: '0.75rem',
                              fontWeight: 700, color: DEEP_BLUE,
                            }}>
                              {TIER_LABELS[slot.tier] || slot.tier}
                            </span>
                            <span style={{
                              fontSize: '0.75rem', color: TEXT_MUTED, fontWeight: 600, marginLeft: 'auto',
                            }}>
                              End Date: <strong>{formatDateStr(slot.end_date)}</strong>
                            </span>
                          </div>

                          {/* Two-column layout: Info + Live Preview */}
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
                            gap: '2rem',
                          }}>
                            {/* LEFT — Info & Stats */}
                            <div>
                              <h3 style={{ ...displayFont, fontSize: '1.2rem', color: DEEP_BLUE, margin: '0 0 1rem',
                                textShadow: '0 2px 4px rgba(255,255,255,0.8)' }}>
                                {slot.company_name}
                              </h3>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.5rem' }}>
                                <FieldRow label="Contact" value={slot.contact_email} />
                                <FieldRow label="Target" value={slot.target_url} />
                                <FieldRow label="Price Paid" value={`$${slot.price_paid} ${slot.currency || 'USD'}`} />
                                <FieldRow label="Schedule" value={`${formatDateStr(slot.start_date)} → ${formatDateStr(slot.end_date)}`} />
                              </div>

                              {/* Analytics Counters */}
                              <div style={{
                                display: 'flex', gap: '1rem', padding: '1rem 1.2rem', borderRadius: 18,
                                background: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.7)',
                              }}>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: '0.75rem', color: TEXT_MUTED, fontWeight: 700, textTransform: 'uppercase' }}>
                                    Impressions
                                  </div>
                                  <div style={{ ...displayFont, fontSize: '1.5rem', color: DEEP_BLUE }}>
                                    {slot.impressions ?? 0}
                                  </div>
                                </div>
                                <div style={{ width: 1, background: 'rgba(0,0,0,0.1)' }} />
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: '0.75rem', color: TEXT_MUTED, fontWeight: 700, textTransform: 'uppercase' }}>
                                    Clicks
                                  </div>
                                  <div style={{ ...displayFont, fontSize: '1.5rem', color: DEEP_BLUE }}>
                                    {slot.clicks ?? 0}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* RIGHT — Card Preview */}
                            <div>
                              <h3 style={{ ...displayFont, fontSize: '1.1rem', color: DEEP_BLUE, margin: '0 0 1rem',
                                textShadow: '0 2px 4px rgba(255,255,255,0.8)' }}>
                                Active Card Preview
                              </h3>
                              <div style={{
                                background: 'rgba(255,255,255,0.5)', borderRadius: 16, padding: '1rem',
                                border: '1px solid rgba(255,255,255,0.6)',
                              }}>
                                <SponsorCardPreview slot={slot} />
                              </div>
                            </div>
                          </div>

                          {/* Deactivate Early Action */}
                          <div style={{
                            display: 'flex', gap: '0.8rem', marginTop: '1.5rem',
                            justifyContent: 'flex-end', flexWrap: 'wrap',
                          }}>
                            <button
                              className="admin-btn admin-btn-warn"
                              disabled={!!isProcessing}
                              onClick={() => handleDeactivate(slot)}
                            >
                              {isProcessing === 'deactivating' ? 'Deactivating…' : '⚠️ Deactivate Early'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function FieldRow({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', alignItems: 'baseline' }}>
      <span style={{ fontSize: '0.8rem', color: TEXT_MUTED, fontWeight: 700, minWidth: 80 }}>{label}:</span>
      <span style={{ fontSize: '0.9rem', color: TEXT_PRIMARY, fontWeight: 600, wordBreak: 'break-all' }}>{value || '—'}</span>
    </div>
  );
}

const labelStyle = {
  display: 'block', fontWeight: 700, fontSize: '0.78rem', color: TEXT_PRIMARY,
  marginBottom: '0.3rem', letterSpacing: '0.02em',
  fontFamily: "'Figtree', sans-serif",
};
