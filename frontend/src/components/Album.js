import {useNavigation} from '@react-navigation/native';
import React from 'react';
import RowOption from './RowOption';

export default function Album({title}) {
  const navigation = useNavigation();
  return (
    <RowOption
      icon="disc"
      title={title}
      style={{marginHorizontal: 10, width: '80%'}}
      fontSize={16}
      iconSize={25}
      onPress={() =>
        navigation.navigate('SongsList', {by: 'album', value: title})
      }
    />
  );
}
