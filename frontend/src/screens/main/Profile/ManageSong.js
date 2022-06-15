import {ScrollView, Text, ToastAndroid, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Error, Pressable, Song, SongWithCheckbox} from '../../../components';
import {useNavigation} from '@react-navigation/native';

export default function ManageSong() {
  const [songs, setSongs] = useState([]);
  const navigation = useNavigation();

  const getUnaprrovedSongs = async () => {
    try {
      const response = await fetch(
        'http://localhost:8080/songs/uncheckedSongs',
      );
      const data = await response.json();
      setSongs(data);
      console.info({data});
    } catch (error) {
      console.error(error);
    }
  };

  const approveSong = async id => {
    const response = await fetch(
      `http://localhost:8080/songs/check/?songId=${id}&bool=${true}`,
      {
        method: 'PUT',
      },
    );
    const message = await response.text();
    console.log(message);
    response.ok && ToastAndroid.show('Approved successfully', 2000);
    setSongs(songs.filter(item => item.id !== id));
  };

  const deleteSong = async id => {
    try {
      const response = await fetch(`http://localhost:8080/songs/${id}`, {
        method: 'DELETE',
      });
      const message = await response.text();
      setSongs(songs.filter(item => item.id !== id));
      console.info({message});
      response.ok && ToastAndroid.show('Song removed successfully', 2000);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUnaprrovedSongs();
  }, []);

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
        <Text style={{fontSize: 20, fontWeight: '600', color: '#fff'}}>
          Unapproved Songs
        </Text>
      </View>
      {songs.length === 0 ? (
        <Error status="No unapproved songs" />
      ) : (
        <ScrollView>
          {songs.map(
            (song, index) =>
              !song.isChecked && (
                <Song track={song} key={index} disabled>
                  <Pressable
                    icon="checkmark"
                    size={25}
                    style={{padding: 10}}
                    onPress={() => approveSong(song.id)}
                  />
                  <Pressable
                    icon="close"
                    size={25}
                    style={{padding: 10}}
                    onPress={() => deleteSong(song.id)}
                  />
                </Song>
              ),
          )}
        </ScrollView>
      )}
    </View>
  );
}
