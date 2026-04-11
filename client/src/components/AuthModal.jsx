import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../AuthContext';

function AuthModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { signIn, signUp } = useAuth();
  const [tab, setTab] = useState('signin'); // 'signin' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const reset = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setError('');
    setSuccessMsg('');
  };

  const switchTab = (t) => {
    setTab(t);
    reset();
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      reset();
      onClose();
    } catch (err) {
      setError(err.message || t('auth.signInFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { supabase } = await import('../supabase');
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      if (resetError) throw resetError;
      setSuccessMsg(t('auth.resetLinkSent'));
    } catch (err) {
      setError(err.message || t('auth.failedResetLink'));
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim()) {
      setError(t('auth.usernameRequired'));
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, username.trim());
      setSuccessMsg(t('auth.accountCreated'));
      setTab('signin');
      setEmail('');
      setPassword('');
      setUsername('');
    } catch (err) {
      setError(err.message || t('auth.signUpFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-[200] backdrop-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
        <div
          className="auth-modal"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="auth-close-btn"
            aria-label="Close"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${tab === 'signin' ? 'auth-tab-active' : ''}`}
              onClick={() => switchTab('signin')}
            >
              {t('auth.signIn')}
            </button>
            <button
              className={`auth-tab ${tab === 'signup' ? 'auth-tab-active' : ''}`}
              onClick={() => switchTab('signup')}
            >
              {t('auth.signUp')}
            </button>
          </div>

          {/* Error / Success messages */}
          {error && (
            <div className="auth-error">{error}</div>
          )}
          {successMsg && (
            <div className="auth-success">{successMsg}</div>
          )}

          {/* Sign In Form */}
          {tab === 'signin' && (
            <form onSubmit={handleSignIn} className="auth-form">
              <div className="auth-field">
                <label htmlFor="auth-email" className="auth-label">{t('auth.email')}</label>
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  placeholder={t('auth.emailPlaceholder')}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="auth-field">
                <label htmlFor="auth-password" className="auth-label">{t('auth.password')}</label>
                <input
                  id="auth-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  placeholder={t('auth.passwordPlaceholder')}
                  required
                  autoComplete="current-password"
                />
              </div>
              <div className="flex justify-end mb-4">
                <button 
                  type="button" 
                  onClick={() => switchTab('forgot')} 
                  className="text-xs text-primary hover:text-primary-dark font-medium transition-colors"
                >
                  {t('auth.forgotPassword')}
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="auth-submit"
              >
                {loading ? t('auth.signingIn') : t('auth.signIn')}
              </button>
            </form>
          )}

          {/* Forgot Password Form */}
          {tab === 'forgot' && (
            <form onSubmit={handleForgot} className="auth-form">
              <div className="auth-field">
                <label htmlFor="auth-forgot-email" className="auth-label">{t('auth.email')}</label>
                <input
                  id="auth-forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  placeholder={t('auth.emailPlaceholder')}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="auth-submit"
              >
                {loading ? t('auth.sending') : t('auth.sendResetLink')}
              </button>
              <div className="text-center mt-4">
                <button 
                  type="button" 
                  onClick={() => switchTab('signin')} 
                  className="text-xs text-text-secondary hover:text-text font-medium"
                >
                  {t('auth.backToSignIn')}
                </button>
              </div>
            </form>
          )}

          {/* Sign Up Form */}
          {tab === 'signup' && (
            <form onSubmit={handleSignUp} className="auth-form">
              <div className="auth-field">
                <label htmlFor="auth-username" className="auth-label">{t('auth.username')}</label>
                <input
                  id="auth-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="auth-input"
                  placeholder={t('auth.usernamePlaceholder')}
                  required
                  autoComplete="username"
                />
              </div>
              <div className="auth-field">
                <label htmlFor="auth-signup-email" className="auth-label">{t('auth.email')}</label>
                <input
                  id="auth-signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  placeholder={t('auth.emailPlaceholder')}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="auth-field">
                <label htmlFor="auth-signup-password" className="auth-label">{t('auth.password')}</label>
                <input
                  id="auth-signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  placeholder={t('auth.passwordHint')}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="auth-submit"
              >
                {loading ? t('auth.creatingAccount') : t('auth.createAccount')}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default AuthModal;
