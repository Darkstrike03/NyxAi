// src/hooks/useChatMemory.js
import { useState, useEffect } from 'react';
import {
  storeSessionData,
  getAllSessionData,
  purgeSessionData,
} from '../services/cloudService';

export function useChatMemory() {
  const [sessionLog, setSessionLog] = useState([]);

  // Add a new message to memory
  const logMessage = async (message, mood = 'neutral', intent = 'chat') => {
    const entry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      message,
      mood,
      intent,
    };

    await storeSessionData(entry.id, entry);
    setSessionLog(prev => [...prev, entry]);
  };

  // Load all session data
  const loadSession = async () => {
    const data = await getAllSessionData();
    const sorted = Object.values(data).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    setSessionLog(sorted);
  };

  // Purge session memory
  const clearSession = async () => {
    await purgeSessionData();
    setSessionLog([]);
  };

  useEffect(() => {
    loadSession();
  }, []);

  return {
    sessionLog,
    logMessage,
    clearSession,
  };
}