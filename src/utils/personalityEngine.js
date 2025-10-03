// src/utils/personalityEngine.js

/**
 * Evolves personality traits based on filtered memory
 * @param {Object} currentPersonality - Current personality JSON
 * @param {Object} filteredMemory - Output from filterMemory.js
 * @returns {Object} - Updated personality object
 */
export function evolvePersonality(currentPersonality, filteredMemory) {
  const updated = { ...currentPersonality };
  const { mood, learnings } = filteredMemory;

  // Mood-based tone adjustment
  if (mood === 'happy') {
    updated.tone = 'cheerful';
  } else if (mood === 'sad') {
    updated.tone = 'empathetic';
  } else if (mood === 'curious') {
    updated.tone = 'inquisitive';
    updated.curiosityLevel = Math.min(updated.curiosityLevel + 0.1, 1);
  } else if (mood === 'angry') {
    updated.tone = 'blunt';
    updated.humor = 'dry';
  } else {
    updated.tone = 'neutral';
  }

  // Learning-based curiosity boost
  if (learnings.length > 5) {
    updated.curiosityLevel = Math.min(updated.curiosityLevel + 0.05, 1);
  }

  // Humor evolution (example logic)
  const humorTriggers = ['joke', 'funny', 'laugh', 'sarcasm'];
  const humorMentions = learnings.filter(l => humorTriggers.some(t => l.toLowerCase().includes(t)));
  if (humorMentions.length > 0) {
    updated.humor = 'playful';
  }

  return updated;
}