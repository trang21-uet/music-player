import {
  View,
  Text,
  ScrollView,
  ToastAndroid,
  Modal,
  TextInput,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  CornerButton,
  Button,
  Error,
  Playlist,
  Pressable,
} from '../../../components';
import {useAuth} from '../../../providers';
import {useIsFocused, useNavigation} from '@react-navigation/native';

export default function Playlists() {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const submitRef = useRef();
  const auth = useAuth();
  const isFocused = useIsFocused();
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
      setData(json);
    } catch (error) {
      console.error(error);
    }
  };

  const addPlaylist = async name => {
    try {
      const user = await auth.getUser();
      const response = await fetch(`http://localhost:8080/playlist`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          name,
          ownerId: user.id,
        }),
      });
      const message = await response.text();
      setModalVisible(false);
      setNewPlaylistName('');
      ToastAndroid.show(message, 2000);
      console.info(message);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPlaylists();
  }, [isFocused, modalVisible]);
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomColor: '#333',
          borderBottomWidth: 1,
        }}>
        <Pressable
          icon="arrow-back"
          size={25}
          style={{padding: 15}}
          onPress={navigation.goBack}
        />
        <Text style={{fontSize: 18, color: '#eee'}}>Playlist</Text>
      </View>
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          setNewPlaylistName('');
        }}>
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
              Create new playlist
            </Text>
            <TextInput
              style={{
                width: 250,
                height: 45,
                color: '#000',
                backgroundColor: '#fff',
                marginVertical: 15,
                borderRadius: 10,
                paddingHorizontal: 10,
              }}
              value={newPlaylistName}
              onChangeText={value => setNewPlaylistName(value)}
              placeholder="Playlist name"
              placeholderTextColor="#aaa"
              onSubmitEditing={() => submitRef.current.props.onPress()}
            />
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Button
                title="Cancel"
                color="#777"
                onPress={() => {
                  setModalVisible(false);
                  setNewPlaylistName('');
                }}
              />
              <Button
                title="Create"
                color="#2E7F4B"
                ref={submitRef}
                onPress={() => addPlaylist(newPlaylistName)}
              />
            </View>
          </View>
        </View>
      </Modal>
      <ScrollView contentContainerStyle={{flex: 1}}>
        {data.length === 0 ? (
          <Error status="No playlists" />
        ) : (
          data.map(({id, name}, index) => (
            <Playlist id={id} key={index} title={name} />
          ))
        )}
      </ScrollView>
      <CornerButton icon="add" onPress={() => setModalVisible(true)} />
    </View>
  );
}
