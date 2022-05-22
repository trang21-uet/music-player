import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React from 'react';
import {usePlayer} from '../../providers';
import {Pressable, Song} from '../../components';
import {useNavigation} from '@react-navigation/native';

const SongPlaylist = ({tracks}) => {
  return (
    <ScrollView>
      {tracks.map((track, index) => (
        <Song track={track} key={index} />
      ))}
    </ScrollView>
  );
};

export default function Playlist() {
  const player = usePlayer();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <Pressable
          icon="arrow-back"
          style={{paddingHorizontal: 20, paddingVertical: 10}}
          onPress={() => navigation.goBack()}
        />
      </View>
      <Text
        style={{
          marginStart: 10,
          marginBottom: 20,
          fontWeight: '600',
          fontSize: 20,
          color: '#fff',
        }}>
        Playing
      </Text>
      <SongPlaylist tracks={player.tracks} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
