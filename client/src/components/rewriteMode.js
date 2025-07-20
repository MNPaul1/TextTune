// RewriteMode.js
import React, { useState } from 'react';
import WordLimitInputs from './wordLimitInputs'; // Import the reusable component

const RewriteMode = ({
    inputRewriteText,
    setInputRewriteText,
    handleRewrite,
    isLoading,
    rewrittenText
}) => {
    // State for word limits specific to RewriteMode
    const [maxWordLimit, setMaxWordLimit] = useState('');
    const [minWordLimit, setMinWordLimit] = useState('');
    // New state for tone selection
    const [selectedTone, setSelectedTone] = useState('neutral'); // Default tone

    // Function to call handleRewrite with all parameters
    const onRewriteClick = () => {
        const parsedMaxLimit = maxWordLimit === '' ? null : parseInt(maxWordLimit, 10);
        const parsedMinLimit = minWordLimit === '' ? null : parseInt(minWordLimit, 10);

        // Pass selectedTone along with word limits
        handleRewrite(parsedMaxLimit, parsedMinLimit, selectedTone);
    };

    return (
        <>
            {/* Input Textarea for Rewrite */}
            <div className="form-group">
                <label htmlFor="inputRewriteText" className="label">
                    Your Text to Rewrite:
                </label>
                <textarea
                    id="inputRewriteText"
                    className="textarea"
                    placeholder="e.g., 'Me go store buy apple and banana, then me home. My friend, he say, 'That good idea.' So we go together.'"
                    value={inputRewriteText}
                    onChange={(e) => setInputRewriteText(e.target.value)}
                    rows="8"
                    spellCheck="false"
                    data-gramm="false"
                    data-gramm_editor="false"
                    autocorrect="off"
                    autocomplete="off"
                ></textarea>
            </div>

            {/* Word Limit Inputs */}
            <WordLimitInputs
                maxWordLimit={maxWordLimit}
                setMaxWordLimit={setMaxWordLimit}
                minWordLimit={minWordLimit}
                setMinWordLimit={setMinWordLimit}
                idPrefix="Rewrite"
            />

            {/* Tone Selection Dropdown */}
            <div className="form-group">
                <label htmlFor="toneSelectRewrite" className="label">
                    Select Tone (Optional):
                </label>
                <select
                    id="toneSelectRewrite"
                    className="select-input" // New class for styling dropdown
                    value={selectedTone}
                    onChange={(e) => setSelectedTone(e.target.value)}
                >
                    <option value="neutral">Neutral</option>
                    <option value="formal">Formal</option>
                    <option value="informal">Informal</option>
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="persuasive">Persuasive</option>
                    <option value="academic">Academic</option>
                    <option value="humorous">Humorous</option>
                </select>
            </div>

            {/* Rewrite Button */}
            <button
                onClick={onRewriteClick}
                disabled={isLoading || inputRewriteText.trim() === ''}
                className={`action-button ${isLoading || inputRewriteText.trim() === '' ? 'disabled' : ''}`}
            >
                {isLoading ? (
                    <span className="flex items-center justify-center">
                        <svg className="spinner -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Rewriting...
                    </span>
                ) : (
                    'Rewrite Text'
                )}
            </button>

            {/* Rewritten Text Output */}
            {rewrittenText && (
                <div className="output-section">
                    <label htmlFor="rewrittenText" className="label">
                        Rewritten Text:
                    </label>
                    <textarea
                        id="rewrittenText"
                        className="textarea output-textarea"
                        value={rewrittenText}
                        readOnly
                        rows="8"
                    ></textarea>
                </div>
            )}
        </>
    );
};

export default RewriteMode;
