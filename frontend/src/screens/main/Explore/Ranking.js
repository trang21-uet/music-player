import {ScrollView, Text, View} from 'react-native';
import React from 'react';
import {usePlayer} from '../../../providers';
import {Song} from '../../../components';

export default function Ranking() {
  const player = usePlayer();
  const tracks = player.tracks.slice(0, 10);

  tracks.sort((a, b) => b.numListened - a.numListened);

  return (
    <View style={{flex: 1}}>
      <Text
        style={{
          color: '#fff',
          fontSize: 20,
          marginVertical: 20,
          textAlign: 'center',
          fontWeight: '600',
        }}>
        Top Songs
      </Text>
      <ScrollView>
        {tracks.map((track, index) => (
          <View
            key={index}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                color: '#ccc',
                fontSize: 18,
                fontWeight: 'bold',
                marginHorizontal: 5,
                minWidth: 30,
                textAlign: 'center',
              }}>
              {index + 1}
            </Text>
            <Song track={track} index={index} queue={tracks}>
              <Text
                style={{
                  fontSize: 12,
                  color: '#eee',
                }}>
                {track.numListened}
              </Text>
            </Song>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
