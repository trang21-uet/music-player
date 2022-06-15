import {
  View,
  Text,
  ToastAndroid,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useAuth, usePlayer} from '../../providers';
import {Button, Playlist, RowOption} from '../../components';
import TrackPlayer from 'react-native-track-player';
import {useNavigation} from '@react-navigation/native';

export default function MenuModal({setModalVisible}) {
  const [playlistModalVisible, setPlaylistModalVisible] = useState(false);
  const [timerModalVisible, setTimerModalVisible] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const auth = useAuth();
  const navigation = useNavigation();

  const getPlaylists = async () => {
    try {
      const user = await auth.getUser();
      const response = await fetch(
        `http://localhost:8080/playlist?ownerId=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
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
    getPlaylists();
  }, [playlistModalVisible]);

  return (
    <>
      <PlaylistModal
        modalVisible={playlistModalVisible}
        setModalVisible={setPlaylistModalVisible}
        playlists={playlists}
      />
      <TimerModal
        modalVisible={timerModalVisible}
        setModalVisible={setTimerModalVisible}
      />
      <View
        style={{
          flexDirection: 'column',
          padding: 15,
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
        <RowOption
          iconSize={25}
          fontSize={18}
          icon="add"
          title="Add to playlist"
          onPress={() => setPlaylistModalVisible(true)}
        />
        <RowOption
          iconSize={25}
          fontSize={18}
          icon="moon-outline"
          title="Set timer"
          onPress={() => setTimerModalVisible(true)}
        />
        <RowOption
          iconSize={25}
          fontSize={18}
          icon="information-circle-outline"
          title="Song informations"
          onPress={() => {
            navigation.navigate('SongInfo');
            setModalVisible(false);
          }}
        />
      </View>
    </>
  );
}

const PlaylistModal = ({modalVisible, setModalVisible, playlists}) => {
  const {track} = usePlayer();
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
    <Modal
      animationType="slide"
      transparent
      visible={modalVisible}
      onRequestClose={() => setModalVisible(!modalVisible)}>
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
    </Modal>
  );
};

const TimerModal = ({modalVisible, setModalVisible}) => {
  const [value, setValue] = useState('');
  const submitRef = useRef();
  const [remain, setRemain] = useState(0);
  var timer = null;
  var remainTimer = null;

  useEffect(() => {
    if (remain === 0 && remainTimer !== null) {
      clearInterval(remainTimer);
    }
  }, [remain]);

  const setTimer = value => {
    const time = parseInt(value);
    if (time === 0) {
      timer !== null && clearTimeout(timer);
      timer = null;
      remainTimer !== null && clearInterval(remainTimer);
      remainTimer = null;
      setRemain(0);
      ToastAndroid.show('Timer canceled', 2000);
    } else {
      timer = setTimeout(() => TrackPlayer.pause(), time * 60000);
      setRemain(time);
      remainTimer = setInterval(() => setRemain(remain - 1), 60000);
      ToastAndroid.show(
        `Player will stop after ${value} minute${value > 1 ? 's' : ''}`,
        2000,
      );
      setModalVisible(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
        setValue('');
      }}>
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
            width: 300,
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
            Set timer
          </Text>
          <TextInput
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              height: 45,
              marginVertical: 20,
              paddingHorizontal: 10,
              color: '#000',
            }}
            keyboardType="decimal-pad"
            selectionColor="#2E8B57"
            value={value}
            onChangeText={value => setValue(value)}
            placeholder="Time in minutes"
            placeholderTextColor="#999"
            selectTextOnFocus
            onSubmitEditing={() => submitRef.current.props.onPress()}
          />
          {remain > 0 && (
            <Text
              style={{
                color: '#eee',
                fontSize: 12,
              }}>{`Remaining time: ${remain} minute${
              remain > 1 ? 's' : ''
            }`}</Text>
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 15,
            }}>
            <Button
              title="Cancel"
              color="#777"
              onPress={() => {
                setModalVisible(false);
                setValue('');
              }}
            />
            {remain !== 0 && (
              <Button
                title="Reset"
                color="#777"
                onPress={() => {
                  setTimer(0);
                  setValue('');
                }}
              />
            )}
            <Button
              ref={submitRef}
              title="OK"
              color="#2E8B57"
              onPress={() => {
                setTimer(value);
                setValue('');
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
