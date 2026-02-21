'use client';
import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { keyframes } from '@mui/system';

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const glowPulse = keyframes`
  0%, 100% { opacity: 1; text-shadow: 0 0 8px currentColor; }
  50% { opacity: 0.3; text-shadow: none; }
`;

/***************************  TEXT TYPE EFFECT  ***************************/

export default function TextType({
  texts = [],
  typingSpeed = 75,
  deletingSpeed = 50,
  pauseDuration = 1500,
  showCursor = true,
  cursorCharacter = '_',
  cursorBlinkDuration = 0.5,
  variableSpeedEnabled = false,
  variableSpeedMin = 60,
  variableSpeedMax = 120,
  sx = {}
}) {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const getSpeed = useCallback(() => {
    if (variableSpeedEnabled) {
      return Math.floor(Math.random() * (variableSpeedMax - variableSpeedMin + 1)) + variableSpeedMin;
    }
    return isDeleting ? deletingSpeed : typingSpeed;
  }, [isDeleting, typingSpeed, deletingSpeed, variableSpeedEnabled, variableSpeedMin, variableSpeedMax]);

  useEffect(() => {
    if (!texts.length) return;

    const currentText = texts[textIndex];

    // Paused after finishing typing
    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        // Only delete if there are multiple texts to cycle through
        if (texts.length > 1) {
          setIsDeleting(true);
        }
      }, pauseDuration);
      return () => clearTimeout(pauseTimer);
    }

    // Typing
    if (!isDeleting && charIndex < currentText.length) {
      const timer = setTimeout(() => {
        setDisplayText(currentText.slice(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, getSpeed());
      return () => clearTimeout(timer);
    }

    // Finished typing — pause
    if (!isDeleting && charIndex === currentText.length) {
      setIsPaused(true);
      return;
    }

    // Deleting
    if (isDeleting && charIndex > 0) {
      const timer = setTimeout(() => {
        setDisplayText(currentText.slice(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      }, getSpeed());
      return () => clearTimeout(timer);
    }

    // Finished deleting — move to next text
    if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % texts.length);
    }
  }, [texts, textIndex, charIndex, isDeleting, isPaused, pauseDuration, getSpeed]);

  return (
    <Box component="span" sx={{ ...sx }}>
      {displayText}
      {showCursor && (
        <Box
          component="span"
          sx={{
            animation: `${glowPulse} ${cursorBlinkDuration}s ease-in-out infinite`,
            ml: 0.25,
            fontWeight: 900,
            fontSize: 'inherit',
            color: 'primary.main'
          }}
        >
          {cursorCharacter}
        </Box>
      )}
    </Box>
  );
}

TextType.propTypes = {
  texts: PropTypes.arrayOf(PropTypes.string),
  typingSpeed: PropTypes.number,
  deletingSpeed: PropTypes.number,
  pauseDuration: PropTypes.number,
  showCursor: PropTypes.bool,
  cursorCharacter: PropTypes.string,
  cursorBlinkDuration: PropTypes.number,
  variableSpeedEnabled: PropTypes.bool,
  variableSpeedMin: PropTypes.number,
  variableSpeedMax: PropTypes.number,
  sx: PropTypes.object
};
