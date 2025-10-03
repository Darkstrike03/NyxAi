import { commitMemory } from '../services/githubService';
import { evolvePersonality } from '../utils/personalityEngine';
import { getPersonality, updatePersonality } from '../config/personality';

export async function evolveDailyMemory() {
  try {
    // Step 1: Fetch the previous day's memory from GitHub
    const date = new Date(Date.now() - 86400000).toISOString().slice(0, 10); // Yesterday's date
    const filePath = `memolog/day-${date}.json`;
    const apiUrl = `https://api.github.com/repos/your-github-username/your-repo-name/contents/${filePath}`;
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      console.warn('No previous memory found.');
      return;
    }

    const data = await response.json();
    const previousMemory = JSON.parse(atob(data.content));

    // Step 2: Evolve personality based on previous memory
    const personality = getPersonality();
    const updatedPersonality = evolvePersonality(personality, previousMemory);
    updatePersonality(updatedPersonality);

    console.log('✅ Personality evolved based on previous memory.');
  } catch (error) {
    console.error('❌ Error during memory evolution:', error);
  }
}