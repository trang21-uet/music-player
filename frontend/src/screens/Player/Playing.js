import {Text, View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Pressable, Song} from '../../components';
import {useNavigation} from '@react-navigation/native';
import TrackPlayer from 'react-native-track-player';

const SongList = ({queue}) => {
  return (
    <ScrollView overScrollMode="always">
      {queue.length > 0 &&
        queue.map((track, index) => (
          <Song track={track} key={index} queue={queue} index={index} />
        ))}
    </ScrollView>
  );
};

export default function Playing() {
  const navigation = useNavigation();
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const getCurrentQueue = async () => {
      const currentQueue = await TrackPlayer.getQueue();
      setQueue(currentQueue);
    };
    getCurrentQueue();
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
          onPress={() => navigation.goBack()}
        />
        <Text
          style={{
            fontWeight: '600',
            fontSize: 18,
            color: '#ccc',
          }}>
          Playing
        </Text>
      </View>
      <SongList queue={queue} />
    </View>
  );
}
