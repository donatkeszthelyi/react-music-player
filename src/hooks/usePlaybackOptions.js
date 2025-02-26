import { useState } from 'react';

const usePlaybackOptions = () => {
  const [autoPlayNext, setAutoPlayNext] = useState(false);
  const [repeatSong, setRepeatSong] = useState(false);
  const [repeatPlaylist, setRepeatPlaylist] = useState(false);
  const [shuffle, setShuffle] = useState(false);

  const toggleAutoPlayNext = () => setAutoPlayNext((prev) => !prev);
  const toggleRepeatSong = () => setRepeatSong((prev) => !prev);
  const toggleRepeatPlaylist = () => setRepeatPlaylist((prev) => !prev);
  const toggleShuffle = () => setShuffle((prev) => !prev);

  return {
    autoPlayNext,
    repeatSong,
    repeatPlaylist,
    shuffle,
    toggleAutoPlayNext,
    toggleRepeatSong,
    toggleRepeatPlaylist,
    toggleShuffle,
  };
};

export default usePlaybackOptions;
