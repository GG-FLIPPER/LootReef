const express = require('express');
const {
  createSlot,
  updateSlot,
  getSlotById,
  listActiveServingSlots,
  incrementImpressions,
  incrementClicks,
} = require('../models/sponsorSlots');
const { supabaseAdmin } = require('../utils/supabaseAdmin');

const router = express.Router();

// ─── Pricing lookup (server-side, never trust client input) ───
const PRICING = {
  deal_card: { '3day': 8, '7day': 15, '14day': 25, '30day': 45 },
  todays_deal: { '3day': 15, '7day': 28, '14day': 45, '30day': 80 },
};

const TIER_DAYS = { '3day': 3, '7day': 7, '14day': 14, '30day': 30 };

const VALID_PLACEMENTS = Object.keys(PRICING);
const VALID_TIERS = ['3day', '7day', '14day', '30day'];

// ═══════════════════════════════════════════════════════════
// PUBLIC — Active slots, Impressions & Clicks
// ═══════════════════════════════════════════════════════════

/**
 * GET /api/sponsors/active?placement=deal_card
 * Public endpoint — returns up to 4 active/approved serving sponsor slots for placement.
 */
router.get('/active', async (req, res) => {
  try {
    const placement = req.query.placement || 'deal_card';
    const limit = parseInt(req.query.limit, 10) || 4;

    const { data, error } = await listActiveServingSlots(placement, Math.min(limit, 10));

    if (error) {
      console.error('[sponsors/active] Error fetching active serving slots:', error.message);
      return res.json({ slots: [] });
    }

    res.json({ slots: data || [] });
  } catch (err) {
    console.error('[sponsors/active] Unexpected error:', err);
    res.json({ slots: [] });
  }
});

/**
 * POST /api/sponsors/:id/impression
 * Public endpoint — increments the impression counter for a slot.
 */
router.post('/:id/impression', async (req, res) => {
  try {
    const { id } = req.params;
    await incrementImpressions(id);
    res.json({ success: true });
  } catch (err) {
    console.error('[sponsors/impression] Error:', err);
    res.json({ success: false });
  }
});

/**
 * POST /api/sponsors/:id/click
 * Public endpoint — increments the click counter for a slot.
 */
router.post('/:id/click', async (req, res) => {
  try {
    const { id } = req.params;
    await incrementClicks(id);
    res.json({ success: true });
  } catch (err) {
    console.error('[sponsors/click] Error:', err);
    res.json({ success: false });
  }
});

// ═══════════════════════════════════════════════════════════
// PUBLIC — Application submission
// ═══════════════════════════════════════════════════════════


/**
 * POST /api/sponsors/apply
 * Public endpoint — accepts a sponsor slot application.
 */
router.post('/apply', async (req, res) => {
  try {
    const {
      company_name,
      contact_email,
      card_title,
      card_description,
      target_url,
      placement,
      tier,
    } = req.body;

    // ─── Validate required fields ───
    const missing = [];
    if (!company_name) missing.push('company_name');
    if (!contact_email) missing.push('contact_email');
    if (!card_title) missing.push('card_title');
    if (!target_url) missing.push('target_url');
    if (!placement) missing.push('placement');
    if (!tier) missing.push('tier');

    if (missing.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        fields: missing,
      });
    }

    // ─── Validate enums ───
    if (!VALID_PLACEMENTS.includes(placement)) {
      return res.status(400).json({
        error: `Invalid placement. Must be one of: ${VALID_PLACEMENTS.join(', ')}`,
      });
    }
    if (!VALID_TIERS.includes(tier)) {
      return res.status(400).json({
        error: `Invalid tier. Must be one of: ${VALID_TIERS.join(', ')}`,
      });
    }

    // ─── Validate email format (basic) ───
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact_email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // ─── Validate URL format (basic) ───
    try {
      new URL(target_url);
    } catch {
      return res.status(400).json({ error: 'Invalid target_url — must be a full URL' });
    }

    // ─── Server-side price lookup ───
    const price_paid = PRICING[placement][tier];

    // ─── Insert into DB ───
    const { data, error } = await createSlot({
      company_name: company_name.trim(),
      contact_email: contact_email.trim().toLowerCase(),
      card_title: card_title.trim(),
      card_description: card_description ? card_description.trim() : null,
      target_url: target_url.trim(),
      placement,
      tier,
      price_paid,
      currency: 'USD',
      status: 'pending',
      active: false,
    });

    if (error) {
      console.error('[sponsors/apply] DB error:', error.message);
      return res.status(500).json({ error: 'Failed to submit application. Please try again.' });
    }

    // Return minimal info — don't leak internal fields
    res.status(201).json({
      success: true,
      message: 'Application received! We will review it and get back to you shortly.',
      id: data.id,
    });
  } catch (err) {
    console.error('[sponsors/apply] Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ═══════════════════════════════════════════════════════════
// ADMIN AUTH MIDDLEWARE & ENDPOINTS
// ═══════════════════════════════════════════════════════════

/**
 * Middleware to check X-Admin-Password header against process.env.ADMIN_PASSWORD
 */
const requireAdminAuth = (req, res, next) => {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const providedPassword = req.headers['x-admin-password'];

  if (!providedPassword || providedPassword !== adminPassword) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing admin password' });
  }
  next();
};

/**
 * POST /api/sponsors/admin/verify
 * Verifies admin password
 */
router.post('/admin/verify', requireAdminAuth, (req, res) => {
  res.json({ success: true });
});

/**
 * GET /api/sponsors/admin/pending
 * List all pending sponsor applications, oldest first.
 */
router.get('/admin/pending', requireAdminAuth, async (req, res) => {
  try {
    if (!supabaseAdmin) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const { data, error } = await supabaseAdmin
      .from('sponsor_slots')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[sponsors/admin] List pending error:', error.message);
      return res.status(500).json({ error: 'Failed to fetch pending applications' });
    }

    res.json({ slots: data || [] });
  } catch (err) {
    console.error('[sponsors/admin] Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/sponsors/admin/active
 * List all active/approved sponsor slots, sorted by end_date ascending.
 */
router.get('/admin/active', requireAdminAuth, async (req, res) => {
  try {
    if (!supabaseAdmin) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const { data, error } = await supabaseAdmin
      .from('sponsor_slots')
      .select('*')
      .in('status', ['approved', 'active'])
      .order('end_date', { ascending: true, nullsFirst: false });

    if (error) {
      console.error('[sponsors/admin] List active error:', error.message);
      return res.status(500).json({ error: 'Failed to fetch active/approved applications' });
    }

    res.json({ slots: data || [] });
  } catch (err) {
    console.error('[sponsors/admin] Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PATCH /api/sponsors/admin/:id/approve
 * Approve a pending application. Accepts optional edits to card fields.
 * Calculates start_date (today) and end_date (today + tier days) server-side.
 */
router.patch('/admin/:id/approve', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the current slot to get tier info
    const { data: slot, error: fetchErr } = await getSlotById(id);
    if (fetchErr || !slot) {
      return res.status(404).json({ error: 'Sponsor slot not found' });
    }

    if (slot.status !== 'pending') {
      return res.status(400).json({ error: `Cannot approve — slot status is "${slot.status}", expected "pending"` });
    }

    // Allow admin to edit these fields before approving
    const editable = {};
    const { card_title, card_description, target_url } = req.body;
    if (card_title !== undefined) editable.card_title = card_title.trim();
    if (card_description !== undefined) editable.card_description = card_description.trim() || null;
    if (target_url !== undefined) {
      try {
        new URL(target_url);
        editable.target_url = target_url.trim();
      } catch {
        return res.status(400).json({ error: 'Invalid target_url' });
      }
    }

    // Calculate dates server-side
    const days = TIER_DAYS[slot.tier] || 7;
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    const updates = {
      ...editable,
      status: 'approved',
      active: true,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
    };

    const { data: updated, error: updateErr } = await updateSlot(id, updates);
    if (updateErr) {
      console.error('[sponsors/admin] Approve error:', updateErr.message);
      return res.status(500).json({ error: 'Failed to approve application' });
    }

    console.log(`[sponsors/admin] Approved slot ${id} — ${updated.card_title} (${updated.tier}, ${updates.start_date} → ${updates.end_date})`);

    res.json({ success: true, slot: updated });
  } catch (err) {
    console.error('[sponsors/admin] Approve unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PATCH /api/sponsors/admin/:id/reject
 * Soft-reject: sets status to "expired", keeps the record.
 */
router.patch('/admin/:id/reject', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: slot, error: fetchErr } = await getSlotById(id);
    if (fetchErr || !slot) {
      return res.status(404).json({ error: 'Sponsor slot not found' });
    }

    if (slot.status !== 'pending') {
      return res.status(400).json({ error: `Cannot reject — slot status is "${slot.status}", expected "pending"` });
    }

    const { data: updated, error: updateErr } = await updateSlot(id, {
      status: 'expired',
      active: false,
    });

    if (updateErr) {
      console.error('[sponsors/admin] Reject error:', updateErr.message);
      return res.status(500).json({ error: 'Failed to reject application' });
    }

    console.log(`[sponsors/admin] Rejected slot ${id} — ${updated.card_title}`);

    res.json({ success: true, slot: updated });
  } catch (err) {
    console.error('[sponsors/admin] Reject unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PATCH /api/sponsors/admin/:id/deactivate
 * Manually deactivate an active/approved slot (sets active: false, status: 'expired').
 */
router.patch('/admin/:id/deactivate', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: slot, error: fetchErr } = await getSlotById(id);
    if (fetchErr || !slot) {
      return res.status(404).json({ error: 'Sponsor slot not found' });
    }

    const { data: updated, error: updateErr } = await updateSlot(id, {
      status: 'expired',
      active: false,
    });

    if (updateErr) {
      console.error('[sponsors/admin] Deactivate error:', updateErr.message);
      return res.status(500).json({ error: 'Failed to deactivate slot' });
    }

    console.log(`[sponsors/admin] Deactivated slot ${id} — ${updated.card_title}`);

    res.json({ success: true, slot: updated });
  } catch (err) {
    console.error('[sponsors/admin] Deactivate unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


