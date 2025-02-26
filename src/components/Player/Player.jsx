import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Box, Button, Switch, Typography } from '@mui/material';
import {
  Delete,
  Shuffle,
  Repeat,
  RepeatOne,
  TrendingFlat,
  MusicNote,
} from '@mui/icons-material';
import Controls from './Controls';
import SongList from '../SongList/SongList';
import SongDropzone from '../SongList/SongDropzone';

const Player = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(null); // Keep track of the previous song
  const [songs, setSongs] = useState([]);
  const [playbackMode, setPlaybackMode] = useState('normal');
  const [autoPlayNext, setAutoPlayNext] = useState(true);

  const playerRef = useRef(null);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleAutoPlayNext = () => setAutoPlayNext((prev) => !prev);

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

  const getNextSongIndex = () => {
    if (playbackMode === 'repeatSong') {
      return currentIndex;
    }

    if (playbackMode === 'shuffle') {
      const shuffledIndexes = songs
        .map((_, i) => i)
        .filter((i) => i !== currentIndex);
      return shuffledIndexes[
        Math.floor(Math.random() * shuffledIndexes.length)
      ];
    }

    if (currentIndex + 1 < songs.length) {
      return currentIndex + 1;
    } else if (playbackMode === 'repeatPlaylist') {
      return 0;
    }

    return -1;
  };

  const getPreviousSongIndex = () => {
    return previousIndex !== null ? previousIndex : currentIndex;
  };

  const handleEnded = () => {
    const nextIndex = getNextSongIndex();
    if (nextIndex !== -1) {
      setPreviousIndex(currentIndex);
      setCurrentIndex(nextIndex);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const handleSkipNext = () => {
    const nextIndex = getNextSongIndex();
    if (nextIndex !== -1) {
      setPreviousIndex(currentIndex);
      setCurrentIndex(nextIndex);
      setIsPlaying(true);
    }
  };

  const handleSkipBack = () => {
    const prevIndex = getPreviousSongIndex();
    setCurrentIndex(prevIndex);
    setIsPlaying(true);
  };

  const clearPlaylist = () => {
    setSongs([]);
    setIsPlaying(false);
    setCurrentIndex(0);
    setCurrentTime(0);
  };

  const handleSongSelect = (song, index) => {
    if (index !== currentIndex) {
      setCurrentIndex(index);
      setIsPlaying(true);
    }
  };

  const cyclePlaybackMode = () => {
    const modes = ['normal', 'repeatSong', 'repeatPlaylist', 'shuffle'];
    const nextMode = modes[(modes.indexOf(playbackMode) + 1) % modes.length];
    setPlaybackMode(nextMode);
  };

  const getPlaybackIcon = () => {
    switch (playbackMode) {
      case 'repeatSong':
        return <RepeatOne />;
      case 'repeatPlaylist':
        return <Repeat />;
      case 'shuffle':
        return <Shuffle />;
      default:
        return <TrendingFlat />;
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <h1>REACT MUSIC PLAYER</h1>
      <Box display="flex" flexDirection="row" justifyContent="start" gap={4}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          id="playlist"
          marginTop="-40px"
          zIndex={100}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
            width="15vw"
          >
            <Box
              display="flex"
              justifyContent="center"
              gap={4}
              alignItems="center"
            >
              <Box display="flex" alignItems="center">
                <p>Clear Playlist</p>
                <Button onClick={clearPlaylist} id="clear-playlist-button">
                  <Delete />
                </Button>
              </Box>
              <Box display="flex" alignItems="center">
                <p>Autoplay</p>
                <Switch checked={autoPlayNext} onClick={toggleAutoPlayNext} />
              </Box>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="0px"
              visibility={autoPlayNext ? 'visible' : 'hidden'}
            >
              {autoPlayNext && (
                <Box display="flex" alignItems="center">
                  <p>Playback Mode</p>
                  <Button
                    onClick={cyclePlaybackMode}
                    sx={{ color: 'white' }}
                    id="playback-mode-button"
                  >
                    {getPlaybackIcon()}
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
          <Box marginTop="24px">
            <SongList
              songs={songs}
              setSongs={setSongs}
              selectedIndex={currentIndex}
              onSelectSong={handleSongSelect}
            />
            {songs.length === 0 ? (
              <SongDropzone setSongs={setSongs} fullScreen={true} />
            ) : (
              <SongDropzone setSongs={setSongs} fullScreen={false} />
            )}
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          id="player"
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
            width="50vw"
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              marginTop="20px"
              height="54vh"
            >
              <Box>
                {songs.length !== 0 &&
                (songs[currentIndex].artist ||
                  songs[currentIndex].album ||
                  songs[currentIndex].year) ? (
                  <p id="song-artist-album-year">
                    {songs[currentIndex].artist && (
                      <span>{songs[currentIndex].artist}</span>
                    )}
                    {songs[currentIndex].artist &&
                      songs[currentIndex].album &&
                      ' - '}
                    {songs[currentIndex].album && (
                      <span>{songs[currentIndex].album}</span>
                    )}
                    {songs[currentIndex].year &&
                      ` (${songs[currentIndex].year})`}
                  </p>
                ) : (
                  <Box id="music-note-top">
                    <MusicNote />
                  </Box>
                )}
              </Box>

              <p id="song-title">
                {songs.length !== 0 ? songs[currentIndex].title : ''}
              </p>
              <Box>
                {songs.length > 0 && songs[currentIndex]?.image ? (
                  <img
                    src={songs[currentIndex].image}
                    alt={songs[currentIndex]?.title || 'Album Cover'}
                    style={{
                      width: '400px',
                      height: '400px',
                      objectFit: 'cover',
                      boxShadow:
                        '#00000057 0px 0px 0px 2px, #00000057 10px 10px 0px 4px,#00000057 20px 20px 0px 6px, #00000057 30px 30px 0px 8px',
                    }}
                  />
                ) : (
                  <Box id="music-note-bottom">
                    <MusicNote />
                  </Box>
                )}
              </Box>
            </Box>
            <ReactPlayer
              ref={playerRef}
              url={songs[currentIndex]?.url}
              playing={isPlaying}
              controls={false}
              width="100%"
              height="50px"
              volume={volume}
              onProgress={handleProgress}
              onDuration={handleDuration}
              onEnded={handleEnded}
              config={{ file: { forceAudio: true } }}
            />
            <Controls
              isPlaying={isPlaying}
              togglePlayPause={togglePlayPause}
              volume={volume * 100}
              setVolume={setVolume}
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
              isSongsEmpty={songs.length === 0}
              onSkipNext={handleSkipNext}
              onSkipBack={handleSkipBack}
            />
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          id="lyrics"
          gap={1}
          width="20vw"
          style={{
            overflowY: 'auto',
            maxHeight: '80vh',
            marginTop: '-40px',
            paddingRight: '20px',
          }}
          zIndex={100}
        >
          <h3>Lyrics</h3>
          {songs.length > 0 && songs[currentIndex]?.lyrics ? (
            songs[currentIndex].lyrics.split('\n').map((line, index) => (
              <Typography key={index} variant="body1" textAlign="center">
                {line}
              </Typography>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No lyrics available
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Player;
