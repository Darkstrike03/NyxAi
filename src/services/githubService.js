// src/services/githubService.js

const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;
const REPO_OWNER = 'Darkstrike03'; // replace with your GitHub username
const REPO_NAME = 'NyxAi';        // replace with your main repo name
const BRANCH = 'main';

/**
 * Commits a JSON memory file to GitHub inside /memolog folder.
 * Creates a new file or updates if it already exists.
 * Tracks personality changes and logs commit history.
 * @param {Object} jsonData - The memory data to commit
 * @returns {Promise<Object>} - GitHub API response
 */
export async function commitMemory(jsonData) {
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const fileName = `day-${date}.json`;
  const filePath = `memolog/${fileName}`;
  const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`;

  const content = btoa(JSON.stringify(jsonData, null, 2)); // base64 encode

  // Step 1: Check if file already exists
  let sha = null;
  try {
    const existing = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (existing.status === 200) {
      const data = await existing.json();
      sha = data.sha; // required for updates
    }
  } catch (error) {
    console.error('Error checking existing file:', error);
  }

  // Step 2: Load previous day's personality for diffing
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const prevPath = `memolog/day-${yesterday}.json`;
  const prevUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${prevPath}`;

  let personalityDiff = '';
  try {
    const prevRes = await fetch(prevUrl, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (prevRes.status === 200) {
      const prevData = await prevRes.json();
      const prevContent = JSON.parse(atob(prevData.content));
      const prevPersonality = prevContent.personality || {};
      const newPersonality = jsonData.personality || {};

      const changes = Object.entries(newPersonality).filter(([key, value]) => {
        return prevPersonality[key] !== value;
      });

      if (changes.length > 0) {
        personalityDiff = changes
          .map(([key, value]) => `→ ${key} changed from "${prevPersonality[key]}" to "${value}"`)
          .join('\n');
      }
    }
  } catch (error) {
    console.warn('No previous personality found for diffing.');
  }

  // Step 3: Create or update the file
  try {
    const commitMessage = `Memory commit for ${fileName}` + (personalityDiff ? `\n\nPersonality changes:\n${personalityDiff}` : '');

    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        message: commitMessage,
        content,
        branch: BRANCH,
        ...(sha && { sha }), // include sha only if updating
      }),
    });

    const result = await response.json();
    if (response.ok) {
      console.log(`✅ Memory committed: ${fileName}`);
      if (personalityDiff) {
        console.log(`🧠 Personality diff:\n${personalityDiff}`);
      }
    } else {
      console.error(`❌ Commit failed:`, result);
    }
    return result;
  } catch (error) {
    console.error('Error committing memory:', error);
    throw error;
  }
}