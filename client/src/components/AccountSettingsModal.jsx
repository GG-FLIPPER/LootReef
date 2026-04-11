import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../AuthContext';

function AccountSettingsModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  
  const [tab, setTab] = useState('password'); // 'password' | 'delete'
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const resetState = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccessMsg('');
  };

  const switchTab = (t) => {
    setTab(t);
    resetState();
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (newPassword !== confirmPassword) {
      setError(t('account.passwordsDoNotMatch', 'New passwords do not match'));
      return;
    }

    if (newPassword.length < 6) {
      setError(t('account.passwordTooShort', 'Password must be at least 6 characters'));
      return;
    }

    setLoading(true);
    try {
      const { supabase } = await import('../supabase');
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;
      
      setSuccessMsg(t('account.passwordChanged', 'Password changed successfully'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || t('account.passwordChangeFailed', 'Failed to change password'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setError('');
    setLoading(true);
    try {
      const { supabase } = await import('../supabase');
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          is_deleted: true, 
          deleted_at: new Date().toISOString() 
        })
        .eq('id', user.id);
        
      if (updateError) throw updateError;

      onClose();
      await signOut();
    } catch (err) {
      setError(err.message || t('account.deactivateFailed', 'Failed to delete account'));
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[200] backdrop-fade-in" onClick={onClose} />
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
        <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
          <button onClick={onClose} className="auth-close-btn" aria-label="Close">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="auth-tabs">
            <button className={`auth-tab ${tab === 'password' ? 'auth-tab-active' : ''}`} onClick={() => switchTab('password')}>
              {t('account.passwordTab')}
            </button>
            <button className={`auth-tab ${tab === 'delete' ? 'auth-tab-active !text-red-500' : ''}`} onClick={() => switchTab('delete')}>
              {t('account.dangerZoneTab')}
            </button>
          </div>

          {error && <div className="auth-error">{error}</div>}
          {successMsg && <div className="auth-success">{successMsg}</div>}

          {tab === 'password' && (
            <form onSubmit={handlePasswordChange} className="auth-form mt-4">
              <div className="auth-field">
                <label className="auth-label">{t('account.currentPassword')}</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="auth-input"
                  required
                  autoComplete="current-password"
                />
              </div>
              <div className="auth-field">
                <label className="auth-label">{t('account.newPassword')}</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="auth-input"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>
              <div className="auth-field">
                <label className="auth-label">{t('account.confirmNewPassword')}</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="auth-input"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>
              <button type="submit" disabled={loading} className="auth-submit">
                {loading ? t('account.updating') : t('account.updatePassword')}
              </button>
            </form>
          )}

          {tab === 'delete' && (
            <div className="auth-form mt-4">
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-4 text-sm text-red-500">
                <strong>{t('account.warning', 'Warning')}:</strong> {t('account.warningDelete')}
              </div>
              <button 
                onClick={handleDeleteAccount} 
                disabled={loading} 
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-4 rounded-xl transition-all"
              >
                {loading ? t('account.deactivating') : t('account.deactivateBtn')}
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default AccountSettingsModal;
