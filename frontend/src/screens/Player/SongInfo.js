import {View, Text} from 'react-native';
import React from 'react';
import {Pressable} from '../../components';
import {useNavigation} from '@react-navigation/native';
import {usePlayer} from '../../providers';

const regionName = {
  vn: 'Vietnam',
  'us-uk': 'US-UK',
  cn: 'China',
  jp: 'Japan',
  kr: 'Korea',
  null: 'Other',
};

const Info = ({title, value}) => {
  return (
    <View style={{width: '100%', marginVertical: 20, marginHorizontal: 20}}>
      <Text style={{color: '#fff', fontSize: 18, marginBottom: 5}}>
        {title}
      </Text>
      <Text style={{color: '#ccc', fontSize: 16}}>{value}</Text>
    </View>
  );
};

export default function SongInfo() {
  const navigation = useNavigation();
  const {track} = usePlayer();
  const {title, artist, album, genre, region} = track;

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
          onPress={navigation.goBack}
          style={{padding: 15}}
        />
        <Text style={{color: '#fff', fontSize: 18, fontWeight: '600'}}>
          Song Infomations
        </Text>
      </View>

      <Info title="Song title" value={title || 'Unknown'} />
      <Info title="Author" value={artist || 'Unknown'} />
      <Info title="Album" value={album || 'Unknown'} />
      <Info title="Genre" value={`${regionName[region]} - ${genre}`} />
    </View>
  );
}
