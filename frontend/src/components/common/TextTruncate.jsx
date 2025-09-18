import React, { useState } from 'react';

const TextTruncate = ({ 
  text, 
  maxLength = 100, 
  className = '', 
  showMoreText = 'View More', 
  showLessText = 'View Less',
  truncateText = '...'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text || text.length <= maxLength) {
    return <span className={className}>{text}</span>;
  }

  const truncatedText = text.substring(0, maxLength);
  const displayText = isExpanded ? text : truncatedText + truncateText;

  return (
    <span className={className}>
      {displayText}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="ml-1 text-primary hover:text-primary-dark font-medium transition-colors"
      >
        {isExpanded ? showLessText : showMoreText}
      </button>
    </span>
  );
};

export default TextTruncate;
