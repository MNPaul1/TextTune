// server.js
// This file demonstrates a conceptual Node.js Express backend for TextTune.
// It cannot be run directly within the Canvas environment.
// In a real application, you would host this on a server.

const express = require('express');
const cors = require('cors');
require('dotenv').config(); // For loading environment variables from a .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all origins (adjust in production for specific origins)
app.use(express.json()); // Enable parsing of JSON request bodies

// Replace with your actual Gemini API Key in a secure environment variable
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "YOUR_GEMINI_API_KEY_HERE";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

/**
 * Helper function to call the Gemini API.
 * Encapsulates the fetch logic and basic error handling.
 * @param {string} prompt - The text prompt to send to Gemini.
 * @param {number} temperature - Controls the randomness of the output.
 * @param {number} maxOutputTokens - Maximum number of tokens to generate (hard limit for API).
 * @param {number | null} wordLimit - Optional approximate maximum word limit for the generated text.
 * @param {number | null} minWordLimit - Optional approximate minimum word limit for the generated text.
 * @param {string} tone - Optional tone/style for the generated text.
 * @returns {Promise<string>} The generated text from Gemini.
 * @throws {Error} If the API call fails or no content is found.
 */
async function callGeminiApi(prompt, temperature, maxOutputTokens, wordLimit = null, minWordLimit = null, tone = 'neutral') {
    // Dynamically import node-fetch within the async function
    // This handles the ERR_REQUIRE_ESM issue for node-fetch
    const fetch = (await import('node-fetch')).default;

    // Append word limits and tone to the prompt if provided
    let finalPrompt = prompt;
    let constraints = [];

    if (minWordLimit !== null && minWordLimit > 0) {
        constraints.push(`minimum ${minWordLimit} words`);
    }
    if (wordLimit !== null && wordLimit > 0) {
        constraints.push(`approximately ${wordLimit} words`);
    }
    if (tone && tone !== 'neutral') {
        constraints.push(`in a ${tone} tone`);
    }

    if (constraints.length > 0) {
        finalPrompt += ` (${constraints.join(' and ')})`;
    }

    const payload = {
        contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
        generationConfig: {
            temperature: temperature,
            // maxOutputTokens is a hard limit on tokens, not words.
            // It's good to keep it reasonably high to allow the AI to finish its thought,
            // while the prompt guides it on word count.
            maxOutputTokens: maxOutputTokens,
        },
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error(`Gemini API error: ${response.status} ${response.statusText} - ${errorData.error.message || 'Unknown error'}`);
        throw new Error(errorData.error.message || 'Error from AI service');
    }

    const result = await response.json();

    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
        return result.candidates[0].content.parts[0].text.trim();
    } else {
        throw new Error("No content found in AI response.");
    }
}

// API endpoint to rewrite text
app.post('/api/rewrite', async (req, res) => {
    const { text: input_text, wordLimit, minWordLimit, tone } = req.body; // Destructure all parameters

    if (!input_text) {
        return res.status(400).json({ error: "No text provided for rewriting." });
    }

    const prompt = `Perform a grammar check and rewrite the following text in perfect, natural-sounding English. Correct any grammatical errors, awkward phrasing, spelling mistakes, or unclear expressions. Focus on clarity, conciseness, and accuracy while maintaining the original meaning.

    Text to rewrite: "${input_text}"

    Rewritten text:`;

    try {
        // Pass all parameters to callGeminiApi
        const rewrittenText = await callGeminiApi(prompt, 0.7, 1000, wordLimit, minWordLimit, tone);
        return res.json({ rewrittenText });
    } catch (error) {
        console.error("Error rewriting text:", error);
        return res.status(500).json({ error: `Failed to rewrite text: ${error.message}` });
    }
});

// API endpoint to generate text
app.post('/api/generate', async (req, res) => {
    const { prompt: input_prompt, wordLimit, minWordLimit, tone } = req.body; // Destructure all parameters

    if (!input_prompt) {
        return res.status(400).json({ error: "No prompt provided for generation." });
    }

    const prompt = `Generate a message based on the following request. Be creative and helpful.

    Request: "${input_prompt}"

    Generated message:`;

    try {
        // Pass all parameters to callGeminiApi
        const generatedText = await callGeminiApi(prompt, 0.9, 500, wordLimit, minWordLimit, tone);
        return res.json({ generatedText });
    } catch (error) {
        console.error("Error generating text:", error);
        return res.status(500).json({ error: `Failed to generate text: ${error.message}` });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access rewrite endpoint at http://localhost:${PORT}/api/rewrite`);
    console.log(`Access generate endpoint at http://localhost:${PORT}/api/generate`);
});

/*
To run this Node.js Express backend:
1. Make sure you have Node.js installed.
2. Create a new directory for your backend (e.g., 'backend').
3. Inside that directory, run: `npm init -y`
4. Install necessary packages: `npm install express cors node-fetch dotenv`
5. Create a file named `server.js` and paste the code above into it.
6. Create a `.env` file in the same directory and add your Gemini API key:
   `GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY_HERE"`
7. Run the server: `node server.js`
*/
