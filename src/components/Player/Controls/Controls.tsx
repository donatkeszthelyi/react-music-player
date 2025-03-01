import React from 'react';
import { Slider, Box, Button, useMediaQuery } from '@mui/material';
import { PlayArrow, Pause, SkipNext, SkipPrevious } from '@mui/icons-material';
import styles from './Controls.module.scss';

interface ControlsProps {
  isPlaying: boolean;
  togglePlayPause: () => void;
  volume: number;
  setVolume: (value: number) => void;
  currentTime: number;
  duration: number;
  onSeek: (value: number) => void;
  isSongsEmpty: boolean;
  onSkipNext: () => void;
  onSkipBack: () => void;
}

const Controls: React.FC<ControlsProps> = ({
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
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const isSmallScreen = useMediaQuery('(max-width: 1024px)');

  return (
    <>
      {isSmallScreen ? (
        <Box className={styles.mobileControlsContainer}>
          <Box className={styles.mobileButtonsVolumeContainer}>
            <Button
              className={styles.mobilePlayPauseButton}
              onClick={togglePlayPause}
              disabled={isSongsEmpty}
            >
              {isPlaying ? <Pause /> : <PlayArrow />}
            </Button>

            <Button
              className={styles.mobileSkipBackButton}
              onClick={onSkipBack}
              disabled={isSongsEmpty}
            >
              <SkipPrevious />
            </Button>

            <Button
              className={styles.mobileSkipNextButton}
              onClick={onSkipNext}
              disabled={isSongsEmpty}
            >
              <SkipNext />
            </Button>

            <Box className={styles.mobileVolumeSliderContainer}>
              <Slider
                value={volume}
                onChange={(event, newValue) =>
                  setVolume((newValue as number) / 100)
                }
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${Math.floor(value)}%`}
              />
            </Box>
          </Box>

          <Slider
            className={styles.mobileTimeTracker}
            value={currentTime}
            onChange={(event, newValue) => onSeek(newValue as number)}
            max={duration}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${formatTime(value)}`}
            disabled={isSongsEmpty}
          />
        </Box>
      ) : (
        <Box className={styles.desktopControlsContainer}>
          <Button
            className={styles.desktopPlayPauseButton}
            onClick={togglePlayPause}
            disabled={isSongsEmpty}
          >
            {isPlaying ? <Pause /> : <PlayArrow />}
          </Button>

          <Button
            className={styles.desktopSkipBackButton}
            onClick={onSkipBack}
            disabled={isSongsEmpty}
          >
            <SkipPrevious />
          </Button>

          <Button
            className={styles.desktopSkipNextButton}
            onClick={onSkipNext}
            disabled={isSongsEmpty}
          >
            <SkipNext />
          </Button>

          <Box className={styles.desktopVolumeSliderContainer}>
            <Slider
              value={volume}
              onChange={(event, newValue) =>
                setVolume((newValue as number) / 100)
              }
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${Math.floor(value)}%`}
            />
          </Box>

          <Slider
            className={styles.desktopTimeTracker}
            value={currentTime}
            onChange={(event, newValue) => onSeek(newValue as number)}
            max={duration}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${formatTime(value)}`}
            disabled={isSongsEmpty}
          />
        </Box>
      )}
    </>
  );
};

export default Controls;
