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

module.exports = {
  createSlot,
  getSlotById,
  listSlotsByPlacement,
  listActiveSlots,
  updateSlotStatus,
  updateSlot,
};
