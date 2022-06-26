import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Image,
  ScrollView,
  Animated,
  Easing,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
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
import {Pressable} from '../../components';
import MCicon from 'react-native-vector-icons/MaterialCommunityIcons';
import MenuModal from './MenuModal';
import {useAuth, usePlayer} from '../../providers';

const {width, height} = Dimensions.get('window');

const togglePlayback = async playbackState =>
  playbackState === State.Paused
    ? await TrackPlayer.play()
    : await TrackPlayer.pause();

export default function Player() {
  const navigation = useNavigation();
  const player = usePlayer();
  const auth = useAuth();
  const {title, artist, fileName, coverImage} = player.track;
  const {position, duration} = useProgress();
  const playbackState = usePlaybackState();
  const [repeat, setRepeat] = useState('queue');
  const [modalVisible, setModalVisible] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useTrackPlayerEvents(
    [Event.PlaybackTrackChanged, Event.PlaybackQueueEnded],
    async event => {
      if (
        event.type === Event.PlaybackTrackChanged &&
        event.nextTrack !== undefined
      ) {
        const track = await TrackPlayer.getTrack(event.nextTrack);
        player.setTrack(track);
      }
      if (event.type === Event.PlaybackQueueEnded) {
        TrackPlayer.stop();
        player.setTrack({});
        navigation.navigate('Home');
      }
    },
  );

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

  const getUserRole = async () => {
    const info = await auth.getUser();
    info && setUserRole(info.role[0]);
  };

  useEffect(() => {
    getUserRole();
  }, []);

  return (
    <ImageBackground
      source={
        coverImage
          ? {uri: `http://localhost:8080/images/${coverImage}`}
          : require('../../assets/images/disc.png')
      }
      resizeMode="cover"
      style={{flex: 1}}
      imageStyle={{opacity: 0.2}}>
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <TouchableOpacity
          activeOpacity={1}
          style={{width, height, justifyContent: 'flex-end'}}
          onPress={() => setModalVisible(false)}>
          <TouchableWithoutFeedback activeOpacity={1}>
            <MenuModal setModalVisible={setModalVisible} userRole={userRole} />
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
      <View style={[styles.container, {opacity: modalVisible ? 0.2 : 1}]}>
        <View style={styles.header}>
          <Pressable
            icon="arrow-back"
            size={25}
            style={{padding: 20}}
            onPress={() => navigation.goBack()}
          />
          <Pressable
            icon={modalVisible ? 'close' : 'ellipsis-horizontal'}
            size={25}
            style={{padding: 20}}
            onPress={() => setModalVisible(true)}
          />
        </View>
        <View style={styles.cover}>
          <Image
            source={
              coverImage !== 'default.png'
                ? {uri: `http://localhost:8080/images/${coverImage}`}
                : require('../../assets/images/disc.png')
            }
            style={{
              width: 250,
              height: 250,
              borderRadius: 20,
            }}
          />
        </View>
        <View style={styles.info}>
          <View style={styles.infoText}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Text numberOfLines={1} style={styles.songTitle}>
                {title || fileName}
              </Text>
            </ScrollView>
          </View>
          <View style={styles.infoText}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Text numberOfLines={1} style={styles.songArtist}>
                {artist || 'Unknown'}
              </Text>
            </ScrollView>
          </View>
        </View>
        <View style={styles.musicControls}>
          <View style={styles.row}>
            <Text
              style={{fontSize: 14, color: '#ccc', fontFamily: 'san-serif'}}>
              {new Date(position * 1000).toISOString().substring(14, 19)}
            </Text>
            <Slider
              style={styles.progressBar}
              value={position}
              minimumValue={0}
              maximumValue={duration}
              thumbTintColor="#2E8B57"
              minimumTrackTintColor="#2E8B57"
              maximumTrackTintColor="#ccc"
              onSlidingComplete={async value => await TrackPlayer.seekTo(value)}
            />
            <Text
              style={{fontSize: 14, color: '#ccc', fontFamily: 'san-serif'}}>
              {new Date((duration - position) * 1000)
                .toISOString()
                .substring(14, 19)}
            </Text>
          </View>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => navigation.navigate('Playing')}>
              <MCicon name="playlist-music" size={30} color="#ccc" />
            </TouchableOpacity>
            <Pressable
              icon="play-skip-back"
              onPress={async () => await TrackPlayer.skipToPrevious()}
            />
            <Pressable
              icon={
                playbackState === State.Playing ? 'pause-circle' : 'play-circle'
              }
              onPress={() => togglePlayback(playbackState)}
              size={80}
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
  const {title, artist, fileName, coverImage} = player.track || {};
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

  useTrackPlayerEvents(
    [Event.PlaybackTrackChanged, Event.PlaybackQueueEnded],
    async event => {
      if (
        event.type === Event.PlaybackTrackChanged &&
        event.nextTrack !== undefined
      ) {
        const track = await TrackPlayer.getTrack(event.nextTrack);
        player.setTrack(track);
      }
      if (event.type === Event.PlaybackQueueEnded) {
        await TrackPlayer.stop();
        player.setTrack(null);
        navigation.navigate('Home');
      }
    },
  );

  useEffect(() => {
    playbackState === State.Playing ? rotate.start() : rotate.stop();
  }, [playbackState]);

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
          source={
            coverImage !== 'default.png'
              ? {uri: `http://localhost:8080/images/${coverImage}`}
              : require('../../assets/images/disc.png')
          }
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
        <Text numberOfLines={1} style={{fontSize: 16, color: '#ccc'}}>
          {title || fileName}
        </Text>
        <Text
          numberOfLines={1}
          style={{fontSize: 12, fontFamily: 'Gotham Book', color: '#aaa'}}>
          {artist || 'Unknown'}
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
    alignItems: 'center',
  },
  cover: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  infoText: {
    paddingHorizontal: 20,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  songTitle: {
    textAlign: 'center',
    fontSize: 30,
    color: '#eee',
  },
  songArtist: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Gotham Book',
    color: '#aaa',
  },
  musicControls: {
    marginVertical: 10,
  },
  progressContainer: {
    flexDirection: 'row',
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

import Playing from './Playing';
import SongInfo from './SongInfo';
export {Playing, SongInfo};
