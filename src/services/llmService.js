// 🛑 IMPORTANT: The secret key is NO LONGER here 🛑

const PROXY_ENDPOINT = 'http://localhost:3001/api/generate'; // Your new backend server URL

/**
 * Generates a response by calling the secure backend proxy.
 * @param {string} userMessage - The user's input
 * @param {Object} personality - Nova's personality traits
 * @param {string} model - OpenRouter model ID
 * @returns {Promise<string>} - AI response
 */
export async function generateResponse(userMessage, personality, model = 'deepseek/deepseek-chat-v3.1:free') {
    try {
        const response = await fetch(PROXY_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Send all required data to the backend for it to build the final OpenRouter payload
            body: JSON.stringify({
                userMessage,
                personality,
                model
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            // Log the error details sent back from your proxy server
            console.error(`❌ Proxy request failed with status ${response.status}:`, errorData);
            return `[Error generating response: ${errorData.details?.message || errorData.error}]`;
        }

        const result = await response.json();
        
        // The backend sends back a simple object { content: "..." }
        return result.content; 
    } catch (error) {
        console.error('❌ Network or Proxy connection error:', error);
        return '[Error connecting to the chat service]';
    }
}