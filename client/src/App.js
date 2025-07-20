import React, { useState, useCallback } from 'react';
import { callBackendApi } from './components/apiService'; // Import the API service function
import RewriteMode from './components/rewriteMode'; // Import RewriteMode component
import GenerateMode from './components/generateMode'; // Import GenerateMode component
import './App.css'; // Import the main CSS file

// Main App component
const App = () => {
    // State to manage the current mode: 'rewrite' or 'generate'
    const [mode, setMode] = useState('rewrite');

    // States for Rewrite feature
    const [inputRewriteText, setInputRewriteText] = useState('');
    const [rewrittenText, setRewrittenText] = useState('');

    // States for Generate feature
    const [inputGeneratePrompt, setInputGeneratePrompt] = useState('');
    const [generatedText, setGeneratedText] = useState('');

    // Common states for API interaction
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to handle the text rewriting process
    // Now accepts maxWordLimit and minWordLimit
    const handleRewrite = useCallback(async (maxWordLimit, minWordLimit) => {
        setRewrittenText('');
        setError(null);
        setIsLoading(true);

        // --- Validation for word limits ---
        if (maxWordLimit !== null && minWordLimit !== null && maxWordLimit < minWordLimit) {
            setError("Maximum word limit cannot be less than minimum word limit.");
            setIsLoading(false);
            return; // Stop execution if validation fails
        }
        // --- End Validation ---

        try {
            // Pass wordLimit and minWordLimit in the data payload
            const result = await callBackendApi('/api/rewrite', {
                text: inputRewriteText,
                wordLimit: maxWordLimit,
                minWordLimit: minWordLimit
            });
            setRewrittenText(result.rewrittenText);
        } catch (err) {
            console.error("Error rewriting text:", err);
            setError(`Failed to rewrite text: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [inputRewriteText]); // Dependencies for useCallback

    // Function to handle the text generation process
    // Now accepts maxWordLimit and minWordLimit
    const handleGenerate = useCallback(async (maxWordLimit, minWordLimit) => {
        setGeneratedText('');
        setError(null);
        setIsLoading(true);

        // --- Validation for word limits ---
        if (maxWordLimit !== null && minWordLimit !== null && maxWordLimit < minWordLimit) {
            setError("Max word limit cannot be less than min word limit.");
            setIsLoading(false);
            return; // Stop execution if validation fails
        }
        // --- End Validation ---

        try {
            // Pass wordLimit and minWordLimit in the data payload
            const result = await callBackendApi('/api/generate', {
                prompt: inputGeneratePrompt,
                wordLimit: maxWordLimit,
                minWordLimit: minWordLimit
            });
            setGeneratedText(result.generatedText);
        } catch (err) {
            console.error("Error generating text:", err);
            setError(`Failed to generate text: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [inputGeneratePrompt]); // Dependencies for useCallback

    return (
        <div className="app-container-wrapper">
            <div className="app-container">
                <h1 className="app-title">
                    📖TextTune
                </h1>

                {/* Navigation Bar */}
                <div className="navbar">
                    <button
                        onClick={() => setMode('rewrite')}
                        className={`nav-button ${mode === 'rewrite' ? 'active' : ''}`}
                    >
                        Rewrite Text
                    </button>
                    <button
                        onClick={() => setMode('generate')}
                        className={`nav-button ${mode === 'generate' ? 'active' : ''}`}
                    >
                        Generate Text
                    </button>
                </div>

                <p className="app-description">
                    {mode === 'rewrite'
                        ? "Enter your text below, and I'll rewrite it in perfect, natural-sounding English with grammar corrections."
                        : "Please outline the specifics of the message you require, including its purpose and any key points, and I will be happy to generate a tailored draft for you."
                    }
                </p>

                {/* Conditional Rendering based on mode */}
                {mode === 'rewrite' && (
                    <RewriteMode
                        inputRewriteText={inputRewriteText}
                        setInputRewriteText={setInputRewriteText}
                        handleRewrite={handleRewrite} // This handleRewrite now expects arguments
                        isLoading={isLoading}
                        rewrittenText={rewrittenText}
                    />
                )}

                {mode === 'generate' && (
                    <GenerateMode
                        inputGeneratePrompt={inputGeneratePrompt}
                        setInputGeneratePrompt={setInputGeneratePrompt}
                        handleGenerate={handleGenerate} // This handleGenerate now expects arguments
                        isLoading={isLoading}
                        generatedText={generatedText}
                    />
                )}

                {/* Error Message Display (common for both modes) */}
                {error && (
                    <div className="error-message">
                        <p className="font-semibold">Error:</p>
                        <p>{error}</p>
                    </div>
                )}

                <p className="footer-text">
                    Powered by Paul Ai
                </p>
            </div>
        </div>
    );
};

export default App;