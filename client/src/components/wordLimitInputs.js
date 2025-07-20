// WordLimitInputs.js
import React from 'react';

const WordLimitInputs = ({ maxWordLimit, setMaxWordLimit, minWordLimit, setMinWordLimit, idPrefix }) => {
    return (
        <div className="form-group flex justify-between gap-4">
            <div className="w-1/2">
                <label htmlFor={`maxWordLimit${idPrefix}`} className="label">
                    Max Words (Optional):
                </label>
                <input
                    type="number"
                    id={`maxWordLimit${idPrefix}`}
                    className="textarea" /* Reusing textarea class for consistent styling */
                    placeholder="e.g., 250"
                    value={maxWordLimit}
                    onChange={(e) => setMaxWordLimit(e.target.value)}
                    min="1"
                />
            </div>
            <div className="w-1/2">
                <label htmlFor={`minWordLimit${idPrefix}`} className="label">
                    Min Words (Optional):
                </label>
                <input
                    type="number"
                    id={`minWordLimit${idPrefix}`}
                    className="textarea" /* Reusing textarea class for consistent styling */
                    placeholder="e.g., 50"
                    value={minWordLimit}
                    onChange={(e) => setMinWordLimit(e.target.value)}
                    min="1"
                />
            </div>
        </div>
    );
};

export default WordLimitInputs;
