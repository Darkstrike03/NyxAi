import { getAllSessionData, purgeSessionData } from '../services/cloudService';
import { filterMemory } from '../utils/filterMemory';
import { commitMemory } from '../services/githubService';

export async function commitDailyMemory() {
  try {
    // Step 1: Fetch all session data from Supabase
    const sessionData = await getAllSessionData();

    // Step 2: Filter the session data
    const filteredMemory = filterMemory(sessionData);

    // Step 3: Commit the filtered memory to GitHub
    await commitMemory(filteredMemory);

    // Step 4: Purge Supabase session data
    await purgeSessionData();

    console.log('✅ Daily memory committed and Supabase purged.');
  } catch (error) {
    console.error('❌ Error during daily memory commit:', error);
  }
}