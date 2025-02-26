import React from 'react';
import { Slider, Box, Button } from '@mui/material';
import { PlayArrow, Pause, SkipNext, SkipPrevious } from '@mui/icons-material';

const Controls = ({
  isPlaying,
  togglePlayPause,
  volume,
  setVolume,
  currentTime,
  duration,
  onSeek,
  isSongsEmpty,
  onSkipNext,
  onSkipBack,
}) => {
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Box id="controls-container">
      <Button
        onClick={togglePlayPause}
        disabled={isSongsEmpty}
        id="play-pause-button"
      >
        {isPlaying ? (
          <Pause fontSize="large" />
        ) : (
          <PlayArrow fontSize="large" />
        )}
      </Button>

      <Button
        onClick={onSkipBack}
        disabled={isSongsEmpty}
        id="skip-back-button"
      >
        <SkipPrevious fontSize="large" />
      </Button>

      <Button
        onClick={onSkipNext}
        disabled={isSongsEmpty}
        id="skip-next-button"
      >
        <SkipNext fontSize="large" />
      </Button>

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
          disabled={isSongsEmpty}
        />
      </Box>
    </Box>
  );
};

export default Controls;
