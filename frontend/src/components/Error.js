import {View, Image, Text} from 'react-native';
import React from 'react';

export default function Error({status}) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#212131',
      }}>
      <Image
        source={require('../assets/images/paimon_sleep.png')}
        style={{width: '50%'}}
        resizeMode={'contain'}
      />
      <Text style={{fontSize: 18, color: '#ccc'}}>{status}</Text>
    </View>
  );
}
