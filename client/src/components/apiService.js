// apiService.js
// This file handles all communication with the backend API.

// Define the base URL for your Node.js backend
// In a real deployment, this would be your server's domain (e.g., 'https://api.yourdomain.com')
const BACKEND_BASE_URL = 'https://texttune.onrender.com'; // Adjust if your backend runs on a different port/host

/**
 * Generic function to make API calls to the backend.
 * @param {string} endpoint - The API endpoint (e.g., '/api/rewrite', '/api/generate').
 * @param {object} data - The data payload to send in the request body.
 * @returns {Promise<object>} The JSON response from the backend.
 * @throws {Error} If the network request fails or the backend returns an error.
 */
export const callBackendApi = async (endpoint, data) => {
    const response = await fetch(`${BACKEND_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
};

// You can add more specific API functions here if needed,
// e.g., export const rewriteText = (text) => callBackendApi('/api/rewrite', { text });
// export const generateText = (prompt) => callBackendApi('/api/generate', { prompt });
