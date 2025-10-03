import { commitDailyMemory } from './services/commitDailyMemory';
import { evolveDailyMemory } from './utils/evolveDailyMemory';

// Scheduler function to run tasks at specific times
export function startScheduler() {
  // Run at the end of the day (e.g., 11:59 PM)
  setInterval(async () => {
    const now = new Date();
    if (now.getHours() === 23 && now.getMinutes() === 59) {
      console.log('⏳ Committing daily memory...');
      await commitDailyMemory();
    }
  }, 60000); // Check every minute

  // Run at the start of the day (e.g., 12:01 AM)
  setInterval(async () => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 1) {
      console.log('⏳ Evolving daily memory...');
      await evolveDailyMemory();
    }
  }, 60000); // Check every minute
}