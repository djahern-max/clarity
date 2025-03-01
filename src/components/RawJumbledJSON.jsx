import React from 'react';

const RawJumbledJSON = ({ rawData }) => {
    // Convert the JSON to a compressed, less readable format
    const generateJumbledJSON = (data) => {
        try {
            if (!data) return "No data available";

            // First stringify without pretty formatting
            let compressed = JSON.stringify(data);

            // Make it more visually chaotic by randomly breaking lines in awkward places
            // and adding inconsistent indentation
            let jumbled = '';
            let charsPerLine = Math.floor(Math.random() * 40) + 80; // Random line length between 80-120 chars
            let randomBreaks = [];

            // Create some random breakpoints
            for (let i = 50; i < compressed.length; i += charsPerLine) {
                if (Math.random() > 0.5) { // Only break some lines
                    randomBreaks.push(i + Math.floor(Math.random() * 30) - 15);
                }
            }

            // Apply the random breaks and indentation
            let lastBreak = 0;
            let indentLevel = 0;

            for (let i = 0; i < compressed.length; i++) {
                // Add the character
                jumbled += compressed[i];

                // Random indentation changes
                if (compressed[i] === '{' || compressed[i] === '[') {
                    indentLevel += Math.floor(Math.random() * 2);
                } else if (compressed[i] === '}' || compressed[i] === ']') {
                    indentLevel = Math.max(0, indentLevel - Math.floor(Math.random() * 2));
                }

                // Check if we should break here
                if (randomBreaks.includes(i)) {
                    jumbled += '\n';
                    // Add inconsistent indentation
                    jumbled += ' '.repeat(Math.floor(Math.random() * 4) + indentLevel * 2);
                    lastBreak = i;
                }
            }

            return jumbled;
        } catch (e) {
            console.error("Error formatting JSON:", e);
            return "Error formatting JSON data";
        }
    };

    return (
        <div className="bg-gray-900 rounded-lg overflow-hidden">
            <pre className="text-gray-300 p-4 text-xs overflow-x-auto whitespace-pre-wrap"
                style={{
                    fontFamily: 'monospace',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    wordBreak: 'break-all'
                }}>
                {generateJumbledJSON(rawData)}
            </pre>
        </div>
    );
};

export default RawJumbledJSON;