import { Typography, TypographyProps } from '@mui/material';
import React from 'react';
import { convertTextToAppleEmoji } from 'src/lib/convert-to-apple-emoji';

// Wrapper component to apply emoji conversion
const EmojiTypography: React.FC<TypographyProps> = (props) => {
  const { children, ...rest } = props;

  // Apply emoji conversion if children is a string
  const processedText = typeof children === 'string' ? convertTextToAppleEmoji(children) : children;

  return <Typography {...rest}>{processedText}</Typography>;
};

export default EmojiTypography;
