import React from 'react';
import emojiData from 'emoji-datasource-apple/emoji.json';
import emojiRegex from 'emoji-regex';

// Interface for emoji data
interface Emoji {
  unified: string;
  short_name: string;
}

// Utility to convert the emoji unified code to an Apple image URL
function emojiToAppleImage(unified: string): string {
  const emojiUnified = unified.toLowerCase().replace(/-/g, '');
  return `/emoji/img/apple/64/${emojiUnified}.png`;
}

// Create a map from emoji unicode to the Apple emoji image URL
const emojiMap: { [key: string]: string } = {};
(emojiData as Emoji[]).forEach((emoji) => {
  const unifiedCode = emoji.unified.toLowerCase();
  emojiMap[unifiedCode] = emojiToAppleImage(unifiedCode);
});

// Function to convert text to Apple-style emojis
export function convertTextToAppleEmoji(text: string): (string | JSX.Element)[] {
  const regex = emojiRegex();

  if (!text) {
    return [text]; // Return empty or invalid text as is
  }

  const result: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match;

  // Iterate over all matches in the text using the regex
  while ((match = regex.exec(text)) !== null) {
    const emojiMatch = match[0]; // The actual emoji matched
    const emojiIndex = match.index; // Index of the emoji in the string

    // Add any text before the emoji to the result array
    if (lastIndex < emojiIndex) {
      result.push(text.substring(lastIndex, emojiIndex));
    }

    // Generate code point(s) for the matched emoji
    const codePoint = Array.from(emojiMatch)
      .map((char) => char.codePointAt(0)?.toString(16)) // Convert each character to hexadecimal
      .join('-');

    // Check if we have a corresponding Apple emoji image in the emojiMap
    const emojiUrl = emojiMap[codePoint];
    if (emojiUrl) {
      result.push(
        <img
          key={`${emojiIndex}-${emojiMatch}`} // Unique key for each image
          src={emojiUrl}
          alt={emojiMatch}
          style={{
            width: '1em',
            height: '1em',
            display: 'inline',
            verticalAlign: 'middle',
            margin: '0 0.1em',
          }}
        />
      );
    } else {
      // If no emoji image is found, push the raw emoji text
      result.push(emojiMatch);
    }

    // Update the last processed index
    lastIndex = emojiIndex + emojiMatch.length;
  }

  // Add any remaining text after the last emoji
  if (lastIndex < text.length) {
    result.push(text.substring(lastIndex));
  }

  return result;
}
