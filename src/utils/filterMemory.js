// src/utils/filterMemory.js

/**
 * Filters raw session data to extract meaningful learnings
 * @param {Object[]} sessionData - Array of session entries from Supabase
 * @returns {Object} - Filtered memory object for GitHub commit
 */
export function filterMemory(sessionData) {
  const learnings = [];
  const moodCounts = {};
  const personality = {
    tone: 'neutral',
    humor: 'dry',
    curiosityLevel: 0.5,
  };

  sessionData.forEach(entry => {
    const { message, mood, intent } = entry;

    // Track mood frequency
    if (mood) {
      moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    }

    // Filter out trivial messages
    if (isTrivial(message)) return;

    // Extract learnings
    if (intent === 'preference') {
      learnings.push(`User prefers ${message}`);
    } else if (intent === 'avoidance') {
      learnings.push(`User avoids ${message}`);
    } else if (intent === 'emotion') {
      learnings.push(`User expressed feeling ${message}`);
    } else if (intent === 'feedback') {
      learnings.push(`User reacted with: "${message}"`);
    }
  });

  // Infer dominant mood
  const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';

  // Adjust personality based on mood
  if (dominantMood === 'curious') {
    personality.curiosityLevel = Math.min(personality.curiosityLevel + 0.2, 1);
    personality.tone = 'inquisitive';
  } else if (dominantMood === 'happy') {
    personality.tone = 'cheerful';
  } else if (dominantMood === 'sad') {
    personality.tone = 'empathetic';
  }

  return {
    date: new Date().toISOString().slice(0, 10),
    mood: dominantMood,
    learnings,
    personality,
  };
}

/**
 * Determines if a message is trivial or not worth remembering
 * @param {string} message
 * @returns {boolean}
 */
function isTrivial(message) {
  const lower = message.toLowerCase();
  const trivialPhrases = [
    'hello', 'hi', 'how are you', 'what is', 'who is', 'tell me about',
    'thanks', 'bye', 'good morning', 'good night'
  ];

  return trivialPhrases.some(phrase => lower.includes(phrase));
}