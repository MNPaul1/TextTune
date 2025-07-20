// GenerateMode.js
import React, { useState } from 'react';
import WordLimitInputs from './wordLimitInputs'; // Import the new component

const GenerateMode = ({
    inputGeneratePrompt,
    setInputGeneratePrompt,
    handleGenerate,
    isLoading,
    generatedText
}) => {
    // State for word limits specific to GenerateMode
    const [maxWordLimit, setMaxWordLimit] = useState('');
    const [minWordLimit, setMinWordLimit] = useState('');

    // Function to call handleGenerate with word limits
    const onGenerateClick = () => {
        // Parse word limits as numbers, or null if empty
        const parsedMaxLimit = maxWordLimit === '' ? null : parseInt(maxWordLimit, 10);
        const parsedMinLimit = minWordLimit === '' ? null : parseInt(minWordLimit, 10);

        // Call the handleGenerate function passed from App.js
        handleGenerate(parsedMaxLimit, parsedMinLimit);
    };

    return (
        <>
            {/* Input Textarea for Generate */}
            <div className="form-group">
                <label htmlFor="inputGeneratePrompt" className="label">
                    Your Generation Prompt:
                </label>
                <textarea
                    id="inputGeneratePrompt"
                    className="textarea"
                    placeholder="e.g., 'Write a short, polite email requesting a day off due to a sudden illness.'"
                    value={inputGeneratePrompt}
                    onChange={(e) => setInputGeneratePrompt(e.target.value)}
                    rows="8"
                    spellCheck="false" // Disables browser spell check
                    data-gramm="false" // Hint for Grammarly
                    data-gramm_editor="false" // Another hint for Grammarly
                    autocorrect="off" // Disables autocorrect
                    autocomplete="off" // Disables browser autocomplete suggestions
                ></textarea>
            </div>

            {/* Replaced word limit div with reusable component */}
            <WordLimitInputs
                maxWordLimit={maxWordLimit}
                setMaxWordLimit={setMaxWordLimit}
                minWordLimit={minWordLimit}
                setMinWordLimit={setMinWordLimit}
                idPrefix="Generate" // Unique ID prefix for this mode
            />

            {/* Generate Button */}
            <button
                onClick={onGenerateClick}
                disabled={isLoading || inputGeneratePrompt.trim() === ''}
                className={`action-button ${isLoading || inputGeneratePrompt.trim() === '' ? 'disabled' : ''}`}
            >
                {isLoading ? (
                    <span className="flex items-center justify-center">
                        <svg className="spinner -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                    </span>
                ) : (
                    'Generate Text'
                )}
            </button>

            {/* Generated Text Output */}
            {generatedText && (
                <div className="output-section">
                    <label htmlFor="generatedText" className="label">
                        Generated Text:
                    </label>
                    <textarea
                        id="generatedText"
                        className="textarea output-textarea"
                        value={generatedText}
                        readOnly
                        rows="8"
                    ></textarea>
                </div>
            )}
        </>
    );
};

export default GenerateMode;
