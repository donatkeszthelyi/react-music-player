import { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Box, Grid2, useMediaQuery } from '@mui/material';
import {
  Shuffle,
  Repeat,
  RepeatOne,
  TrendingFlat,
  MusicNote,
} from '@mui/icons-material';
import Controls from './Controls/Controls';
import SongList, { Song } from './SongList/SongList';
import SongDropzone from './SongDropzone/SongDropzone';
import Navbar from '../Navbar/Navbar';
import PlaylistControls from './PlaylistControls/PlaylistControls';
import LyricsDisplay from './LyricsDislpay/LyricsDisplay';
import styles from './Player.module.scss';

type PlaybackMode = 'normal' | 'repeatSong' | 'repeatPlaylist' | 'shuffle';

const Player = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [history, setHistory] = useState<number[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>('normal');
  const [autoPlayNext, setAutoPlayNext] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<string>('player');

  const playerRef = useRef<ReactPlayer | null>(null);

  const isSmallScreen = useMediaQuery('(max-width: 1024px)');

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleAutoPlayNext = () => setAutoPlayNext((prev) => !prev);

  const handleProgress = (state: { playedSeconds: number }) => {
    setCurrentTime(state.playedSeconds);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleSeek = (newTime: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(newTime, 'seconds');
      setCurrentTime(newTime);
    }
  };

  const getNextSongIndex = (): number => {
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

  const handleEnded = () => {
    if (playbackMode === 'repeatSong') {
      if (playerRef.current) {
        playerRef.current.seekTo(0, 'seconds');
        setIsPlaying(true);
      }
      return;
    }
    const nextIndex = getNextSongIndex();
    if (nextIndex !== -1) {
      setHistory((prev) => [...prev, currentIndex]);
      setCurrentIndex(nextIndex);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const handleSkipNext = () => {
    const nextIndex = getNextSongIndex();
    if (nextIndex !== -1) {
      setHistory((prev) => [...prev, currentIndex]);
      setCurrentIndex(nextIndex);
      setIsPlaying(true);
    }
  };

  const handleSkipBack = () => {
    if (history.length > 0) {
      const lastIndex = history[history.length - 1];
      setHistory((prev) => prev.slice(0, -1));
      setCurrentIndex(lastIndex);
      setIsPlaying(true);
    }
  };

  const clearPlaylist = () => {
    setSongs([]);
    setIsPlaying(false);
    setCurrentIndex(0);
    setCurrentTime(0);
  };

  const handleSongSelect = (song: Song, index: number) => {
    console.log(`Selected song: ${song.title}`);
    if (index !== currentIndex) {
      setCurrentIndex(index);
      setIsPlaying(true);
    }
  };

  const cyclePlaybackMode = () => {
    const modes: PlaybackMode[] = [
      'normal',
      'repeatSong',
      'repeatPlaylist',
      'shuffle',
    ];
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
    <Box>
      <Box>
        {songs.length === 0 ? (
          <SongDropzone setSongs={setSongs} fullScreen={true} />
        ) : isSmallScreen ? (
          <Box overflow={'hidden'}>
            <Navbar setActiveSection={setActiveSection} />
            <Box>
              {activeSection === 'playlist' && (
                <Box className={styles.mobilePlaylistContainer}>
                  <PlaylistControls
                    autoPlayNext={autoPlayNext}
                    toggleAutoPlayNext={toggleAutoPlayNext}
                    playbackMode={playbackMode}
                    cyclePlaybackMode={cyclePlaybackMode}
                    getPlaybackIcon={getPlaybackIcon}
                    clearPlaylist={clearPlaylist}
                  />
                  <SongList
                    songs={songs}
                    setSongs={setSongs}
                    selectedIndex={currentIndex}
                    onSelectSong={handleSongSelect}
                  />
                </Box>
              )}

              {activeSection === 'player' && (
                <Box className={styles.mobilePlayerContainer}>
                  <Box>
                    <h1>React Music Player</h1>
                    <Box className={styles.mobileSongInfo}>
                      <Box>
                        {songs.length !== 0 &&
                        (songs[currentIndex].artist ||
                          songs[currentIndex].album ||
                          songs[currentIndex].year) ? (
                          <p>
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
                          <Box>
                            <MusicNote />
                          </Box>
                        )}
                      </Box>
                      <p>
                        {songs.length !== 0 ? songs[currentIndex].title : ''}
                      </p>
                      <Box>
                        {songs.length > 0 && songs[currentIndex]?.image ? (
                          <img
                            src={songs[currentIndex].image}
                            alt={songs[currentIndex]?.title || 'Album Cover'}
                            style={{
                              width: 'min(60vw, 28vh)',
                              height: 'min(60vw, 28vh)',
                              objectFit: 'cover',
                              boxShadow:
                                '#00000057 0px 0px 0px 2px, #00000057 5px 5px 0px 4px,#00000057 10px 10px 0px 6px, #00000057 15px 15px 0px 8px',
                            }}
                          />
                        ) : (
                          <Box>
                            <MusicNote />
                          </Box>
                        )}
                      </Box>
                    </Box>
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
              )}

              {activeSection === 'lyrics' && (
                <Box className={styles.mobileLyricsContainer}>
                  <LyricsDisplay songs={songs} currentIndex={currentIndex} />
                </Box>
              )}
              <ReactPlayer
                ref={playerRef}
                url={songs[currentIndex]?.url}
                playing={isPlaying}
                controls={false}
                volume={volume}
                onProgress={handleProgress}
                onDuration={handleDuration}
                onEnded={handleEnded}
                config={{ file: { forceAudio: true } }}
              />
            </Box>
          </Box>
        ) : (
          <Grid2 container spacing={2}>
            <Grid2 size={4}>
              <Box className={styles.playlistContainer}>
                <PlaylistControls
                  autoPlayNext={autoPlayNext}
                  toggleAutoPlayNext={toggleAutoPlayNext}
                  playbackMode={playbackMode}
                  cyclePlaybackMode={cyclePlaybackMode}
                  getPlaybackIcon={getPlaybackIcon}
                  clearPlaylist={clearPlaylist}
                />
                <SongList
                  songs={songs}
                  setSongs={setSongs}
                  selectedIndex={currentIndex}
                  onSelectSong={handleSongSelect}
                />
              </Box>
            </Grid2>

            <Grid2 size={4}>
              <Box className={styles.playerContainer}>
                <Box className={styles.playerSongInfo}>
                  <h1>React Music Player</h1>
                  <Box>
                    {songs.length !== 0 &&
                    (songs[currentIndex].artist ||
                      songs[currentIndex].album ||
                      songs[currentIndex].year) ? (
                      <p>
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
                      <Box
                        sx={{
                          transform: 'scale(4)',
                          marginTop: '10vh',
                          marginBottom: '10vh',
                          filter:
                            'drop-shadow(1px 1px 0px rgba(0, 0, 0, 0.34)) drop-shadow(1px 1px 0px rgba(0, 0, 0, 0.34)) drop-shadow(1px 1px 0px rgba(0, 0, 0, 0.34)) drop-shadow(1px 1px 0px rgba(0, 0, 0, 0.34))',
                        }}
                      >
                        <MusicNote />
                      </Box>
                    )}
                  </Box>
                  <p>{songs.length !== 0 ? songs[currentIndex].title : ''}</p>
                  <Box>
                    {songs.length > 0 && songs[currentIndex]?.image ? (
                      <img
                        src={songs[currentIndex].image}
                        alt={songs[currentIndex]?.title || 'Album Cover'}
                        style={{
                          width: 'min(30vw, 40vh)',
                          height: 'min(30vw, 40vh)',
                          objectFit: 'cover',
                          marginBottom: '10px',
                          boxShadow:
                            '#00000057 0px 0px 0px 2px, #00000057 10px 10px 0px 4px,#00000057 20px 20px 0px 6px, #00000057 30px 30px 0px 8px',
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          transform: 'scale(4)',
                          marginTop: '10vh',
                          filter:
                            'drop-shadow(1px 1px 0px rgba(0, 0, 0, 0.34)) drop-shadow(1px 1px 0px rgba(0, 0, 0, 0.34)) drop-shadow(1px 1px 0px rgba(0, 0, 0, 0.34)) drop-shadow(1px 1px 0px rgba(0, 0, 0, 0.34))',
                        }}
                      >
                        <MusicNote />
                      </Box>
                    )}
                  </Box>
                </Box>

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
            </Grid2>

            <Grid2 size={4}>
              <Box className={styles.lyricsContainer}>
                <LyricsDisplay songs={songs} currentIndex={currentIndex} />
              </Box>
            </Grid2>

            <Box height={0} width={0}>
              <ReactPlayer
                ref={playerRef}
                url={songs[currentIndex]?.url}
                playing={isPlaying}
                controls={false}
                volume={volume}
                onProgress={handleProgress}
                onDuration={handleDuration}
                onEnded={handleEnded}
                config={{ file: { forceAudio: true } }}
              />
            </Box>
          </Grid2>
        )}
      </Box>
    </Box>
  );
};

export default Player;
