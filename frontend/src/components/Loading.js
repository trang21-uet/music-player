import {View, ActivityIndicator} from 'react-native';
import React from 'react';

export default function Loading() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#313141',
      }}>
      <ActivityIndicator size={50} color="#ccc" />
    </View>
  );
}
