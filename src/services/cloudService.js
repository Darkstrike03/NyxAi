// src/services/cloudService.js
import { supabase } from '../config/supabaseClient';

const TABLE_NAME = 'session_memory';

/**
 * Stores session data temporarily in Supabase
 * @param {string} id - Unique ID (e.g., timestamp or UUID)
 * @param {Object} data - Data to store
 */
export async function storeSessionData(id, data) {
  const { error } = await supabase
    .from(TABLE_NAME)
    .upsert({ id, ...data });

  if (error) {
    console.error('❌ Error storing session data:', error);
  } else {
    console.log(`✅ Stored session data for ${id}`);
  }
}

/**
 * Retrieves all session data
 * @returns {Promise<Object[]>} - Array of session entries
 */
export async function getAllSessionData() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*');

  if (error) {
    console.error('❌ Error fetching session data:', error);
    return [];
  }

  return data;
}

/**
 * Updates a specific session entry
 * @param {string} id - ID to update
 * @param {Object} updates - Partial updates
 */
export async function updateSessionData(id, updates) {
  const { error } = await supabase
    .from(TABLE_NAME)
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('❌ Error updating session data:', error);
  } else {
    console.log(`🔄 Updated session data for ${id}`);
  }
}

/**
 * Deletes all session data
 */
export async function purgeSessionData() {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .neq('id', '');

  if (error) {
    console.error('❌ Error purging session data:', error);
  } else {
    console.log('🧹 Supabase RAM purged.');
  }
}