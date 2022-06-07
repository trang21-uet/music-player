import {
  View,
  Text,
  ScrollView,
  TouchableNativeFeedback,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Error, Playlist, Pressable, RowOption} from '../../../components';
import {useAuth} from '../../../providers';

export default function Playlists() {
  const [data, setData] = useState([]);
  const auth = useAuth();

  const getPlaylists = async () => {
    try {
      const user = await auth.getUser();
      const response = await fetch(
        `http://localhost:8080/playlist?ownerId=${user.id}`,
      );
      const json = await response.json();
      console.log(json);
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
      ToastAndroid.show(message, 2000);
      console.info(message);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPlaylists();
  }, []);
  return (
    <ScrollView style={{flex: 1}}>
      <TouchableNativeFeedback onPress={() => addPlaylist('hihi')}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            padding: 20,
            alignItems: 'center',
          }}>
          <Pressable icon="add" size={30} onPress={addPlaylist} />
          <Text style={{fontSize: 18, color: '#ccc', marginStart: 20}}>
            Add a playlist
          </Text>
        </View>
      </TouchableNativeFeedback>
      {data.length === 0 ? (
        <Error status="No playlists" />
      ) : (
        data.map((item, index) => <Playlist key={index} title={item.name} />)
      )}
    </ScrollView>
  );
}
