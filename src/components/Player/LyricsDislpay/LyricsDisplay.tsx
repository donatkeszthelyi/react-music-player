import React from 'react';
import { Box, Typography } from '@mui/material';
import styles from './Lyrics.module.scss';
import { Song } from '../SongList/SongList';

interface LyricsDisplayProps {
  songs: Song[];
  currentIndex: number;
}

const LyricsDisplay: React.FC<LyricsDisplayProps> = ({
  songs,
  currentIndex,
}) => {
  return (
    <Box className={styles.lyricsContainer}>
      <Typography className={styles.lyricsTitle} variant="h6">
        Lyrics
      </Typography>
      <Box className={styles.lyrics}>
        {songs.length > 0 && songs[currentIndex]?.lyrics ? (
          songs[currentIndex].lyrics
            .split('\n')
            .map((line: string, index: number) => (
              <Typography key={index} variant="body1">
                {line}
              </Typography>
            ))
        ) : (
          <Typography variant="body2">No lyrics available</Typography>
        )}
      </Box>
    </Box>
  );
};

export default LyricsDisplay;
