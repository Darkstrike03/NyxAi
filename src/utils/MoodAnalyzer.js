/**
 * Analyzes the user's query and returns a suggested new mood for the AI.
 * The moods must match the keys defined in MoodBox.js (ALL_MOODS).
 * * @param {string} query - The user's input message.
 * @returns {string} - The suggested mood key (e.g., 'playful', 'frustrated').
 */
export function analyzeMood(query) {
    const lowerQuery = query.toLowerCase().trim();

    // 1. ANGER/FRUSTRATION Keywords
    if (lowerQuery.includes('angry') || lowerQuery.includes('frustrate') || lowerQuery.includes('terrible') || lowerQuery.includes('hate') || lowerQuery.includes('stop')) {
        return 'furious';
    }

    // 2. SADNESS/MELANCHOLY Keywords
    if (lowerQuery.includes('sad') || lowerQuery.includes('depressed') || lowerQuery.includes('sorry') || lowerQuery.includes('bad day')) {
        return 'melancholy'; // This should match a key in ALL_MOODS
    }

    // 3. EXCITEMENT/CURIOSITY Keywords
    if (lowerQuery.includes('wow') || lowerQuery.includes('amazing') || lowerQuery.includes('cool') || lowerQuery.includes('tell me more') || lowerQuery.includes('explore')) {
        return 'curious';
    }

    // 4. JOKES/PLAYFULNESS Keywords
    if (lowerQuery.includes('joke') || lowerQuery.includes('pun') || lowerQuery.includes('funny') || lowerQuery.includes('playful') || lowerQuery.includes('ha ha')) {
        return 'playful';
    }

    // 5. CALM/NEUTRAL Keywords (Defaulting to core personality if no strong emotion)
    if (lowerQuery.length < 5 || lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('thank you') || lowerQuery.includes('help')) {
        // Return a core regal/mystical mood for neutral/short queries
        return 'mysterious'; 
    }
    
    // Default fallback to a slightly more active state than the starting 'mysterious'
    return 'contemplative'; 
}