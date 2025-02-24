import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Box, Typography, Switch } from '@mui/material';
import Controls from './Controls'; // Import the Controls component
import SongList from '../SongList/SongList'; // Import the SongList component

const Player = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [autoPlayNext, setAutoPlayNext] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null); // Track the selected index
  const playerRef = useRef(null);

  const getMusicFiles = () => {
    const musicContext = require.context(
      '../../assets/music',
      false,
      /\.(mp3)$/
    );
    return musicContext.keys().map((file) => ({
      title: file.replace('./', '').replace(/\.(mp3)$/, ''),
      url: musicContext(file),
    }));
  };

  const songList = getMusicFiles(); // List of songs

  // Ensure that audioUrl properly updates when currentIndex changes
  const audioUrl =
    songList.length > 0 && currentIndex !== null
      ? songList[currentIndex]?.url
      : null;

  useEffect(() => {
    if (audioUrl) {
      setIsPlaying(true);
      setCurrentTime(0); // Reset the current time when a new song is selected
    }
  }, [audioUrl]); // This will trigger whenever the audioUrl (based on currentIndex) changes

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgress = (state) => {
    setCurrentTime(state.playedSeconds);
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleSeek = (newTime) => {
    if (playerRef.current) {
      playerRef.current.seekTo(newTime, 'seconds');
      setCurrentTime(newTime);
    }
  };

  const handleEnded = () => {
    if (autoPlayNext && songList.length > 0) {
      const nextIndex = (currentIndex + 1) % songList.length;
      setCurrentIndex(nextIndex);
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: 500,
        margin: '0 auto',
      }}
    >
      <h3>{songList[currentIndex]?.title || 'No Song Selected'}</h3>
      <ReactPlayer
        ref={playerRef}
        url={audioUrl}
        playing={isPlaying}
        controls={false}
        width="100%"
        height="50px"
        volume={volume}
        onProgress={handleProgress}
        onDuration={handleDuration}
        onEnded={handleEnded}
        config={{
          file: {
            forceAudio: true,
          },
        }}
      />
      <Controls
        isPlaying={isPlaying}
        togglePlayPause={togglePlayPause}
        volume={volume * 100}
        setVolume={setVolume}
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
      />
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <p>Autoplay</p>
        <Switch
          onClick={() => setAutoPlayNext(!autoPlayNext)}
          variant="contained"
        />
      </Box>

      {/* Pass the selectedIndex and setCurrentIndex to SongList */}
      <SongList
        selectedIndex={currentIndex} // Pass the selected index to highlight it
        onSelectSong={(song, index) => {
          setCurrentIndex(index); // Set the selected song's index
          setIsPlaying(true); // Start playing immediately
        }}
      />
    </Box>
  );
};

export default Player;
