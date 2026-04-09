import { supabase } from './supabase';

const STORAGE_KEY = 'pricescout_bookmarks';
const MAX_LOCAL = 50;

/**
 * Save a bookmark.
 * If user is logged in → Supabase. Otherwise → localStorage.
 */
export async function saveBookmark(offer, user) {
  if (user) {
    // Logged in — save to Supabase
    const { error } = await supabase.from('bookmarks').insert({
      user_id: user.id,
      offer: offer,
      created_at: new Date().toISOString(),
    });
    if (error) console.error('Error saving bookmark to Supabase:', error);
  } else {
    // Guest — save to localStorage
    let bookmarks = [];
    try {
      bookmarks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      bookmarks = [];
    }

    // Remove duplicates based on URL
    bookmarks = bookmarks.filter(
      (b) => b.offer && b.offer.url !== offer.url
    );

    // Add new entry at the front
    bookmarks.unshift({ offer, created_at: new Date().toISOString() });

    // Keep only last MAX_LOCAL
    bookmarks = bookmarks.slice(0, MAX_LOCAL);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }
}

/**
 * Load bookmarks.
 * If user is logged in → Supabase. Otherwise → localStorage.
 */
export async function loadBookmarks(user) {
  if (user) {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('id, offer, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to load bookmarks:', error);
      return [];
    }
    return (data || []).map((row) => ({
      id: row.id,
      offer: row.offer,
      created_at: row.created_at,
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
 * Delete a bookmark by URL (for guests) or DB ID (for users).
 */
export async function removeBookmark(offerUrl, user) {
  if (user) {
    // If the user passed the offer URL or offer object, let's delete by matching offer->>url.
    // Supabase jsonb querying: ->>'url'.eq(offerUrl)
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', user.id)
      .filter('offer->>url', 'eq', offerUrl);
    
    if (error) console.error('Error removing bookmark from Supabase:', error);
  } else {
    let bookmarks = [];
    try {
      bookmarks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      bookmarks = [];
    }
    bookmarks = bookmarks.filter(
      (b) => b.offer && b.offer.url !== offerUrl
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }
}

/**
 * Check if an offer is bookmarked.
 * Note: For Supabase, doing a sync check is not possible.
 * It's better for components to fetch all bookmarks and do the check locally, 
 * or this function is async. We will provide an async check here.
 * Alternatively, components can pass in the current loaded bookmarks array.
 */
export async function isBookmarked(offerUrl, user) {
  if (user) {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', user.id)
      .filter('offer->>url', 'eq', offerUrl)
      .limit(1);
    
    if (error) {
      console.error('Error checking bookmark:', error);
      return false;
    }
    return data && data.length > 0;
  } else {
    let bookmarks = [];
    try {
      bookmarks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      bookmarks = [];
    }
    return bookmarks.some((b) => b.offer && b.offer.url === offerUrl);
  }
}
