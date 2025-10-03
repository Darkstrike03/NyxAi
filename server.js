const express = require('express');
const cors = require('cors');

const app = express();
// 1. DYNAMIC PORT: Use the hosting platform's port (process.env.PORT) or default to 3001 for local development.
const PORT = process.env.PORT || 3001; 

// --- SECRET CONFIGURATION (The hosting platform injects this into process.env) ---
// Note: Changed access variable name to be more standard for a Node.js backend
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY; 

// --- CORS CONFIGURATION (CRUCIAL for cross-domain requests) ---
// 2. Add your local and future Vercel domain here!
const allowedOrigins = [
    `http://localhost:3000`, // Your local frontend
    'https://your-vercel-frontend-app.vercel.app', // <-- 🛑 REPLACE THIS with your Vercel URL
];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or Curls) and from allowed domains
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200 // Some older browsers choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());


// Proxy API Endpoint
app.post('/api/generate', async (req, res) => {
    const { userMessage, personality, model } = req.body;

    // Use a clearer environment variable name check if the key is missing on the server
    if (!OPENROUTER_API_KEY) {
        return res.status(500).json({ 
            error: 'Server Error: OPENROUTER_API_KEY not configured.',
            details: 'The API key is missing. Ensure it is set in the environment variables on Render.'
        });
    }

    const prompt = `
You are Nyx, an AI with the following traits:
- Tone: ${personality.tone}
- Humor: ${personality.humor}
- Curiosity Level: ${personality.curiosityLevel}

Respond to the user message below in a way that reflects your personality.
`;

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                // The secret key is safely used here on the server
                Authorization: `Bearer ${OPENROUTER_API_KEY}`, 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model || 'deepseek/deepseek-chat-v3.1:free',
                messages: [
                    { role: 'system', content: prompt.trim() },
                    { role: 'user', content: userMessage },
                ],
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error('OpenRouter upstream error:', response.status, errorBody);
            return res.status(response.status).json({ error: 'LLM Provider Error', details: errorBody });
        }

        const result = await response.json();
        const content = result.choices?.[0]?.message?.content || '[No response received]';
        
        res.json({ content });

    } catch (error) {
        console.error('Proxy server error (network/fetch failure):', error);
        res.status(500).json({ 
            error: 'Internal server error during LLM call.',
            details: error.message || 'A network error occurred.'
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Proxy Server running on port ${PORT}`);
});

