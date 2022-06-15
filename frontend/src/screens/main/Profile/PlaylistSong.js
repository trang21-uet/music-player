import {
  View,
  Text,
  ScrollView,
  Modal,
  ToastAndroid,
  ImageBackground,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Button,
  Error,
  Pressable,
  Song,
  SongWithCheckbox,
} from '../../../components';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {useAuth} from '../../../providers';

const {width} = Dimensions.get('window');

export default function PlaylistSong() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editting, setEditting] = useState(false);
  const [cover, setCover] = useState(null);
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const {id, title} = useRoute().params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const auth = useAuth();

  const getPlaylistSongs = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/playlist?playlistId=${id}`,
      );
      const {songs} = await response.json();
      setPlaylistSongs(
        songs.map(song => ({
          ...song,
          url: `http://localhost:8080/songs/${song.url}`,
        })),
      );
      songs.length > 0 &&
        setCover(songs[Math.floor(Math.random() * songs.length)].coverImage);
    } catch (error) {
      console.error(error);
    }
  };

  const deletePlaylist = async () => {
    try {
      const response = await fetch(`http://localhost:8080/playlist/${id}`, {
        method: 'DELETE',
      });
      const message = await response.text();
      ToastAndroid.show(message, 2000);
      setModalVisible(true);
      navigation.navigate('Playlists');
    } catch (error) {
      console.error(error);
    }
  };

  const removeSongFromPlaylist = async songId => {
    try {
      const {token} = await auth.getUser();
      const response = await fetch(
        `http://localhost:8080/playlist/songs?playlistId=${id}&songId=${songId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const message = await response.text();
      console.info({message});
      ToastAndroid.show(`Removed from ${title}`, 2000);
      setPlaylistSongs(playlistSongs.filter(song => song.id !== songId));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPlaylistSongs();
  }, [isFocused]);

  return (
    <View style={{flex: 1, opacity: modalVisible ? 0.4 : 1}}>
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
                fontWeight: '600',
                textAlign: 'center',
              }}>
              Delete playlist
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: '#ccc',
                textAlign: 'center',
                marginVertical: 25,
              }}>{`Do you want to delete playlist ${title}?`}</Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Button
                title="Cancel"
                color="#777"
                onPress={() => setModalVisible(false)}
              />
              <Button title="OK" color="#B12222" onPress={deletePlaylist} />
            </View>
          </View>
        </View>
      </Modal>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomColor: '#333',
          borderBottomWidth: 1,
        }}>
        <Pressable
          icon={editting ? 'close' : 'arrow-back'}
          style={{padding: 15}}
          onPress={() => (editting ? setEditting(false) : navigation.goBack())}
          size={25}
        />
        <Text
          style={{color: '#ccc', fontSize: 18, fontWeight: '600', width: '60%'}}
          numberOfLines={1}>
          {title}
        </Text>
      </View>
      <View style={{flex: 1}}>
        <ScrollView>
          <ImageBackground
            source={cover && {uri: `http://localhost:8080/images/${cover}`}}
            resizeMode="cover"
            style={{width}}
            imageStyle={{opacity: 0.2}}>
            <View
              style={{
                flexDirection: 'row',
                marginVertical: 50,
                paddingHorizontal: 20,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: '#ccc',
                  fontSize: 30,
                }}>
                {title}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Pressable
                  icon="add"
                  size={25}
                  style={{marginEnd: 15}}
                  onPress={() =>
                    navigation.navigate('AddSongToPlaylist', {
                      id,
                      title,
                      songIds: playlistSongs.map(data => data.id),
                    })
                  }
                />
                <Pressable
                  icon="pencil"
                  size={20}
                  style={{marginEnd: 15}}
                  onPress={() => setEditting(!editting)}
                />
                <Pressable
                  icon="trash-outline"
                  size={25}
                  onPress={() => setModalVisible(true)}
                />
              </View>
            </View>
          </ImageBackground>
          {playlistSongs.length === 0 ? (
            <Error status="No songs" />
          ) : (
            playlistSongs.map((track, index) =>
              editting ? (
                <Song key={index} track={track} disabled>
                  <Pressable
                    icon="trash-outline"
                    size={25}
                    style={{padding: 10}}
                    onPress={() => removeSongFromPlaylist(track.id)}
                  />
                </Song>
              ) : (
                <Song
                  key={index}
                  track={track}
                  index={index}
                  queue={playlistSongs}
                />
              ),
            )
          )}
        </ScrollView>
      </View>
    </View>
  );
}
