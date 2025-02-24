import React from 'react';
import { Button, Slider, Box, Typography, IconButton } from '@mui/material';
import { PlayArrow, Pause } from '@mui/icons-material';

const Controls = ({
  isPlaying,
  togglePlayPause,
  volume,
  setVolume,
  currentTime,
  duration,
  onSeek,
}) => {
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Box id="controls-container">
      <Box onClick={togglePlayPause} id="play-pause-button">
        {isPlaying ? (
          <Pause fontSize="large" />
        ) : (
          <PlayArrow fontSize="large" />
        )}
      </Box>

      {/* Volume Slider */}
      <Box id="volume-slider-container">
        <Slider
          value={volume}
          onChange={(event, newValue) => setVolume(newValue / 100)}
          aria-labelledby="volume-slider"
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${Math.floor(value)}%`}
          id="volume-slider"
        />
      </Box>

      {/* Time Tracker */}
      <Box id="time-tracker-container">
        <Slider
          value={currentTime}
          onChange={(event, newValue) => onSeek(newValue)}
          max={duration}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${formatTime(value)}`}
          id="time-tracker"
        />
      </Box>
    </Box>
  );
};

export default Controls;
