import {ScrollView, Text, View} from 'react-native';
import React from 'react';
import {usePlayer} from '../../../providers';
import {SongWithNum} from '../../../components';

export default function Ranking() {
  const player = usePlayer();
  const tracks = [...player.tracks];

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
        Most Listened Songs
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
            <SongWithNum
              track={track}
              index={index}
              key={index}
              queue={tracks}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
