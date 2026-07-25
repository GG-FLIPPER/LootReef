const { supabaseAdmin } = require('../utils/supabaseAdmin');

const TABLE = 'sponsor_slots';

/**
 * Guard: throws if the Supabase admin client is not configured.
 */
function requireClient() {
  if (!supabaseAdmin) {
    throw new Error(
      '[sponsorSlots] Supabase admin client is not configured. ' +
      'Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in server/.env.'
    );
  }
}

/**
 * Expire any slots whose end_date has passed.
 * Sets status = 'expired' and active = false for rows where
 * end_date < today AND status is not already 'expired'.
 *
 * Designed to be called lazily at the top of read endpoints
 * so the DB self-corrects without a cron job.
 */
async function expireStaleSlots() {
  requireClient();
  const todayStr = new Date().toISOString().split('T')[0];

  const { error } = await supabaseAdmin
    .from(TABLE)
    .update({ status: 'expired', active: false })
    .lt('end_date', todayStr)
    .neq('status', 'expired');

  if (error) {
    console.error('[sponsorSlots] expireStaleSlots error:', error.message);
  }
}

// ─────────────────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────────────────

/**
 * Insert a new sponsor slot.
 * @param {Object} slotData - Fields matching the sponsor_slots schema.
 * @returns {{ data: Object|null, error: Object|null }}
 */
async function createSlot(slotData) {
  requireClient();
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .insert(slotData)
    .select()
    .single();

  if (error) console.error('[sponsorSlots] createSlot error:', error.message);
  return { data, error };
}

// ─────────────────────────────────────────────────────────
// READ
// ─────────────────────────────────────────────────────────

/**
 * Fetch a single slot by its UUID.
 * @param {string} id
 * @returns {{ data: Object|null, error: Object|null }}
 */
async function getSlotById(id) {
  requireClient();
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error) console.error('[sponsorSlots] getSlotById error:', error.message);
  return { data, error };
}

/**
 * List slots filtered by placement and one or more statuses.
 * Results ordered by created_at descending.
 *
 * @param {string} placement - 'deal_card' | 'todays_deal'
 * @param {string[]} [statuses] - e.g. ['approved', 'active']. If omitted, all statuses returned.
 * @returns {{ data: Object[]|null, error: Object|null }}
 */
async function listSlotsByPlacement(placement, statuses) {
  requireClient();
  let query = supabaseAdmin
    .from(TABLE)
    .select('*')
    .eq('placement', placement)
    .order('created_at', { ascending: false });

  if (statuses && statuses.length > 0) {
    query = query.in('status', statuses);
  }

  const { data, error } = await query;

  if (error) console.error('[sponsorSlots] listSlotsByPlacement error:', error.message);
  return { data: data || [], error };
}

/**
 * List slots that are currently active and serving.
 * (active = true AND status = 'active')
 *
 * @param {string} [placement] - Optional. If provided, filter by placement type.
 * @returns {{ data: Object[]|null, error: Object|null }}
 */
async function listActiveSlots(placement) {
  requireClient();
  let query = supabaseAdmin
    .from(TABLE)
    .select('*')
    .eq('active', true)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (placement) {
    query = query.eq('placement', placement);
  }

  const { data, error } = await query;

  if (error) console.error('[sponsorSlots] listActiveSlots error:', error.message);
  return { data: data || [], error };
}

// ─────────────────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────────────────

/**
 * Update a slot's status and active flag.
 *
 * @param {string} id - Slot UUID
 * @param {string} status - 'pending' | 'approved' | 'active' | 'expired'
 * @param {boolean} [active] - If provided, sets the active flag too.
 * @returns {{ data: Object|null, error: Object|null }}
 */
async function updateSlotStatus(id, status, active) {
  requireClient();
  const updates = { status };
  if (typeof active === 'boolean') {
    updates.active = active;
  }

  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) console.error('[sponsorSlots] updateSlotStatus error:', error.message);
  return { data, error };
}

/**
 * General partial update — pass any subset of sponsor_slots columns.
 *
 * @param {string} id - Slot UUID
 * @param {Object} updates - Key/value pairs to update.
 * @returns {{ data: Object|null, error: Object|null }}
 */
async function updateSlot(id, updates) {
  requireClient();
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) console.error('[sponsorSlots] updateSlot error:', error.message);
  return { data, error };
}

/**
 * List active serving slots for public display.
 * (active = true AND status in ('approved', 'active') AND start_date <= today AND end_date >= today)
 *
 * @param {string} placement - 'deal_card' | 'todays_deal'
 * @param {number} [limit=4] - Max slots to return (default 4)
 * @returns {{ data: Object[]|null, error: Object|null }}
 */
async function listActiveServingSlots(placement, limit = 4) {
  requireClient();
  const todayStr = new Date().toISOString().split('T')[0];

  let query = supabaseAdmin
    .from(TABLE)
    .select('*')
    .eq('active', true)
    .in('status', ['approved', 'active'])
    .lte('start_date', todayStr)
    .gte('end_date', todayStr)
    .order('created_at', { ascending: true })
    .limit(limit);

  if (placement) {
    query = query.eq('placement', placement);
  }

  const { data, error } = await query;

  if (error) console.error('[sponsorSlots] listActiveServingSlots error:', error.message);
  return { data: data || [], error };
}

/**
 * Increment impressions counter for a sponsor slot.
 * @param {string} id
 */
async function incrementImpressions(id) {
  requireClient();
  const { data: slot, error: getErr } = await getSlotById(id);
  if (getErr || !slot) return { data: null, error: getErr };

  const newImpressions = (slot.impressions || 0) + 1;
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .update({ impressions: newImpressions })
    .eq('id', id)
    .select()
    .single();

  if (error) console.error('[sponsorSlots] incrementImpressions error:', error.message);
  return { data, error };
}

/**
 * Increment clicks counter for a sponsor slot.
 * @param {string} id
 */
async function incrementClicks(id) {
  requireClient();
  const { data: slot, error: getErr } = await getSlotById(id);
  if (getErr || !slot) return { data: null, error: getErr };

  const newClicks = (slot.clicks || 0) + 1;
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .update({ clicks: newClicks })
    .eq('id', id)
    .select()
    .single();

  if (error) console.error('[sponsorSlots] incrementClicks error:', error.message);
  return { data, error };
}

module.exports = {
  createSlot,
  getSlotById,
  listSlotsByPlacement,
  listActiveSlots,
  listActiveServingSlots,
  updateSlotStatus,
  updateSlot,
  incrementImpressions,
  incrementClicks,
  expireStaleSlots,
};

