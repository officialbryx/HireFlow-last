import React from 'react';

export const HighlightedText = ({ segments }) => {
  return segments.map((segment, i) => 
    segment.isMatch ? 
      <mark key={i} className="bg-yellow-100 px-0.5 rounded">{segment.text}</mark> : 
      <React.Fragment key={i}>{segment.text}</React.Fragment>
  );
};