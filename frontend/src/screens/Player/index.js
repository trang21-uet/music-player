import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ToastAndroid,
  ImageBackground,
  Image,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import React, {useRef, useState} from 'react';
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

const {height} = Dimensions.get('window');

const togglePlayback = async playbackState =>
  playbackState === State.Paused
    ? await TrackPlayer.play()
    : await TrackPlayer.pause();

export default function Player() {
  const navigation = useNavigation();
  const player = usePlayer();
  const {position, buffered, duration} = useProgress();
  const playbackState = usePlaybackState();
  const [repeat, setRepeat] = useState('off');

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
    <ImageBackground
      source={{uri: `http://localhost:8080/images/${player.track.coverImage}`}}
      resizeMode="cover"
      style={{height: height}}
      imageStyle={{opacity: 0.3}}>
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
        <View style={styles.cover}>
          <Image
            source={{
              uri: `http://localhost:8080/images/${player.track.coverImage}`,
            }}
            style={{width: 250, height: 250, borderRadius: 20}}
          />
        </View>
        <View style={styles.info}>
          <View style={styles.infoText}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <Text numberOfLines={1} style={styles.songTitle}>
                {player.track.title}
              </Text>
            </ScrollView>
          </View>
          <View style={styles.infoText}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <Text numberOfLines={1} style={styles.songArtist}>
                {player.track.artist}
              </Text>
            </ScrollView>
          </View>
        </View>
        <View style={styles.musicControls}>
          <View style={styles.row}>
            <Text style={{color: '#ccc'}}>
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
              onSlidingComplete={async value => await TrackPlayer.seekTo(value)}
            />
            <Text style={{color: '#ccc'}}>
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
            <TouchableOpacity onPress={() => navigation.navigate('Playing')}>
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
              size={70}
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
    </ImageBackground>
  );
}

export const PlayerWidget = () => {
  const playbackState = usePlaybackState();
  const player = usePlayer();
  const navigation = useNavigation();
  const spin = useRef(new Animated.Value(0)).current;

  const rotate = Animated.loop(
    Animated.timing(spin, {
      toValue: 1,
      duration: 8000,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
  );

  const spinValue = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      player.setTrack(track);
    }
  });

  return !player.track ? null : (
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
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
        <Animated.Image
          source={{
            uri: `http://localhost:8080/images/${player.track.coverImage}`,
          }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            marginHorizontal: 10,
            transform: [{rotate: spinValue}],
          }}
        />
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
        <Text
          numberOfLines={1}
          style={{fontSize: 16, fontWeight: '600', color: '#ccc'}}>
          {player.track.title}
        </Text>
        <Text
          numberOfLines={1}
          style={{fontSize: 14, fontWeight: '300', color: '#ccc'}}>
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
          onPress={() => {
            togglePlayback(playbackState);
            playbackState === State.Playing ? rotate.stop() : rotate.start();
          }}
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
    alignItems: 'center',
  },
  cover: {
    flex: 5,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: '2%',
  },
  infoText: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  songTitle: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '600',
    overflow: 'visible',
    color: '#ccc',
  },
  songArtist: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '300',
    color: '#ccc',
  },
  musicControls: {
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    marginBottom: '2%',
    justifyContent: 'center',
  },
  progressBar: {
    width: '75%',
  },
  widget: {
    height: 70,
    borderTopColor: '#333',
    borderTopWidth: 1,
    flexDirection: 'row',
  },
});

import PlayerMenu from './PlayerMenu';
import Playing from './Playing';
export {PlayerMenu, Playing};
