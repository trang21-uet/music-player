import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import TrackPlayer, {
  State,
  Event,
  RepeatMode,
  useProgress,
  usePlaybackState,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import {Selectable, Pressable} from '../../components';
import MCicon from 'react-native-vector-icons/MaterialCommunityIcons';
import {usePlayer} from '../../providers';
import PlayerMenu from './PlayerMenu';

const {width, height} = Dimensions.get('screen');

const togglePlayback = async playbackState => {
  const currentTrack = await TrackPlayer.getCurrentTrack();

  if (currentTrack !== null) {
    if (playbackState === State.Paused) {
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  }
};

export default function Player() {
  const navigation = useNavigation();
  const {position, buffered, duration} = useProgress();
  const playbackState = usePlaybackState();
  const [repeat, setRepeat] = useState('off');
  const player = usePlayer();

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      player.setTrack(track);
    }
  });

  const changeRepeatMode = () => {
    if (repeat === 'off') {
      setRepeat('queue');
      TrackPlayer.setRepeatMode(RepeatMode.Queue);
    } else if (repeat === 'queue') {
      setRepeat('once');
      TrackPlayer.setRepeatMode(RepeatMode.Track);
    } else if (repeat === 'once') {
      setRepeat('off');
      TrackPlayer.setRepeatMode(RepeatMode.Off);
    }
  };

  const repeatIcon = () => {
    if (repeat === 'once') {
      return 'repeat-once';
    } else {
      return 'repeat';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          icon="arrow-back"
          style={{padding: 20}}
          onPress={() => navigation.goBack()}
        />
        <Pressable
          icon="ellipsis-horizontal"
          style={{padding: 20}}
          onPress={() => navigation.navigate('PlayerMenu')}
        />
      </View>
      <View style={styles.info}>
        <View style={[styles.infoText, {bottom: -60, width: width}]}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <Text numberOfLines={1} style={[styles.songTitle]}>
              {player.track.title}
            </Text>
          </ScrollView>
        </View>
        <View style={[styles.infoText, {bottom: -95}]}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <Text numberOfLines={1} style={[styles.songAuthor]}>
              {player.track.artist}
            </Text>
          </ScrollView>
        </View>
      </View>
      <View style={styles.musicControls}>
        <View style={styles.row}>
          <Text style={styles.timeLabel}>
            {new Date(position * 1000).toISOString().substring(14, 19)}
          </Text>
          <Slider
            style={styles.progressBar}
            value={position}
            minimumValue={0}
            maximumValue={duration}
            thumbTintColor="#2E8B57"
            minimumTrackTintColor="#2E8B57"
            maximumTrackTintColor="#C1E1C1"
            onSlidingComplete={async value => TrackPlayer.seekTo(value)}
          />
          <Text style={styles.timeLabel}>
            {new Date((duration - position) * 1000)
              .toISOString()
              .substring(14, 19)}
          </Text>
        </View>
        <View style={[styles.row, {marginBottom: 0}]}>
          <Selectable
            icon="heart-outline"
            alternativeIcon="heart"
            onPress={() =>
              ToastAndroid.show('Added to favorites!', ToastAndroid.SHORT)
            }
          />
          <TouchableOpacity onPress={() => navigation.navigate('PlayerMenu')}>
            <MCicon name="playlist-music" size={30} color="#ccc" />
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <Selectable icon="shuffle" onPress={() => null} />
          <Pressable
            icon="play-skip-back"
            onPress={async () => await TrackPlayer.skipToPrevious()}
          />
          <Pressable
            icon={
              playbackState === State.Playing ? 'pause-circle' : 'play-circle'
            }
            onPress={() => togglePlayback(playbackState)}
            size={60}
          />
          <Pressable
            icon="play-skip-forward"
            onPress={async () => await TrackPlayer.skipToNext()}
          />
          <TouchableOpacity onPress={changeRepeatMode}>
            <MCicon
              name={`${repeatIcon()}`}
              size={30}
              color={repeat !== 'off' ? '#2E8B57' : '#ccc'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export const PlayerWidget = () => {
  const playbackState = usePlaybackState();
  const player = usePlayer();
  const navigation = useNavigation();

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      player.setTrack(track);
    }
  });

  return player.tracks.length === 0 ? null : (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Player');
      }}
      style={[
        styles.widget,
        {display: playbackState === State.Stopped ? 'none' : 'flex'},
      ]}>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'baseline',
          justifyContent: 'center',
        }}>
        <Text numberOfLines={1} style={{fontSize: 16, fontWeight: '600'}}>
          {player.track.title}
        </Text>
        <Text numberOfLines={1} style={{fontSize: 14, fontWeight: '300'}}>
          {player.track.artist}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        <Pressable
          icon="play-skip-back"
          onPress={async () => await TrackPlayer.skipToPrevious()}
        />
        <Pressable
          icon={playbackState === State.Playing ? 'pause' : 'play'}
          onPress={() => togglePlayback(playbackState)}
          size={35}
        />
        <Pressable
          icon="play-skip-forward"
          onPress={async () => await TrackPlayer.skipToNext()}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
    position: 'absolute',
    top: 450,
    left: 0,
    right: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: '2%',
  },
  infoText: {
    position: 'absolute',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  songTitle: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '600',
    // textShadowColor: '#313141',
    // textShadowOffset: {width: 2, height: 2},
    // textShadowRadius: 1,
    overflow: 'visible',
  },
  songAuthor: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '300',
    // textShadowColor: '#313141',
    // textShadowOffset: {width: 2, height: 2},
    // textShadowRadius: 1,
  },
  musicControls: {
    position: 'absolute',
    bottom: '2%',
    paddingHorizontal: '5%',
  },
  progressContainer: {
    flexDirection: 'row',
    marginBottom: '2%',
    justifyContent: 'center',
  },
  progressBar: {
    width: '75%',
  },
  timeLabel: {
    color: '#ccc',
  },
  widget: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#313141',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 4,
    bottom: 68,
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
});

export {PlayerMenu};
