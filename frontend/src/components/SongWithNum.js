import {Text, View, Image, TouchableNativeFeedback} from 'react-native';
import React, {useEffect, useState} from 'react';
import {usePlayer} from '../providers';
import TrackPlayer from 'react-native-track-player';

export default function SongWithNum({track, queue, index}) {
  const player = usePlayer();
  const [playing, setPlaying] = useState(false);

  const updateQueue = async () => {
    await TrackPlayer.destroy();
    await player.setUpPlayer(queue);
    player.setTrack(track);
    await TrackPlayer.skip(index);
    await TrackPlayer.play();
  };

  useEffect(() => {
    setPlaying(player.track?.url === track.url);
  }, [player.track]);

  return (
    <TouchableNativeFeedback onPress={updateQueue}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          paddingVertical: 10,
          paddingHorizontal: 10,
          alignItems: 'center',
          backgroundColor: playing ? '#2E7F4B' : 'transparent',
          borderRadius: 10,
        }}>
        <Image
          source={{uri: `http://localhost:8080/images/${track.coverImage}`}}
          style={{width: 50, height: 50, borderRadius: 10}}
        />
        <View style={{flex: 1, marginStart: 20}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{width: '80%'}}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: playing ? '#000' : '#fff',
                }}>
                {track.title}
              </Text>
            </View>
            <Text
              style={{
                color: playing ? '#000' : '#aaa',
                fontWeight: '400',
                fontSize: 12,
              }}>
              {track.numListened}
            </Text>
          </View>
          <View style={{width: '80%'}}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 12,
                fontWeight: '400',
                color: playing ? '#333' : '#ccc',
              }}>
              {track.artist}
            </Text>
          </View>
        </View>
      </View>
    </TouchableNativeFeedback>
  );
}
