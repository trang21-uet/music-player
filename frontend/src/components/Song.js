import {
  Text,
  View,
  Image,
  TouchableNativeFeedback,
  TouchableOpacity,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAuth, usePlayer} from '../providers';
import TrackPlayer from 'react-native-track-player';
import Button from './Button';
import Playlist from './Playlist';

const {width, height} = Dimensions.get('screen');

export default function Song({track, queue, index, disabled, children}) {
  const player = usePlayer();
  const auth = useAuth();
  const [playing, setPlaying] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [userInfo, setUserInfo] = useState({});

  const props = {track, playlists, setModalVisible};

  const updateQueue = async () => {
    await TrackPlayer.destroy();
    await player.setUpPlayer(queue);
    player.setTrack(track);
    await TrackPlayer.skip(index);
    await TrackPlayer.play();
  };

  const getUserInfo = async () => {
    const info = await auth.getUser();
    // console.info({info});
    setUserInfo(info);
  };

  const getPlaylists = async () => {
    try {
      const {id, token} = userInfo;
      const response = await fetch(
        `http://localhost:8080/playlist?ownerId=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const json = await response.json();
      setPlaylists(json);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    queue && setPlaying(player.track?.id === track.id);
  }, [player.track]);

  return (
    <TouchableNativeFeedback
      disabled={disabled}
      onPress={updateQueue}
      onLongPress={() => {
        if (userInfo?.role[0] === 'user') {
          getPlaylists();
          setModalVisible(true);
        }
      }}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          padding: 10,
          alignItems: 'center',
          borderRadius: 10,
        }}>
        <Image
          source={
            track.coverImage !== 'default.png'
              ? {uri: `http://localhost:8080/images/${track.coverImage}`}
              : require('../assets/images/disc.png')
          }
          style={{width: 50, height: 50, borderRadius: 10}}
        />
        <View style={{flex: 1, marginStart: 20}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                width: '80%',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: playing ? '#50C878' : '#eee',
                }}>
                {track.title || track.fileName}
              </Text>
            </View>
          </View>
          <View style={{width: '80%'}}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 12,
                fontFamily: 'Gotham Book',
                color: playing ? '#50C878' : '#aaa',
              }}>
              {track.artist || 'Unknown'}
            </Text>
          </View>
        </View>

        <Modal
          animationType="slide"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <TouchableOpacity
            activeOpacity={1}
            style={{width, height}}
            onPress={() => setModalVisible(false)}>
            <TouchableWithoutFeedback>
              <PlaylistModal {...props} />
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>
        {children || null}
      </View>
    </TouchableNativeFeedback>
  );
}

const PlaylistModal = ({track, playlists, setModalVisible}) => {
  const auth = useAuth();

  const addSongToPlaylist = async (id, name) => {
    try {
      const {token} = await auth.getUser();
      const response = await fetch('http://localhost:8080/playlist/songs', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          playlistId: id,
          songId: track.id,
        }),
      });
      const message = await response.text();
      message === 'Success' &&
        ToastAndroid.show(`Added to playlist ${name}`, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          flexDirection: 'column',
          margin: 20,
          padding: 15,
          minWidth: 250,
          backgroundColor: '#414151',
          borderRadius: 10,
          shadowColor: '#918181',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        }}>
        <Text
          style={{
            fontSize: 18,
            color: '#fff',
            marginBottom: 15,
            fontWeight: '600',
            textAlign: 'center',
          }}>
          Add to playlist
        </Text>
        <View>
          {playlists.length === 0 ? null : (
            <ScrollView style={{maxHeight: 250}}>
              {playlists.map(({id, name, songs}, index) => (
                <Playlist
                  key={index}
                  id={id}
                  title={name}
                  tracks={songs}
                  style={{padding: 10}}
                  onPress={() => addSongToPlaylist(id, name)}
                />
              ))}
            </ScrollView>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 15,
          }}>
          <Button
            title="Cancel"
            color="#777"
            onPress={() => setModalVisible(false)}
          />
        </View>
      </View>
    </View>
  );
};
