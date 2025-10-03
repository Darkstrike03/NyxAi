// src/config/personality.js
import personalityData from './personality.json';

/**
 * Returns the current personality object
 * @returns {Object} - AI personality traits
 */
export function getPersonality() {
  return { ...personalityData };
}

/**
 * Updates personality traits in memory (not persistent)
 * Use this before committing to GitHub
 * @param {Object} updates - Partial trait updates
 * @returns {Object} - Updated personality object
 */
export function updatePersonality(updates) {
  return {
    ...personalityData,
    ...updates,
  };
}