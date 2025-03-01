import React, { JSX } from 'react';
import { Box, Button, Switch } from '@mui/material';
import { Delete } from '@mui/icons-material';
import styles from './PlaylistControls.module.scss';

interface PlaylistControlsProps {
  autoPlayNext: boolean;
  toggleAutoPlayNext: () => void;
  clearPlaylist: () => void;
  cyclePlaybackMode: () => void;
  getPlaybackIcon: () => JSX.Element;
  playbackMode: PlaybackMode;
}

type PlaybackMode = 'normal' | 'repeatSong' | 'repeatPlaylist' | 'shuffle';

const PlaylistControls: React.FC<PlaylistControlsProps> = ({
  autoPlayNext,
  toggleAutoPlayNext,
  clearPlaylist,
  cyclePlaybackMode,
  getPlaybackIcon,
}) => {
  return (
    <Box className={styles.playlistControlsContainer}>
      <Box className={styles.playlistControlsMain}>
        <Box className={styles.clear}>
          <p>Clear Playlist</p>
          <Button className={styles.clearButton} onClick={clearPlaylist}>
            <Delete />
          </Button>
        </Box>
        <Box className={styles.autoplay}>
          <p>Autoplay</p>
          <Switch checked={autoPlayNext} onClick={toggleAutoPlayNext} />
        </Box>
      </Box>
      <Box
        className={styles.playbackModeContainer}
        visibility={autoPlayNext ? 'visible' : 'hidden'}
      >
        {autoPlayNext && (
          <Box className={styles.playbackMode}>
            <p>Playback Mode</p>
            <Button
              className={styles.playbackModeButton}
              onClick={cyclePlaybackMode}
            >
              {getPlaybackIcon()}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PlaylistControls;
