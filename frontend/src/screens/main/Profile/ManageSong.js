import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Error, Pressable, SongWithCheckbox} from '../../../components';

export default function ManageSong() {
  const [songs, setSongs] = useState(null);
  const [checkedSongs, setCheckedSongs] = useState([]);

  const getUnaprrovedSongs = async () => {
    try {
      const response = await fetch(
        'http://localhost:8080/songs/uncheckedSongs',
      );
      const data = await response.json();
      setSongs(data);
      console.info('data: ', data);
    } catch (error) {
      console.error(error);
    }
  };

  const approveSong = () => {
    checkedSongs.forEach(async song => {
      const response = await fetch(
        `http://localhost:8080/songs/check/?songId=${song.id}&bool=${true}`,
        {
          method: 'PUT',
        },
      );
      const message = await response.text();
      console.log(message);
      setSongs(songs.filter(item => item !== song));
    });
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
          justifyContent: 'space-between',
          padding: 10,
        }}>
        <Text style={{fontSize: 20, fontWeight: '600', color: '#fff'}}>
          Unapproved Songs
        </Text>
        {checkedSongs.length > 0 && (
          <Pressable
            icon="checkmark"
            style={{marginEnd: 10}}
            onPress={approveSong}
          />
        )}
      </View>
      {songs.length === 0 ? (
        <Error status="No unapproved songs" />
      ) : (
        <ScrollView>
          {songs.map(
            (song, index) =>
              !song.isChecked && (
                <SongWithCheckbox
                  track={song}
                  key={index}
                  isChecked={song.isChecked}
                  onCheck={checked =>
                    setCheckedSongs(
                      checked
                        ? checkedSongs.filter(item => item !== song)
                        : [...checkedSongs, song],
                    )
                  }
                />
              ),
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
