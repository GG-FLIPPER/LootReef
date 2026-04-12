import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabase';

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single();
        
      if (error && error.code !== 'PGRST116') {
         console.error('fetchProfile error:', error);
      }
      
      if (data) {
        setProfile(data);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error('fetchProfile exception:', err);
      setProfile(null);
    }
  }

  // Sync localStorage searches to Supabase on sign-in
  async function syncLocalSearches(userId) {
    const raw = localStorage.getItem('pricescout_history');
    if (!raw) return;

    let localHistory;
    try {
      localHistory = JSON.parse(raw);
    } catch {
      return;
    }
    if (!Array.isArray(localHistory) || localHistory.length === 0) return;

    // Fetch existing searches from Supabase
    const { data: existing } = await supabase
      .from('searches')
      .select('query')
      .eq('user_id', userId);

    const existingQueries = new Set((existing || []).map((s) => s.query.toLowerCase()));

    // Insert only new ones
    const toInsert = localHistory
      .filter((h) => !existingQueries.has(h.query.toLowerCase()))
      .map((h) => ({
        user_id: userId,
        query: h.query,
        created_at: h.timestamp,
      }));

    if (toInsert.length > 0) {
      await supabase.from('searches').insert(toInsert);
    }

    // Clear localStorage history after merge
    localStorage.removeItem('pricescout_history');
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) fetchProfile(u.id);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const u = session?.user ?? null;
        setUser(u);
        
        if (u) {
          if (event === 'SIGNED_IN') {
            const { data: existingProfile } = await supabase
              .from('profiles')
              .select('username')
              .eq('id', u.id)
              .single();
              
            if (!existingProfile) {
              const pendingUsername = localStorage.getItem('pricescout_pending_username');
              if (pendingUsername) {
                await supabase.from('profiles').insert({ id: u.id, username: pendingUsername });
                localStorage.removeItem('pricescout_pending_username');
              }
              await fetchProfile(u.id);
            } else {
              setProfile(existingProfile);
            }
          } else {
            await fetchProfile(u.id);
          }
          await syncLocalSearches(u.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (data.user) {
      const { data: prof } = await supabase
        .from('profiles')
        .select('is_deleted')
        .eq('id', data.user.id)
        .single();
        
      if (prof?.is_deleted) {
        await supabase.auth.signOut();
        throw new Error('This account has been deactivated.');
      }
      await fetchProfile(data.user.id);
    }
    return data;
  }

  async function signUp(email, password, username) {
    localStorage.setItem('pricescout_pending_username', username);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;

    return data;
  }

  async function signOut() {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Sign out error:', e);
    } finally {
      setUser(null);
      setProfile(null);
      window.location.href = '/';
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
