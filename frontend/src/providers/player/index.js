import React, {createContext, useState, useEffect} from 'react';
import {ToastAndroid} from 'react-native';
import TrackPlayer, {
  Capability,
  useTrackPlayerEvents,
  Event,
  State,
  RepeatMode,
} from 'react-native-track-player';
import {Loading, Error} from '../../components';

const PlayerContext = createContext(null);

const PlayerProvider = ({children}) => {
  const [tracks, setTracks] = useState([]);
  const [track, setTrack] = useState(null);
  const [status, setStatus] = useState('loading');
  let timer;

  useTrackPlayerEvents(
    [Event.PlaybackTrackChanged, Event.PlaybackState],
    event => {
      if (event.type === Event.PlaybackState) {
        if (event.state === State.Playing) {
          timer = setTimeout(() => incraseListenedCount(track.id), 15000);
        } else {
          clearTimeout(timer);
        }
      } else if (event.type === Event.PlaybackTrackChanged) {
        clearTimeout(timer);
      }
    },
  );

  const incraseListenedCount = async id => {
    try {
      const response = await fetch(
        `http://localhost:8080/songs/incNumListened?id=${id}`,
        {method: 'POST'},
      );
      const message = await response.text();
      console.info({message});
    } catch (error) {
      console.error(error);
    }
  };

  const setUpPlayer = async queue => {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        stopWithApp: false,
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
        ],
      });
      await TrackPlayer.setRepeatMode(RepeatMode.Queue);
      await TrackPlayer.add(queue);
    } catch (error) {
      console.error(error);
    }
  };

  const getAllSongs = async () => {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 10000);

      const response = await fetch('http://localhost:8080/songs', {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(id);
      const data = await response.json();
      // console.info(data);
      if (data.length === 0) {
        setStatus('No song');
      } else {
        data.forEach(track => {
          track.url = `http://localhost:8080/songs/${track.url}`;
          track.artwork = `http://localhost:8080/images/${track.coverImage}`;
        });
        setTracks(data);
        setStatus('success');
      }
    } catch (error) {
      setStatus(error.message);
    }
  };

  useEffect(() => {
    getAllSongs();
    return TrackPlayer.destroy();
  }, []);

  return (
    <PlayerContext.Provider value={{tracks, track, setTrack, setUpPlayer}}>
      {status === 'loading' && <Loading />}
      {(status === 'Aborted' || status === 'Network request failed') && (
        <Error status={'Network request failed'} />
      )}
      {(status === 'No song' || status === 'success') && children}
    </PlayerContext.Provider>
  );
};

const usePlayer = () => {
  return React.useContext(PlayerContext);
};

export {PlayerProvider, usePlayer};
