import {View, Text, ScrollView, ToastAndroid} from 'react-native';
import React, {useState} from 'react';
import {Error, Pressable, Song, SongWithCheckbox} from '../../../components';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useAuth, usePlayer} from '../../../providers';

export default function AddSongToPlaylist() {
  const navigation = useNavigation();
  const auth = useAuth();
  const {tracks} = usePlayer();
  const {id, songIds} = useRoute().params;
  const [otherSongs, setOtherSongs] = useState(
    tracks.filter(track => !songIds.includes(track.id)),
  );

  const addSongToPlaylist = async song => {
    const {token} = await auth.getUser();
    try {
      const response = await fetch('http://localhost:8080/playlist/songs', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          playlistId: id,
          songId: song.id,
        }),
      });
      const message = await response.text();
      setOtherSongs(otherSongs.filter(item => item !== song));
      ToastAndroid.show(message, 2000);
    } catch (error) {
      console.error(error);
    }
  };

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
        <Text style={{fontSize: 18, color: '#ccc', fontWeight: '600'}}>
          Add song
        </Text>
      </View>
      {otherSongs.length === 0 ? (
        <Error status="No songs left" />
      ) : (
        <ScrollView>
          {otherSongs.map((song, index) => (
            <Song key={index} track={song} disabled>
              <Pressable
                icon="add"
                size={25}
                style={{padding: 10}}
                onPress={() => addSongToPlaylist(song)}
              />
            </Song>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
