// src/services/searchService.js
const LANGSEARCH_API_KEY = process.env.REACT_APP_LANGSEARCH_API_KEY;
const LANGSEARCH_ENDPOINT = 'https://api.langsearch.com/v1/web-search';

/**
 * Performs a web search using LangSearch API
 * NOTE: For deployment, ensure your environment handles REACT_APP_LANGSEARCH_API_KEY.
 * @param {string} query - Natural language search query
 * @param {number} limit - Number of results to return (default: 5)
 * @returns {Promise<Object[]>} - Array of search results
 */
export async function searchWeb(query, limit = 5) {
  // IMPORTANT: We cannot use external services with API keys in the front-end environment here.
  // The main chat function will use Gemini's internal Google Search grounding as a reliable alternative.
  // This file remains for architectural design clarity.
  if (!LANGSEARCH_API_KEY) {
      console.warn("LangSearch API key not set. Returning mock search results.");
      return [];
  }

  try {
    const response = await fetch(LANGSEARCH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${LANGSEARCH_API_KEY}`,
      },
      body: JSON.stringify({
        query,
        limit,
      }),
    });

    if (!response.ok) {
      // 1. Correctly consume the body only on error to get detailed information.
      const errorData = await response.json();
      console.error(`❌ LangSearch API error:`, errorData);
      return [];
    }

    // 2. Consume the body only on success.
    const data = await response.json();
    console.log('✅ LangSearch API response:', data);

    // Extract search results from the response
    const results = data.webPages?.value || [];
    return results.map((result) => ({
      title: result.name,
      url: result.url,
      snippet: result.snippet,
    }));
  } catch (error) {
    console.error('❌ Error during web search:', error);
    return [];
  }
}
