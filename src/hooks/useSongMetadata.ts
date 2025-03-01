import { useState } from 'react';

interface SongMetadata {
  fetchAlbumCover: (artist: string, album: string) => Promise<string | null>;
  fetchLyrics: (artist: string, title: string) => Promise<string | null>;
  loading: boolean;
  firstLoad: boolean;
}

const useSongMetadata = (): SongMetadata => {
  const [loading, setLoading] = useState<boolean>(false);
  const [firstLoad, setFirstLoad] = useState<boolean>(false);

  const fetchAlbumCover = async (
    artist: string,
    album: string
  ): Promise<string | null> => {
    try {
      setLoading(true);
      setFirstLoad(true);
      if (!artist || !album) return null;

      const searchUrl = `https://musicbrainz.org/ws/2/release-group?query=album:${encodeURIComponent(
        album
      )} AND artist:${encodeURIComponent(artist)}&fmt=json`;

      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();

      if (
        !searchData['release-groups'] ||
        searchData['release-groups'].length === 0
      ) {
        return null;
      }

      const releaseGroupId = searchData['release-groups'][0].id;
      const coverArtUrl = `https://coverartarchive.org/release-group/${releaseGroupId}/front`;

      const coverResponse = await fetch(coverArtUrl);
      if (coverResponse.ok) {
        return coverArtUrl;
      }
    } catch (error) {
      console.error('Error fetching album cover:', error);
    } finally {
      setLoading(false);
    }
    return null;
  };

  const fetchLyrics = async (
    artist: string,
    title: string
  ): Promise<string | null> => {
    try {
      setLoading(true);
      setFirstLoad(true);
      if (!artist || !title) return null;

      const searchUrl = `https://api.lyrics.ovh/v1/${artist
        .split(' ')
        .join('%20')}/${title.split(' ').join('%20')}`;

      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();

      if (!searchData['lyrics'] || searchData['lyrics'].length === 0) {
        return null;
      }
      return searchData['lyrics'];
    } catch (error) {
      console.error('Error fetching lyrics:', error);
    } finally {
      setLoading(false);
    }
    return null;
  };

  return { fetchAlbumCover, fetchLyrics, loading, firstLoad };
};

export default useSongMetadata;
