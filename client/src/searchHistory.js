import { supabase } from './supabase';

const STORAGE_KEY = 'pricescout_history';
const MAX_LOCAL = 10;

/**
 * Save a search query.
 * If user is logged in → Supabase. Otherwise → localStorage.
 */
export async function saveSearch(query, user) {
  const trimmed = query.trim();
  if (!trimmed) return;

  if (user) {
    // Logged in — save to Supabase
    await supabase.from('searches').insert({
      user_id: user.id,
      query: trimmed,
      created_at: new Date().toISOString(),
    });
  } else {
    // Guest — save to localStorage
    let history = [];
    try {
      history = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      history = [];
    }

    // Remove duplicates (case-insensitive)
    history = history.filter(
      (h) => h.query.toLowerCase() !== trimmed.toLowerCase()
    );

    // Add new entry at the front
    history.unshift({ query: trimmed, timestamp: new Date().toISOString() });

    // Keep only last 10
    history = history.slice(0, MAX_LOCAL);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }
}

/**
 * Load recent search history.
 * If user is logged in → Supabase. Otherwise → localStorage.
 */
export async function loadHistory(user) {
  if (user) {
    const { data, error } = await supabase
      .from('searches')
      .select('id, query, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Failed to load search history:', error);
      return [];
    }
    return (data || []).map((row) => ({
      id: row.id,
      query: row.query,
      timestamp: row.created_at,
    }));
  } else {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}

/**
 * Delete a single search entry.
 */
export async function deleteSearch(entry, user) {
  if (user) {
    // Delete from Supabase by id
    if (entry.id) {
      await supabase.from('searches').delete().eq('id', entry.id);
    }
  } else {
    let history = [];
    try {
      history = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      history = [];
    }
    history = history.filter(
      (h) =>
        h.query !== entry.query || h.timestamp !== entry.timestamp
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }
}
